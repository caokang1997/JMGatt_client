/*
 * debug_console.c
 * 调试控制台 - 基于 ESP-IDF esp_console REPL
 *
 * 在烧录串口 (UART0) 上启动一个交互式命令行, 语音模块未到货时可手动敲命令测试。
 * 所有命令都复用 asr_pro 的注入接口, 走的是与真实 ASR-PRO 完全相同的代码路径。
 *
 * 支持的命令 (与 Web/语音命令一一对应):
 *   wake               触发 BLE 扫描并连接马桶 (等价于语音唤醒词)
 *   footon/footoff     脚感 开/关
 *   flushl/flushs      大冲 / 小冲
 *   stop               停止
 *   seatlow/mid/high/off  座圈加热 低/中/高/关
 *   coveron/coveroff   翻盖 开/关
 *   ringon/ringoff     翻圈 开/关
 *   lighton/lightoff   夜灯 开/关
 *   autoflushon/off    自动冲刷 开/关
 *   autocoveron/off    自动翻盖 开/关
 *   poweron/poweroff   智能节电 开/关
 *   hibernate          休眠
 *   selfclean          自清洁
 *   querystate         查询马桶状态 (回包由 notify 0x30 解析)
 *   seatlongon/off     久坐提醒 开/关
 *   autotempon/off     四季温感 开/关
 *   autosmallon/off    自动小冲 开/关
 *   ccflushon/off      关盖冲厕 开/关
 *   prewetton/off      预润湿 开/关
 *   lightsenson/off    光感夜灯 开/关
 *   regflushon/off     定期冲刷 开/关
 *   tstate             打印最近一次解析的马桶状态快照
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

/* ---------------- 通用注入命令 (表驱动) ---------------- */

typedef struct {
    const char *name;       /* 控制台命令名 */
    uint8_t asr_cmd;        /* ASR 命令码 */
} console_cmd_map_t;

static const console_cmd_map_t s_console_cmds[] = {
    { "wake",         0x00 },
    { "footon",       0x01 },
    { "footoff",      0x02 },
    { "flushl",       0x03 },
    { "flushs",       0x04 },
    { "stop",         0x05 },
    { "seaton",       0x06 },
    { "seatoff",      0x07 },
    { "coveron",      0x08 },
    { "coveroff",     0x09 },
    { "ringon",       0x0A },
    { "ringoff",      0x0B },
    { "lighton",      0x0C },
    { "lightoff",     0x0D },
    { "seatlow",      0x0E },
    { "seatmid",      0x0F },
    { "seathigh",     0x10 },
    { "autoflushon",  0x11 },
    { "autoflushoff", 0x12 },
    { "poweron",      0x13 },
    { "poweroff",     0x14 },
    { "hibernate",    0x15 },
    { "selfclean",    0x16 },
    { "autocoveron",  0x17 },
    { "autocoveroff", 0x18 },
    { "querystate",   0x19 },
    { "seatlongon",   0x1A },
    { "seatlongoff",  0x1B },
    { "autotempon",   0x1C },
    { "autotempoff",  0x1D },
    { "autosmallon",  0x1E },
    { "autosmalloff", 0x1F },
    { "ccflushon",    0x20 },
    { "ccflushoff",   0x21 },
    { "prewetton",    0x22 },
    { "prewettoff",   0x23 },
    { "lightsenson",  0x24 },
    { "lightsensoff", 0x25 },
    { "regflushon",   0x26 },
    { "regflushoff",  0x27 },
};

#define CONSOLE_CMD_NUM  (sizeof(s_console_cmds) / sizeof(s_console_cmds[0]))

/* 通用命令处理: esp_console 不支持注册时携带私有数据,
 * 用 argv[0] (命令名) 反查表拿到 ASR 命令码 */
static int cmd_generic(int argc, char **argv)
{
    if (argc < 1) {
        return 1;
    }
    for (size_t i = 0; i < CONSOLE_CMD_NUM; i++) {
        if (strcmp(argv[0], s_console_cmds[i].name) == 0) {
            asr_pro_inject_cmd(s_console_cmds[i].asr_cmd);
            return 0;
        }
    }
    printf("unknown command: %s\n", argv[0]);
    return 1;
}

/* 打印最近一次马桶状态快照 (notify 0x30 解析结果) */
static int cmd_tstate(int argc, char **argv)
{
    toilet_state_t t;
    ble_toilet_get_state(&t);

    if (!t.valid) {
        printf("No state yet. Run 'wake' first, then 'querystate'.\n");
        return 1;
    }

    printf("work_state : %u (%s%s%s)\n", t.work_state,
           t.hibernating ? "hibernating " : "",
           t.self_clean ? "self-clean " : "",
           (!t.hibernating && !t.self_clean) ? "active" : "");
    printf("seat_temp  : %u\n", t.seat_temp_level);
    printf("on_seat    : %d   cover: %d   ring: %d   (running cover=%d ring=%d)\n",
           t.on_seat, t.cover_on, t.ring_on, t.cover_running, t.ring_running);
    printf("flushing   : large=%d small=%d\n", t.flushing_large, t.flushing_small);
    printf("night_light: %d   light_sensor: %d\n", t.night_light, t.light_sensor);
    printf("switches   : foot=%d auto_flush=%d auto_cover=%d smart_save=%d\n",
           t.foot_sensor, t.auto_flush, t.auto_cover, t.smart_power_save);
    printf("more       : auto_temp=%d pre_wet=%d regular_flush=%d auto_small=%d close_cover_flush=%d\n",
           t.auto_temp, t.pre_wetting, t.regular_flush,
           t.auto_small_flush, t.close_cover_flush);
    printf("fault_bits : %02X %02X %02X %s\n",
           t.error_bits[0], t.error_bits[1], t.error_bits[2],
           (t.error_bits[0] | t.error_bits[1] | t.error_bits[2]) ? "<-- FAULT!" : "(ok)");
    return 0;
}

/* 查看当前 BLE 连接状态 */
static int cmd_status(int argc, char **argv)
{
    printf("BLE state  : %s\n", ble_toilet_state_name());
    printf("BLE ready  : %s\n", ble_toilet_is_ready() ? "YES" : "NO");
    printf("BLE busy   : %s\n", ble_toilet_is_busy()  ? "YES" : "NO");
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
    /* 表驱动命令: 每条命令单独注册, 共用一个处理函数 */
    size_t n = sizeof(s_console_cmds) / sizeof(s_console_cmds[0]);
    for (size_t i = 0; i < n; i++) {
        /* 复制命令名到静态存储 (esp_console_cmd_t 不拷贝字符串) */
        static char cmd_names[CONSOLE_CMD_NUM][16];
        snprintf(cmd_names[i], sizeof(cmd_names[i]), "%s", s_console_cmds[i].name);

        esp_console_cmd_t c = {
            .command = cmd_names[i],
            .help = "inject ASR command",
            .func = &cmd_generic,
        };
        ESP_ERROR_CHECK(esp_console_cmd_register(&c));
    }

    const esp_console_cmd_t cmds[] = {
        { .command = "tstate", .help = "Print last parsed toilet state", .func = &cmd_tstate },
        { .command = "status", .help = "Show BLE conn state",            .func = &cmd_status },
        { .command = "send",   .help = "Feed raw HEX frame, e.g. send AA 55 01 00 55", .func = &cmd_send },
    };
    n = sizeof(cmds) / sizeof(cmds[0]);
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
