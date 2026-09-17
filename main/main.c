/*
 * main.c
 * 应用入口: NVS -> BLE(仅初始化) -> WiFi/Web -> 省电模式调度 -> ASR-PRO(UART 语音命令接收)
 *
 * 唤醒连接模式:
 *   - 上电后初始化 BLE 协议栈, 但不扫描不连接
 *   - 收到唤醒词 (CMD=0x00) -> ble_toilet_wake() -> 扫描 -> 连接 -> READY
 *   - 收到命令词 (CMD=0x01-0x05) -> ble_toilet_execute() -> 发送 BLE 指令帧
 *   - 超时 30 秒无命令 -> 自动断开 BLE -> 回到 IDLE
 *
 * 网络功能:
 *   - 有 WiFi 凭据 -> STA 连接路由器 + NTP 校时
 *   - 无凭据/连接失败 -> 热点配网模式 (Toilet-Setup-XXXX)
 *   - Web 页面: 省电模式时间段配置 + 马桶手动控制 + WiFi 配置
 *   - 省电模式: 配置时段内自动开座圈加热, 时段外自动关
 */

#include <stdio.h>
#include <string.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "nvs.h"
#include "nvs_flash.h"
#include "esp_log.h"

#include "ble_toilet.h"
#include "asr_pro.h"
#include "debug_console.h"
#include "app_wifi.h"
#include "web_server.h"
#include "power_save.h"

#define TAG     "APP_MAIN"

/* BLE 状态事件 -> 语音反馈 (通过 ASR-PRO 播报) */
static void on_ble_event(ble_toilet_event_t evt)
{
    switch (evt) {
    case BLE_TOILET_EVT_READY:        asr_pro_send_feedback(FB_CONNECTED);    break;  /* 已连接 */
    case BLE_TOILET_EVT_DISCONNECTED: asr_pro_send_feedback(FB_DISCONNECTED); break;  /* 已断开 */
    case BLE_TOILET_EVT_CONNECT_FAIL: asr_pro_send_feedback(FB_CONNECT_FAIL); break;  /* 连接失败 */
    default: break;
    }
}

void app_main(void)
{
    ESP_LOGI(TAG, "============ JOMOO SQ9650 Voice Controller ============");
    ESP_LOGI(TAG, "Target MAC : " TOILET_TARGET_MAC_STR);
    ESP_LOGI(TAG, "Mode       : Wake-on-demand (wake->connect, timeout->disconnect)");
    ESP_LOGI(TAG, "Protocol   : AA 55 CMD DATA 55");
    ESP_LOGI(TAG, "  CMD 0x00 = Wake (start BLE connection)");
    ESP_LOGI(TAG, "  CMD 0x01 = Foot Sensor ON");
    ESP_LOGI(TAG, "  CMD 0x02 = Foot Sensor OFF");
    ESP_LOGI(TAG, "  CMD 0x03 = Flush Large");
    ESP_LOGI(TAG, "  CMD 0x04 = Flush Small");
    ESP_LOGI(TAG, "  CMD 0x05 = Stop");
    ESP_LOGI(TAG, "  CMD 0x06 = Seat Heat ON");
    ESP_LOGI(TAG, "  CMD 0x07 = Seat Heat OFF");

    /* 1. 初始化 NVS (Bluedroid 依赖) */
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    /* 2. 初始化 BLE 协议栈 (不自动扫描, 等待唤醒词) */
    ESP_ERROR_CHECK(ble_toilet_init());

    /* 3. 初始化 UART 语音命令接收 */
    ESP_ERROR_CHECK(asr_pro_init());

    /* 3.1 注册 BLE 状态事件回调 -> 语音反馈(已连接/已断开/连接失败) */
    ble_toilet_set_event_cb(on_ble_event);

    /* 4. 启动 WiFi (STA 连接路由器 / 无凭据时热点配网), 内部含 NTP 校时 */
    app_wifi_mode_t wifi_mode = app_wifi_start();

    /* 5. 启动 Web 服务 (省电模式配置页 + 马桶控制按钮) */
    ESP_ERROR_CHECK(web_server_start());

    /* 6. 启动省电模式调度 (依赖网络时间, 时间未同步时自动挂起) */
    if (wifi_mode == APP_WIFI_MODE_STA) {
        ESP_ERROR_CHECK(power_save_start());
    } else {
        ESP_LOGW(TAG, "AP provisioning mode, power-save scheduler NOT started");
    }

    /* 7. 启动调试控制台 (烧录串口 UART0), 语音模块未到货时可手动敲命令测试 */
#if CONFIG_ENABLE_DEBUG_CONSOLE
    ESP_ERROR_CHECK(debug_console_init());
#endif

    ESP_LOGI(TAG, "System ready. Waiting for wake word / web requests...");
}
