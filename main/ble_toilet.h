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

/* BLE 状态事件 (用于语音反馈等上层通知) */
typedef enum {
    BLE_TOILET_EVT_READY = 0,       /* 已连接并就绪 */
    BLE_TOILET_EVT_DISCONNECTED,    /* 已断开连接 (正常会话结束) */
    BLE_TOILET_EVT_CONNECT_FAIL,    /* 连接失败 (扫描超时/open失败/服务未找到) */
} ble_toilet_event_t;

/* 状态事件回调类型 */
typedef void (*ble_toilet_event_cb_t)(ble_toilet_event_t evt);

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

/**
 * @brief 注册 BLE 状态事件回调 (连接就绪/断开/失败), 用于语音反馈
 *        回调可能在 BLE 任务上下文触发, 不要做耗时操作
 */
void ble_toilet_set_event_cb(ble_toilet_event_cb_t cb);

/**
 * @brief 主动断开与马桶的 BLE 连接 (省电模式执行完命令后调用, 尽快释放蓝牙)
 *        仅在 READY 状态有效, 其他状态返回 ESP_ERR_INVALID_STATE
 */
esp_err_t ble_toilet_disconnect(void);

/**
 * @brief 阻塞等待 BLE 进入 READY 状态 (轮询实现, 供省电模式等非实时调用方使用)
 * @return true 已就绪; false 超时或连接失败回到 IDLE
 */
bool ble_toilet_wait_ready(int timeout_ms);

/**
 * @brief 获取当前状态机名称: "IDLE"/"SCANNING"/"CONNECTING"/"DISCOVERING"/"READY"/"DISCONNECTING"
 */
const char *ble_toilet_state_name(void);

#ifdef __cplusplus
}
#endif
