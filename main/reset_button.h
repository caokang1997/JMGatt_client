/*
 * reset_button.h
 * 实体按键恢复出厂 - 长按 5 秒清除 NVS 配网信息
 *
 * 按住 BOOT 键 (GPIO0, Kconfig 可改) 持续 5 秒:
 *   清除 WiFi 凭据 -> 重启进入配网热点模式
 *   (省电模式配置与马桶蓝牙地址保留)
 */
#pragma once

#include "esp_err.h"

#ifdef __cplusplus
extern "C" {
#endif

/**
 * @brief 初始化按键并启动监测任务 (低电平有效, 内部上拉)
 *        必须在 NVS 初始化之后调用
 */
esp_err_t reset_button_start(void);

#ifdef __cplusplus
}
#endif
