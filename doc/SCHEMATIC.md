# 原理图设计指南（嘉立创EDA）

本文档指导如何用**嘉立创EDA（专业版/标准版）**绘制本项目原理图。

> **能力说明**：嘉立创EDA 工程文件（.eprj）是专有格式，无法由外部直接生成可打开的工程。
> 但本文提供 3 样东西让绘制变得简单：
> 1. **立创商城（LCSC）编号** → 直接搜编号调出带封装元件
> 2. **推荐克隆现成工程** → ESP32 部分省去 80% 工作
> 3. **完整网表 + 分模块连线说明** → 照着连线即可

---

## 目录

- [一、最快方案：克隆现成工程](#一最快方案克隆现成工程)
- [二、立创商城元件编号（LCSC）](#二立创商城元件编号lcsc)
- [三、需要自建的元件符号](#三需要自建的元件符号)
- [四、完整网表（Netlist）](#四完整网表netlist)
- [五、分模块连线说明](#五分模块连线说明)
- [六、嘉立创EDA 操作流程](#六嘉立创eda-操作流程)

---

## 一、最快方案：克隆现成工程

### 推荐做法

立创开源硬件平台（**oshwhub.com**）上有大量现成的 **ESP32-WROOM-32E + CH340C + Type-C + 自动下载** 最小系统板工程，**可直接用嘉立创EDA打开/克隆**。

**操作步骤：**

1. 访问 https://oshwhub.com
2. 搜索关键词：`ESP32-WROOM-32E CH340C TypeC`
3. 找一个「ESP32最小系统板」开源工程（带自动下载电路）
4. 点击「**打开工程**」→ 在嘉立创EDA中打开
5. 点击「**克隆**」到自己账户
6. 在此基础上：**删掉多余排针，加上 ASRPRO-CORE 模块 + 麦克风 + 喇叭**

### 这样做的优势

| 部分 | 克隆得到 | 自己补 |
|---|---|---|
| Type-C + ESD + CC电阻 | ✅ 已有 | — |
| CH340C + 自动下载电路 | ✅ 已有 | — |
| AMS1117-3.3 + 电容 | ✅ 已有 | — |
| ESP32 模组 + EN/BOOT | ✅ 已有 | — |
| ASRPRO-CORE 模块 | ❌ 需自建 | ✅ 本文档提供 |
| 麦克风/喇叭电路 | ❌ 需自建 | ✅ 本文档提供 |
| ESP32↔ASR-PRO UART连线 | ❌ | ✅ 本文档提供 |

> 参考工程示例（oshwhub 上可搜到）：
> - "ESP32最小系统板项目"（ESP32-WROOM-32E-N8 + CH340C + AMS1117 + TypeC + 自动下载）
> - "esp32-wroom-32e-pro"

---

## 二、立创商城元件编号（LCSC）

在嘉立创EDA中，放置元件时直接搜索下列**编号**，可自动关联立创商城库存和封装。

### 已核实编号

| 元件 | 型号 | LCSC编号 | 封装 | 备注 |
|---|---|---|---|---|
| ESP32模组 | ESP32-WROOM-32E-N4 | **C701341** | SMD-38 | 4MB Flash，无PSRAM ✅推荐 |
| ESP32模组 | ESP32-WROOM-32E-N8 | **C701342** | SMD-38 | 8MB Flash，无PSRAM |
| ESP32模组 | ESP32-WROOM-32E-N16 | **C701343** | SMD-38 | 16MB Flash，无PSRAM |
| USB转串口 | CH340C | **C84681** | SOP-16 | WCH南京沁恒，内置晶振 |
| LDO 3.3V | AMS1117-3.3 | **C6186** | SOT-223 | 1A |
| LDO 3.3V(备选) | AMS1117-3.3 | C347222 | SOT-223 | UMW友台 |
| NPN三极管 | SS8050 | 搜索"SS8050 SOT-23" | SOT-23 | 替代S8050，自动下载用 |
| 100nF电容 | CL10B104KB8NNNC | **C1591** | 0603 | 三星 |
| 10μF电容 | CL10A106KP8NNNC | **C19702** | 0603 | 三星 |

> ⚠️ **重要**：ESP32 务必选 **不带 PSRAM** 的型号（N4/N8/N16，**不是** N4R2/N8R2/N16R2），否则 GPIO16/17 被 PSRAM 占用，UART 无法工作！

### 需按关键词搜索的元件（0603封装）

| 元件 | 搜索关键词 | 封装 |
|---|---|---|
| 5.1kΩ 电阻 | `5.1kΩ 0603` | 0603 |
| 10kΩ 电阻 | `10kΩ 0603` | 0603 |
| 1kΩ 电阻 | `1kΩ 0603` | 0603 |
| 2.2kΩ 电阻 | `2.2kΩ 0603` | 0603 |
| 0Ω 电阻 | `0Ω 0603` | 0603 |
| 1μF 电容 | `1uF 0603` | 0603 |
| 4.7μF 电容 | `4.7uF 0603` | 0603 |
| 22μF 电容 | `22uF 0603`（或0805） | 0603/0805 |
| ESD保护 | `USBLC6-2SC6` | SOT-23-6 |
| Type-C母座 | `TYPE-C 16PIN 2MD` | SMD |
| 轻触开关 | `轻触开关 3x4 SMD` | SMD |
| 100μF电容 | `100uF 10V 电解` 或 `钽电容` | 直插/1210 |

---

## 三、需要自建的元件符号

### ASRPRO-CORE 核心板（必须自建）

ASRPRO-CORE 是天问五幺的模块，**立创商城标准库没有现成符号**，需在嘉立创EDA自建（18引脚邮票孔模块）。

**新建器件步骤：** 嘉立创EDA → 文件 → 新建 → 器件 → 绘制符号(18引脚) + 封装(邮票孔/半孔)

**符号引脚定义（18脚）：**

| 脚号 | 名称 | 类型 | 电气连接 |
|---|---|---|---|
| 1 | 3V3 | 电源输出 | 接 C13(4.7μF)→GND，**不外带负载** |
| 2 | PA6 | IO | UART2_RX（未用，可空） |
| 3 | PA5 | IO | UART2_TX（未用，可空） |
| 4 | PA3 | IO | **UART1_RX ← ESP32 GPIO16** |
| 5 | PA2 | IO | **UART1_TX → ESP32 GPIO17** |
| 6 | PA1 | IO | 空 |
| 7 | PA0 | IO | 空 |
| 8 | SPKL- | 输出 | 喇叭负（J2-2） |
| 9 | SPKL+ | 输出 | 喇叭正（J2-1） |
| 10 | MIC- | 输入 | 麦克风负 |
| 11 | MIC+ | 输入 | 麦克风正 |
| 12 | MUTE | IO | 功放使能，低有效，**可悬空**（内部默认使能） |
| 13 | PA4 | IO | PG_EN 编程使能，**接烧录口J3**（高电平进编程） |
| 14 | PC4 | IO | 空 |
| 15 | PB6 | IO | UART0_RX，**接烧录口J3** |
| 16 | PB5 | IO | UART0_TX，**接烧录口J3** |
| 17 | 5V | 电源 | 接 +5V 主轨 |
| 18 | GND | 地 | 接 GND |

> 封装：18脚邮票孔（半孔工艺），间距按规格书图2尺寸（18×23mm）。若不做贴片，可用 2×9 排母插接。

### ESP32-WROOM-32E（立创库已有）

搜 C701341 直接调出，符号封装齐全。38脚 + EPAD。关键脚：

| 脚号 | 名称 | 用途 |
|---|---|---|
| 1,15,38,39(EPAD) | GND | 全接地 |
| 2 | 3V3 | 接 3.3V（C7/C8去耦） |
| 3 | EN | RC复位 + 自动下载 |
| 25 | IO0 | BOOT按键 + 自动下载 |
| 27 | IO16 | **UART2 TX → ASR-PRO PA3** |
| 28 | IO17 | **UART2 RX ← ASR-PRO PA2** |
| 34 | RXD0(GPIO3) | ← CH340C TXD（烧录） |
| 35 | TXD0(GPIO1) | → CH340C RXD（烧录） |
| 14 | IO12(MTDI) | **必须低电平**，加10kΩ下拉或悬空 |

### CH340C（立创库已有）

搜 C84681，SOP-16。关键脚：VCC、GND、UD+(USB D+)、UD-(USB D-)、TXD、RXD、RTS#、DTR#、V3(3.3V输出脚，接100nF)。

---

## 四、完整网表（Netlist）

按网络（Net）组织，可用于嘉立创EDA专业版「网表导入」，或作为连线核对表。

### 电源网络

```
NET +5V:
  J1.VBUS, F1.2, D1.VBUS, U4.IN(AMS1117脚3),
  U2.Pin17(ASR-PRO 5V), C1.+, C2.1, C11.+, C12.1, U3.VCC(CH340C)

NET +3V3:
  U4.OUT(AMS1117脚2), U1.Pin2(ESP32 3V3),
  C4.1, C5.1, C7.1, C8.1, R3.2(EN上拉), R4.2(IO0上拉),
  U3.V3(CH340C 3.3V输出/或独立供电)

NET GND:
  J1.GND, F1.1(如保险丝在负极), D1.GND, Q1(防反).S,
  U4.GND(AMS1117脚1), U1.Pin1/15/38/EPAD(ESP32 GND),
  U2.Pin18(ASR-PRO GND), U3.GND(CH340C),
  C1.-, C2.2, C3.2, C4.2, C5.2, C6.2, C7.2, C8.2,
  C11.-, C12.2, C13.2, SW1.2, SW2.2, R5.2(IO12下拉),
  LED1.阴, LED2.阴, R1.2(CC), R2.2(CC), J2.2? (喇叭单端接地视喇叭而定)
```

### USB 网络

```
NET USB_DP:
  J1.DP1, J1.DP2, D1.I/O1, U3.UD+(CH340C脚6)
NET USB_DM:
  J1.DN1, J1.DN2, D1.I/O2, U3.UD-(CH340C脚5)
NET CC1:
  J1.CC1, R1.1(5.1k) → R1.2 → GND
NET CC2:
  J1.CC2, R2.1(5.1k) → R2.2 → GND
```

### ESP32 烧录网络（CH340C ↔ ESP32 UART0）

```
NET ESP_RX:
  U3.TXD(CH340C脚2) → U1.Pin34(RXD0/GPIO3)
NET ESP_TX:
  U3.RXD(CH340C脚3) ← U1.Pin35(TXD0/GPIO1)
```

### ESP32 自动下载网络

```
NET DTR:
  U3.DTR#(CH340C) → R7(1k) → Q3.B(SS8050基极)
  Q3.E → GND, Q3.C → ESP_EN
NET RTS:
  U3.RTS#(CH340C) → R8(1k) → Q2.B(SS8050基极)
  Q2.E → GND, Q2.C → ESP_IO0
NET ESP_EN:
  U1.Pin3(EN), Q3.C, R3.1(10k上拉到3V3), C6.1(1μF到GND), SW1.1
NET ESP_IO0:
  U1.Pin25(IO0), Q2.C, R4.1(10k上拉到3V3), SW2.1
```

> 注：交叉耦合更稳妥的接法为 Q2.C→EN、Q3.C→IO0，并让两管发射极分别接对方的DTR/RTS网络（Espressif官方电路）。基础版按上述直连即可，esptool时序能正常工作。

### ESP32 ↔ ASR-PRO 通信网络（核心）

```
NET UART_ESP_TX:
  U1.Pin27(ESP32 GPIO16/TX) → R12(0Ω) → U2.Pin4(ASR-PRO PA3/UART1_RX)
NET UART_ESP_RX:
  U1.Pin28(ESP32 GPIO17/RX) ← R13(0Ω) ← U2.Pin5(ASR-PRO PA2/UART1_TX)
```

### ESP32 Strapping 处理

```
NET ESP_IO12:
  U1.Pin14(IO12/MTDI) → R5(10k) → GND   // 必须低电平，禁止上拉
NET ESP_IO2:
  U1.Pin24(IO2) 悬空
NET ESP_IO15:
  U1.Pin23(IO15/MTDO) 悬空
```

### ASR-PRO 麦克风网络

```
NET MIC_P:
  U2.Pin11(MIC+) → C9(1μF隔直) → MIC1.+
  MIC1 偏置: MIC1.+ → R11(2.2k) → 3V3(或按参考设计)
NET MIC_N:
  U2.Pin10(MIC-) → MIC1.-
  C10(100nF) 就近滤波到GND
```

> 麦克风具体偏置/滤波网络请按 ASRPRO-CORE 规格书「图4 模块应用指导电路图」，不同麦克风(驻极体/MEMS)接法略有差异。

### ASR-PRO 喇叭网络

```
NET SPK_P:
  U2.Pin9(SPKL+) → J2.1 → SPK1+
NET SPK_N:
  U2.Pin8(SPKL-) → J2.2 → SPK1-
```

> ASR-PRO 内置 8002A 功放，喇叭直连 SPKL+/SPKL-，无需外部功放。

### ASR-PRO 烧录网络

```
NET ASR_TX(PB5):
  U2.Pin16(PB5/UART0_TX) → J3.2
NET ASR_RX(PB6):
  U2.Pin15(PB6/UART0_RX) → J3.1
NET ASR_PGEN(PA4):
  U2.Pin13(PA4/PG_EN) → J3.3
J3.4 → +5V,  J3.5 → GND
```

### ASR-PRO 电源引脚

```
NET ASR_3V3OUT:
  U2.Pin1(3V3内部LDO输出) → C13(4.7μF) → GND   // 不外带负载
```

---

## 五、分模块连线说明

### 模块1：Type-C 供电

```
J1(Type-C) VBUS ── F1(保险丝) ── Q1(防反P-MOS) ──> +5V
J1 CC1 ── R1(5.1k) ── GND
J1 CC2 ── R2(5.1k) ── GND
J1 D+/D- ── D1(USBLC6-2SC6 ESD) ── CH340C UD+/UD-
+5V ── C1(100μF) ── GND
+5V ── C2(10μF) ── GND
```

### 模块2：3.3V LDO

```
+5V ── U4(AMS1117 IN脚3)
U4 GND脚1 ── GND
U4 OUT脚2 ──> +3V3
+5V ── C3(10μF) ── GND      (输入)
+3V3 ── C4(22μF) ── GND     (输出)
+3V3 ── C5(100nF) ── GND    (高频)
```

### 模块3：CH340C + 自动下载

```
CH340C VCC ── +5V(或+3V3)
CH340C V3脚 ── C(100nF) ── GND   (内部3.3V输出滤波)
CH340C GND ── GND
CH340C UD+ ── USB_DP
CH340C UD- ── USB_DM
CH340C TXD ── ESP32 GPIO3(RXD0)
CH340C RXD ── ESP32 GPIO1(TXD0)
CH340C DTR# ── R7(1k) ── Q3.B ; Q3.C ── ESP_EN ; Q3.E ── GND
CH340C RTS# ── R8(1k) ── Q2.B ; Q2.C ── ESP_IO0 ; Q2.E ── GND
```

### 模块4：ESP32 最小系统

```
ESP32 3V3脚2 ── +3V3 ; C7(10μF)+C8(100nF) 就近到GND
ESP32 GND(脚1/15/38/EPAD) ── GND
ESP32 EN脚3 ── R3(10k)上拉到3V3 ; C6(1μF)到GND ; SW1到GND
ESP32 IO0脚25 ── R4(10k)上拉到3V3 ; SW2到GND
ESP32 IO12脚14 ── R5(10k)下拉到GND  ⚠️禁止上拉
ESP32 天线区 ── Keepout 净空
```

### 模块5：ESP32 ↔ ASR-PRO UART

```
ESP32 GPIO16脚27(TX) ── R12(0Ω) ── ASR-PRO PA3脚4(RX)
ESP32 GPIO17脚28(RX) ── R13(0Ω) ── ASR-PRO PA2脚5(TX)
两模块 GND 共地
```

### 模块6：ASR-PRO 外围

```
ASR-PRO 5V脚17 ── +5V ; C11(100μF)+C12(100nF)就近到GND
ASR-PRO 3V3脚1 ── C13(4.7μF)到GND  (内部LDO输出，不外带)
ASR-PRO MIC+脚11/MIC-脚10 ── 麦克风网络(R11/C9/C10)
ASR-PRO SPKL+脚9/SPKL-脚8 ── J2 ── 8Ω2W喇叭
ASR-PRO MUTE脚12 ── 悬空(内部默认使能)
ASR-PRO PB5脚16/PB6脚15/PA4脚13 ── J3烧录排针
```

---

## 六、嘉立创EDA 操作流程

### 专业版（推荐）

1. **新建工程**：文件 → 新建 → 工程，命名 `JOMOO_Toilet_VoiceCtrl`
2. **克隆现成ESP32工程**（推荐）：
   - oshwhub.com 搜 ESP32最小系统 → 打开 → 克隆 → 复制ESP32部分到本工程
3. **放置元件**：右侧「元件库」→ 搜 LCSC 编号（如 C701341）→ 放置
4. **自建ASRPRO-CORE**：文件 → 新建 → 器件 → 按第三节引脚表画符号+封装
5. **连线**：按第四/五节网表连接，用「网络标签(NetLabel)」标注同名网络
6. **ERC检查**：设计 → 检查DRC/ERC，修正悬空/冲突
7. **转PCB**：设计 → 更新/转换到PCB
8. **布局布线**：按 HARDWARE.md 第六节布局建议
9. **输出**：制造 → 生成Gerber + BOM + 坐标文件 → 提交嘉立创打样/SMT

### 关键检查项

- [ ] ESP32 型号确认无 PSRAM（N4/N8/N16）
- [ ] IO12 有下拉、无上拉
- [ ] Type-C CC1/CC2 各 5.1kΩ 下拉
- [ ] ASR-PRO Pin1(3V3) 外接 4.7μF
- [ ] 5V 主轨 ≥100μF 储能
- [ ] ESP32↔ASR-PRO 的 TX/RX 交叉正确（TX接对方RX）
- [ ] ESP32 天线区 Keepout
- [ ] 所有 EPAD/GND 脚接地
- [ ] 电阻电容统一 0603

---

## 附：无法直接生成工程文件的替代方案

如果你希望进一步自动化，可选：

| 方案 | 说明 | 可行性 |
|---|---|---|
| 克隆oshwhub工程 | ESP32部分直接用现成的 | ⭐⭐⭐⭐⭐ 强烈推荐 |
| 网表导入(专业版) | 本文档第四节网表整理成Protel网表格式导入 | ⭐⭐⭐ 需元件先建好 |
| 手工按指南绘制 | 照第四/五节连线 | ⭐⭐⭐⭐ 最可靠 |
| AI生成.eprj | 专有格式，无法可靠生成 | ❌ 不可行 |

**最省事路径**：克隆现成ESP32最小系统工程 → 只自建ASRPRO-CORE符号 → 补麦克风/喇叭/UART连线 → 完成。

---

*文档版本：v1.0*
*配套文档：HARDWARE.md（BOM与设计说明）、BOM.csv（元件清单）*
