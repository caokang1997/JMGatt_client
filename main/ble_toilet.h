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
    TOILET_CMD_FOOT_SENSOR_ON,   /* 打开脚感 (40H,14) */
    TOILET_CMD_FOOT_SENSOR_OFF,  /* 关闭脚感 (40H,14) */
    TOILET_CMD_FLUSH_LARGE,      /* 大冲 (53,2) */
    TOILET_CMD_FLUSH_SMALL,      /* 小冲 (53,1) */
    TOILET_CMD_STOP,             /* 停止 (50,0) */
    TOILET_CMD_SEAT_HEAT_ON,     /* 座圈加热开-高档 (60,3) */
    TOILET_CMD_SEAT_HEAT_OFF,    /* 座圈加热关 (60,0) */
    TOILET_CMD_QUERY_STATE,      /* 查询设备状态 (17,0) */
    TOILET_CMD_SEAT_HEAT_LOW,    /* 座圈加热-低档 (60,1) */
    TOILET_CMD_SEAT_HEAT_MID,    /* 座圈加热-中档 (60,2) */
    TOILET_CMD_COVER_ON,         /* 翻盖-开 (51,1) */
    TOILET_CMD_COVER_OFF,        /* 翻盖-关 (51,0) */
    TOILET_CMD_RING_ON,          /* 翻圈-开 (52,1) */
    TOILET_CMD_RING_OFF,         /* 翻圈-关 (52,0) */
    TOILET_CMD_NIGHT_LIGHT_ON,   /* 夜灯开 (41H,0,1) */
    TOILET_CMD_NIGHT_LIGHT_OFF,  /* 夜灯关 (41H,0,0) */
    TOILET_CMD_AUTO_FLUSH_ON,    /* 自动冲刷开 (40H,5) */
    TOILET_CMD_AUTO_FLUSH_OFF,   /* 自动冲刷关 (40H,5) */
    TOILET_CMD_AUTO_COVER_ON,    /* 自动翻盖开 (40H,0) */
    TOILET_CMD_AUTO_COVER_OFF,   /* 自动翻盖关 (40H,0) */
    TOILET_CMD_SMART_POWER_ON,   /* 智能节电开 (40H,3) */
    TOILET_CMD_SMART_POWER_OFF,  /* 智能节电关 (40H,3) */
    TOILET_CMD_HIBERNATE,        /* 进入休眠 (23,1) */
    TOILET_CMD_SELF_CLEAN,       /* 自清洁 (97,1) */
    TOILET_CMD_SEAT_TOO_LONG_ON, /* 久坐提醒开 (40H,26) */
    TOILET_CMD_SEAT_TOO_LONG_OFF,/* 久坐提醒关 (40H,26) */
    TOILET_CMD_AUTO_TEMP_ON,     /* 四季温感开 (40H,15) */
    TOILET_CMD_AUTO_TEMP_OFF,    /* 四季温感关 (40H,15) */
    TOILET_CMD_REGULAR_FLUSH_ON, /* 定期冲刷开 (40H,23) */
    TOILET_CMD_REGULAR_FLUSH_OFF,/* 定期冲刷关 (40H,23) */
    TOILET_CMD_AUTO_SMALL_ON,    /* 自动小冲开 (40H,19) */
    TOILET_CMD_AUTO_SMALL_OFF,   /* 自动小冲关 (40H,19) */
    TOILET_CMD_CLOSE_COVER_FLUSH_ON,  /* 关盖冲厕开 (40H,20) */
    TOILET_CMD_CLOSE_COVER_FLUSH_OFF, /* 关盖冲厕关 (40H,20) */
    TOILET_CMD_PRE_WETTING_ON,   /* 预润湿开 (40H,18) */
    TOILET_CMD_PRE_WETTING_OFF,  /* 预润湿关 (40H,18) */
    TOILET_CMD_LIGHT_SENSOR_ON,  /* 光感夜灯开 (40H,2) */
    TOILET_CMD_LIGHT_SENSOR_OFF, /* 光感夜灯关 (40H,2) */
    TOILET_CMD_MAX
} toilet_cmd_t;

/* 马桶实时状态 (由 notify 0x30 状态上报帧解析, 参照小程序 dealWith30) */
typedef struct {
    bool valid;              /* 是否收到过状态上报 */
    uint8_t work_state;      /* 工作状态 (0=待机 1=休眠 16=自清洁 17=预湿润 31=自检) */
    bool hibernating;        /* 休眠中 */
    bool self_clean;         /* 自清洁中 */
    bool on_seat;            /* 着座状态 */
    bool cover_on;           /* 盖板翻开 */
    bool ring_on;            /* 座圈翻开 */
    bool cover_running;      /* 翻盖动作中 */
    bool ring_running;       /* 翻圈动作中 */
    bool flushing_large;     /* 大冲进行中 */
    bool flushing_small;     /* 小冲进行中 */
    uint8_t seat_temp_level; /* 座温档位 0=关 1=低 2=中 3=高 */
    bool night_light;        /* 夜灯开 */
    bool light_sensor;       /* 光感夜灯开 */
    bool auto_flush;         /* 自动冲刷开 */
    bool auto_cover;         /* 自动翻盖开 */
    bool smart_power_save;   /* 智能节电开 */
    bool foot_sensor;        /* 脚感开 */
    bool auto_temp;          /* 四季温感开 */
    bool pre_wetting;        /* 预润湿开 */
    bool regular_flush;      /* 定期冲刷开 */
    bool auto_small_flush;   /* 自动小冲开 */
    bool close_cover_flush;  /* 关盖冲厕开 */
    uint8_t error_bits[3];   /* 故障位 t[8]/t[9]/t[10], 非 0 表示有故障 */
} toilet_state_t;

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

/**
 * @brief 运行时修改目标马桶 MAC (网页配置用, 优先级高于 Kconfig 默认值)
 *        立即生效: 当前连接不受影响, 下次唤醒扫描按新地址连接
 */
void ble_toilet_set_target_mac(const uint8_t mac[6]);

/**
 * @brief 读取当前生效的目标 MAC (6 字节, 大端序)
 */
void ble_toilet_get_target_mac(uint8_t mac[6]);

/**
 * @brief 获取马桶实时状态副本 (由 notify 0x30 状态上报解析)
 *        state->valid=false 表示连接后尚未收到状态上报
 */
void ble_toilet_get_state(toilet_state_t *state);

#ifdef __cplusplus
}
#endif
