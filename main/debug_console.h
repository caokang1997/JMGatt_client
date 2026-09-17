/*
 * debug_console.h
 * 调试控制台: 在烧录串口 (UART0) 上提供交互式命令行
 *
 * 语音模块未到货时, 可在 idf.py monitor 里直接敲命令测试 BLE 控制流程,
 * 命令内部走的是和 ASR-PRO 完全相同的代码路径 (asr_pro_inject_cmd / feed_byte)。
 */
#pragma once

#include "esp_err.h"

#ifdef __cplusplus
extern "C" {
#endif

/**
 * @brief 在 UART0 (烧录/监视串口) 上启动交互式调试控制台
 *        需在 ble_toilet_init() 和 asr_pro_init() 之后调用
 */
esp_err_t debug_console_init(void);

#ifdef __cplusplus
}
#endif
