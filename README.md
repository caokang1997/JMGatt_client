# 九牧 SQ9650 智能马桶语音控制器

基于 **ESP32 + 天问 ASR-PRO 语音模块**，通过蓝牙 BLE 控制九牧 SQ9650 智能马桶的脚感、冲水、座圈加热等功能。

语音模块识别到指令后通过 UART 发送十六进制帧给 ESP32，ESP32 再转换成马桶的 BLE 私有协议指令下发。

**v2 新增功能：**
- **WiFi 配网**：首次上电自动开启热点 `Toilet-Setup-XXXX`，手机连上后浏览器访问 `192.168.4.1` 完成配网，凭据存入 NVS
- **Web 控制台**：配网成功后启动 HTTP 服务，提供网页版马桶控制按钮（与语音控制同路径）
- **省电模式**：按时间段自动开关座圈加热（如工作日 07:00-08:30、17:30-24:00 开启，其余时间关闭），时间段可在网页自由配置，NTP 网络自动校时
- **全量马桶控制**（v2.1）：翻盖/翻圈、夜灯/光感夜灯、自动冲刷/翻盖/小冲、关盖冲厕、预润湿、四季温感、久坐提醒、定期冲刷、智能节电、休眠、自清洁等 38 条指令全覆盖
- **马桶状态面板**（v2.1）：连接后自动查询并实时显示工作状态、座温档位、盖板/座圈、着座、夜灯、故障位

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
- [十二、Web 配网与省电模式](#十二web-配网与省电模式)
- [十三、注意事项](#十三注意事项)

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
| 网络功能 | WiFi STA + 热点配网 + Web 页面 + NTP 校时 |

**核心特性：**
- 平时不占用马桶蓝牙（家人仍可用手机小程序）
- 说唤醒词后才连接，30 秒无操作自动断开
- 支持脚感开关、大小冲、停止、座圈加热开关
- 网页可远程控制马桶 + 配置省电模式时间段
- 省电模式在时间段边界自动开/关座圈加热，手动操作不会被覆盖

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
                                                         │  ▲
                                                 WiFi/HTTP │  └── 省电模式定时任务(自动开/关座圈加热)
                                                         ▼  │
┌──────────────┐                            ┌──────────────────────────┐
│ 手机浏览器    │ ─────── HTTP ─────────────>│ Web 服务 (控制按钮/配置页) │
└──────────────┘                            └──────────────────────────┘
```

1. 用户说唤醒词 → ASR-PRO 发 `AA 55 00 00 55` → ESP32 扫描并连接马桶
2. 用户说"打开脚感" → ASR-PRO 发 `AA 55 01 00 55` → ESP32 转成 BLE 帧 `FC 50 01 00 00 00 40 0E 01 FC` 下发
3. 马桶执行动作
4. 30 秒内无新指令 → ESP32 主动断开 BLE → 回到待机
5. Web 页面按钮走 `asr_pro_inject_cmd()` → 与语音完全相同的执行路径
6. 省电模式每 30 秒检查一次：跨入时段 → 连接马桶开座圈加热；跨出时段 → 连接马桶关座圈加热，执行完立即断开

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
| **冲水 / 脚感** | | | |
| 大冲 | `_setSingleValue(53, 2)` | `FC 38 01 00 00 00 35 02 FC` | 9 |
| 小冲 | `_setSingleValue(53, 1)` | `FC 37 01 00 00 00 35 01 FC` | 9 |
| 停止 | `_setSingleValue(50, 0)` | `FC 33 01 00 00 00 32 00 FC` | 9 |
| 打开脚感 | `_set40H(14, 1)` | `FC 50 01 00 00 00 40 0E 01 FC` | 10 |
| 关闭脚感 | `_set40H(14, 0)` | `FC 4F 01 00 00 00 40 0E 00 FC` | 10 |
| **盖板 / 座圈** | | | |
| 翻盖开 | `_setSingleValue(51, 1)` | `FC 35 01 00 00 00 33 01 FC` | 9 |
| 翻盖关 | `_setSingleValue(51, 0)` | `FC 34 01 00 00 00 33 00 FC` | 9 |
| 翻圈开 | `_setSingleValue(52, 1)` | `FC 36 01 00 00 00 34 01 FC` | 9 |
| 翻圈关 | `_setSingleValue(52, 0)` | `FC 35 01 00 00 00 34 00 FC` | 9 |
| 座圈加热低档 | `_setSingleValue(60, 1)` | `FC 3E 01 00 00 00 3C 01 FC` | 9 |
| 座圈加热中档 | `_setSingleValue(60, 2)` | `FC 3F 01 00 00 00 3C 02 FC` | 9 |
| 座圈加热高档 | `_setSingleValue(60, 3)` | `FC 40 01 00 00 00 3C 03 FC` | 9 |
| 座圈加热关 | `_setSingleValue(60, 0)` | `FC 3D 01 00 00 00 3C 00 FC` | 9 |
| **灯光 / 维护** | | | |
| 夜灯开 | `_set41H(0, 1)` | `FC 43 01 00 00 00 41 00 01 FC` | 10 |
| 夜灯关 | `_set41H(0, 0)` | `FC 42 01 00 00 00 41 00 00 FC` | 10 |
| 光感夜灯开 | `_set40H(2, 1)` | `FC 44 01 00 00 00 40 02 01 FC` | 10 |
| 光感夜灯关 | `_set40H(2, 0)` | `FC 43 01 00 00 00 40 02 00 FC` | 10 |
| 休眠 | `_setSingleValue(23, 1)` | `FC 19 01 00 00 00 17 01 FC` | 9 |
| 自清洁 | `_setSingleValue(97, 1)` | `FC 63 01 00 00 00 61 01 FC` | 9 |
| 查询状态 | `_setSingleValue(17, 0)` | `FC 12 01 00 00 00 11 00 FC` | 9 |
| **自动化设置** | | | |
| 自动翻盖开 | `_set40H(0, 1)` | `FC 42 01 00 00 00 40 00 01 FC` | 10 |
| 自动翻盖关 | `_set40H(0, 0)` | `FC 41 01 00 00 00 40 00 00 FC` | 10 |
| 智能节电开 | `_set40H(3, 1)` | `FC 45 01 00 00 00 40 03 01 FC` | 10 |
| 智能节电关 | `_set40H(3, 0)` | `FC 44 01 00 00 00 40 03 00 FC` | 10 |
| 自动冲刷开 | `_set40H(5, 1)` | `FC 47 01 00 00 00 40 05 01 FC` | 10 |
| 自动冲刷关 | `_set40H(5, 0)` | `FC 46 01 00 00 00 40 05 00 FC` | 10 |
| **更多设置** | | | |
| 四季温感开 | `_set40H(15, 1)` | `FC 51 01 00 00 00 40 0F 01 FC` | 10 |
| 四季温感关 | `_set40H(15, 0)` | `FC 50 01 00 00 00 40 0F 00 FC` | 10 |
| 预润湿开 | `_set40H(18, 1)` | `FC 54 01 00 00 00 40 12 01 FC` | 10 |
| 预润湿关 | `_set40H(18, 0)` | `FC 53 01 00 00 00 40 12 00 FC` | 10 |
| 自动小冲开 | `_set40H(19, 1)` | `FC 55 01 00 00 00 40 13 01 FC` | 10 |
| 自动小冲关 | `_set40H(19, 0)` | `FC 54 01 00 00 00 40 13 00 FC` | 10 |
| 关盖冲厕开 | `_set40H(20, 1)` | `FC 56 01 00 00 00 40 14 01 FC` | 10 |
| 关盖冲厕关 | `_set40H(20, 0)` | `FC 55 01 00 00 00 40 14 00 FC` | 10 |
| 定期冲刷开 | `_set40H(23, 1)` | `FC 59 01 00 00 00 40 17 01 FC` | 10 |
| 定期冲刷关 | `_set40H(23, 0)` | `FC 58 01 00 00 00 40 17 00 FC` | 10 |
| 久坐提醒开 | `_set40H(26, 1)` | `FC 5C 01 00 00 00 40 1A 01 FC` | 10 |
| 久坐提醒关 | `_set40H(26, 0)` | `FC 5B 01 00 00 00 40 1A 00 FC` | 10 |

> 座温档位说明：0=常温、1=最低、2=偏低、3=标准、4=最高。语音"座圈加热开"默认用标准档(3)，低/中/高档可通过 Web 或串口控制台指定。

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
| `0x06` | `AA 55 06 00 55` | 座圈加热开(高档) |
| `0x07` | `AA 55 07 00 55` | 座圈加热关 |
| `0x08` | `AA 55 08 00 55` | 翻盖开 |
| `0x09` | `AA 55 09 00 55` | 翻盖关 |
| `0x0A` | `AA 55 0A 00 55` | 翻圈开 |
| `0x0B` | `AA 55 0B 00 55` | 翻圈关 |
| `0x0C` | `AA 55 0C 00 55` | 夜灯开 |
| `0x0D` | `AA 55 0D 00 55` | 夜灯关 |
| `0x0E` | `AA 55 0E 00 55` | 座温低档 |
| `0x0F` | `AA 55 0F 00 55` | 座温中档 |
| `0x10` | `AA 55 10 00 55` | 座温高档 |
| `0x11` | `AA 55 11 00 55` | 自动冲刷开 |
| `0x12` | `AA 55 12 00 55` | 自动冲刷关 |
| `0x13` | `AA 55 13 00 55` | 智能节电开 |
| `0x14` | `AA 55 14 00 55` | 智能节电关 |
| `0x15` | `AA 55 15 00 55` | 休眠 |
| `0x16` | `AA 55 16 00 55` | 自清洁 |
| `0x17` | `AA 55 17 00 55` | 自动翻盖开 |
| `0x18` | `AA 55 18 00 55` | 自动翻盖关 |
| `0x19` | `AA 55 19 00 55` | 查询状态 |
| `0x1A` | `AA 55 1A 00 55` | 久坐提醒开 |
| `0x1B` | `AA 55 1B 00 55` | 久坐提醒关 |
| `0x1C` | `AA 55 1C 00 55` | 四季温感开 |
| `0x1D` | `AA 55 1D 00 55` | 四季温感关 |
| `0x1E` | `AA 55 1E 00 55` | 自动小冲开 |
| `0x1F` | `AA 55 1F 00 55` | 自动小冲关 |
| `0x20` | `AA 55 20 00 55` | 关盖冲厕开 |
| `0x21` | `AA 55 21 00 55` | 关盖冲厕关 |
| `0x22` | `AA 55 22 00 55` | 预润湿开 |
| `0x23` | `AA 55 23 00 55` | 预润湿关 |
| `0x24` | `AA 55 24 00 55` | 光感夜灯开 |
| `0x25` | `AA 55 25 00 55` | 光感夜灯关 |
| `0x26` | `AA 55 26 00 55` | 定期冲刷开 |
| `0x27` | `AA 55 27 00 55` | 定期冲刷关 |

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

### 5.5 语音反馈（ESP32 → ASR-PRO）

ESP32 执行动作后，会通过 **GPIO16(TX) → ASR-PRO PA3(UART1_RX)** 回传一个**单字节反馈码**，ASR-PRO 收到后播报对应语音，实现"已连接""已打开脚感"等语音反馈。

**反馈码定义（单字节 0xB1~0xBC）：**

| 反馈码 | 语音内容 | 触发时机 |
|---|---|---|
| `0xB1` | 已连接 | BLE 连接到达 READY |
| `0xB2` | 已断开 | 空闲超时/正常断开 |
| `0xB3` | 连接失败 | 扫描超时/连接失败/找不到服务 |
| `0xB4` | 已打开脚感 | 脚感开命令发送成功 |
| `0xB5` | 已关闭脚感 | 脚感关命令发送成功 |
| `0xB6` | 已大冲 | 大冲命令发送成功 |
| `0xB7` | 已小冲 | 小冲命令发送成功 |
| `0xB8` | 已停止 | 停止命令发送成功 |
| `0xB9` | 座圈加热已开 | 座圈加热开命令发送成功 |
| `0xBA` | 座圈加热已关 | 座圈加热关命令发送成功 |
| `0xBB` | 蓝牙忙请稍后 | 忙时又发唤醒词 |
| `0xBC` | 未连接请先唤醒 | 未连接就发动作命令 |

**天问Block 配置（接收方向）：** 在 ASR-PRO 端用「串口接收」+「语音播报」积木：

```
当 串口1 收到 0xB1  →  播报 "已连接"
当 串口1 收到 0xB4  →  播报 "已打开脚感"
当 串口1 收到 0xB5  →  播报 "已关闭脚感"
当 串口1 收到 0xB3  →  播报 "连接失败"
... 其余按需
```

> - 命令确认音（0xB4~0xBA）是在 ESP32 **成功发出 BLE 指令**时播报（写用无响应模式，不等马桶回执），属"指令已发送"确认。
> - `0xB2 已断开` 若嫌吵（每次空闲超时都播报），在天问Block里不配该字节的语音即可。
> - **硬件**：GPIO16 → ASR-PRO PA3 这根线现在是**必需**的（反馈方向），不再是可选。

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
│   ├── main.c              # 应用入口: NVS -> BLE -> WiFi -> Web -> 省电调度 -> UART
│   ├── ble_toilet.h/.c     # BLE 客户端: 扫描/连接/指令帧构造/状态机
│   ├── asr_pro.h/.c        # UART 驱动 + 语音帧解析状态机
│   ├── debug_console.h/.c  # UART0 调试控制台 (无语音模块时手动测试)
│   ├── app_config.h/.c     # NVS 配置管理 (WiFi 凭据 + 省电模式 + 马桶 MAC)
│   ├── app_wifi.h/.c       # WiFi STA/AP 配网切换 + SNTP 时间同步
│   ├── web_server.h/.c     # HTTP 服务 (REST API + 静态页面分发)
│   ├── power_save.h/.c     # 省电模式调度 (时间段边界检测 + 自动开/关座圈加热)
│   ├── reset_button.h/.c   # 实体重置按键 (长按 BOOT 5 秒清除配网信息)
│   ├── www/index.html      # 前端页面 (编译时嵌入固件, 无外部依赖)
│   ├── CMakeLists.txt      # 组件注册 (bt/wifi/http_server/json 等依赖)
│   └── Kconfig.projbuild   # menuconfig 配置项 (纯英文, 避免GBK问题)
├── OUTPUT/                 # 反编译的九牧微信小程序 (协议参考)
├── sdkconfig.defaults      # 默认配置 (WiFi+BLE 共存, SNTP, HTTPD)
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
| `ble_toilet_disconnect()` | ble_toilet.c | 主动断开（省电模式执行完立即释放蓝牙） |
| `ble_toilet_wait_ready()` | ble_toilet.c | 阻塞等待连接就绪（省电模式用） |
| `asr_pro_init()` | asr_pro.c | 初始化 UART 并启动接收任务 |
| `asr_pro_inject_cmd()` | asr_pro.c | 直接注入命令字节（控制台/Web 共用） |
| `asr_pro_send_feedback()` | asr_pro.c | 发送反馈码到 ASR-PRO 触发语音播报 |
| `app_wifi_start()` | app_wifi.c | 读取 NVS 凭据, STA 连接或进入配网热点模式 |
| `app_config_ps_load/save()` | app_config.c | 省电模式配置 NVS 读写 |
| `app_config_wifi_save()` | app_config.c | WiFi 凭据 NVS 保存（配网页提交） |
| `web_server_start()` | web_server.c | 启动 HTTP 服务与 REST API |
| `power_save_start()` | power_save.c | 启动省电模式调度任务 |
| `power_save_reload()` | power_save.c | 网页保存配置后热加载（立即生效） |
| `power_save_report_manual()` | power_save.c | 语音/网页手动开关座圈后通知调度器 |
| `ble_toilet_set_target_mac()` | ble_toilet.c | 运行时修改目标马桶 MAC (网页配置) |
| `app_config_mac_save/get()` | app_config.c | 马桶蓝牙地址 NVS 读写 |
| `reset_button_start()` | reset_button.c | 启动实体重置按键监测任务 |
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

# 2. (可选) 图形化配置 MAC/引脚/波特率/热点名称
idf.py menuconfig

# 3. 编译
idf.py build

# 4. 烧录 + 监控串口 (COM口按实际修改)
idf.py -p COM3 flash monitor
```

> **从旧版本升级**：v2 起启用了 WiFi 与 TCP/IP（软件共存），若之前编译过请先执行 `idf.py fullclean`（或删除 `sdkconfig`）再重新编译。

退出串口监控：`Ctrl + ]`

---

## 九、可配置项

运行 `idf.py menuconfig` → `JOMOO SQ9650 Voice Controller`：

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `TOILET_TARGET_MAC` | `A4:C1:38:5E:79:76` | 目标马桶 BLE MAC 地址 |
| `ASR_UART_BAUD_RATE` | `115200` | ASR-PRO UART 波特率 |
| `ASR_UART_RX_PIN` | `17` | ESP32 接收引脚（接 ASR-PRO TXD） |
| `ASR_UART_TX_PIN` | `16` | ESP32 发送引脚（接 ASR-PRO PA3，**语音反馈必需**） |
| `BLE_IDLE_TIMEOUT_SEC` | `30` | 空闲多少秒后自动断开 BLE |
| `ENABLE_DEBUG_CONSOLE` | `y` | 是否在 UART0 启用调试控制台（量产可关） |
| `TOILET_AP_SSID` | `Toilet-Setup` | 配网热点 SSID 前缀（自动追加 MAC 后 4 位） |
| `TOILET_AP_PASS` | `12345678` | 配网热点密码（WPA2，至少 8 位） |
| `RESET_BUTTON_GPIO` | `0` | 实体重置按键 GPIO（低电平有效，默认 BOOT 键） |
| `RESET_BUTTON_HOLD_MS` | `5000` | 长按多久触发恢复出厂（毫秒） |

> `TOILET_TARGET_MAC` 仅作为**初始默认值**；网页"网络设置"页签可随时修改马桶蓝牙地址（存 NVS，优先级高于编译值）。

---

## 十、硬件接线

```
天问 ASR-PRO          ESP32
─────────────         ─────────────
   TXD  ───────────>  GPIO17 (UART2 RX)
   RXD  <───────────  GPIO16 (UART2 TX)  [必需:语音反馈]
   GND  ───────────   GND
   VCC  ───────────   5V 或 3.3V (看模块要求)
```

> ESP32 与马桶之间是无线 BLE 连接，无需接线。

---

## 十一、测试方法

### 方法一：调试控制台（最方便，语音模块未到货时首选）

固件在烧录串口（UART0，即 `idf.py monitor` 那个口）上内置了交互式命令行。烧录后运行 `idf.py monitor`，直接在终端敲命令即可测试，**走的是和真实 ASR-PRO 完全相同的代码路径**。

```
idf.py -p COM3 monitor
```

看到 `toilet>` 提示符后，敲入命令：

| 命令 | 作用 | 等价 ASR 帧 |
|---|---|---|
| `wake` | 扫描并连接马桶（等价唤醒词） | `AA 55 00 00 55` |
| `footon` / `footoff` | 脚感 开/关 | `AA 55 01/02 00 55` |
| `flushl` / `flushs` | 大冲 / 小冲 | `AA 55 03/04 00 55` |
| `stop` | 停止 | `AA 55 05 00 55` |
| `seaton` / `seatoff` | 座圈加热 开(高档)/关 | `AA 55 06/07 00 55` |
| `seatlow` / `seatmid` / `seathigh` | 座温 低/中/高档 | `AA 55 0E/0F/10 00 55` |
| `coveron` / `coveroff` | 翻盖 开/关 | `AA 55 08/09 00 55` |
| `ringon` / `ringoff` | 翻圈 开/关 | `AA 55 0A/0B 00 55` |
| `lighton` / `lightoff` | 夜灯 开/关 | `AA 55 0C/0D 00 55` |
| `autoflushon/off` | 自动冲刷 开/关 | `AA 55 11/12 00 55` |
| `autocoveron/off` | 自动翻盖 开/关 | `AA 55 17/18 00 55` |
| `poweron` / `poweroff` | 智能节电 开/关 | `AA 55 13/14 00 55` |
| `hibernate` | 休眠 | `AA 55 15 00 55` |
| `selfclean` | 自清洁 | `AA 55 16 00 55` |
| `seatlongon/off` | 久坐提醒 开/关 | `AA 55 1A/1B 00 55` |
| `autotempon/off` | 四季温感 开/关 | `AA 55 1C/1D 00 55` |
| `autosmallon/off` | 自动小冲 开/关 | `AA 55 1E/1F 00 55` |
| `ccflushon/off` | 关盖冲厕 开/关 | `AA 55 20/21 00 55` |
| `prewetton/off` | 预润湿 开/关 | `AA 55 22/23 00 55` |
| `lightsenson/off` | 光感夜灯 开/关 | `AA 55 24/25 00 55` |
| `regflushon/off` | 定期冲刷 开/关 | `AA 55 26/27 00 55` |
| `querystate` | 查询马桶状态（回包由 notify 0x30 解析） | `AA 55 19 00 55` |
| `tstate` | 打印最近一次解析的状态快照 | - |
| `status` | 查看当前 BLE 连接状态 | - |
| `send AA 55 01 00 55` | 直接喂入原始 HEX 帧（测试帧解析器） | 原样 |
| `help` | 列出所有命令 | - |

**典型测试流程：**
```
toilet> wake          # 触发扫描连接, 等日志出现 "BLE READY" (连接后自动查询一次状态)
toilet> status        # 确认 BLE ready : YES
toilet> tstate        # 打印马桶状态快照 (座温/盖板/夜灯/故障位等)
toilet> footon        # 打开脚感, 马桶应响应
toilet> seatmid       # 座圈加热中档
toilet> querystate    # 再查一次状态, tstate 应同步更新
toilet> send AA 55 02 00 55   # 也可用原始帧测试解析器
```

> 该控制台由 menuconfig 的 `ENABLE_DEBUG_CONSOLE` 控制（默认开启）。量产固件建议关闭，避免占用 UART0。

### 方法二：USB-TTL 串口助手模拟 ASR-PRO（测 GPIO17 通路）

1. USB-TTL 的 TX 接 ESP32 GPIO17，GND 共地
2. 串口助手设为 **115200, 8N1, HEX 发送模式**
3. 按顺序测试：

```
第1步: 发送 AA 55 00 00 55   (唤醒)
       → 等待日志出现 "BLE READY"

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

## 十二、Web 配网与省电模式

### 12.1 首次配网流程

```
上电 ──> NVS 无 WiFi 凭据 ──> 开启热点 "Toilet-Setup-XXXX" (密码 12345678)
                                        │
                        手机连接该热点, 浏览器打开 192.168.4.1
                                        │
                        填入家里 WiFi 的 SSID/密码, 点"保存并重启"
                                        │
                        ESP32 保存凭据到 NVS 并重启
                                        │
                        STA 连接路由器 ──> NTP 校时 ──> Web 服务就绪
```

- 配网热点 SSID 前缀/密码可在 menuconfig 中修改
- 之后可通过路由器后台查看 ESP32 获取的 IP（设备名 `esp32-toilet`），或看串口日志 `Got IP: x.x.x.x`
- 若 STA 连接失败（改密码/换路由器），设备会自动回落到配网热点模式重新配网
- 网页"网络设置"页签也提供"清除 WiFi 配置"按钮（等价恢复出厂）

### 12.2 Web 页面功能

浏览器访问设备 IP（或配网模式下的 `192.168.4.1`）：

| 页签 | 功能 |
|---|---|
| 省电模式 | 启用开关；工作日/周末各最多 4 个时间段（时:分 下拉选择，5 分钟粒度）；保存后立即生效 |
| 马桶控制 | 唤醒连接、脚感开/关、大冲、小冲、停止、座圈加热开/关（与语音控制同路径，含语音播报反馈） |
| 网络设置 | 查看/修改 WiFi、马桶蓝牙 MAC 地址、清除配置重新配网 |

页面为单文件 `main/www/index.html`，**编译时嵌入固件**，无 CDN 依赖，离线可用。

### 12.2.1 马桶蓝牙地址配置

- 网页"网络设置"页签 → "马桶蓝牙地址"卡片，输入 `AA:BB:CC:DD:EE:FF` 格式保存
- 存入 NVS，**优先级高于** menuconfig 的 `TOILET_TARGET_MAC` 编译默认值（上电时覆盖）
- 保存后立即生效，无需重启；当前已建立的连接不受影响，下次唤醒按新地址扫描连接
- 适用场景：更换新马桶 / 换了主控板导致 MAC 变化，无需重新编译固件

### 12.2.2 实体重置按键（恢复出厂）

- **长按 BOOT 键（GPIO0）5 秒**清除 NVS 中的 WiFi 配网信息，设备自动重启进入配网热点模式
- 省电模式时间段与马桶蓝牙地址配置**保留**，不受影响
- 按住期间串口每秒打印倒计时（`RESET_BTN: Button held 1/5 s ...`）
- GPIO 与长按时长可在 menuconfig 中修改（`RESET_BUTTON_GPIO` / `RESET_BUTTON_HOLD_MS`）
- 注意：GPIO0 是启动模式选择引脚，**上电瞬间**按住会进入烧录模式；正常运行时长按才会触发重置

### 12.3 省电模式工作规则

1. **默认时段**（首次保存前）：工作日 `07:00-08:30` 与 `17:30-24:00`，周末无；总开关默认关闭
2. 时间来自 NTP（`ntp.aliyun.com` / `cn.pool.ntp.org` / `pool.ntp.org`，时区 UTC+8），**时间未同步时调度自动挂起**
3. 跨入时段 → 自动连接马桶 → 开座圈加热（标准档）→ 立即断开；跨出时段 → 同样流程下发关闭
4. **手动操作优先**：语音或网页手动开关座圈后，调度器记录该状态，同一时段内不会自动改回，直到下一次时段边界
5. 每次执行完命令立即断开 BLE，不占用家人手机小程序的蓝牙连接
6. 执行失败（蓝牙忙/马桶不在）时 30 秒后自动重试；连续失败 3 次后退避为每 5 分钟重试一次。**自动调度的连接全程静默**——不触发"已连接/已断开"语音播报，只有用户语音唤醒才播报
7. 支持跨夜时段（开始时间 > 结束时间，如 `22:00-06:00`）；结束时间选 `24:00` 表示到午夜

### 12.4 REST API 一览（可供智能家居集成）

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/status` | 设备状态（模式/IP/时间/BLE/省电模式/马桶 MAC） |
| `GET` / `POST` | `/api/config` | 读取 / 保存省电模式配置（JSON） |
| `POST` | `/api/cmd` | 马桶控制 `{"cmd":"wake\|footon\|footoff\|flushl\|flushs\|stop\|seaton\|seatoff\|seatlow\|seatmid\|seathigh\|coveron\|coveroff\|ringon\|ringoff\|lighton\|lightoff\|autoflushon\|autoflushoff\|autocoveron\|autocoveroff\|poweron\|poweroff\|hibernate\|selfclean\|querystate\|seatlongon\|seatlongoff\|autotempon\|autotempoff\|smallflushon\|smallflushoff\|coverflushon\|coverflushoff\|prewetton\|prewettoff\|lightsensoron\|lightsensoroff\|regularon\|regularoff"}` |
| `GET` / `POST` | `/api/mac` | 读取 / 设置马桶蓝牙 MAC `{"mac":"AA:BB:CC:DD:EE:FF"}` |
| `POST` | `/api/wifi` | 保存 WiFi 凭据并重启 `{"ssid":"...","pass":"..."}` |
| `POST` | `/api/factory` | 清除 WiFi 凭据，重启进入配网模式 |

配置 JSON 示例：

```json
{
  "enable": true,
  "weekday": [ {"start": 420, "end": 510}, {"start": 1050, "end": 1440} ],
  "weekend": [ {"start": 480, "end": 600} ]
}
```

> `start`/`end` 为当日分钟数（0 = 00:00，1440 = 24:00）。

### 12.5 预期串口日志（新增部分）

```
I APP_WIFI: Got IP: 192.168.100.42
I APP_WIFI: SNTP time synced
I WEB_SRV: Web server started (7 pages, 21384 bytes)
I PWR_SAVE: Power-save scheduler started (enable=1)
I PWR_SAVE: Want seat heat: ON (weekday, applied=-1)
I BLE_TOILET: State: IDLE -> SCANNING
I BLE_TOILET: State: DISCOVERING -> READY
I PWR_SAVE: Applying seat heat ON (connect...)
I PWR_SAVE: Seat heat ON applied OK
```

---

## 十三、注意事项

1. **手机蓝牙需关闭**：测试时手机小程序若连着马桶，ESP32 会连不上（BLE 从机通常只允许 1 个 central 连接）。

2. **MAC 地址字节序**：代码同时用正序和反序比对 MAC，兼容不同 ESP-IDF 版本的字节序差异。

3. **Kconfig 不能用中文**：`Kconfig.projbuild` 若含中文，Windows 下 Python kconfgen 用 GBK 解码会报 `UnicodeDecodeError`。源码 `.c/.h` 的中文注释无此问题（GCC 正确处理 UTF-8）。

4. **日志用英文**：`ESP_LOGx` 输出统一用英文，避免串口终端乱码。

5. **座温档位**：如需"调高/调低座温"，可在 `cmd_map` 中新增命令码，调用 `build_single_value_frame(frame, 60, level)`，level 取 0~4。

6. **写入模式**：BLE 写特征使用 `ESP_GATT_WRITE_TYPE_NO_RSP`（无响应写），与小程序一致。

7. **断线处理**：READY 状态下若马桶意外断开（如休眠），会触发 `DISCONNECT_EVT` 自动回到 IDLE，需重新说唤醒词。

8. **WiFi 与 BLE 共存**：sdkconfig 已启用 `ESP_COEX_SW_COEXIST_ENABLE`（软件共存），两者可同时工作；若用非常老旧的 ESP-IDF 或自行精简配置，需确认该项开启，否则 BLE 连接会不稳。

9. **省电模式依赖联网校时**：断电重启后需等 NTP 重新同步（几秒内），期间调度挂起属正常现象。

10. **Web 控制走语音路径**：网页按钮下发命令与语音完全同路径，所以 ESP32 上若有语音模块，网页点按钮也会听到语音播报确认。

---

## 附录：协议逆向来源

本项目 BLE 协议通过反编译九牧官方微信小程序获得，关键文件：

| 文件 | 作用 |
|---|---|
| `OUTPUT/config/device_enum.js` | 设备型号映射（SQ9650 → bleProtocol=1） |
| `OUTPUT/utils/tool/deviceTool.js` | 协议分发（bleProtocol → 对应 Controller） |
| `OUTPUT/utils/bluetooth/toilet/TechramicToiletController.js` | SQ9650 实际控制逻辑 |
| `OUTPUT/utils/bluetooth/BLEController.js` | GATT UUID 定义 + 写命令 |
| `OUTPUT/utils/bluetooth/bleutil.js` | MAC 过滤、校验、编解码工�