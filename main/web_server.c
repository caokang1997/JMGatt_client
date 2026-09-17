/*
 * web_server.c
 * 内嵌 Web 服务器实现
 */

#include <string.h>
#include <stdio.h>
#include <stdlib.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "esp_log.h"
#include "esp_http_server.h"
#include "esp_system.h"
#include "cJSON.h"

#include "web_server.h"
#include "app_config.h"
#include "app_wifi.h"
#include "ble_toilet.h"
#include "power_save.h"
#include "asr_pro.h"

#define TAG             "WEB_SRV"

#define BODY_MAX_LEN    1024        /* POST body 最大长度 */

/* 嵌入的前端页面 (CMakeLists EMBED_FILES) */
extern const uint8_t index_html_start[] asm("_binary_index_html_start");
extern const uint8_t index_html_end[]   asm("_binary_index_html_end");

/* ---------------- 工具函数 ---------------- */

/* 读取 POST body (调用者负责 free), 失败返回 NULL */
static char *read_body(httpd_req_t *req)
{
    size_t total = req->content_len;
    if (total == 0 || total > BODY_MAX_LEN) {
        return NULL;
    }

    char *buf = malloc(total + 1);
    if (!buf) return NULL;

    size_t received = 0;
    while (received < total) {
        int ret = httpd_req_recv(req, buf + received, total - received);
        if (ret <= 0) {
            free(buf);
            return NULL;
        }
        received += (size_t)ret;
    }
    buf[total] = '\0';
    return buf;
}

/* 发送 JSON 响应 (ok=false 时返回 400) */
static esp_err_t send_json(httpd_req_t *req, const char *json, bool ok)
{
    httpd_resp_set_status(req, ok ? "200 OK" : "400 Bad Request");
    httpd_resp_set_type(req, "application/json");
    return httpd_resp_send(req, json, strlen(json));
}

/* 延迟重启任务 (先让 HTTP 响应发出去) */
static void restart_task(void *arg)
{
    vTaskDelay(pdMS_TO_TICKS(1500));
    ESP_LOGW(TAG, "Restarting...");
    esp_restart();
}

static void schedule_restart(void)
{
    xTaskCreate(restart_task, "restart", 2048, NULL, 5, NULL);
}

/* ---------------- 页面 ---------------- */

static esp_err_t handler_index(httpd_req_t *req)
{
    httpd_resp_set_type(req, "text/html");
    httpd_resp_set_hdr(req, "Cache-Control", "no-store");
    size_t len = index_html_end - index_html_start;
    return httpd_resp_send(req, (const char *)index_html_start, len);
}

/* ---------------- /api/status ---------------- */

static esp_err_t handler_status(httpd_req_t *req)
{
    char ip[16] = { 0 }, ssid[33] = { 0 }, tstr[40] = { 0 };
    app_wifi_get_ip(ip, sizeof(ip));
    app_wifi_get_ssid(ssid, sizeof(ssid));
    app_wifi_get_time_str(tstr, sizeof(tstr));

    uint8_t mac[6];
    ble_toilet_get_target_mac(mac);

    power_save_cfg_t cfg;
    power_save_get_cfg(&cfg);

    char json[576];
    snprintf(json, sizeof(json),
             "{\"mode\":\"%s\",\"ip\":\"%s\",\"ssid\":\"%s\","
             "\"time\":\"%s\",\"time_synced\":%s,"
             "\"ble\":\"%s\",\"ps_enable\":%s,\"ps_desired\":%d,"
             "\"mac\":\"%02X:%02X:%02X:%02X:%02X:%02X\"}",
             app_wifi_is_sta() ? "sta" : "ap",
             ip, ssid, tstr,
             app_time_is_synced() ? "true" : "false",
             ble_toilet_state_name(),
             cfg.enable ? "true" : "false",
             power_save_desired_state(),
             mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);

    return send_json(req, json, true);
}

/* ---------------- /api/config ---------------- */

/* slots 数组元素 [{"start":420,"end":510}, ...] -> 写入 cfg 的 start/end 数组, 返回元素数 */
static int parse_slots(cJSON *arr, uint16_t *starts, uint16_t *ends)
{
    if (!arr || !cJSON_IsArray(arr)) return 0;

    int count = 0;
    int n = cJSON_GetArraySize(arr);
    for (int i = 0; i < n && count < PS_MAX_SLOTS; i++) {
        cJSON *item = cJSON_GetArrayItem(arr, i);
        cJSON *js = cJSON_GetObjectItem(item, "start");
        cJSON *je = cJSON_GetObjectItem(item, "end");
        if (!cJSON_IsNumber(js) || !cJSON_IsNumber(je)) continue;

        int start = (int)js->valuedouble;
        int end   = (int)je->valuedouble;
        /* 边界裁剪: 0..24:00 */
        if (start < 0) start = 0;
        if (start > 1440) start = 1440;
        if (end < 0) end = 0;
        if (end > 1440) end = 1440;
        if (start == end) continue;      /* 空时段跳过 */

        starts[count] = (uint16_t)start;
        ends[count]   = (uint16_t)end;
        count++;
    }
    return count;
}

/* 配置 -> JSON 字符串 */
static void cfg_to_json(const power_save_cfg_t *cfg, char *buf, size_t len)
{
    snprintf(buf, len, "{\"enable\":%s,\"weekday\":[", cfg->enable ? "true" : "false");
    size_t off = strlen(buf);
    for (int i = 0; i < cfg->wd_count; i++) {
        off += snprintf(buf + off, len - off, "%s{\"start\":%u,\"end\":%u}",
                        i ? "," : "", cfg->wd_start[i], cfg->wd_end[i]);
    }
    off += snprintf(buf + off, len - off, "],\"weekend\":[");
    for (int i = 0; i < cfg->we_count; i++) {
        off += snprintf(buf + off, len - off, "%s{\"start\":%u,\"end\":%u}",
                        i ? "," : "", cfg->we_start[i], cfg->we_end[i]);
    }
    snprintf(buf + off, len - off, "]}");
}

static esp_err_t handler_get_config(httpd_req_t *req)
{
    power_save_cfg_t cfg;
    power_save_get_cfg(&cfg);

    char json[768];
    cfg_to_json(&cfg, json, sizeof(json));
    return send_json(req, json, true);
}

static esp_err_t handler_set_config(httpd_req_t *req)
{
    char *body = read_body(req);
    if (!body) {
        return send_json(req, "{\"ok\":false,\"msg\":\"bad body\"}", false);
    }

    cJSON *root = cJSON_Parse(body);
    free(body);
    if (!root) {
        return send_json(req, "{\"ok\":false,\"msg\":\"bad json\"}", false);
    }

    power_save_cfg_t cfg;
    power_save_get_cfg(&cfg);    /* 以当前配置为基础 */

    cJSON *jenable = cJSON_GetObjectItem(root, "enable");
    if (cJSON_IsBool(jenable)) {
        cfg.enable = cJSON_IsTrue(jenable) ? 1 : 0;
    }

    cfg.wd_count = (uint8_t)parse_slots(cJSON_GetObjectItem(root, "weekday"),
                                        cfg.wd_start, cfg.wd_end);
    cfg.we_count = (uint8_t)parse_slots(cJSON_GetObjectItem(root, "weekend"),
                                        cfg.we_start, cfg.we_end);
    cJSON_Delete(root);

    esp_err_t ret = app_config_ps_save(&cfg);
    if (ret != ESP_OK) {
        return send_json(req, "{\"ok\":false,\"msg\":\"save failed\"}", false);
    }

    power_save_reload();         /* 立即生效 */

    char json[768];
    char tmp[720];
    cfg_to_json(&cfg, tmp, sizeof(tmp));
    snprintf(json, sizeof(json), "{\"ok\":true,\"cfg\":%s}", tmp);
    return send_json(req, json, true);
}

/* ---------------- /api/cmd ---------------- */

typedef struct {
    const char *name;
    uint8_t asr_cmd;
} web_cmd_map_t;

/* 与 asr_pro 命令码一致 (复用同一执行路径, 含语音反馈) */
static const web_cmd_map_t s_web_cmds[] = {
    { "wake",    0x00 },
    { "footon",  0x01 },
    { "footoff", 0x02 },
    { "flushl",  0x03 },
    { "flushs",  0x04 },
    { "stop",    0x05 },
    { "seaton",  0x06 },
    { "seatoff", 0x07 },
};

static esp_err_t handler_cmd(httpd_req_t *req)
{
    char *body = read_body(req);
    if (!body) {
        return send_json(req, "{\"ok\":false,\"msg\":\"bad body\"}", false);
    }

    cJSON *root = cJSON_Parse(body);
    free(body);
    if (!root) {
        return send_json(req, "{\"ok\":false,\"msg\":\"bad json\"}", false);
    }

    cJSON *jcmd = cJSON_GetObjectItem(root, "cmd");
    esp_err_t resp = ESP_OK;

    if (cJSON_IsString(jcmd) && jcmd->valuestring) {
        const char *cmd = jcmd->valuestring;
        size_t n = sizeof(s_web_cmds) / sizeof(s_web_cmds[0]);
        bool found = false;
        for (size_t i = 0; i < n; i++) {
            if (strcmp(cmd, s_web_cmds[i].name) == 0) {
                asr_pro_inject_cmd(s_web_cmds[i].asr_cmd);
                ESP_LOGI(TAG, "Web cmd: %s", cmd);
                found = true;
                break;
            }
        }
        if (found) {
            resp = send_json(req, "{\"ok\":true}", true);
        } else {
            resp = send_json(req, "{\"ok\":false,\"msg\":\"unknown cmd\"}", false);
        }
    } else {
        resp = send_json(req, "{\"ok\":false,\"msg\":\"no cmd\"}", false);
    }

    cJSON_Delete(root);
    return resp;
}

/* ---------------- /api/mac ---------------- */

/* 解析 "AA:BB:CC:DD:EE:FF" 形式的 MAC 字符串, 成功返回 true */
static bool parse_mac_str(const char *str, uint8_t mac[6])
{
    unsigned v[6];
    if (sscanf(str, "%2x:%2x:%2x:%2x:%2x:%2x",
               &v[0], &v[1], &v[2], &v[3], &v[4], &v[5]) != 6) {
        return false;
    }
    for (int i = 0; i < 6; i++) {
        if (v[i] > 0xFF) return false;
        mac[i] = (uint8_t)v[i];
    }
    return true;
}

static esp_err_t handler_get_mac(httpd_req_t *req)
{
    uint8_t mac[6];
    ble_toilet_get_target_mac(mac);
    char txt[20];
    snprintf(txt, sizeof(txt), "%02X:%02X:%02X:%02X:%02X:%02X",
             mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    httpd_resp_set_type(req, "text/plain");
    return httpd_resp_send(req, txt, strlen(txt));
}

static esp_err_t handler_set_mac(httpd_req_t *req)
{
    char *body = read_body(req);
    if (!body) {
        return send_json(req, "{\"ok\":false,\"msg\":\"bad body\"}", false);
    }

    cJSON *root = cJSON_Parse(body);
    free(body);
    if (!root) {
        return send_json(req, "{\"ok\":false,\"msg\":\"bad json\"}", false);
    }

    cJSON *jmac = cJSON_GetObjectItem(root, "mac");
    esp_err_t resp;

    uint8_t mac[6];
    if (cJSON_IsString(jmac) && jmac->valuestring &&
        parse_mac_str(jmac->valuestring, mac)) {
        if (app_config_mac_save(mac) == ESP_OK) {
            ble_toilet_set_target_mac(mac);      /* 立即生效 (当前连接不受影响) */
            resp = send_json(req, "{\"ok\":true}", true);
        } else {
            resp = send_json(req, "{\"ok\":false,\"msg\":\"save failed\"}", false);
        }
    } else {
        resp = send_json(req, "{\"ok\":false,\"msg\":\"bad mac (AA:BB:CC:DD:EE:FF)\"}", false);
    }

    cJSON_Delete(root);
    return resp;
}

/* ---------------- /api/wifi & /api/factory ---------------- */

static esp_err_t handler_wifi(httpd_req_t *req)
{
    char *body = read_body(req);
    if (!body) {
        return send_json(req, "{\"ok\":false,\"msg\":\"bad body\"}", false);
    }

    cJSON *root = cJSON_Parse(body);
    free(body);
    if (!root) {
        return send_json(req, "{\"ok\":false,\"msg\":\"bad json\"}", false);
    }

    cJSON *jssid = cJSON_GetObjectItem(root, "ssid");
    cJSON *jpass = cJSON_GetObjectItem(root, "pass");

    esp_err_t resp;
    if (cJSON_IsString(jssid) && jssid->valuestring && strlen(jssid->valuestring) > 0) {
        const char *pass = (cJSON_IsString(jpass) && jpass->valuestring) ? jpass->valuestring : "";
        if (strlen(jssid->valuestring) >= WIFI_SSID_MAX_LEN ||
            strlen(pass) >= WIFI_PASS_MAX_LEN) {
            resp = send_json(req, "{\"ok\":false,\"msg\":\"too long\"}", false);
        } else if (app_config_wifi_save(jssid->valuestring, pass) == ESP_OK) {
            ESP_LOGI(TAG, "WiFi saved, restarting...");
            resp = send_json(req, "{\"ok\":true}", true);
            cJSON_Delete(root);
            schedule_restart();
            return resp;
        } else {
            resp = send_json(req, "{\"ok\":false,\"msg\":\"save failed\"}", false);
        }
    } else {
        resp = send_json(req, "{\"ok\":false,\"msg\":\"no ssid\"}", false);
    }

    cJSON_Delete(root);
    return resp;
}

static esp_err_t handler_factory(httpd_req_t *req)
{
    app_config_wifi_clear();
    ESP_LOGW(TAG, "Factory reset (WiFi cleared), restarting...");
    esp_err_t resp = send_json(req, "{\"ok\":true}", true);
    schedule_restart();
    return resp;
}

/* ---------------- 启动 ---------------- */

static const httpd_uri_t s_uris[] = {
    { .uri = "/",           .method = HTTP_GET,  .handler = handler_index },
    { .uri = "/api/status", .method = HTTP_GET,  .handler = handler_status },
    { .uri = "/api/config", .method = HTTP_GET,  .handler = handler_get_config },
    { .uri = "/api/config", .method = HTTP_POST, .handler = handler_set_config },
    { .uri = "/api/cmd",    .method = HTTP_POST, .handler = handler_cmd },
    { .uri = "/api/mac",    .method = HTTP_GET,  .handler = handler_get_mac },
    { .uri = "/api/mac",    .method = HTTP_POST, .handler = handler_set_mac },
    { .uri = "/api/wifi",   .method = HTTP_POST, .handler = handler_wifi },
    { .uri = "/api/factory",.method = HTTP_POST, .handler = handler_factory },
};

esp_err_t web_server_start(void)
{
    httpd_handle_t server = NULL;
    httpd_config_t cfg = HTTPD_DEFAULT_CONFIG();
    cfg.stack_size = 8192;
    cfg.max_uri_handlers = sizeof(s_uris) / sizeof(s_uris[0]);
    cfg.lru_purge_enable = true;
    /* LWIP_MAX_SOCKETS=8 时 httpd 上限为 5 (内部占用 3 个);
       限制为 4, 给 SNTP/DNS 留 socket 余量 */
    cfg.max_open_sockets = 4;

    esp_err_t ret = httpd_start(&server, &cfg);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "httpd_start failed: %s", esp_err_to_name(ret));
        return ret;
    }

    size_t n = sizeof(s_uris) / sizeof(s_uris[0]);
    for (size_t i = 0; i < n; i++) {
        ret = httpd_register_uri_handler(server, &s_uris[i]);
        if (ret != ESP_OK) {
            ESP_LOGE(TAG, "register %s failed: %s", s_uris[i].uri, esp_err_to_name(ret));
            return ret;
        }
    }

    ESP_LOGI(TAG, "Web server started (%u pages, %u bytes)",
             (unsigned)n, (unsigned)(index_html_end - index_html_start));
    return ESP_OK;
}
