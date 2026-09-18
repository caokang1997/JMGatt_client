/*
 * app_config.h
 * 应用配置管理 - NVS 持久化存储
 *
 * 管理:
 *   1. WiFi 凭据 (STA 模式 SSID/密码)
 *   2. 省电模式配置 (座圈加热时间段)
 */
#pragma once

#include <stdbool.h>
#include <stdint.h>
#include "esp_err.h"

#ifdef __cplusplus
extern "C" {
#endif

/* ---------------- 省电模式配置 ---------------- */

#define PS_MAX_SLOTS        4       /* 每组(工作日/周末)最多时间段数 */

typedef struct {
    uint32_t magic;                         /* 魔数校验, 见 APP_CONFIG_MAGIC */
    uint8_t  enable;                        /* 省电模式总开关 0/1 */
    uint8_t  wd_count;                      /* 工作日(周一~周五)时段数 */
    uint8_t  we_count;                      /* 周末(周六/周日)时段数 */
    uint8_t  _reserved;                     /* 对齐保留 */
    uint16_t wd_start[PS_MAX_SLOTS];        /* 工作日时段开始(分钟, 0=00:00, 1440=24:00) */
    uint16_t wd_end[PS_MAX_SLOTS];          /* 工作日时段结束(分钟) */
    uint16_t we_start[PS_MAX_SLOTS];        /* 周末时段开始 */
    uint16_t we_end[PS_MAX_SLOTS];          /* 周末时段结束 */
} power_save_cfg_t;

/* 默认配置: 工作日 07:00-08:30 与 17:30-24:00 开启, 其余关闭; 周末无时段 */
void app_config_ps_default(power_save_cfg_t *cfg);

/**
 * @brief 从 NVS 读取省电模式配置
 *        首次使用(无记录/校验失败)时写入并返回默认配置
 */
esp_err_t app_config_ps_load(power_save_cfg_t *cfg);

/**
 * @brief 保存省电模式配置到 NVS
 */
esp_err_t app_config_ps_save(const power_save_cfg_t *cfg);

/* ---------------- WiFi 凭据 ---------------- */

/**
 * @brief 读取 WiFi 凭据, ssid/pass 缓冲区长度至少 WIFI_SSID_MAX_LEN / WIFI_PASS_MAX_LEN
 * @return true: 有已保存的凭据, false: 无(需要配网)
 */
bool app_config_wifi_get(char *ssid, char *pass);

/**
 * @brief 保存 WiFi 凭据到 NVS
 */
esp_err_t app_config_wifi_save(const char *ssid, const char *pass);

/**
 * @brief 清除 WiFi 凭据 (恢复出厂, 重新进入配网模式)
 */
esp_err_t app_config_wifi_clear(void);

#define WIFI_SSID_MAX_LEN   33
#define WIFI_PASS_MAX_LEN   65

/* ---------------- 马桶蓝牙 MAC ---------------- */

/**
 * @brief 读取已保存的马桶 BLE MAC (6 字节)
 * @return true: 有已保存的 MAC; false: 无 (使用 Kconfig 编译默认值)
 */
bool app_config_mac_get(uint8_t mac[6]);

/**
 * @brief 保存马桶 BLE MAC 到 NVS
 */
esp_err_t app_config_mac_save(const uint8_t mac[6]);

#ifdef __cplusplus
}
#endif
