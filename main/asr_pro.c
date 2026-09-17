/*
 * asr_pro.c
 * 天问 ASR-PRO UART 命令解析
 */

#include <string.h>
#include <stdint.h>
#include <stdio.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "driver/uart.h"
#include "driver/gpio.h"
#include "esp_log.h"

#include "asr_pro.h"
#include "ble_toilet.h"
#include "sdkconfig.h"

#define TAG                     "ASR_PRO"

/* ---------------- UART 硬件参数 (可通过 menuconfig 修改) ---------------- */
#define ASR_UART_PORT           UART_NUM_2
#ifndef CONFIG_ASR_UART_BAUD_RATE
#define CONFIG_ASR_UART_BAUD_RATE 115200
#endif
#ifndef CONFIG_ASR_UART_TX_PIN
#define CONFIG_ASR_UART_TX_PIN 16
#endif
#ifndef CONFIG_ASR_UART_RX_PIN
#define CONFIG_ASR_UART_RX_PIN 17
#endif
#define ASR_UART_BAUD           CONFIG_ASR_UART_BAUD_RATE
#define ASR_UART_TX_PIN         ((gpio_num_t)CONFIG_ASR_UART_TX_PIN)  /* ESP32 -> ASR-PRO RXD */
#define ASR_UART_RX_PIN         ((gpio_num_t)CONFIG_ASR_UART_RX_PIN)  /* ASR-PRO TXD -> ESP32 */
#define ASR_UART_RX_BUF_SIZE    256
#define ASR_UART_TX_BUF_SIZE    256           /* 发送语音反馈码用; 必须为0或>128(UART_TX_BUFFER_LEN_MIN) */

/* ---------------- 帧格式 ---------------- */
#define FRAME_HEAD0             0xAA
#define FRAME_HEAD1             0x55
#define FRAME_TAIL              0x55
#define FRAME_LEN               5             /* AA 55 CMD DATA 55 */

/* ---------------- ASR 命令码定义 ----------------
 * 0x00 = 唤醒词 (触发 BLE 扫描连接)
 * 0x01-0x05 = 动作命令 (需要 BLE 已连接)
 */
#define ASR_CMD_WAKE            0x00

typedef struct {
    uint8_t      asr_cmd;
    toilet_cmd_t toilet_cmd;
    const char  *desc;
} cmd_map_t;

static const cmd_map_t s_cmd_map[] = {
    { 0x01, TOILET_CMD_FOOT_SENSOR_ON,  "打开脚感" },
    { 0x02, TOILET_CMD_FOOT_SENSOR_OFF, "关闭脚感" },
    { 0x03, TOILET_CMD_FLUSH_LARGE,     "大冲" },
    { 0x04, TOILET_CMD_FLUSH_SMALL,     "小冲" },
    { 0x05, TOILET_CMD_STOP,            "停止" },
    { 0x06, TOILET_CMD_SEAT_HEAT_ON,    "座圈加热开" },
    { 0x07, TOILET_CMD_SEAT_HEAT_OFF,   "座圈加热关" },
};
#define CMD_MAP_SIZE    (sizeof(s_cmd_map) / sizeof(s_cmd_map[0]))

static toilet_cmd_t lookup_toilet_cmd(uint8_t asr_cmd)
{
    for (size_t i = 0; i < CMD_MAP_SIZE; i++) {
        if (s_cmd_map[i].asr_cmd == asr_cmd) {
            ESP_LOGI(TAG, "Cmd map: 0x%02X -> %s", asr_cmd, s_cmd_map[i].desc);
            return s_cmd_map[i].toilet_cmd;
        }
    }
    return TOILET_CMD_NONE;
}

/* toilet_cmd -> 反馈语音码 */
static uint8_t cmd_to_feedback(toilet_cmd_t cmd)
{
    switch (cmd) {
    case TOILET_CMD_FOOT_SENSOR_ON:  return FB_FOOT_ON;
    case TOILET_CMD_FOOT_SENSOR_OFF: return FB_FOOT_OFF;
    case TOILET_CMD_FLUSH_LARGE:     return FB_FLUSH_LARGE;
    case TOILET_CMD_FLUSH_SMALL:     return FB_FLUSH_SMALL;
    case TOILET_CMD_STOP:            return FB_STOP;
    case TOILET_CMD_SEAT_HEAT_ON:    return FB_SEAT_HEAT_ON;
    case TOILET_CMD_SEAT_HEAT_OFF:   return FB_SEAT_HEAT_OFF;
    default:                         return 0;
    }
}

/* 发送反馈码到 ASR-PRO (触发语音播报); 可从任意任务上下文调用 */
void asr_pro_send_feedback(uint8_t code)
{
    if (code == 0) return;
    uart_write_bytes(ASR_UART_PORT, &code, 1);
    ESP_LOGI(TAG, "Feedback -> ASR-PRO: 0x%02X", code);
}

/* 处理一条 ASR 命令 (可能来自完整帧, 也可能来自裸字节) */
static void handle_asr_cmd(uint8_t asr_cmd)
{
    /* 唤醒词: 触发 BLE 扫描 + 连接 */
    if (asr_cmd == ASR_CMD_WAKE) {
        ESP_LOGI(TAG, "=== WAKE word received ===");
        esp_err_t ret = ble_toilet_wake();
        if (ret == ESP_ERR_INVALID_STATE) {
            ESP_LOGW(TAG, "BLE busy, wake ignored");
            asr_pro_send_feedback(FB_BUSY);   /* 语音: 蓝牙忙 */
        }
        /* "已连接"反馈由 BLE 到达 READY 时通过事件回调发出, 此处不发 */
        return;
    }

    /* 动作命令: 发送到马桶 (必须在 READY 状态) */
    toilet_cmd_t tcmd = lookup_toilet_cmd(asr_cmd);
    if (tcmd == TOILET_CMD_NONE) {
        ESP_LOGW(TAG, "Unknown cmd 0x%02X, ignored", asr_cmd);
        return;
    }
    if (!ble_toilet_is_ready()) {
        ESP_LOGW(TAG, "BLE not ready (wake first), cmd 0x%02X dropped", asr_cmd);
        asr_pro_send_feedback(FB_NOT_READY);   /* 语音: 未连接请先唤醒 */
        return;
    }
    esp_err_t ret = ble_toilet_execute(tcmd);
    if (ret == ESP_OK) {
        asr_pro_send_feedback(cmd_to_feedback(tcmd));   /* 语音: 命令确认 */
    } else {
        ESP_LOGE(TAG, "Execute failed: %s", esp_err_to_name(ret));
        asr_pro_send_feedback(FB_CONNECT_FAIL);
    }
}

/* ---------------- UART 接收解析状态机 ---------------- */
typedef enum {
    ST_WAIT_HEAD0 = 0,
    ST_WAIT_HEAD1,
    ST_WAIT_CMD,
    ST_WAIT_DATA,
    ST_WAIT_TAIL,
} parse_state_t;

/* 解析器状态 (文件级, 供 UART 任务与调试控制台共用) */
static parse_state_t s_parse_state  = ST_WAIT_HEAD0;
static uint8_t  s_parse_cmd         = 0;
static uint32_t s_last_raw_tick     = 0;
static uint8_t  s_last_raw_cmd      = 0xFF;

/* 向解析器喂入一个字节 (核心状态机) */
void asr_pro_feed_byte(uint8_t byte)
{
    switch (s_parse_state) {
    case ST_WAIT_HEAD0:
        if (byte == FRAME_HEAD0) {
            s_parse_state = ST_WAIT_HEAD1;
        } else if (byte <= 0x07) {
            /* 兼容: 单字节裸命令 (方便串口助手直接发 01 测试) */
            uint32_t now = xTaskGetTickCount();
            /* 100ms 内同一命令重复触发, 认为是抖动, 忽略 */
            if (byte != s_last_raw_cmd || (now - s_last_raw_tick) > pdMS_TO_TICKS(100)) {
                ESP_LOGI(TAG, "Raw cmd byte 0x%02X", byte);
                handle_asr_cmd(byte);
                s_last_raw_cmd  = byte;
                s_last_raw_tick = now;
            }
        }
        break;

    case ST_WAIT_HEAD1:
        if (byte == FRAME_HEAD1) {
            s_parse_state = ST_WAIT_CMD;
        } else if (byte == FRAME_HEAD0) {
            /* 连续两个 AA, 保持在等 55 */
            s_parse_state = ST_WAIT_HEAD1;
        } else {
            s_parse_state = ST_WAIT_HEAD0;
        }
        break;

    case ST_WAIT_CMD:
        s_parse_cmd = byte;
        s_parse_state = ST_WAIT_DATA;
        break;

    case ST_WAIT_DATA:
        /* DATA 字节先忽略, 保留将来扩展参数 */
        s_parse_state = ST_WAIT_TAIL;
        break;

    case ST_WAIT_TAIL:
        if (byte == FRAME_TAIL) {
            ESP_LOGI(TAG, "Frame OK: AA 55 %02X XX 55", s_parse_cmd);
            handle_asr_cmd(s_parse_cmd);
        } else {
            ESP_LOGW(TAG, "Frame tail error, expect 0x55 got 0x%02X", byte);
        }
        s_parse_state = ST_WAIT_HEAD0;
        break;

    default:
        s_parse_state = ST_WAIT_HEAD0;
        break;
    }
}

/* 直接注入一条命令 (跳过帧解析) */
void asr_pro_inject_cmd(uint8_t cmd)
{
    handle_asr_cmd(cmd);
}

/* UART 接收任务: 逐字节读取并喂给解析器 */
static void uart_rx_task(void *arg)
{
    uint8_t byte;

    ESP_LOGI(TAG, "UART RX task started (port=%d, baud=%d, rx=%d, tx=%d)",
             ASR_UART_PORT, ASR_UART_BAUD, ASR_UART_RX_PIN, ASR_UART_TX_PIN);

    while (1) {
        /* 一次读 1 字节, 超时 100ms */
        int len = uart_read_bytes(ASR_UART_PORT, &byte, 1, pdMS_TO_TICKS(100));
        if (len <= 0) continue;
        ESP_LOGD(TAG, "RX 0x%02X (state=%d)", byte, s_parse_state);
        asr_pro_feed_byte(byte);
    }
}

/* ---------------- 对外初始化 ---------------- */
esp_err_t asr_pro_init(void)
{
    uart_config_t uart_cfg = {
        .baud_rate  = ASR_UART_BAUD,
        .data_bits  = UART_DATA_8_BITS,
        .parity     = UART_PARITY_DISABLE,
        .stop_bits  = UART_STOP_BITS_1,
        .flow_ctrl  = UART_HW_FLOWCTRL_DISABLE,
        .source_clk = UART_SCLK_DEFAULT,
    };

    esp_err_t ret = uart_driver_install(ASR_UART_PORT, ASR_UART_RX_BUF_SIZE, ASR_UART_TX_BUF_SIZE, 0, NULL, 0);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "uart_driver_install failed: %s", esp_err_to_name(ret));
        return ret;
    }
    ret = uart_param_config(ASR_UART_PORT, &uart_cfg);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "uart_param_config failed: %s", esp_err_to_name(ret));
        return ret;
    }
    ret = uart_set_pin(ASR_UART_PORT, ASR_UART_TX_PIN, ASR_UART_RX_PIN,
                       UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "uart_set_pin failed: %s", esp_err_to_name(ret));
        return ret;
    }

    BaseType_t ok = xTaskCreate(uart_rx_task, "asr_rx", 4096, NULL, 6, NULL);
    if (ok != pdPASS) {
        ESP_LOGE(TAG, "Create uart_rx_task failed");
        return ESP_FAIL;
    }
    return ESP_OK;
}
