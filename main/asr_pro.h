/*
 * asr_pro.h
 * 天问 ASR-PRO 语音模块 UART 驱动
 *
 * 帧格式 (可在 Kconfig / 宏里调整):
 *   0xAA 0x55 CMD DATA 0x55
 *   CMD = 0x00 : 唤醒词 (触发 BLE 扫描连接)
 *   CMD = 0x01 : 打开脚感      0x02 : 关闭脚感
 *   CMD = 0x03 : 大冲          0x04 : 小冲
 *   CMD = 0x05 : 停止          0x06 : 座圈加热开(高档)
 *   CMD = 0x07 : 座圈加热关
 *   CMD = 0x08 : 翻盖开        0x09 : 翻盖关
 *   CMD = 0x0A : 翻圈开        0x0B : 翻圈关
 *   CMD = 0x0C : 夜灯开        0x0D : 夜灯关
 *   CMD = 0x0E : 座温低档      0x0F : 座温中档
 *   CMD = 0x10 : 座温高档
 *   CMD = 0x11 : 自动冲刷开    0x12 : 自动冲刷关
 *   CMD = 0x13 : 智能节电开    0x14 : 智能节电关
 *   CMD = 0x15 : 休眠          0x16 : 自清洁
 *   CMD = 0x17 : 自动翻盖开    0x18 : 自动翻盖关
 *   CMD = 0x19 : 查询状态
 *   CMD = 0x1A : 久坐提醒开    0x1B : 久坐提醒关
 *   CMD = 0x1C : 四季温感开    0x1D : 四季温感关
 *   CMD = 0x1E : 自动小冲开    0x1F : 自动小冲关
 *   CMD = 0x20 : 关盖冲厕开    0x21 : 关盖冲厕关
 *   CMD = 0x22 : 预润湿开      0x23 : 预润湿关
 *   CMD = 0x24 : 光感夜灯开    0x25 : 光感夜灯关
 *   CMD = 0x26 : 定期冲刷开    0x27 : 定期冲刷关
 *
 * 也兼容"单字节裸命令" 方便调试。
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
 * @brief 直接注入一条 ASR 命令字节 (跳过帧解析), 供调试控制台/Web 使用
 *        cmd: 0x00=唤醒, 0x01-0x19=动作命令
 */
void asr_pro_inject_cmd(uint8_t cmd);

/**
 * @brief 向帧解析状态机喂入一个原始字节, 供调试控制台模拟 ASR-PRO 数据流
 *        例: 依次喂入 AA 55 01 00 55 会触发"打开脚感"
 */
void asr_pro_feed_byte(uint8_t byte);

/* ---------------- 语音反馈码 (ESP32 -> ASR-PRO, 单字节, GPIO16/TX) ----------------
 * ASR-PRO 端在天问Block里配置: 串口收到对应字节 -> 播报对应语音
 */
#define FB_CONNECTED        0xB1    /* 已连接 */
#define FB_DISCONNECTED     0xB2    /* 已断开 */
#define FB_CONNECT_FAIL     0xB3    /* 连接失败/未找到设备 */
#define FB_FOOT_ON          0xB4    /* 已打开脚感 */
#define FB_FOOT_OFF         0xB5    /* 已关闭脚感 */
#define FB_FLUSH_LARGE      0xB6    /* 已大冲 */
#define FB_FLUSH_SMALL      0xB7    /* 已小冲 */
#define FB_STOP             0xB8    /* 已停止 */
#define FB_SEAT_HEAT_ON     0xB9    /* 座圈加热已开 */
#define FB_SEAT_HEAT_OFF    0xBA    /* 座圈加热已关 */
#define FB_BUSY             0xBB    /* 蓝牙忙, 请稍后 */
#define FB_NOT_READY        0xBC    /* 未连接, 请先唤醒 */

/**
 * @brief 向 ASR-PRO 发送一个反馈码, 触发对应语音播报 (传 0 则忽略)
 */
void asr_pro_send_feedback(uint8_t code);

/**
 * @brief 反馈静音开关 (true = 暂停所有反馈码发送)
 *        省电模式自动调度连接马桶时使用, 避免"已连接/已断开"在深夜反复播报
 */
void asr_pro_set_mute(bool mute);

#ifdef __cplusplus
}
#endif
