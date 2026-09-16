/*
 * ble_toilet.h
 * 九牧 SQ9650 智能马桶 BLE 客户端 (Techramic 协议, bleProtocol=1)
 *
 * 唤醒连接模式:
 *   - IDLE: BLE 协议栈已初始化, 不扫描
 *   - 收到唤醒词 -> ble_toilet_wake() -> 扫描 -> 连接 -> READY
 *   - 收到命令词 -> ble_toilet_execute(cmd) -> 发送 BLE 指令帧 (必须在 READY 状态)
 *   - 超时 N 秒无命令 -> 自动断开连接 -> 回到 IDLE
 */
#pragma once

#include <stdbool.h>
#include <stdint.h>
#include "esp_err.h"
#include "sdkconfig.h"

#ifdef __cplusplus
extern "C" {
#endif

/* 目标马桶 MAC 地址字符串 (可通过 menuconfig 修改) */
#ifndef CONFIG_TOILET_TARGET_MAC
#define CONFIG_TOILET_TARGET_MAC "A4:C1:38:5E:79:76"
#endif
#define TOILET_TARGET_MAC_STR   CONFIG_TOILET_TARGET_MAC

/* 业务命令枚举 */
typedef enum {
    TOILET_CMD_NONE = 0,
    TOILET_CMD_FOOT_SENSOR_ON,   /* 打开脚感 */
    TOILET_CMD_FOOT_SENSOR_OFF,  /* 关闭脚感 */
    TOILET_CMD_FLUSH_LARGE,      /* 大冲 */
    TOILET_CMD_FLUSH_SMALL,      /* 小冲 */
    TOILET_CMD_STOP,             /* 停止 */
    TOILET_CMD_SEAT_HEAT_ON,     /* 座圈加热开 (标准档 level=3) */
    TOILET_CMD_SEAT_HEAT_OFF,    /* 座圈加热关 (level=0) */
    TOILET_CMD_QUERY_STATE,      /* 查询设备状态 */
    TOILET_CMD_MAX
} toilet_cmd_t;

/**
 * @brief 初始化 BLE 控制器 + Bluedroid + GATTC (不会自动扫描)
 */
esp_err_t ble_toilet_init(void);

/**
 * @brief 唤醒词触发: 开始扫描 -> 连接 -> 发现服务 -> 进入 READY 状态
 *        如果已经在 READY 状态, 仅重置超时定时器
 *        如果正在扫描/连接中, 返回 ESP_ERR_INVALID_STATE
 */
esp_err_t ble_toilet_wake(void);

/**
 * @brief 发送命令到马桶, 必须在 READY 状态下调用
 *        成功后会重置超时定时器
 *        未连接时返回 ESP_ERR_INVALID_STATE
 */
esp_err_t ble_toilet_execute(toilet_cmd_t cmd);

/**
 * @brief 检查 BLE 是否已连接并就绪 (可接受命令)
 */
bool ble_toilet_is_ready(void);

/**
 * @brief 检查 BLE 是否忙碌 (正在扫描或连接中)
 */
bool ble_toilet_is_busy(void);

#ifdef __cplusplus
}
#endif
