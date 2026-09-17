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

#include <stdint.h>
#include "esp_err.h"

#ifdef __cplusplus
extern "C" {
#endif

/**
 * @brief 初始化 UART 并启动接收任务
 *        必须在 ble_toilet_init() 之后调用
 */
esp_err_t asr_pro_init(void);

/**
 * @brief 直接注入一条 ASR 命令字节 (跳过帧解析), 供调试控制台使用
 *        cmd: 0x00=唤醒, 0x01-0x07=动作命令
 */
void asr_pro_inject_cmd(uint8_t cmd);

/**
 * @brief 向帧解析状态机喂入一个原始字节, 供调试控制台模拟 ASR-PRO 数据流
 *        例: 依次喂入 AA 55 01 00 55 会触发"打开脚感"
 */
void asr_pro_feed_byte(uint8_t byte);

#ifdef __cplusplus
}
#endif
