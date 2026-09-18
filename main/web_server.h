/*
 * web_server.h
 * 内嵌 Web 服务器 - 省电模式配置 + 马桶控制 + WiFi 配网
 *
 * 页面与 API:
 *   GET  /              前端页面 (www/index.html, 编译时嵌入固件)
 *   GET  /api/status    设备状态 (WiFi/BLE/时间/省电模式)
 *   GET  /api/config    读取省电模式配置
 *   POST /api/config    保存省电模式配置 (立即生效)
 *   POST /api/cmd       马桶控制 {"cmd":"wake|footon|..."}
 *   POST /api/wifi      保存 WiFi 凭据 {"ssid","pass"} 并重启
 *   POST /api/factory   清除 WiFi 凭据, 重启进入配网模式
 */
#pragma once

#include "esp_err.h"

#ifdef __cplusplus
extern "C" {
#endif

/**
 * @brief 启动 HTTP 服务器 (STA 与 AP 模式下均可调用)
 */
esp_err_t web_server_start(void);

#ifdef __cplusplus
}
#endif
