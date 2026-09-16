/*
 * asr_pro.h
 * 天问 ASR-PRO 语音模块 UART 驱动
 *
 * 帧格式 (可在 Kconfig / 宏里调整):
 *   0xAA 0x55 CMD DATA 0x55
 *   CMD = 0x00 : 唤醒词 (触发 BLE 扫描连接)
 *   CMD = 0x01 : 打开脚感
 *   CMD = 0x02 : 关闭脚感
 *   CMD = 0x03 : 大冲
 *   CMD = 0x04 : 小冲
 *   CMD = 0x05 : 停止
 *
 * 也兼容"单字节裸命令"(仅 0x00..0x05) 方便调试。
 */
#pragma once

#include "esp_err.h"

#ifdef __cplusplus
extern "C" {
#endif

/**
 * @brief 初始化 UART 并启动接收任务
 *        必须在 ble_toilet_init() 之后调用
 */
esp_err_t asr_pro_init(void);

#ifdef __cplusplus
}
#endif
