/*
 * app_config.c
 * 应用配置管理 - NVS 持久化存储实现
 */

#include <string.h>

#include "nvs.h"
#include "esp_log.h"

#include "app_config.h"

#define TAG             "APP_CFG"

#define NVS_NAMESPACE   "toilet_cfg"
#define NVS_KEY_PS      "ps_cfg"        /* 省电模式配置 blob */
#define NVS_KEY_SSID    "wifi_ssid"     /* WiFi SSID string */
#define NVS_KEY_PASS    "wifi_pass"     /* WiFi 密码 string */

#define APP_CONFIG_MAGIC    0x50534A4DU  /* "PSJM" (Power-save Jomoo) */

void app_config_ps_default(power_save_cfg_t *cfg)
{
    memset(cfg, 0, sizeof(*cfg));
    cfg->magic = APP_CONFIG_MAGIC;
    cfg->enable = 0;                        /* 默认关闭, 由用户在网页开启 */

    /* 工作日: 07:00-08:30, 17:30-24:00 */
    cfg->wd_count = 2;
    cfg->wd_start[0] = 7 * 60;              /* 07:00 = 420 */
    cfg->wd_end[0]   = 8 * 60 + 30;         /* 08:30 = 510 */
    cfg->wd_start[1] = 17 * 60 + 30;        /* 17:30 = 1050 */
    cfg->wd_end[1]   = 24 * 60;             /* 24:00 = 1440 */

    /* 周末: 默认无时段 */
    cfg->we_count = 0;
}

esp_err_t app_config_ps_load(power_save_cfg_t *cfg)
{
    nvs_handle_t h;
    esp_err_t ret = nvs_open(NVS_NAMESPACE, NVS_READONLY, &h);
    if (ret != ESP_OK) {
        /* 首次使用: 写入默认配置 */
        ESP_LOGW(TAG, "No PS config yet, using defaults");
        app_config_ps_default(cfg);
        return app_config_ps_save(cfg);
    }

    size_t len = sizeof(*cfg);
    ret = nvs_get_blob(h, NVS_KEY_PS, cfg, &len);
    nvs_close(h);

    if (ret != ESP_OK || len != sizeof(*cfg) || cfg->magic != APP_CONFIG_MAGIC) {
        ESP_LOGW(TAG, "PS config invalid (ret=%d len=%u), using defaults", ret, (unsigned)len);
        app_config_ps_default(cfg);
        return app_config_ps_save(cfg);
    }

    ESP_LOGI(TAG, "PS config loaded: enable=%u wd=%u we=%u slots",
             cfg->enable, cfg->wd_count, cfg->we_count);
    return ESP_OK;
}

esp_err_t app_config_ps_save(const power_save_cfg_t *cfg)
{
    nvs_handle_t h;
    esp_err_t ret = nvs_open(NVS_NAMESPACE, NVS_READWRITE, &h);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "nvs_open failed: %s", esp_err_to_name(ret));
        return ret;
    }

    ret = nvs_set_blob(h, NVS_KEY_PS, cfg, sizeof(*cfg));
    if (ret == ESP_OK) {
        ret = nvs_commit(h);
    }
    nvs_close(h);

    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "PS save failed: %s", esp_err_to_name(ret));
    }
    return ret;
}

bool app_config_wifi_get(char *ssid, char *pass)
{
    nvs_handle_t h;
    if (nvs_open(NVS_NAMESPACE, NVS_READONLY, &h) != ESP_OK) {
        return false;
    }

    size_t len = WIFI_SSID_MAX_LEN;
    esp_err_t r1 = nvs_get_str(h, NVS_KEY_SSID, ssid, &len);

    len = WIFI_PASS_MAX_LEN;
    esp_err_t r2 = nvs_get_str(h, NVS_KEY_PASS, pass, &len);
    nvs_close(h);

    bool ok = (r1 == ESP_OK) && (ssid[0] != '\0');
    if (!ok) {
        ssid[0] = '\0';
        pass[0] = '\0';
    }
    (void)r2;   /* 密码允许为空(开放网络) */
    return ok;
}

esp_err_t app_config_wifi_save(const char *ssid, const char *pass)
{
    nvs_handle_t h;
    esp_err_t ret = nvs_open(NVS_NAMESPACE, NVS_READWRITE, &h);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "nvs_open failed: %s", esp_err_to_name(ret));
        return ret;
    }

    ret = nvs_set_str(h, NVS_KEY_SSID, ssid);
    if (ret == ESP_OK) {
        ret = nvs_set_str(h, NVS_KEY_PASS, pass ? pass : "");
    }
    if (ret == ESP_OK) {
        ret = nvs_commit(h);
    }
    nvs_close(h);

    ESP_LOGI(TAG, "WiFi cred saved (ssid=%s)", ssid);
    return ret;
}

esp_err_t app_config_wifi_clear(void)
{
    nvs_handle_t h;
    esp_err_t ret = nvs_open(NVS_NAMESPACE, NVS_READWRITE, &h);
    if (ret != ESP_OK) {
        return ret;
    }
    nvs_erase_key(h, NVS_KEY_SSID);
    nvs_erase_key(h, NVS_KEY_PASS);
    ret = nvs_commit(h);
    nvs_close(h);
    ESP_LOGW(TAG, "WiFi cred cleared (enter provisioning mode)");
    return ret;
}
