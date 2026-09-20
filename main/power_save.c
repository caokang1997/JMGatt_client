/*
 * power_save.c
 * 省电模式 - 座圈加热时间段自动控制实现
 *
 * 调度策略 (每 30 秒检查一次):
 *   want = 当前时刻是否落在任一配置时段内
 *   仅当 want 相对上次"成功执行值"发生变化时才连接马桶下发命令:
 *     - 开机/时间刚同步/配置刚修改 -> 强制同步一次
 *     - 时段边界跨越 -> 执行开/关
 *     - 其余时间不动 -> 用户手动操作不被覆盖
 *   BLE 被语音/网页占用时跳过本周期, 下周期重试
 *   自动调度的连接全程静音 (不触发"已连接/已断开"语音播报)
 *   执行失败: 30 秒后重试; 连续失败 3 次后退避为每 5 分钟重试一次
 */

#include <string.h>
#include <stdio.h>
#include <time.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "esp_log.h"

#include "power_save.h"
#include "ble_toilet.h"
#include "asr_pro.h"
#include "app_wifi.h"

#define TAG                 "PWR_SAVE"

#define CHECK_PERIOD_SEC    30          /* 检查周期(秒) */
#define WAIT_READY_MS       25000       /* 等待 BLE 就绪超时 */
#define CMD_SETTLE_MS       800         /* 命令写入后的等待 */
#define FAIL_BACKOFF_CYCLES 10          /* 连续失败后的退避周期数 (10*30s = 5分钟) */
#define FAIL_STREAK_LIMIT   3           /* 连续失败多少次后进入退避 */

/* ---------------- 内部状态 ---------------- */

static power_save_cfg_t s_cfg;              /* 当前生效配置 (reload 时更新) */
static volatile int s_applied = -1;         /* 最近一次下发的状态: -1 未知, 0 关, 1 开 */
static volatile int s_prev_want = -1;       /* 上一周期计算出的期望值 (边界检测) */
static volatile bool s_time_ever_synced = false;
static int s_fail_streak = 0;               /* 连续执行失败次数 */
static int s_skip_cycles = 0;               /* 退避期间跳过的检查周期数 */

/* ---------------- 时间段判断 ---------------- */

/* 判断 now 分钟是否落在 [start, end) 内, 支持跨午夜 (start > end) */
static bool in_slot(int now, int start, int end)
{
    if (start == end) return false;
    if (start < end)  return now >= start && now < end;
    /* 跨午夜: 如 22:00-06:00 */
    return now >= start || now < end;
}

static bool compute_want(bool *is_weekday)
{
    time_t now = time(NULL);
    struct tm tmv;
    localtime_r(&now, &tmv);

    int wday = tmv.tm_wday;                  /* 0=周日 ... 6=周六 */
    *is_weekday = (wday >= 1 && wday <= 5);

    int now_min = tmv.tm_hour * 60 + tmv.tm_min;
    const power_save_cfg_t *c = &s_cfg;

    if (*is_weekday) {
        for (int i = 0; i < c->wd_count && i < PS_MAX_SLOTS; i++) {
            if (in_slot(now_min, c->wd_start[i], c->wd_end[i])) return true;
        }
    } else {
        for (int i = 0; i < c->we_count && i < PS_MAX_SLOTS; i++) {
            if (in_slot(now_min, c->we_start[i], c->we_end[i])) return true;
        }
    }
    return false;
}

/* ---------------- 命令执行 ---------------- */

/* 连接马桶 -> 下发座圈加热命令 -> 立即断开; 返回是否成功 */
static bool apply_seat_heat(bool on)
{
    /* BLE 被其他调用方(语音/网页)占用, 本周期放弃 */
    if (ble_toilet_is_busy() || ble_toilet_is_ready()) {
        ESP_LOGW(TAG, "BLE busy (voice/web session?), skip this cycle");
        return false;
    }

    ESP_LOGI(TAG, "Applying seat heat %s (connect...)", on ? "ON" : "OFF");

    /* 静默执行: 自动调度的连接/断开/失败不触发语音播报, 只有用户主动唤醒才播报 */
    asr_pro_set_mute(true);

    if (ble_toilet_wake() != ESP_OK) {
        asr_pro_set_mute(false);
        return false;
    }
    if (!ble_toilet_wait_ready(WAIT_READY_MS)) {
        ESP_LOGE(TAG, "BLE not ready in %d ms", WAIT_READY_MS);
        asr_pro_set_mute(false);
        return false;
    }

    vTaskDelay(pdMS_TO_TICKS(300));
    esp_err_t ret = ble_toilet_execute(on ? TOILET_CMD_SEAT_HEAT_ON
                                          : TOILET_CMD_SEAT_HEAT_OFF);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Seat heat cmd failed: %s", esp_err_to_name(ret));
    }

    /* 给写入留一点时间, 然后立即断开释放蓝牙 */
    vTaskDelay(pdMS_TO_TICKS(CMD_SETTLE_MS));
    ble_toilet_disconnect();
    asr_pro_set_mute(false);     /* 恢复语音反馈 */

    return (ret == ESP_OK);
}

/* ---------------- 调度任务 ---------------- */

static void power_save_task(void *arg)
{
    while (1) {
        vTaskDelay(pdMS_TO_TICKS(CHECK_PERIOD_SEC * 1000));

        bool synced = app_time_is_synced();
        if (synced && !s_time_ever_synced) {
            /* 时间刚同步成功, 状态未知, 强制重新同步一次 */
            ESP_LOGI(TAG, "Time synced, force resync seat state");
            s_prev_want = -1;
            s_applied = -1;
            s_time_ever_synced = true;
        } else if (!synced) {
            s_prev_want = -1;      /* 时间失效(如重启未同步), 等同步后重新强制同步 */
            continue;
        }

        if (!s_cfg.enable) {
            s_prev_want = -1;      /* 关闭时保持未知, 重新开启后强制同步 */
            continue;
        }

        /* 失败退避: 连续失败后拉长重试间隔, 避免深夜每 30 秒重连打扰 */
        if (s_skip_cycles > 0) {
            s_skip_cycles--;
            continue;
        }

        bool is_wd = false;
        bool want = compute_want(&is_wd);

        /* 首次运行 或 期望值变化(时段边界跨越) 时才需要执行 */
        if (s_prev_want != -1 && (int)want == s_prev_want) {
            continue;
        }

        ESP_LOGI(TAG, "Want seat heat: %s (%s, applied=%d)",
                 want ? "ON" : "OFF", is_wd ? "weekday" : "weekend", s_applied);

        if (apply_seat_heat(want)) {
            s_applied = want;
            s_prev_want = want;
            s_fail_streak = 0;
            ESP_LOGI(TAG, "Seat heat %s applied OK", want ? "ON" : "OFF");
        } else {
            /* 失败则不更新 s_prev_want, 下个周期自动重试;
             * 连续失败 3 次 (如手机占用蓝牙/马桶不在) 后退避为每 5 分钟一次 */
            if (++s_fail_streak >= FAIL_STREAK_LIMIT) {
                s_skip_cycles = FAIL_BACKOFF_CYCLES;
                s_fail_streak = 0;
                ESP_LOGW(TAG, "Apply failed %d times, backoff %d min",
                         FAIL_STREAK_LIMIT, FAIL_BACKOFF_CYCLES * CHECK_PERIOD_SEC / 60);
            }
        }
    }
}

/* ---------------- 对外 API ---------------- */

esp_err_t power_save_start(void)
{
    app_config_ps_load(&s_cfg);

    if (xTaskCreate(power_save_task, "ps_task", 4096, NULL, 4, NULL) != pdPASS) {
        ESP_LOGE(TAG, "Create power save task failed");
        return ESP_FAIL;
    }

    ESP_LOGI(TAG, "Power-save scheduler started (enable=%u)", s_cfg.enable);
    return ESP_OK;
}

void power_save_reload(void)
{
    app_config_ps_load(&s_cfg);
    s_prev_want = -1;      /* 强制下个周期重新评估并同步 */
    s_fail_streak = 0;     /* 重置失败退避 */
    s_skip_cycles = 0;
    ESP_LOGI(TAG, "Config reloaded (enable=%u)", s_cfg.enable);
}

void power_save_get_cfg(power_save_cfg_t *cfg)
{
    if (cfg) memcpy(cfg, (const void *)&s_cfg, sizeof(*cfg));
}

void power_save_report_manual(bool seat_heat_on)
{
    /* 只记录实际状态; 不动 s_prev_want, 手动操作保持到下个边界 */
    s_applied = seat_heat_on ? 1 : 0;
    ESP_LOGI(TAG, "Manual seat heat %s reported", seat_heat_on ? "ON" : "OFF");
}

int power_save_desired_state(void)
{
    if (!s_cfg.enable || !app_time_is_synced()) {
        return -1;
    }
    bool is_wd = false;
    return compute_want(&is_wd) ? 1 : 0;
}
