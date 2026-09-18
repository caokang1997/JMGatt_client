/*
 * app_wifi.c
 * WiFi 管理 + SNTP 时间同步实现
 */

#include <string.h>
#include <stdio.h>
#include <time.h>
#include <sys/time.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"

#include "esp_log.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_netif.h"
#include "esp_sntp.h"
#include "esp_mac.h"

#include "app_config.h"
#include "app_wifi.h"

#define TAG             "APP_WIFI"

/* ---------------- Kconfig 参数 ---------------- */
#ifndef CONFIG_TOILET_AP_SSID
#define CONFIG_TOILET_AP_SSID    "Toilet-Setup"
#endif
#ifndef CONFIG_TOILET_AP_PASS
#define CONFIG_TOILET_AP_PASS    "12345678"
#endif

#define AP_SSID             CONFIG_TOILET_AP_SSID
#define AP_PASS             CONFIG_TOILET_AP_PASS
#define AP_MAX_CONN         4

#define STA_CONNECT_TIMEOUT_MS  25000       /* STA 总超时 */
#define STA_MAX_RETRY           4           /* 最大重试次数 */

/* 时间同步阈值: 大于 2025-01-01 视为有效 */
#define TIME_VALID_THRESHOLD    1735689600L

/* ---------------- 内部状态 ---------------- */
static EventGroupHandle_t s_ev = NULL;
#define WIFI_CONNECTED_BIT  BIT0
#define WIFI_FAIL_BIT       BIT1

static app_wifi_mode_t s_mode = APP_WIFI_MODE_AP;
static char s_ip[16] = "0.0.0.0";
static char s_ssid[33] = "";
static volatile int s_retry = 0;
static volatile bool s_sta_giveup = false;     /* 放弃 STA 重试(转配网模式) */

/* ---------------- SNTP ---------------- */

static void sntp_time_cb(struct timeval *tv)
{
    ESP_LOGI(TAG, "SNTP time synced");
}

static void start_sntp(void)
{
    if (esp_sntp_enabled()) {
        return;
    }
    ESP_LOGI(TAG, "Initializing SNTP...");
    esp_sntp_setoperatingmode(ESP_SNTP_OPMODE_POLL);
    esp_sntp_setservername(0, "ntp.aliyun.com");
    esp_sntp_setservername(1, "cn.pool.ntp.org");
    esp_sntp_setservername(2, "pool.ntp.org");
    esp_sntp_set_time_sync_notification_cb(sntp_time_cb);
    esp_sntp_init();

    /* 中国时区 UTC+8 */
    setenv("TZ", "CST-8", 1);
    tzset();
}

bool app_time_is_synced(void)
{
    return time(NULL) > TIME_VALID_THRESHOLD;
}

void app_wifi_get_time_str(char *buf, size_t len)
{
    if (!buf || len == 0) return;

    if (!app_time_is_synced()) {
        snprintf(buf, len, "-");
        return;
    }

    static const char *wd[] = { "周日", "周一", "周二", "周三", "周四", "周五", "周六" };
    time_t now = time(NULL);
    struct tm tmv;
    localtime_r(&now, &tmv);
    snprintf(buf, len, "%04d-%02d-%02d %02d:%02d:%02d %s",
             tmv.tm_year + 1900, tmv.tm_mon + 1, tmv.tm_mday,
             tmv.tm_hour, tmv.tm_min, tmv.tm_sec, wd[tmv.tm_wday]);
}

/* ---------------- WiFi 事件处理 ---------------- */

static void on_wifi_event(void *arg, esp_event_base_t base, int32_t id, void *data)
{
    if (base == WIFI_EVENT) {
        switch (id) {
        case WIFI_EVENT_STA_START:
            esp_wifi_connect();
            break;
        case WIFI_EVENT_STA_DISCONNECTED: {
            if (!s_sta_giveup && s_retry < STA_MAX_RETRY) {
                s_retry++;
                ESP_LOGW(TAG, "STA connect failed, retry %d/%d...", s_retry, STA_MAX_RETRY);
                esp_wifi_connect();
            } else {
                ESP_LOGE(TAG, "STA connect failed (retry %d/%d)", s_retry, STA_MAX_RETRY);
                if (s_ev) xEventGroupSetBits(s_ev, WIFI_FAIL_BIT);
            }
            break;
        }
        default:
            break;
        }
    } else if (base == IP_EVENT && id == IP_EVENT_STA_GOT_IP) {
        ip_event_got_ip_t *evt = (ip_event_got_ip_t *)data;
        snprintf(s_ip, sizeof(s_ip), IPSTR, IP2STR(&evt->ip_info.ip));
        ESP_LOGI(TAG, "Got IP: %s", s_ip);
        s_retry = 0;
        if (s_ev) xEventGroupSetBits(s_ev, WIFI_CONNECTED_BIT);
    }
}

/* ---------------- STA / AP 模式启动 ---------------- */

static bool start_sta_mode(const char *ssid, const char *pass)
{
    esp_netif_create_default_wifi_sta();

    wifi_config_t cfg = { 0 };
    strlcpy((char *)cfg.sta.ssid, ssid, sizeof(cfg.sta.ssid));
    strlcpy((char *)cfg.sta.password, pass, sizeof(cfg.sta.password));
    cfg.sta.threshold.authmode = WIFI_AUTH_WPA_WPA2_PSK;

    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
    ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &cfg));
    ESP_ERROR_CHECK(esp_wifi_start());

    ESP_LOGI(TAG, "STA connecting to \"%s\"...", ssid);

    EventBits_t bits = xEventGroupWaitBits(s_ev,
                                           WIFI_CONNECTED_BIT | WIFI_FAIL_BIT,
                                           pdFALSE, pdFALSE,
                                           pdMS_TO_TICKS(STA_CONNECT_TIMEOUT_MS));

    if (bits & WIFI_CONNECTED_BIT) {
        strlcpy(s_ssid, ssid, sizeof(s_ssid));
        start_sntp();
        ESP_LOGI(TAG, "=== STA mode ready, IP=%s ===", s_ip);
        return true;
    }

    ESP_LOGE(TAG, "STA connect timeout/fail");
    return false;
}

static void start_ap_mode(void)
{
    /* 若之前尝试过 STA, WiFi 已在运行, 先停止再切换模式 */
    s_sta_giveup = true;        /* 事件回调里不再继续重试连接 */
    esp_wifi_stop();

    esp_netif_create_default_wifi_ap();

    uint8_t mac[6] = { 0 };
    char ssid_with_id[40] = { 0 };
    esp_read_mac(mac, ESP_MAC_WIFI_SOFTAP);
    /* 热点名加 MAC 后缀, 避免多台设备冲突 */
    snprintf(ssid_with_id, sizeof(ssid_with_id), "%s-%02X%02X",
             AP_SSID, mac[4], mac[5]);

    wifi_config_t cfg = { 0 };
    strlcpy((char *)cfg.ap.ssid, ssid_with_id, sizeof(cfg.ap.ssid));
    cfg.ap.ssid_len = strlen(ssid_with_id);
    strlcpy((char *)cfg.ap.password, AP_PASS, sizeof(cfg.ap.password));
    cfg.ap.channel = 6;
    cfg.ap.max_connection = AP_MAX_CONN;
    cfg.ap.authmode = WIFI_AUTH_WPA2_PSK;

    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_AP));
    ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_AP, &cfg));
    ESP_ERROR_CHECK(esp_wifi_start());

    /* AP 网关地址默认 192.168.4.1 */
    esp_netif_t *netif = esp_netif_get_handle_from_ifkey("WIFI_AP_DEF");
    if (netif) {
        esp_netif_ip_info_t ip;
        esp_netif_get_ip_info(netif, &ip);
        snprintf(s_ip, sizeof(s_ip), IPSTR, IP2STR(&ip.ip));
    }
    strlcpy(s_ssid, ssid_with_id, sizeof(s_ssid));

    ESP_LOGW(TAG, "=== AP provisioning mode ===");
    ESP_LOGW(TAG, "Connect hotspot: \"%s\" pass: \"%s\"", ssid_with_id, AP_PASS);
    ESP_LOGW(TAG, "Then open http://%s to configure", s_ip);
}

/* ---------------- 对外 API ---------------- */

app_wifi_mode_t app_wifi_start(void)
{
    /* 初始化 TCP/IP 栈与默认事件循环 */
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK(esp_event_loop_create_default());

    s_ev = xEventGroupCreate();

    /* 注册事件 */
    ESP_ERROR_CHECK(esp_event_handler_register(WIFI_EVENT, ESP_EVENT_ANY_ID, on_wifi_event, NULL));
    ESP_ERROR_CHECK(esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, on_wifi_event, NULL));

    /* WiFi 驱动初始化 */
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));

    /* 读取已保存凭据, 决定 STA / AP */
    char ssid[WIFI_SSID_MAX_LEN] = { 0 };
    char pass[WIFI_PASS_MAX_LEN] = { 0 };
    bool has_cred = app_config_wifi_get(ssid, pass);

    if (has_cred && start_sta_mode(ssid, pass)) {
        s_mode = APP_WIFI_MODE_STA;
    } else {
        start_ap_mode();
        s_mode = APP_WIFI_MODE_AP;
    }
    return s_mode;
}

bool app_wifi_is_sta(void)
{
    return s_mode == APP_WIFI_MODE_STA;
}

void app_wifi_get_ip(char *buf, size_t len)
{
    strlcpy(buf, s_ip, len);
}

void app_wifi_get_ssid(char *buf, size_t len)
{
    strlcpy(buf, s_ssid, len);
}
