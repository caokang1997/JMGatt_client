/*
 * power_save.h
 * 省电模式 - 座圈加热时间段自动控制
 *
 * 逻辑:
 *   - 配置两组时间段: 工作日(周一~周五) / 周末(周六/周日), 每组最多 4 段
 *   - 处于时段内  -> 自动连接马桶并打开座圈加热(标准档)
 *   - 处于时段外  -> 自动连接马桶并关闭座圈加热
 *   - 仅在"时段边界跨越"或"首次同步"时下发命令, 用户语音/网页的手动
 *     操作不会被自动覆盖, 直到下一次边界变化
 *
 * 依赖: SNTP 时间同步(未同步时不动作), BLE 与语音控制共享连接(忙时跳过)
 */
#pragma once

#include <stdbool.h>
#include "esp_err.h"
#include "app_config.h"

#ifdef __cplusplus
extern "C" {
#endif

/**
 * @brief 初始化并启动省电模式调度任务 (内部会加载 NVS 配置)
 *        必须在 ble_toilet_init / app_wifi_start 之后调用
 */
esp_err_t power_save_start(void);

/**
 * @brief 网页保存新配置后调用: 重载配置并重置状态, 下个周期立即生效
 */
void power_save_reload(void);

/**
 * @brief 获取当前生效配置的副本 (供网页展示)
 */
void power_save_get_cfg(power_save_cfg_t *cfg);

/**
 * @brief 用户手动控制座圈加热后通知 (语音/网页), 记录当前实际状态
 *        避免调度器与用户操作冲突
 */
void power_save_report_manual(bool seat_heat_on);

/**
 * @brief 当前调度的期望状态: 1=时段内(开) 0=时段外(关) -1=未知/未启用/时间未同步
 */
int power_save_desired_state(void);

#ifdef __cplusplus
}
#endif
