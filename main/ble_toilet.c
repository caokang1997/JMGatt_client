/*
 * ble_toilet.c
 * 九牧 SQ9650 BLE 客户端 - 唤醒连接模式
 *
 * 状态机:
 *   IDLE -> (收到唤醒词) -> SCANNING -> CONNECTING -> DISCOVERING -> READY
 *   READY -> (收到命令) -> 发送 BLE 指令帧, 保持 READY, 重置超时定时器
 *   READY -> (超时) -> DISCONNECTING -> IDLE
 *   任何状态 -> (出错) -> IDLE
 */

#include <stdint.h>
#include <string.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "esp_log.h"
#include "esp_bt.h"
#include "esp_bt_main.h"
#include "esp_gap_ble_api.h"
#include "esp_gattc_api.h"
#include "esp_gatt_defs.h"
#include "esp_gatt_common_api.h"

#include "ble_toilet.h"

#define TAG                     "BLE_TOILET"

/* ---------------- GATT 参数 ---------------- */
#define REMOTE_SERVICE_UUID     0xFFE0      /* 服务 UUID */
#define REMOTE_CHAR_UUID        0xFFE1      /* 特征 UUID (写+通知) */
#define PROFILE_NUM             1
#define PROFILE_A_APP_ID        0
#define INVALID_HANDLE          0
#define SCAN_TIMEOUT_SEC        15          /* 扫描超时(秒) */

/* 空闲超时: 无命令 N 秒后自动断开连接 */
#ifndef CONFIG_BLE_IDLE_TIMEOUT_SEC
#define CONFIG_BLE_IDLE_TIMEOUT_SEC 30
#endif
#define IDLE_TIMEOUT_MS         (CONFIG_BLE_IDLE_TIMEOUT_SEC * 1000)

/* ---------------- 状态机 ---------------- */
typedef enum {
    STATE_IDLE = 0,
    STATE_SCANNING,
    STATE_CONNECTING,
    STATE_DISCOVERING,
    STATE_READY,
    STATE_DISCONNECTING,
} ble_state_t;

static const char *state_names[] = {
    "IDLE", "SCANNING", "CONNECTING", "DISCOVERING", "READY", "DISCONNECTING"
};

static ble_state_t s_state = STATE_IDLE;
static bool s_was_ready = false;                 /* 本次连接是否到过 READY (区分正常断开与连接失败) */
static ble_toilet_event_cb_t s_event_cb = NULL;  /* 状态事件回调 (语音反馈) */

/* ---------------- 目标 MAC 地址 ---------------- */
static uint8_t s_target_mac_be[6];
static uint8_t s_target_mac_le[6];

static bool parse_mac_string(const char *str, uint8_t out[6])
{
    int idx = 0;
    const char *p = str;
    while (*p && idx < 6) {
        while (*p == ':' || *p == '-' || *p == ' ') p++;
        if (!p[0] || !p[1]) return false;
        char buf[3] = { p[0], p[1], 0 };
        char *end = NULL;
        unsigned long v = strtoul(buf, &end, 16);
        if (end == buf || v > 0xFF) return false;
        out[idx++] = (uint8_t)v;
        p += 2;
    }
    return idx == 6;
}

/* ---------------- 前置声明 ---------------- */
static void esp_gap_cb(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param);
static void esp_gattc_cb(esp_gattc_cb_event_t event, esp_gatt_if_t gattc_if, esp_ble_gattc_cb_param_t *param);
static void gattc_profile_event_handler(esp_gattc_cb_event_t event, esp_gatt_if_t gattc_if, esp_ble_gattc_cb_param_t *param);
static void idle_monitor_task(void *arg);

/* ---------------- Profile 实例 ---------------- */
struct gattc_profile_inst {
    esp_gattc_cb_t gattc_cb;
    uint16_t gattc_if;
    uint16_t app_id;
    uint16_t conn_id;
    uint16_t service_start_handle;
    uint16_t service_end_handle;
    uint16_t char_handle;
    esp_bd_addr_t remote_bda;
};

static struct gattc_profile_inst gl_profile_tab[PROFILE_NUM] = {
    [PROFILE_A_APP_ID] = {
        .gattc_cb = gattc_profile_event_handler,
        .gattc_if = ESP_GATT_IF_NONE,
    },
};

static bool s_service_found = false;
static esp_gattc_char_elem_t *s_char_elem_result   = NULL;
static esp_gattc_descr_elem_t *s_descr_elem_result = NULL;

/* 空闲监控: 二值信号量 + 独立任务 (替代软件定时器, 避免 Tmr Svc 任务栈溢出) */
static SemaphoreHandle_t s_idle_sem = NULL;

static esp_bt_uuid_t s_remote_filter_service_uuid = {
    .len  = ESP_UUID_LEN_16,
    .uuid = {.uuid16 = REMOTE_SERVICE_UUID,},
};
static esp_bt_uuid_t s_remote_filter_char_uuid = {
    .len  = ESP_UUID_LEN_16,
    .uuid = {.uuid16 = REMOTE_CHAR_UUID,},
};
static esp_bt_uuid_t s_notify_descr_uuid = {
    .len  = ESP_UUID_LEN_16,
    .uuid = {.uuid16 = ESP_GATT_UUID_CHAR_CLIENT_CONFIG,},
};

static esp_ble_scan_params_t s_ble_scan_params = {
    .scan_type              = BLE_SCAN_TYPE_ACTIVE,
    .own_addr_type          = BLE_ADDR_TYPE_PUBLIC,
    .scan_filter_policy     = BLE_SCAN_FILTER_ALLOW_ALL,
    .scan_interval          = 0x50,
    .scan_window            = 0x30,
    .scan_duplicate         = BLE_SCAN_DUPLICATE_DISABLE,
};

/* ---------------- 状态切换辅助函数 ---------------- */

/* 触发状态事件回调 (若已注册), 用于语音反馈 */
static void fire_event(ble_toilet_event_t evt)
{
    if (s_event_cb) s_event_cb(evt);
}

static void set_state(ble_state_t new_state)
{
    ESP_LOGI(TAG, "State: %s -> %s", state_names[s_state], state_names[new_state]);
    s_state = new_state;
    if (new_state == STATE_READY) {
        s_was_ready = true;
        fire_event(BLE_TOILET_EVT_READY);   /* 通知上层: 已连接 */
    }
}

static void reset_to_idle(const char *reason)
{
    ESP_LOGW(TAG, "Reset to IDLE: %s", reason);
    s_service_found = false;
    s_was_ready     = false;
    gl_profile_tab[PROFILE_A_APP_ID].conn_id     = 0;
    gl_profile_tab[PROFILE_A_APP_ID].char_handle = 0;
    gl_profile_tab[PROFILE_A_APP_ID].service_start_handle = 0;
    gl_profile_tab[PROFILE_A_APP_ID].service_end_handle   = 0;
    set_state(STATE_IDLE);
}

/* 通知有活动: 唤醒监控任务重置计时窗口 (任何任务上下文调用都安全, 仅给信号量) */
static void restart_idle_timer(void)
{
    if (s_idle_sem) {
        xSemaphoreGive(s_idle_sem);
    }
}

/* 空闲监控任务: 用带超时的信号量等待实现"计时 + 活动重置"。
 * 超时(即 IDLE_TIMEOUT_MS 内无活动)且处于 READY 时, 在本任务(4096栈)里断开连接,
 * 彻底不在 FreeRTOS Tmr Svc 任务里调用 BLE, 避免栈溢出。 */
static void idle_monitor_task(void *arg)
{
    while (1) {
        /* 等待活动信号; 超时时间内收到信号则重置窗口, 否则视为空闲超时 */
        if (xSemaphoreTake(s_idle_sem, pdMS_TO_TICKS(IDLE_TIMEOUT_MS)) == pdFALSE) {
            /* 超时: 期间无任何活动 */
            if (s_state == STATE_READY) {
                ESP_LOGI(TAG, "Idle timeout (%ds), disconnecting...", CONFIG_BLE_IDLE_TIMEOUT_SEC);
                set_state(STATE_DISCONNECTING);
                esp_ble_gap_disconnect(gl_profile_tab[PROFILE_A_APP_ID].remote_bda);
            }
        }
        /* 收到信号(有活动) -> 直接下一轮循环, 相当于重置计时 */
    }
}

/* ---------------- 指令帧构造 ----------------
 * 参考小程序反编译代码: TechramicToiletController._setDoubleValue / _setSingleValue
 * 帧格式: FC <校验和> 01 00 00 00 <主命令> [<子命令> [<参数>]] FC
 * 校验和: sum(byte[2..len-2]) & 0xFF
 */

/* 构造 9 字节帧: FC SUM 01 00 00 00 CMD ARG FC */
static void build_single_value_frame(uint8_t *out, uint8_t cmd, uint8_t arg)
{
    out[0] = 0xFC; out[1] = 0x00;
    out[2] = 0x01; out[3] = 0x00; out[4] = 0x00; out[5] = 0x00;
    out[6] = cmd;  out[7] = arg;  out[8] = 0xFC;
    uint16_t sum = 0;
    for (int i = 2; i <= 7; i++) sum += out[i];
    out[1] = (uint8_t)(sum & 0xFF);
}

/* 构造 10 字节帧: FC SUM 01 00 00 00 CMD SUB VAL FC */
static void build_double_value_frame(uint8_t *out, uint8_t cmd, uint8_t sub, uint8_t val)
{
    out[0] = 0xFC; out[1] = 0x00;
    out[2] = 0x01; out[3] = 0x00; out[4] = 0x00; out[5] = 0x00;
    out[6] = cmd;  out[7] = sub;  out[8] = val;  out[9] = 0xFC;
    uint16_t sum = 0;
    for (int i = 2; i <= 8; i++) sum += out[i];
    out[1] = (uint8_t)(sum & 0xFF);
}

/* 根据业务命令构造对应的指令帧, 返回帧长度 (0=无效命令) */
static size_t build_cmd_frame(toilet_cmd_t cmd, uint8_t *frame)
{
    switch (cmd) {
    case TOILET_CMD_FOOT_SENSOR_ON:    /* 打开脚感: _set40H(14, 1) */
        build_double_value_frame(frame, 0x40, 0x0E, 0x01); return 10;
    case TOILET_CMD_FOOT_SENSOR_OFF:   /* 关闭脚感: _set40H(14, 0) */
        build_double_value_frame(frame, 0x40, 0x0E, 0x00); return 10;
    case TOILET_CMD_FLUSH_LARGE:       /* 大冲: _setSingleValue(53, 2) */
        build_single_value_frame(frame, 53, 2); return 9;
    case TOILET_CMD_FLUSH_SMALL:       /* 小冲: _setSingleValue(53, 1) */
        build_single_value_frame(frame, 53, 1); return 9;
    case TOILET_CMD_STOP:              /* 停止: _setSingleValue(50, 0) */
        build_single_value_frame(frame, 50, 0); return 9;
    case TOILET_CMD_SEAT_HEAT_ON:      /* 座圈加热-高档: _setSingleValue(60, 3) */
        build_single_value_frame(frame, 60, 3); return 9;
    case TOILET_CMD_SEAT_HEAT_OFF:     /* 座圈加热关: _setSingleValue(60, 0) */
        build_single_value_frame(frame, 60, 0); return 9;
    case TOILET_CMD_QUERY_STATE:       /* 查询状态: _setSingleValue(17, 0) */
        build_single_value_frame(frame, 17, 0); return 9;
    case TOILET_CMD_SEAT_HEAT_LOW:     /* 座圈加热-低档: (60, 1) */
        build_single_value_frame(frame, 60, 1); return 9;
    case TOILET_CMD_SEAT_HEAT_MID:     /* 座圈加热-中档: (60, 2) */
        build_single_value_frame(frame, 60, 2); return 9;
    case TOILET_CMD_COVER_ON:          /* 翻盖开: _setSingleValue(51, 1) */
        build_single_value_frame(frame, 51, 1); return 9;
    case TOILET_CMD_COVER_OFF:         /* 翻盖关: _setSingleValue(51, 0) */
        build_single_value_frame(frame, 51, 0); return 9;
    case TOILET_CMD_RING_ON:           /* 翻圈开: _setSingleValue(52, 1) */
        build_single_value_frame(frame, 52, 1); return 9;
    case TOILET_CMD_RING_OFF:          /* 翻圈关: _setSingleValue(52, 0) */
        build_single_value_frame(frame, 52, 0); return 9;
    case TOILET_CMD_NIGHT_LIGHT_ON:    /* 夜灯开: _set41H(0, 1) */
        build_double_value_frame(frame, 0x41, 0x00, 0x01); return 10;
    case TOILET_CMD_NIGHT_LIGHT_OFF:   /* 夜灯关: _set41H(0, 0) */
        build_double_value_frame(frame, 0x41, 0x00, 0x00); return 10;
    case TOILET_CMD_AUTO_FLUSH_ON:     /* 自动冲刷开: _set40H(5, 1) */
        build_double_value_frame(frame, 0x40, 0x05, 0x01); return 10;
    case TOILET_CMD_AUTO_FLUSH_OFF:    /* 自动冲刷关: _set40H(5, 0) */
        build_double_value_frame(frame, 0x40, 0x05, 0x00); return 10;
    case TOILET_CMD_AUTO_COVER_ON:     /* 自动翻盖开: _set40H(0, 1) */
        build_double_value_frame(frame, 0x40, 0x00, 0x01); return 10;
    case TOILET_CMD_AUTO_COVER_OFF:    /* 自动翻盖关: _set40H(0, 0) */
        build_double_value_frame(frame, 0x40, 0x00, 0x00); return 10;
    case TOILET_CMD_SMART_POWER_ON:    /* 智能节电开: _set40H(3, 1) */
        build_double_value_frame(frame, 0x40, 0x03, 0x01); return 10;
    case TOILET_CMD_SMART_POWER_OFF:   /* 智能节电关: _set40H(3, 0) */
        build_double_value_frame(frame, 0x40, 0x03, 0x00); return 10;
    case TOILET_CMD_HIBERNATE:         /* 休眠: _setSwitch(23, 1) */
        build_single_value_frame(frame, 23, 1); return 9;
    case TOILET_CMD_SELF_CLEAN:        /* 自清洁: _set61H(1) */
        build_single_value_frame(frame, 97, 1); return 9;
    case TOILET_CMD_SEAT_TOO_LONG_ON:  /* 久坐提醒开: _set40H(26, 1) */
        build_double_value_frame(frame, 0x40, 0x1A, 0x01); return 10;
    case TOILET_CMD_SEAT_TOO_LONG_OFF: /* 久坐提醒关: _set40H(26, 0) */
        build_double_value_frame(frame, 0x40, 0x1A, 0x00); return 10;
    case TOILET_CMD_AUTO_TEMP_ON:      /* 四季温感开: _set40H(15, 1) */
        build_double_value_frame(frame, 0x40, 0x0F, 0x01); return 10;
    case TOILET_CMD_AUTO_TEMP_OFF:     /* 四季温感关: _set40H(15, 0) */
        build_double_value_frame(frame, 0x40, 0x0F, 0x00); return 10;
    case TOILET_CMD_REGULAR_FLUSH_ON:  /* 定期冲刷开: _set40H(23, 1) */
        build_double_value_frame(frame, 0x40, 0x17, 0x01); return 10;
    case TOILET_CMD_REGULAR_FLUSH_OFF: /* 定期冲刷关: _set40H(23, 0) */
        build_double_value_frame(frame, 0x40, 0x17, 0x00); return 10;
    case TOILET_CMD_AUTO_SMALL_ON:     /* 自动小冲开: _set40H(19, 1) */
        build_double_value_frame(frame, 0x40, 0x13, 0x01); return 10;
    case TOILET_CMD_AUTO_SMALL_OFF:    /* 自动小冲关: _set40H(19, 0) */
        build_double_value_frame(frame, 0x40, 0x13, 0x00); return 10;
    case TOILET_CMD_CLOSE_COVER_FLUSH_ON:  /* 关盖冲厕开: _set40H(20, 1) */
        build_double_value_frame(frame, 0x40, 0x14, 0x01); return 10;
    case TOILET_CMD_CLOSE_COVER_FLUSH_OFF: /* 关盖冲厕关: _set40H(20, 0) */
        build_double_value_frame(frame, 0x40, 0x14, 0x00); return 10;
    case TOILET_CMD_PRE_WETTING_ON:    /* 预润湿开: _set40H(18, 1) */
        build_double_value_frame(frame, 0x40, 0x12, 0x01); return 10;
    case TOILET_CMD_PRE_WETTING_OFF:   /* 预润湿关: _set40H(18, 0) */
        build_double_value_frame(frame, 0x40, 0x12, 0x00); return 10;
    case TOILET_CMD_LIGHT_SENSOR_ON:   /* 光感夜灯开: _set40H(2, 1) */
        build_double_value_frame(frame, 0x40, 0x02, 0x01); return 10;
    case TOILET_CMD_LIGHT_SENSOR_OFF:  /* 光感夜灯关: _set40H(2, 0) */
        build_double_value_frame(frame, 0x40, 0x02, 0x00); return 10;
    default:
        return 0;
    }
}

/* ---------------- 马桶状态解析 (notify 0x30 上报帧, 参照小程序 dealWith30) ---------------- */

static toilet_state_t s_dev_state = { 0 };

/* 取字节 t 的第 bit 位 (bit0=LSB) */
static inline bool bit_at(uint8_t v, int bit)
{
    return (v >> bit) & 0x01;
}

/* 解析 0x30 状态上报帧: FC SUM 01 00 00 00 30 [t7..t24] FC, 数据从帧[7]开始 */
static void parse_state_report(const uint8_t *f, uint16_t len)
{
    if (len < 26) return;               /* 至少要含到 t[18] 的数据 */

    toilet_state_t s = { 0 };
    const uint8_t *t = f + 7;           /* t[0] 即帧[7], 与小程序 dealWith30(t) 对齐 */

    s.work_state      = t[0] & 0x1F;
    s.hibernating     = (s.work_state == 1);
    s.self_clean      = (s.work_state == 16);

    s.error_bits[0]   = t[1];
    s.error_bits[1]   = t[2];
    s.error_bits[2]   = t[3];

    s.foot_sensor     = bit_at(t[4], 3);
    s.cover_on        = bit_at(t[4], 4);
    s.ring_on         = bit_at(t[4], 5);
    s.on_seat         = bit_at(t[4], 7);

    uint8_t fl        = t[5] & 0x03;
    s.flushing_large  = (fl == 2);
    s.flushing_small  = (fl == 1);
    s.auto_temp       = bit_at(t[5], 2);

    s.ring_running    = bit_at(t[6], 0);
    s.cover_running   = bit_at(t[6], 1);
    s.auto_small_flush  = bit_at(t[6], 3);
    s.close_cover_flush = bit_at(t[6], 4);
    s.regular_flush   = bit_at(t[6], 7);

    s.auto_cover      = bit_at(t[8], 7);            /* t[15] */
    s.night_light     = bit_at(t[9], 6);            /* t[16] */
    s.light_sensor    = bit_at(t[9], 7);
    s.auto_flush      = bit_at(t[10], 7);           /* t[17] */
    s.seat_temp_level = (t[10] >> 3) & 0x07;
    s.smart_power_save = bit_at(t[10], 6);

    s.valid = true;
    s_dev_state = s;

    ESP_LOGI(TAG, "State: work=%u seat_temp=%u %s%s%s%s%s",
             s.work_state, s.seat_temp_level,
             s.on_seat ? "[on-seat] " : "",
             s.cover_on ? "[cover-open] " : "",
             s.ring_on ? "[ring-open] " : "",
             (s.flushing_large || s.flushing_small) ? "[flushing] " : "",
             (s.error_bits[0] | s.error_bits[1] | s.error_bits[2]) ? "[FAULT!]" : "");
}

/* ---------------- MAC 地址匹配 ---------------- */
static bool mac_matches_target(const uint8_t *bda)
{
    return (memcmp(bda, s_target_mac_be, 6) == 0) ||
           (memcmp(bda, s_target_mac_le, 6) == 0);
}

/* ---------------- GAP 回调 (扫描事件) ---------------- */
static void esp_gap_cb(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param)
{
    switch (event) {
    case ESP_GAP_BLE_SCAN_PARAM_SET_COMPLETE_EVT:
        ESP_LOGI(TAG, "Scan params ready (waiting for wake word)");
        break;

    case ESP_GAP_BLE_SCAN_START_COMPLETE_EVT:
        if (param->scan_start_cmpl.status != ESP_BT_STATUS_SUCCESS) {
            ESP_LOGE(TAG, "Scan start failed: %x", param->scan_start_cmpl.status);
            reset_to_idle("scan start failed");
        } else {
            /* 打印运行时生效的 MAC (可能是网页/NVS 配置, 而非编译期 Kconfig 值) */
            ESP_LOGI(TAG, "Scanning for %02X:%02X:%02X:%02X:%02X:%02X (timeout %ds)...",
                     s_target_mac_be[0], s_target_mac_be[1], s_target_mac_be[2],
                     s_target_mac_be[3], s_target_mac_be[4], s_target_mac_be[5],
                     SCAN_TIMEOUT_SEC);
        }
        break;

    case ESP_GAP_BLE_SCAN_RESULT_EVT: {
        esp_ble_gap_cb_param_t *scan_result = (esp_ble_gap_cb_param_t *)param;
        switch (scan_result->scan_rst.search_evt) {
        case ESP_GAP_SEARCH_INQ_RES_EVT:
            if (s_state != STATE_SCANNING) break;
            if (mac_matches_target(scan_result->scan_rst.bda)) {
                ESP_LOGI(TAG, "Target MAC found! Connecting...");
                set_state(STATE_CONNECTING);
                esp_ble_gap_stop_scanning();
                esp_ble_gattc_open(gl_profile_tab[PROFILE_A_APP_ID].gattc_if,
                                   scan_result->scan_rst.bda,
                                   scan_result->scan_rst.ble_addr_type, true);
            }
            break;
        case ESP_GAP_SEARCH_INQ_CMPL_EVT:
            if (s_state == STATE_SCANNING) {
                ESP_LOGE(TAG, "Scan timeout! Target not found.");
                fire_event(BLE_TOILET_EVT_CONNECT_FAIL);   /* 语音: 连接失败 */
                reset_to_idle("scan timeout");
            }
            break;
        default: break;
        }
        break;
    }

    case ESP_GAP_BLE_SCAN_STOP_COMPLETE_EVT:
        break;

    default:
        break;
    }
}

/* ---------------- GATTC 事件处理 ---------------- */
static void gattc_profile_event_handler(esp_gattc_cb_event_t event, esp_gatt_if_t gattc_if, esp_ble_gattc_cb_param_t *param)
{
    esp_ble_gattc_cb_param_t *p_data = (esp_ble_gattc_cb_param_t *)param;

    switch (event) {
    case ESP_GATTC_REG_EVT: {
        ESP_LOGI(TAG, "GATTC registered");
        esp_err_t ret = esp_ble_gap_set_scan_params(&s_ble_scan_params);
        if (ret) ESP_LOGE(TAG, "Set scan params failed: %s", esp_err_to_name(ret));
        break;
    }

    case ESP_GATTC_CONNECT_EVT:
        ESP_LOGI(TAG, "Connected conn_id=%d", p_data->connect.conn_id);
        gl_profile_tab[PROFILE_A_APP_ID].conn_id = p_data->connect.conn_id;
        memcpy(gl_profile_tab[PROFILE_A_APP_ID].remote_bda,
               p_data->connect.remote_bda, sizeof(esp_bd_addr_t));
        esp_ble_gattc_send_mtu_req(gattc_if, p_data->connect.conn_id);
        break;

    case ESP_GATTC_OPEN_EVT:
        if (p_data->open.status != ESP_GATT_OK) {
            ESP_LOGE(TAG, "Open failed status=%d", p_data->open.status);
            fire_event(BLE_TOILET_EVT_CONNECT_FAIL);   /* 语音: 连接失败 */
            reset_to_idle("gattc open failed");
        }
        break;

    case ESP_GATTC_DIS_SRVC_CMPL_EVT:
        if (p_data->dis_srvc_cmpl.status != ESP_GATT_OK) {
            ESP_LOGE(TAG, "Discovery failed status=%d", p_data->dis_srvc_cmpl.status);
            esp_ble_gap_disconnect(gl_profile_tab[PROFILE_A_APP_ID].remote_bda);
            set_state(STATE_DISCONNECTING);
            break;
        }
        ESP_LOGI(TAG, "Discovery complete, searching FFE0...");
        set_state(STATE_DISCOVERING);
        esp_ble_gattc_search_service(gattc_if, p_data->dis_srvc_cmpl.conn_id,
                                     &s_remote_filter_service_uuid);
        break;

    case ESP_GATTC_CFG_MTU_EVT:
        ESP_LOGI(TAG, "MTU=%d", p_data->cfg_mtu.mtu);
        break;

    case ESP_GATTC_SEARCH_RES_EVT:
        if (p_data->search_res.srvc_id.uuid.len == ESP_UUID_LEN_16 &&
            p_data->search_res.srvc_id.uuid.uuid.uuid16 == REMOTE_SERVICE_UUID) {
            ESP_LOGI(TAG, "Found FFE0, handles [%d, %d]",
                     p_data->search_res.start_handle, p_data->search_res.end_handle);
            s_service_found = true;
            gl_profile_tab[PROFILE_A_APP_ID].service_start_handle = p_data->search_res.start_handle;
            gl_profile_tab[PROFILE_A_APP_ID].service_end_handle   = p_data->search_res.end_handle;
        }
        break;

    case ESP_GATTC_SEARCH_CMPL_EVT: {
        if (p_data->search_cmpl.status != ESP_GATT_OK || !s_service_found) {
            ESP_LOGE(TAG, "FFE0 not found, disconnecting");
            esp_ble_gap_disconnect(gl_profile_tab[PROFILE_A_APP_ID].remote_bda);
            set_state(STATE_DISCONNECTING);
            break;
        }

        uint16_t count = 0;
        esp_gatt_status_t status = esp_ble_gattc_get_attr_count(
            gattc_if, p_data->search_cmpl.conn_id, ESP_GATT_DB_CHARACTERISTIC,
            gl_profile_tab[PROFILE_A_APP_ID].service_start_handle,
            gl_profile_tab[PROFILE_A_APP_ID].service_end_handle,
            INVALID_HANDLE, &count);
        if (status != ESP_GATT_OK || count == 0) {
            ESP_LOGE(TAG, "No chars found");
            esp_ble_gap_disconnect(gl_profile_tab[PROFILE_A_APP_ID].remote_bda);
            set_state(STATE_DISCONNECTING);
            break;
        }

        s_char_elem_result = (esp_gattc_char_elem_t *)malloc(sizeof(esp_gattc_char_elem_t) * count);
        if (!s_char_elem_result) {
            esp_ble_gap_disconnect(gl_profile_tab[PROFILE_A_APP_ID].remote_bda);
            set_state(STATE_DISCONNECTING);
            break;
        }
        status = esp_ble_gattc_get_char_by_uuid(
            gattc_if, p_data->search_cmpl.conn_id,
            gl_profile_tab[PROFILE_A_APP_ID].service_start_handle,
            gl_profile_tab[PROFILE_A_APP_ID].service_end_handle,
            s_remote_filter_char_uuid, s_char_elem_result, &count);
        if (status != ESP_GATT_OK || count == 0) {
            ESP_LOGE(TAG, "FFE1 not found");
            free(s_char_elem_result); s_char_elem_result = NULL;
            esp_ble_gap_disconnect(gl_profile_tab[PROFILE_A_APP_ID].remote_bda);
            set_state(STATE_DISCONNECTING);
            break;
        }

        gl_profile_tab[PROFILE_A_APP_ID].char_handle = s_char_elem_result[0].char_handle;
        ESP_LOGI(TAG, "Found FFE1 handle=%d prop=0x%02x",
                 s_char_elem_result[0].char_handle, s_char_elem_result[0].properties);
        free(s_char_elem_result); s_char_elem_result = NULL;

        esp_ble_gattc_register_for_notify(gattc_if,
            gl_profile_tab[PROFILE_A_APP_ID].remote_bda,
            gl_profile_tab[PROFILE_A_APP_ID].char_handle);
        break;
    }

    case ESP_GATTC_REG_FOR_NOTIFY_EVT: {
        if (p_data->reg_for_notify.status != ESP_GATT_OK) {
            ESP_LOGW(TAG, "Notify reg failed, entering READY anyway");
            set_state(STATE_READY);
            restart_idle_timer();
            ESP_LOGI(TAG, "=== BLE READY (notify disabled). Waiting for commands. ===");
            break;
        }

        uint16_t count = 0;
        uint16_t notify_en = 1;
        esp_gatt_status_t ret = esp_ble_gattc_get_attr_count(
            gattc_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id, ESP_GATT_DB_DESCRIPTOR,
            gl_profile_tab[PROFILE_A_APP_ID].service_start_handle,
            gl_profile_tab[PROFILE_A_APP_ID].service_end_handle,
            gl_profile_tab[PROFILE_A_APP_ID].char_handle, &count);
        if (ret != ESP_GATT_OK || count == 0) {
            set_state(STATE_READY);
            restart_idle_timer();
            ESP_LOGI(TAG, "=== BLE READY (no CCCD). Waiting for commands. ===");
            break;
        }

        s_descr_elem_result = malloc(sizeof(esp_gattc_descr_elem_t) * count);
        if (!s_descr_elem_result) {
            set_state(STATE_READY);
            restart_idle_timer();
            break;
        }
        ret = esp_ble_gattc_get_descr_by_char_handle(
            gattc_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
            p_data->reg_for_notify.handle, s_notify_descr_uuid,
            s_descr_elem_result, &count);
        if (ret != ESP_GATT_OK || count == 0) {
            free(s_descr_elem_result); s_descr_elem_result = NULL;
            set_state(STATE_READY);
            restart_idle_timer();
            ESP_LOGI(TAG, "=== BLE READY (CCCD not found). Waiting for commands. ===");
            break;
        }

        esp_ble_gattc_write_char_descr(
            gattc_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
            s_descr_elem_result[0].handle,
            sizeof(notify_en), (uint8_t *)&notify_en,
            ESP_GATT_WRITE_TYPE_RSP, ESP_GATT_AUTH_REQ_NONE);
        free(s_descr_elem_result); s_descr_elem_result = NULL;
        break;
    }

    case ESP_GATTC_WRITE_DESCR_EVT:
        ESP_LOGI(TAG, "CCCD written (status=%d)", p_data->write.status);
        set_state(STATE_READY);
        restart_idle_timer();
        ESP_LOGI(TAG, "=== BLE READY. Waiting for voice commands (timeout %ds). ===",
                 CONFIG_BLE_IDLE_TIMEOUT_SEC);
        /* 就绪后自动查一次状态 (与小程序 onDeviceReady 一致), 回包由 notify 0x30 解析 */
        ble_toilet_execute(TOILET_CMD_QUERY_STATE);
        break;

    case ESP_GATTC_NOTIFY_EVT: {
        uint8_t *val = p_data->notify.value;
        uint16_t len = p_data->notify.value_len;
        ESP_LOGI(TAG, "Notify RX (%d bytes):", len);
        esp_log_buffer_hex(TAG, val, len);

        /* Techramic 应答帧: FC ... FC, 帧第 7 字节 (index 6) 为命令码回显 */
        if (len >= 8 && val[0] == 0xFC && val[len - 1] == 0xFC) {
            switch (val[6]) {
            case 0x30:                          /* 状态上报 -> 解析到 s_dev_state */
                parse_state_report(val, len);
                break;
            case 0x01:                          /* 版本信息应答 (未解析, 仅日志) */
                ESP_LOGI(TAG, "Version report (parsing not implemented)");
                break;
            case 0x60:                          /* 60 命令应答 (座温等) */
                ESP_LOGI(TAG, "Cmd 0x60 ack");
                break;
            default:
                ESP_LOGI(TAG, "Cmd 0x%02X ack", val[6]);
                break;
            }
        }
        break;
    }

    case ESP_GATTC_WRITE_CHAR_EVT:
        if (p_data->write.status != ESP_GATT_OK) {
            ESP_LOGE(TAG, "Write char FAILED status=%d", p_data->write.status);
        } else {
            ESP_LOGI(TAG, "Write char OK");
        }
        break;

    case ESP_GATTC_DISCONNECT_EVT: {
        bool was_ready = s_was_ready;                 /* reset_to_idle 会清除, 先保存 */
        bool was_idle  = (s_state == STATE_IDLE);     /* 已 reset 过(如open失败), 避免重复播报 */
        ESP_LOGI(TAG, "Disconnected (reason=%d)", p_data->disconnect.reason);
        if (s_state == STATE_DISCONNECTING) {
            reset_to_idle("session ended");
            ESP_LOGI(TAG, "=== Back to IDLE. Waiting for next wake word. ===");
        } else {
            reset_to_idle("unexpected disconnect");
        }
        /* 到过 READY -> "已断开"; 从未就绪 -> 属连接失败 -> "连接失败" */
        if (!was_idle) {
            fire_event(was_ready ? BLE_TOILET_EVT_DISCONNECTED : BLE_TOILET_EVT_CONNECT_FAIL);
        }
        break;
    }

    default:
        break;
    }
}

/* ---------------- GATTC 顶层回调分发 ---------------- */
static void esp_gattc_cb(esp_gattc_cb_event_t event, esp_gatt_if_t gattc_if, esp_ble_gattc_cb_param_t *param)
{
    if (event == ESP_GATTC_REG_EVT) {
        if (param->reg.status == ESP_GATT_OK) {
            gl_profile_tab[param->reg.app_id].gattc_if = gattc_if;
        } else {
            ESP_LOGE(TAG, "reg app failed");
            return;
        }
    }
    for (int idx = 0; idx < PROFILE_NUM; idx++) {
        if (gattc_if == ESP_GATT_IF_NONE || gattc_if == gl_profile_tab[idx].gattc_if) {
            if (gl_profile_tab[idx].gattc_cb) {
                gl_profile_tab[idx].gattc_cb(event, gattc_if, param);
            }
        }
    }
}

/* ---------------- 对外 API ---------------- */

bool ble_toilet_is_ready(void)
{
    return s_state == STATE_READY;
}

bool ble_toilet_is_busy(void)
{
    return (s_state == STATE_SCANNING || s_state == STATE_CONNECTING || s_state == STATE_DISCOVERING);
}

const char *ble_toilet_state_name(void)
{
    return state_names[s_state];
}

esp_err_t ble_toilet_disconnect(void)
{
    if (s_state != STATE_READY) {
        return ESP_ERR_INVALID_STATE;
    }
    ESP_LOGI(TAG, "Manual disconnect requested");
    set_state(STATE_DISCONNECTING);
    esp_ble_gap_disconnect(gl_profile_tab[PROFILE_A_APP_ID].remote_bda);
    return ESP_OK;
}

bool ble_toilet_wait_ready(int timeout_ms)
{
    int waited = 0;
    while (waited < timeout_ms) {
        if (s_state == STATE_READY) return true;
        if (s_state == STATE_IDLE)  return false;   /* 连接失败已复位 */
        vTaskDelay(pdMS_TO_TICKS(100));
        waited += 100;
    }
    return false;
}

void ble_toilet_set_target_mac(const uint8_t mac[6])
{
    memcpy(s_target_mac_be, mac, 6);
    for (int i = 0; i < 6; i++) s_target_mac_le[i] = s_target_mac_be[5 - i];
    ESP_LOGI(TAG, "Target MAC updated: %02X:%02X:%02X:%02X:%02X:%02X",
             mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
}

void ble_toilet_get_target_mac(uint8_t mac[6])
{
    memcpy(mac, s_target_mac_be, 6);
}

void ble_toilet_get_state(toilet_state_t *state)
{
    if (state) memcpy(state, &s_dev_state, sizeof(*state));
}

void ble_toilet_set_event_cb(ble_toilet_event_cb_t cb)
{
    s_event_cb = cb;
}

esp_err_t ble_toilet_wake(void)
{
    switch (s_state) {
    case STATE_READY:
        /* Already connected, just reset timeout */
        ESP_LOGI(TAG, "Wake: already READY, timeout reset");
        restart_idle_timer();
        return ESP_OK;

    case STATE_IDLE:
        /* Start scan -> connect flow */
        ESP_LOGI(TAG, "Wake: starting scan...");
        set_state(STATE_SCANNING);
        esp_err_t ret = esp_ble_gap_start_scanning(SCAN_TIMEOUT_SEC);
        if (ret) {
            ESP_LOGE(TAG, "Start scan failed: %s", esp_err_to_name(ret));
            reset_to_idle("scan start failed");
            return ret;
        }
        return ESP_OK;

    default:
        /* SCANNING / CONNECTING / DISCOVERING / DISCONNECTING */
        ESP_LOGW(TAG, "Wake: busy (state=%s), ignored", state_names[s_state]);
        return ESP_ERR_INVALID_STATE;
    }
}

esp_err_t ble_toilet_execute(toilet_cmd_t cmd)
{
    if (cmd <= TOILET_CMD_NONE || cmd >= TOILET_CMD_MAX) {
        return ESP_ERR_INVALID_ARG;
    }
    if (s_state != STATE_READY) {
        ESP_LOGW(TAG, "Execute failed: not READY (state=%s)", state_names[s_state]);
        return ESP_ERR_INVALID_STATE;
    }

    uint8_t frame[10];
    size_t len = build_cmd_frame(cmd, frame);
    if (len == 0) return ESP_ERR_INVALID_ARG;

    ESP_LOGI(TAG, "Execute cmd %d (%d bytes):", (int)cmd, (int)len);
    esp_log_buffer_hex(TAG, frame, len);

    esp_err_t ret = esp_ble_gattc_write_char(
        gl_profile_tab[PROFILE_A_APP_ID].gattc_if,
        gl_profile_tab[PROFILE_A_APP_ID].conn_id,
        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
        len, frame,
        ESP_GATT_WRITE_TYPE_NO_RSP,
        ESP_GATT_AUTH_REQ_NONE);
    if (ret) {
        ESP_LOGE(TAG, "write_char failed: %s", esp_err_to_name(ret));
        return ret;
    }

    /* Reset idle timeout on successful command */
    restart_idle_timer();
    return ESP_OK;
}

esp_err_t ble_toilet_init(void)
{
    /* 解析目标 MAC 地址 */
    if (!parse_mac_string(TOILET_TARGET_MAC_STR, s_target_mac_be)) {
        ESP_LOGE(TAG, "Failed to parse MAC: \"%s\"", TOILET_TARGET_MAC_STR);
        return ESP_ERR_INVALID_ARG;
    }
    for (int i = 0; i < 6; i++) s_target_mac_le[i] = s_target_mac_be[5 - i];
    ESP_LOGI(TAG, "Target MAC: %02X:%02X:%02X:%02X:%02X:%02X",
             s_target_mac_be[0], s_target_mac_be[1], s_target_mac_be[2],
             s_target_mac_be[3], s_target_mac_be[4], s_target_mac_be[5]);

    /* 创建空闲监控: 二值信号量 + 独立任务 (4096 栈) */
    s_idle_sem = xSemaphoreCreateBinary();
    if (!s_idle_sem) {
        ESP_LOGE(TAG, "Failed to create idle semaphore");
        return ESP_FAIL;
    }
    if (xTaskCreate(idle_monitor_task, "ble_idle_mon", 4096, NULL, 5, NULL) != pdPASS) {
        ESP_LOGE(TAG, "Failed to create idle monitor task");
        return ESP_FAIL;
    }

    /* 初始化 BLE 协议栈 */
    ESP_ERROR_CHECK(esp_bt_controller_mem_release(ESP_BT_MODE_CLASSIC_BT));

    esp_bt_controller_config_t bt_cfg = BT_CONTROLLER_INIT_CONFIG_DEFAULT();
    esp_err_t ret = esp_bt_controller_init(&bt_cfg);
    if (ret) { ESP_LOGE(TAG, "bt init: %s", esp_err_to_name(ret)); return ret; }

    ret = esp_bt_controller_enable(ESP_BT_MODE_BLE);
    if (ret) { ESP_LOGE(TAG, "bt enable: %s", esp_err_to_name(ret)); return ret; }

    ret = esp_bluedroid_init();
    if (ret) { ESP_LOGE(TAG, "bluedroid init: %s", esp_err_to_name(ret)); return ret; }

    ret = esp_bluedroid_enable();
    if (ret) { ESP_LOGE(TAG, "bluedroid enable: %s", esp_err_to_name(ret)); return ret; }

    ret = esp_ble_gap_register_callback(esp_gap_cb);
    if (ret) { ESP_LOGE(TAG, "gap cb: %s", esp_err_to_name(ret)); return ret; }

    ret = esp_ble_gattc_register_callback(esp_gattc_cb);
    if (ret) { ESP_LOGE(TAG, "gattc cb: %s", esp_err_to_name(ret)); return ret; }

    ret = esp_ble_gattc_app_register(PROFILE_A_APP_ID);
    if (ret) { ESP_LOGE(TAG, "gattc reg: %s", esp_err_to_name(ret)); return ret; }

    esp_ble_gatt_set_local_mtu(185);

    ESP_LOGI(TAG, "BLE init OK (wake-on-demand, idle timeout %ds)", CONFIG_BLE_IDLE_TIMEOUT_SEC);
    return ESP_OK;
}
