/*
 * debug_console.c
 * 调试控制台 - 基于 ESP-IDF esp_console REPL
 *
 * 在烧录串口 (UART0) 上启动一个交互式命令行, 语音模块未到货时可手动敲命令测试。
 * 所有命令都复用 asr_pro 的注入接口, 走的是与真实 ASR-PRO 完全相同的代码路径。
 *
 * 支持的命令:
 *   wake               触发 BLE 扫描并连接马桶 (等价于语音唤醒词)
 *   footon / footoff   打开 / 关闭脚感
 *   flushl / flushs    大冲 / 小冲
 *   stop               停止
 *   seaton / seatoff   座圈加热开 / 关
 *   state              查询马桶状态
 *   send AA 55 01 00 55  直接喂入原始 HEX 帧 (测试帧解析器)
 *   status             查看当前 BLE 连接状态
 *   help               列出所有命令
 */

#include <string.h>
#include <stdlib.h>
#include <stdio.h>

#include "esp_log.h"
#include "esp_console.h"

#include "debug_console.h"
#include "asr_pro.h"
#include "ble_toilet.h"

#define TAG     "CONSOLE"

/* ---------------- 各命令实现 (直接注入对应 ASR 命令码) ---------------- */

static int cmd_wake(int argc, char **argv)
{
    asr_pro_inject_cmd(0x00);   /* 唤醒: 扫描并连接 */
    return 0;
}

static int cmd_footon(int argc, char **argv)
{
    asr_pro_inject_cmd(0x01);
    return 0;
}

static int cmd_footoff(int argc, char **argv)
{
    asr_pro_inject_cmd(0x02);
    return 0;
}

static int cmd_flushl(int argc, char **argv)
{
    asr_pro_inject_cmd(0x03);
    return 0;
}

static int cmd_flushs(int argc, char **argv)
{
    asr_pro_inject_cmd(0x04);
    return 0;
}

static int cmd_stop(int argc, char **argv)
{
    asr_pro_inject_cmd(0x05);
    return 0;
}

static int cmd_seaton(int argc, char **argv)
{
    asr_pro_inject_cmd(0x06);
    return 0;
}

static int cmd_seatoff(int argc, char **argv)
{
    asr_pro_inject_cmd(0x07);
    return 0;
}

/* 查询马桶状态 (直接调 BLE 层, 不占用 ASR 命令码) */
static int cmd_state(int argc, char **argv)
{
    if (!ble_toilet_is_ready()) {
        printf("BLE not ready, run 'wake' first.\n");
        return 1;
    }
    ble_toilet_execute(TOILET_CMD_QUERY_STATE);
    return 0;
}

/* 查看当前 BLE 连接状态 */
static int cmd_status(int argc, char **argv)
{
    printf("BLE ready : %s\n", ble_toilet_is_ready() ? "YES" : "NO");
    printf("BLE busy  : %s\n", ble_toilet_is_busy()  ? "YES" : "NO");
    return 0;
}

/* 直接喂入原始 HEX 帧, 测试 asr_pro 帧解析器
 * 用法: send AA 55 01 00 55
 */
static int cmd_send(int argc, char **argv)
{
    if (argc < 2) {
        printf("usage: send AA 55 01 00 55\n");
        return 1;
    }
    for (int i = 1; i < argc; i++) {
        uint8_t b = (uint8_t)strtoul(argv[i], NULL, 16);
        asr_pro_feed_byte(b);
    }
    printf("fed %d bytes into parser.\n", argc - 1);
    return 0;
}

/* ---------------- 注册所有命令 ---------------- */
static void register_commands(void)
{
    const esp_console_cmd_t cmds[] = {
        { .command = "wake",    .help = "Scan and connect to toilet (voice wake word)", .func = &cmd_wake },
        { .command = "footon",  .help = "Foot sensor ON",    .func = &cmd_footon },
        { .command = "footoff", .help = "Foot sensor OFF",   .func = &cmd_footoff },
        { .command = "flushl",  .help = "Large flush",       .func = &cmd_flushl },
        { .command = "flushs",  .help = "Small flush",       .func = &cmd_flushs },
        { .command = "stop",    .help = "Stop",              .func = &cmd_stop },
        { .command = "seaton",  .help = "Seat heat ON",      .func = &cmd_seaton },
        { .command = "seatoff", .help = "Seat heat OFF",     .func = &cmd_seatoff },
        { .command = "state",   .help = "Query toilet state",.func = &cmd_state },
        { .command = "status",  .help = "Show BLE conn state", .func = &cmd_status },
        { .command = "send",    .help = "Feed raw HEX frame, e.g. send AA 55 01 00 55", .func = &cmd_send },
    };
    size_t n = sizeof(cmds) / sizeof(cmds[0]);
    for (size_t i = 0; i < n; i++) {
        ESP_ERROR_CHECK(esp_console_cmd_register(&cmds[i]));
    }
}

/* ---------------- 对外初始化 ---------------- */
esp_err_t debug_console_init(void)
{
    esp_console_repl_t *repl = NULL;

    /* REPL 配置 */
    esp_console_repl_config_t repl_config = ESP_CONSOLE_REPL_CONFIG_DEFAULT();
    repl_config.prompt = "toilet>";
    repl_config.max_cmdline_length = 64;

    /* 使用默认控制台 UART (UART0, 即烧录/监视串口) */
    esp_console_dev_uart_config_t hw_config = ESP_CONSOLE_DEV_UART_CONFIG_DEFAULT();

    esp_err_t ret = esp_console_new_repl_uart(&hw_config, &repl_config, &repl);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "esp_console_new_repl_uart failed: %s", esp_err_to_name(ret));
        return ret;
    }

    register_commands();

    ret = esp_console_start_repl(repl);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "esp_console_start_repl failed: %s", esp_err_to_name(ret));
        return ret;
    }

    ESP_LOGI(TAG, "Debug console started on UART0. Type 'help' for commands.");
    return ESP_OK;
}
