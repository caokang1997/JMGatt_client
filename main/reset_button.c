/*
 * reset_button.c
 * 实体按键恢复出厂实现
 *
 * 采样策略 (20ms 周期):
 *   - 低电平(按下)持续累计 hold_ms, 每满 1 秒打印倒计时
 *   - 高电平毛刺容忍 60ms (3 次采样), 超过才判定松开清零
 *   - hold_ms 达到阈值 -> 清 WiFi 凭据 -> 3 秒倒计时重启
 */

#include <stdio.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "esp_log.h"
#include "esp_system.h"
#include "driver/gpio.h"

#include "reset_button.h"
#include "app_config.h"

#define TAG             "RESET_BTN"

/* Kconfig 参数 */
#ifndef CONFIG_RESET_BUTTON_GPIO
#define CONFIG_RESET_BUTTON_GPIO     0       /* BOOT 键 */
#endif
#ifndef CONFIG_RESET_BUTTON_HOLD_MS
#define CONFIG_RESET_BUTTON_HOLD_MS  5000    /* 长按阈值 */
#endif

#define BTN_GPIO       CONFIG_RESET_BUTTON_GPIO
#define HOLD_MS        CONFIG_RESET_BUTTON_HOLD_MS

#define POLL_MS        20          /* 采样周期 */
#define GLITCH_MS      60          /* 毛刺容忍 (高电平短于此时长不清零) */
#define REBOOT_DELAY_MS 3000       /* 清除后到重启的间隔 */

static void reset_button_task(void *arg)
{
    int hold_ms = 0;
    int glitch_ms = 0;
    int reported_sec = 0;          /* 已打印的倒计时秒数 */
    bool triggered = false;

    while (1) {
        vTaskDelay(pdMS_TO_TICKS(POLL_MS));

        if (triggered) {
            continue;              /* 已触发, 等待重启 */
        }

        if (gpio_get_level(BTN_GPIO) == 0) {
            hold_ms += POLL_MS;
            glitch_ms = 0;

            int sec = hold_ms / 1000;
            if (sec > reported_sec) {
                reported_sec = sec;
                ESP_LOGW(TAG, "Button held %d/%d s ...", sec, HOLD_MS / 1000);
            }

            if (hold_ms >= HOLD_MS) {
                triggered = true;
                ESP_LOGW(TAG, "=== Factory reset triggered! Clearing WiFi credentials ===");
                app_config_wifi_clear();
                ESP_LOGW(TAG, "Rebooting into provisioning mode in %d ms ...", REBOOT_DELAY_MS);
                vTaskDelay(pdMS_TO_TICKS(REBOOT_DELAY_MS));
                esp_restart();
            }
        } else {
            glitch_ms += POLL_MS;
            if (glitch_ms >= GLITCH_MS) {
                /* 确认松开, 清零计时 */
                hold_ms = 0;
                glitch_ms = 0;
                reported_sec = 0;
            }
        }
    }
}

esp_err_t reset_button_start(void)
{
    /* GPIO0 为 strapping 引脚, gpio_config 使用普通 IO 配置即可正常输入 */
    gpio_config_t io = {
        .pin_bit_mask = 1ULL << BTN_GPIO,
        .mode = GPIO_MODE_INPUT,
        .pull_up_en = GPIO_PULLUP_ENABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .intr_type = GPIO_INTR_DISABLE,
    };
    esp_err_t ret = gpio_config(&io);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "gpio_config (%d) failed: %s", BTN_GPIO, esp_err_to_name(ret));
        return ret;
    }

    if (xTaskCreate(reset_button_task, "reset_btn", 2048, NULL, 4, NULL) != pdPASS) {
        ESP_LOGE(TAG, "Create reset button task failed");
        return ESP_FAIL;
    }

    ESP_LOGI(TAG, "Reset button ready (GPIO%d, hold %d ms to clear WiFi)",
             BTN_GPIO, HOLD_MS);
    return ESP_OK;
}
