/*
 * app_wifi.h
 * WiFi 管理 + SNTP 时间同步
 *
 * 启动流程 (app_wifi_start):
 *   1. NVS 中有 WiFi 凭据 -> STA 模式连接路由器 (最多尝试 4 次)
 *      成功 -> 启动 SNTP 时间同步, 返回 APP_WIFI_MODE_STA
 *      失败 -> 转入热点配网模式
 *   2. NVS 中无凭据 -> 直接进入热点配网模式, 返回 APP_WIFI_MODE_AP
 *
 * 配网模式: 开放热点 "Toilet-Setup" (Kconfig 可改), 网关 192.168.4.1,
 *           用户连接后通过网页提交 WiFi 信息, 保存 NVS 后设备重启。
 */
#pragma once

#include <stdbool.h>
#include <stddef.h>
#include "esp_err.h"

#ifdef __cplusplus
extern "C" {
#endif

typedef enum {
    APP_WIFI_MODE_STA = 0,      /* 已连接路由器 (正常工作模式) */
    APP_WIFI_MODE_AP,           /* 热点配网模式 */
} app_wifi_mode_t;

/**
 * @brief 初始化网络栈并按 NVS 凭据选择 STA / AP 模式 (阻塞, 最多约 25 秒)
 *        必须在 NVS 初始化之后调用
 */
app_wifi_mode_t app_wifi_start(void);

/* 当前是否为 STA 模式 */
bool app_wifi_is_sta(void);

/* 取当前模式下的本机 IP 字符串 (点分十进制) */
void app_wifi_get_ip(char *buf, size_t len);

/* 取当前 SSID (STA: 路由器 SSID / AP: 热点 SSID) */
void app_wifi_get_ssid(char *buf, size_t len);

/* SNTP 时间是否已同步成功 */
bool app_time_is_synced(void);

/* 取当前时间字符串 "YYYY-MM-DD HH:MM:SS 周X", 未同步返回 "-" */
void app_wifi_get_time_str(char *buf, size_t len);

#ifdef __cplusplus
}
#endif
