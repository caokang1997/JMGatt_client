# 九牧 SQ9650 智能马桶语音控制器

基于 **ESP32 + 天问 ASR-PRO 语音模块**，通过蓝牙 BLE 控制九牧 SQ9650 智能马桶的脚感、冲水、座圈加热等功能。

语音模块识别到指令后通过 UART 发送十六进制帧给 ESP32，ESP32 再转换成马桶的 BLE 私有协议指令下发。

---

## 目录

- [一、项目简介](#一项目简介)
- [二、硬件需求](#二硬件需求)
- [三、工作原理](#三工作原理)
- [四、BLE 通信协议](#四ble-通信协议)
- [五、语音模块 UART 协议](#五语音模块-uart-协议)
- [六、连接状态机](#六连接状态机)
- [七、项目结构](#七项目结构)
- [八、编译与烧录](#八编译与烧录)
- [九、可配置项](#九可配置项)
- [十、硬件接线](#十硬件接线)
- [十一、测试方法](#十一测试方法)
- [十二、注意事项](#十二注意事项)

---

## 一、项目简介

| 项目 | 说明 |
|---|---|
| 目标设备 | 九牧 SQ9650 轻智能马桶 |
| 通信方式 | BLE（蓝牙低功耗）GATT Client |
| 控制芯片 | ESP32（ESP-IDF v5.3） |
| 语音模块 | 天问 ASR-PRO（UART 通信） |
| 连接模式 | 唤醒按需连接（非常驻连接） |
| 目标 MAC | `A4:C1:38:5E:79:76` |

**核心特性：**
- 平时不占用马桶蓝牙（家人仍可用手机小程序）
- 说唤醒词后才连接，30 秒无操作自动断开
- 支持脚感开关、大小冲、停止、座圈加热开关

> 协议来源：反编译九牧微信小程序（`OUTPUT/` 目录），从 `TechramicToiletController.js` 提取。SQ9650 的 `bleProtocol=1`，对应 Techramic 协议。

---

## 二、硬件需求

- ESP32 开发板（ESP32-DevKitC、ESP-WROVER-KIT 等）
- 天问 ASR-PRO 语音识别模块
- 九牧 SQ9650 智能马桶
- USB 数据线（供电 + 烧录）
- 杜邦线若干

---

## 三、工作原理

```
┌──────────────┐   语音    ┌──────────────┐   UART    ┌──────────────┐   BLE    ┌──────────────┐
│   用户说话    │ ───────> │  天问 ASR-PRO │ ───────> │    ESP32     │ ───────> │  SQ9650 马桶  │
│ "打开脚感"    │          │  (识别+发帧)  │  HEX帧   │  (协议转换)   │  私有协议 │  (执行动作)   │
└──────────────┘          └──────────────┘          └──────────────┘          └──────────────┘
```

1. 用户说唤醒词 → ASR-PRO 发 `AA 55 00 00 55` → ESP32 扫描并连接马桶
2. 用户说"打开脚感" → ASR-PRO 发 `AA 55 01 00 55` → ESP32 转成 BLE 帧 `FC 50 01 00 00 00 40 0E 01 FC` 下发
3. 马桶执行动作
4. 30 秒内无新指令 → ESP32 主动断开 BLE → 回到待机

---

## 四、BLE 通信协议

### 4.1 GATT 服务与特征

| 用途 | Service UUID | Characteristic UUID | 属性 |
|---|---|---|---|
| 主控通道 | `0xFFE0` | `0xFFE1` | Write-No-Response + Notify |

> 所有九牧马桶通用此 UUID。写入使用 **Write Without Response** 模式。

### 4.2 帧格式

马桶私有协议帧有两种长度：

**9 字节帧（单参数命令）：**
```
偏移:  0    1     2    3    4    5    6    7    8
值  : FC  SUM   01   00   00   00   CMD  ARG  FC
      │    │    │    │              │    │    └ 帧尾
      │    │    │    │              │    └ 参数
      │    │    │    │              └ 主命令
      │    │    └────┴─ 地址字段 (手机=01, 马桶=00)
      │    └ 校验和
      └ 帧头
```

**10 字节帧（双参数命令）：**
```
偏移:  0    1     2    3    4    5    6    7    8    9
值  : FC  SUM   01   00   00   00   CMD  SUB  VAL  FC
                                      │    │    └ 数值(0/1)
                                      │    └ 子命令
                                      └ 主命令
```

### 4.3 校验和算法

```
SUM = ( byte[2] + byte[3] + ... + byte[len-2] ) & 0xFF
```

即：**除帧头(byte0)、校验位(byte1)、帧尾(最后一字节) 外，其余所有字节累加取低 8 位**。

代码实现见 `build_single_value_frame()` / `build_double_value_frame()`。

### 4.4 完整指令表

| 功能 | 底层调用 | BLE 帧 (HEX) | 长度 |
|---|---|---|---|
| 打开脚感 | `_set40H(14, 1)` | `FC 50 01 00 00 00 40 0E 01 FC` | 10 |
| 关闭脚感 | `_set40H(14, 0)` | `FC 4F 01 00 00 00 40 0E 00 FC` | 10 |
| 大冲 | `_setSingleValue(53, 2)` | `FC 38 01 00 00 00 35 02 FC` | 9 |
| 小冲 | `_setSingleValue(53, 1)` | `FC 37 01 00 00 00 35 01 FC` | 9 |
| 停止 | `_setSingleValue(50, 0)` | `FC 33 01 00 00 00 32 00 FC` | 9 |
| 座圈加热开(标准档) | `_setSingleValue(60, 3)` | `FC 40 01 00 00 00 3C 03 FC` | 9 |
| 座圈加热关 | `_setSingleValue(60, 0)` | `FC 3D 01 00 00 00 3C 00 FC` | 9 |
| 查询状态 | `_setSingleValue(17, 0)` | `FC 12 01 00 00 00 11 00 FC` | 9 |

> 座温档位说明：0=常温、1=最低、2=偏低、3=标准、4=最高。当前"座圈加热开"默认用标准档(3)，可在 `build_cmd_frame()` 中修改参数。

---

## 五、语音模块 UART 协议

### 5.1 UART 参数

| 参数 | 值 |
|---|---|
| 波特率 | 115200 |
| 数据位 | 8 |
| 停止位 | 1 |
| 校验 | 无 |

### 5.2 帧格式

```
0xAA  0x55  CMD  DATA  0x55
帧头0  帧头1  命令  数据   帧尾
```

也兼容**单字节裸命令**（直接发 `0x00`~`0x07`），方便用串口助手测试，带 100ms 去抖。

### 5.3 命令码定义

| CMD | UART 帧 | 功能 |
|---|---|---|
| `0x00` | `AA 55 00 00 55` | **唤醒词** - 触发 BLE 扫描连接 |
| `0x01` | `AA 55 01 00 55` | 打开脚感 |
| `0x02` | `AA 55 02 00 55` | 关闭脚感 |
| `0x03` | `AA 55 03 00 55` | 大冲 |
| `0x04` | `AA 55 04 00 55` | 小冲 |
| `0x05` | `AA 55 05 00 55` | 停止 |
| `0x06` | `AA 55 06 00 55` | 座圈加热开 |
| `0x07` | `AA 55 07 00 55` | 座圈加热关 |

### 5.4 天问Block 可视化配置步骤

天问Block 是 ASR-PRO 的图形化编程工具（类似 Scratch/Mixly）。发送 `AA 55 00 00 55` 这种多字节十六进制，核心是用「串口输出十六进制」积木绑定到「语音识别事件」上。

#### 第 1 步：新建项目

打开天问Block → 新建项目 → 芯片选 **ASR-PRO** → 用 Type-C 连接模块。

#### 第 2 步：配置语音词条（唤醒词 + 命令词）

在软件的**语音识别/词条配置**区添加词条，每个词条会自动分配一个**命令 ID**：

| 语音词条 | 类型 | 命令ID |
|---|---|---|
| 你好马桶（自定义唤醒词） | 唤醒词 | 0 |
| 打开脚感 | 命令词 | 1 |
| 关闭脚感 | 命令词 | 2 |
| 大冲 | 命令词 | 3 |
| ... | ... | ... |

> 唤醒词建议 4-6 个字、避免常见词，降低误唤醒。

#### 第 3 步：拖积木（关键）

**① 串口分类** → 拖出「串口初始化」积木，放主程序开头：
- 波特率设 **115200**（必须和 ESP32 一致）
- 串口选 **串口1**（PA2=发送TX，PA3=接收RX）
- 注意：**串口0 是烧录用的**，对外通信要用**串口1**

**② 语音识别分类** → 拖出事件帽积木「当识别到命令词 [下拉选词条]」，在下面接「串口输出十六进制」积木。

#### 第 4 步：每个词条对应一段积木

```
┌─ 当识别到 [唤醒词/你好马桶] ─────────────┐
│    串口1 输出十六进制 [AA 55 00 00 55]   │
└──────────────────────────────────────────┘

┌─ 当识别到 [打开脚感] ────────────────────┐
│    串口1 输出十六进制 [AA 55 01 00 55]   │
└──────────────────────────────────────────┘

┌─ 当识别到 [关闭脚感] ────────────────────┐
│    串口1 输出十六进制 [AA 55 02 00 55]   │
└──────────────────────────────────────────┘
```

以此类推，把所有词条都配上。

#### 第 5 步：编译下载

点「编译下载」烧进 ASR-PRO，说唤醒词测试。

#### 完整对照表（照抄即可）

| 语音词条 | 串口输出十六进制 |
|---|---|
| 唤醒词（如"你好马桶"） | `AA 55 00 00 55` |
| 打开脚感 | `AA 55 01 00 55` |
| 关闭脚感 | `AA 55 02 00 55` |
| 大冲 | `AA 55 03 00 55` |
| 小冲 | `AA 55 04 00 55` |
| 停止 | `AA 55 05 00 55` |
| 座圈加热 | `AA 55 06 00 55` |
| 关闭加热 | `AA 55 07 00 55` |

#### 天问Block 配置注意事项

1. **十六进制输入格式**：不同版本天问Block填法不同，常见两种，看积木输入框提示：
   - 空格分隔：`AA 55 00 00 55`
   - 或 `0xAA,0x55,0x00,0x00,0x55`

2. **接线**（ASR-PRO ↔ ESP32）：
   ```
   ASR-PRO PA2(TX/串口1发送) → ESP32 GPIO17(RX)
   ASR-PRO GND              → ESP32 GND  (必须共地)
   ```

3. **波特率**：ASR-PRO 默认可能是 9600，务必在「串口初始化」积木改成 **115200**，和 ESP32 的 `CONFIG_ASR_UART_BAUD_RATE` 对齐。

4. **编码**：ASR-PRO 编译器用 GB2312，纯 hex 发送不受影响；若加 TTS 中文播报注意音量别太大，避免播报电流冲击导致串口掉线。

#### 语音模块单独验证方法

先不接 ESP32，用 **USB-TTL + 串口助手** 验证 ASR-PRO 输出：
1. ASR-PRO 的 PA2(TX) 接 USB-TTL 的 RX，共地
2. 串口助手设 115200，勾选「十六进制显示」
3. 说唤醒词 → 应看到 `AA 55 00 00 55`
4. 说"打开脚感" → 应看到 `AA 55 01 00 55`

确认 ASR-PRO 端发对了再接 ESP32，可快速定位问题在语音模块还是 ESP32。

> 天问Block 版本迭代较快，积木的**具体名称/位置**可能略有出入。找不到对应积木时，参考天问官方论坛（haohaodada.com）的 ASRPRO 教程或对应版本手册。

---

## 六、连接状态机

```
                        ┌─────────────────────────────────┐
                        │                                  │
                    超时/错误                            超时(30s无命令)
                        │                                  │
                        v                                  │
  ┌──────┐  唤醒词   ┌──────────┐  命中MAC  ┌────────────┐  │  ┌───────────┐  ┌─────────────┐
  │ IDLE │ ───────> │ SCANNING │ ───────> │ CONNECTING │ ─┼─>│DISCOVERING│─>│    READY     │
  └──────┘          └──────────┘          └────────────┘  │  └───────────┘  └─────────────┘
     ^                                                     │                        │  │
     │                                                     │                   收到命令│  │
     │                  ┌─────────────────┐                │                        │  │
     └──────────────────│ DISCONNECTING   │<───────────────┴────────────────────────┘  │
        断开完成         └─────────────────┘                                              │
                              ^                                                          │
                              └──────────────── 发送BLE指令(保持READY) <────────────────┘
```

| 状态 | 说明 |
|---|---|
| `IDLE` | 待机，BLE 栈已初始化但不扫描 |
| `SCANNING` | 收到唤醒词后扫描目标 MAC（最多 15 秒） |
| `CONNECTING` | 命中 MAC，发起连接 |
| `DISCOVERING` | 发现服务 FFE0 / 特征 FFE1，写 CCCD 使能通知 |
| `READY` | 就绪，可接收命令词并下发 BLE 指令 |
| `DISCONNECTING` | 空闲超时或出错，主动断开 |

---

## 七、项目结构

```
JMGatt_client/
├── main/
│   ├── main.c              # 应用入口: NVS -> BLE init -> UART init
│   ├── ble_toilet.h/.c     # BLE 客户端: 扫描/连接/指令帧构造/状态机
│   ├── asr_pro.h/.c        # UART 驱动 + 语音帧解析状态机
│   ├── CMakeLists.txt      # 组件注册 (依赖 bt/driver/nvs_flash)
│   └── Kconfig.projbuild   # menuconfig 配置项 (纯英文, 避免GBK问题)
├── OUTPUT/                 # 反编译的九牧微信小程序 (协议参考)
├── sdkconfig.defaults      # 精简配置 (关闭WiFi等)
├── CMakeLists.txt
└── README.md               # 本文档
```

### 关键函数

| 函数 | 文件 | 说明 |
|---|---|---|
| `ble_toilet_init()` | ble_toilet.c | 初始化 BLE 栈，不自动扫描 |
| `ble_toilet_wake()` | ble_toilet.c | 唤醒词触发，开始扫描连接 |
| `ble_toilet_execute(cmd)` | ble_toilet.c | 发送指令到马桶（需 READY 状态） |
| `ble_toilet_is_ready()` | ble_toilet.c | 查询是否已连接就绪 |
| `asr_pro_init()` | asr_pro.c | 初始化 UART 并启动接收任务 |
| `build_cmd_frame()` | ble_toilet.c | 根据业务命令构造 BLE 指令帧 |

---

## 八、编译与烧录

### 环境要求

- ESP-IDF v5.3
- 目标芯片：ESP32

### 编译步骤

```bash
# 1. 设置目标芯片
idf.py set-target esp32

# 2. (可选) 图形化配置 MAC/引脚/波特率
idf.py menuconfig

# 3. 编译
idf.py build

# 4. 烧录 + 监控串口 (COM口按实际修改)
idf.py -p COM3 flash monitor
```

退出串口监控：`Ctrl + ]`

---

## 九、可配置项

运行 `idf.py menuconfig` → `JOMOO SQ9650 Voice Controller`：

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `TOILET_TARGET_MAC` | `A4:C1:38:5E:79:76` | 目标马桶 BLE MAC 地址 |
| `ASR_UART_BAUD_RATE` | `115200` | ASR-PRO UART 波特率 |
| `ASR_UART_RX_PIN` | `17` | ESP32 接收引脚（接 ASR-PRO TXD） |
| `ASR_UART_TX_PIN` | `16` | ESP32 发送引脚（接 ASR-PRO RXD，暂未用） |
| `BLE_IDLE_TIMEOUT_SEC` | `30` | 空闲多少秒后自动断开 BLE |

---

## 十、硬件接线

```
天问 ASR-PRO          ESP32
─────────────         ─────────────
   TXD  ───────────>  GPIO17 (UART2 RX)
   RXD  <───────────  GPIO16 (UART2 TX)  [可选]
   GND  ───────────   GND
   VCC  ───────────   5V 或 3.3V (看模块要求)
```

> ESP32 与马桶之间是无线 BLE 连接，无需接线。

---

## 十一、测试方法

### 无语音模块时，用 USB-TTL 串口助手模拟

1. USB-TTL 的 TX 接 ESP32 GPIO17，GND 共地
2. 串口助手设为 **115200, 8N1, HEX 发送模式**
3. 按顺序测试：

```
第1步: 发送 AA 55 00 00 55   (唤醒)
       → 等待日志出现 "=== BLE READY ==="

第2步: 发送 AA 55 01 00 55   (打开脚感)
       → 马桶应立即响应

第3步: 30秒内可继续发其他命令
       → 超时后自动断开, 日志显示 "Back to IDLE"
```

### 预期串口日志

```
I APP_MAIN: ============ JOMOO SQ9650 Voice Controller ============
I APP_MAIN: Target MAC : A4:C1:38:5E:79:76
I BLE_TOILET: BLE init OK (wake-on-demand, idle timeout 30s)
I APP_MAIN: System ready. Waiting for wake word...

# 收到唤醒词后:
I ASR_PRO: === WAKE word received ===
I BLE_TOILET: State: IDLE -> SCANNING
I BLE_TOILET: Target MAC found! Connecting...
I BLE_TOILET: Found FFE1 handle=X prop=0xXX
I BLE_TOILET: State: DISCOVERING -> READY
I BLE_TOILET: === BLE READY. Waiting for voice commands (timeout 30s). ===

# 收到命令后:
I ASR_PRO: Frame OK: AA 55 01 XX 55
I BLE_TOILET: Execute cmd 1 (10 bytes): fc 50 01 00 00 00 40 0e 01 fc
I BLE_TOILET: Write char OK
```

---

## 十二、注意事项

1. **手机蓝牙需关闭**：测试时手机小程序若连着马桶，ESP32 会连不上（BLE 从机通常只允许 1 个 central 连接）。

2. **MAC 地址字节序**：代码同时用正序和反序比对 MAC，兼容不同 ESP-IDF 版本的字节序差异。

3. **Kconfig 不能用中文**：`Kconfig.projbuild` 若含中文，Windows 下 Python kconfgen 用 GBK 解码会报 `UnicodeDecodeError`。源码 `.c/.h` 的中文注释无此问题（GCC 正确处理 UTF-8）。

4. **日志用英文**：`ESP_LOGx` 输出统一用英文，避免串口终端乱码。

5. **座温档位**：如需"调高/调低座温"，可在 `cmd_map` 中新增命令码，调用 `build_single_value_frame(frame, 60, level)`，level 取 0~4。

6. **写入模式**：BLE 写特征使用 `ESP_GATT_WRITE_TYPE_NO_RSP`（无响应写），与小程序一致。

7. **断线处理**：READY 状态下若马桶意外断开（如休眠），会触发 `DISCONNECT_EVT` 自动回到 IDLE，需重新说唤醒词。

---

## 附录：协议逆向来源

本项目 BLE 协议通过反编译九牧官方微信小程序获得，关键文件：

| 文件 | 作用 |
|---|---|
| `OUTPUT/config/device_enum.js` | 设备型号映射（SQ9650 → bleProtocol=1） |
| `OUTPUT/utils/tool/deviceTool.js` | 协议分发（bleProtocol → 对应 Controller） |
| `OUTPUT/utils/bluetooth/toilet/TechramicToiletController.js` | SQ9650 实际控制逻辑 |
| `OUTPUT/utils/bluetooth/BLEController.js` | GATT UUID 定义 + 写命令 |
| `OUTPUT/utils/bluetooth/bleutil.js` | MAC 过滤、校验、编解码工具 |
#   J M G a t t _ c l i e n t  
 