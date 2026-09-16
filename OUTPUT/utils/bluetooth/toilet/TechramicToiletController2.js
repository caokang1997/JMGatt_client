Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e = require("../../../@babel/runtime/helpers/classCallCheck"),
  t = require("../../../@babel/runtime/helpers/createClass"),
  s = require("../../../@babel/runtime/helpers/get"),
  i = require("../../../@babel/runtime/helpers/getPrototypeOf"),
  o = require("../../../@babel/runtime/helpers/inherits"),
  h = require("../../../@babel/runtime/helpers/createSuper"),
  a = (r(require("../BLEController.js")), require("../../../config/toilet_enum.js")),
  l = r(require("../../../utils/debuglog.js")),
  n = (r(require("../BleModuleController.js")), r(require("../ota/TechramicOTAToiletController.js")));

function r(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}
var u = require("../bleutil.js"),
  c = function(n) {
    o(c, n);
    var r = h(c);

    function c() {
      var t;
      e(this, c);
      for (var s = arguments.length, i = new Array(s), o = 0; o < s; o++) i[o] = arguments[o];
      return (t = r.call.apply(r, [this].concat(i))).jmZtmxm = "000000", t.deviceInfo = {}, t.isSelfInspectionReady = !1, t.selfInspectDelayTimer = null, t.onQuaryReadyCallback = null, t.isLatestWomanMode = !1, t.latestAutoCleanMode = 0, t.selectedCustomModes = [1, 3, 4, 6], t.isDeviceReady = !1, t.protocolVersionNO1 = 0, t.protocolVersionNO2 = 0, t.PROTOCOL_VERSION_0 = 0, t.PROTOCOL_VERSION_NO1_10 = 10, t.PROTOCOL_VERSION_NO2_08 = 8, t.cleanModeId = 0, t.userId = 0, t.dryOrCleanRemainTime = 0, t.remoteControllerUserId = 0, t.queryTimer = null, t.uiLock = !1, t.uiLockTimer = null, t.model = "-", t.workState = 0, t.isAuto = 0, t.isWaterSpray = 0, t.isPreWetting = 0, t.isHibernating = 0, t.errorCodes = [], t.isOnSeat = 0, t.coverOn = 0, t.coverRun = 0, t.ringOn = 0, t.ringRun = 0, t.flushLargeSwitch = 0, t.flushSmallSwitch = 0, t.dredgeSwitch = 0, t.deodorizationSwitch = 0, t.uvWaterDisinfectSwitch = 0, t.bubbleMotor = 0, t.autoFlushSwitch = 0, t.autoCloseCoverWithFlushSwitch = 0, t.autoFlushWithCloseCoverSwitch = 0, t.autoSmallFlushSwitch = 0, t.footSensorSwitch = 0, t.nightLightSwitch = 0, t.lightSensorSwitch = 0, t.preWettingSwitch = 0, t.autoTemp = 0, t.smartPowerSave = 0, t.autoCoverSwitch = 0, t.regularFlushSwitch = 0, t.regularSelfCleanSwitch = 0, t.regularSelfCleanGear = 3, t.gestureSwitch = 0, t.autoDeodorization = 0, t.atmosphereLightGroupNum = 0, t.atmosphereLightSwitch = 0, t.atmosphereLightMode = 0, t.atmosphereLightBrightness = 70, t.atmosphereLightColorTemp = 0, t.atmosphereLightFlash = 0, t.atmosphereLightFlashSwitch = 0, t.atomsphereLightGroup = [], t.redBlueLightSwitch = 0, t.redBlueLightMode = 1, t.redLightTime = 10, t.blueLightTime = 20, t.seatTempLevel = 0, t.waterTempLevel = 0, t.airTempLevel = 0, t.hipwashWaterPressure = 1, t.hipwashNozzlePosition = 1, t.womanWaterPressure = 1, t.womanNozzlePosition = 1, t.defectWaterPressure = 1, t.defectNozzlePosition = 1, t.wideWashLevel = 1, t.filterInsufficient = 0, t.filterUseTimeInMins = 0, t.filterLevel = 100, t.filterGrade = 1, t.bubbleSwitch = 0, t.bubbleLevel = 2, t.autoBubble = 0, t.openLoopBubble = 0, t.foamTimeOnBrushRing = 9, t.isSelfClean = 0, t.isReplaceNozzleOn = 0, t.windSpeedLevel = 1, t.flipSenseDistance = 3, t.flushMode = 2, t.autoCoverSensitive = 0, t.physiotherapySwitch = 0, t.physiotherapyMode = 0, t.lastAutoToiletMode = a.CleanMode.NONE, t.toiletMode = a.CleanMode.NONE, t.isOnDry = !1, t.moveWash = 0, t.wideWashMode = 0, t.isStrongWeakMessage = !1, t.isMassageWash = 0, t.largeSprayState = 0, t.windSwing = 0, t.flowAbnormal = 0, t.outletOverTemperature = 0, t.inletOverTemperature = 0, t.inletOverTime = 0, t.inletSensorFault = 0, t.outletSensorFault = 0, t.waterBoxSensorFault = 0, t.voltageDetectionFault = 0, t.brightnessSensorFault = 0, t.seatTempOver = 0, t.warmAirOver = 0, t.ambientSensorFault = 0, t.seatTempError = 0, t.warmAirSensorFault = 0, t.bubbleModuleFault = 0, t.washoutFault = 0, t.gearboxAbnormal = 0, t.isBubbleEnable = !0, t.bubbleDisableReason = 0, t.isReflushEnable = !0, t.isWaterStored = !1, t.startBubbleTime = null, t.bubbleLockTimer = null, t.startFlushLargeTime = null, t.startFlushSmallTime = null, t.flushTimer = null, t.coverRingRunTimer = null, t.hardwareVersion = null, t.mcuSoftwareVersion = null, t.mcuSoftwareNumVersion = -1, t.flipCoverHardwareVersion = null, t.flipCoverSoftwareVersion = null, t.flipCoverSoftwareNumVersion = -1, t.powerOffMemory = 1, t.filterLifeAlarmEnable = 1, t.isBuzzerEnable = 1, t.isSeatTooLong = 0, t.isCloseCoverAutoSmallFlush = 0, t.isPetWash = 0, t.hasHuman = 1, t.bandWide = 0, t.waveSensingMode = 0, t.sensingDistance = 60, t.sensingAngle = 30, t.quickCalcDistance = 60, t.quickDistance = 60, t.quickAngle = 30, t.isQuickMode = 1, t.quickDistanceIndex = 0, t.quickDistanceTemp = 0, t.quickDistanceTimer = null, t.aiVoiceSettingSwitch = 0, t
    }
    return t(c, [{
      key: "initDevice",
      value: function() {
        s(i(c.prototype), "initDevice", this).call(this), this.uiLock = !1, this.isSelfInspectionReady = !1, this.isDeviceReady = !1, this.workState = 0, this.isAuto = 0, this.isWaterSpray = 0, this.isHibernating = 0, this.isPreWetting = 0, this.errorCodes = [], this.isOnSeat = 0, this.coverOn = 0, this.ringOn = 0, this.coverRun = 0, this.ringRun = 0, this.flushLargeSwitch = 0, this.flushSmallSwitch = 0, this.dredgeSwitch = 0, this.deodorizationSwitch = 0, this.uvWaterDisinfectSwitch = 0, this.bubbleMotor = 0, this.autoFlushSwitch = 0, this.autoCloseCoverWithFlushSwitch = 0, this.autoFlushWithCloseCoverSwitch = 0, this.autoSmallFlushSwitch = 0, this.footSensorSwitch = 0, this.nightLightSwitch = 0, this.lightSensorSwitch = 0, this.preWettingSwitch = 0, this.autoDeodorization = 0, this.smartPowerSave = 0, this.autoCoverSwitch = 0, this.regularFlushSwitch = 0, this.regularSelfCleanSwitch = 0, this.regularSelfCleanGear = 3, this.gestureSwitch = 0, this.atmosphereLightGroupNum = 0, this.atmosphereLightSwitch = 0, this.atmosphereLightBrightness = 70, this.atmosphereLightColorTemp = 0, this.atmosphereLightFlash = 0, this.atmosphereLightFlashSwitch = 0, this.redBlueLightSwitch = 0, this.redBlueLightMode = 1, this.redLightTime = 10, this.blueLightTime = 20, this.seatTempLevel = 0, this.waterTempLevel = 0, this.airTempLevel = 0, this.hipwashWaterPressure = 1, this.hipwashNozzlePosition = 1, this.womanWaterPressure = 1, this.womanNozzlePosition = 1, this.wideWashLevel = 1, this.flowAbnormal = 0, this.outletOverTemperature = 0, this.inletOverTemperature = 0, this.inletOverTime = 0, this.inletSensorFault = 0, this.outletSensorFault = 0, this.waterBoxSensorFault = 0, this.voltageDetectionFault = 0, this.brightnessSensorFault = 0, this.seatTempOver = 0, this.warmAirOver = 0, this.ambientSensorFault = 0, this.seatTempError = 0, this.warmAirSensorFault = 0, this.bubbleModuleFault = 0, this.washoutFault = 0, this.gearboxAbnormal = 0, this.bubbleSwitch = 0, this.bubbleLevel = 2, this.autoBubble = 0, this.openLoopBubble = 0, this.foamTimeOnBrushRing = 9, this.isSelfClean = 0, this.isReplaceNozzleOn = 0, this.windSpeedLevel = 0, this.flipSenseDistance = 3, this.flushMode = 2, this.atmosphereLightMode = 0, this.autoCoverSensitive = 0, this.physiotherapySwitch = 0, this.physiotherapyMode = 0, this.dryOrCleanRemainTime = 0, this.toiletMode = a.CleanMode.NONE, this.isOnDry = !1, this.moveWash = 0, this.wideWashMode = 0, this.isStrongWeakMessage = !1, this.largeSprayState = 0, this.windSwing = 0, this.filterLifeAlarmEnable = 1, this.filterInsufficient = 0, this.filterUseTimeInMins = 0, this.filterLevel = 100, this.filterGrade = 1, this.startBubbleTime = null, this.bubbleLockTimer = null, this.startFlushLargeTime = null, this.startFlushSmallTime = null, this.flushTimer = null, this.coverRingRunTimer = null, this.hardwareVersion = null, this.mcuSoftwareVersion = null, this.mcuSoftwareNumVersion = -1, this.powerOffMemory = 1, this.isBuzzerEnable = 1, this.isSeatTooLong = 0, this.isCloseCoverAutoSmallFlush = 0, this.isPetWash = 0, this.aiVoiceSettingSwitch = 0, this.loadLocalParam()
      }
    }, {
      key: "loadLocalParam",
      value: function() {
        var e = wx.getStorageSync("hipWashWaterPressure"),
          t = wx.getStorageSync("hipWashNozzlePosition"),
          s = wx.getStorageSync("womanWashWaterPressure"),
          i = wx.getStorageSync("womanWashNozzlePosition");
        null != e ? this.hipwashWaterPressure = e : wx.setStorageSync("hipWashWaterPressure", this.hipwashWaterPressure), null != t ? this.hipwashNozzlePosition = t : wx.setStorageSync("hipWashNozzlePosition", this.hipwashNozzlePosition), null != s ? this.womanWaterPressure = s : wx.setStorageSync("womanWashWaterPressure", this.womanWaterPressure), null != i ? this.womanNozzlePosition = i : wx.setStorageSync("womanWashNozzlePosition", this.womanNozzlePosition)
      }
    }, {
      key: "setDeviceInfo",
      value: function(e) {
        s(i(c.prototype), "setDeviceInfo", this).call(this, e), this.deviceInfo = e
      }
    }, {
      key: "setOnQuaryReadyCallback",
      value: function(e) {
        this.onQuaryReadyCallback = e
      }
    }, {
      key: "startConnect",
      value: function(e, t) {
        this.isDeviceReady = !1, this.closeBubbleTimer(), s(i(c.prototype), "startConnect", this).call(this, e, t)
      }
    }, {
      key: "stopConnnect",
      value: function() {
        this.isDeviceReady = !1, this.closeBubbleTimer(), s(i(c.prototype), "stopConnnect", this).call(this)
      }
    }, {
      key: "onDeviceReady",
      value: function(e) {
        var t = this;
        console.log(1111111, "设备已就绪"), s(i(c.prototype), "onDeviceReady", this).call(this, e), setTimeout((function() {
          t.quaryVersionInfo(1), null != t.onQuaryReadyCallback && t.onQuaryReadyCallback()
        }), 1e3), setTimeout((function() {
          t.quaryDeviceState()
        }), 1500), setTimeout((function() {
          console.log(111111, "发送03查询"), t.quaryVersionInfo(3)
        }), 3e3), setTimeout((function() {
          t.quaryVersionInfo(3)
        }), 3e3), this.deviceInfo.hasRepeatQuaryDeviceState && (setTimeout((function() {
          t.quaryDeviceState()
        }), 2e3), setTimeout((function() {
          t.quaryDeviceState()
        }), 2500))
      }
    }, {
      key: "readDeviceInfo",
      value: function() {
        var e = new ArrayBuffer(4),
          t = new DataView(e);
        t.setUint8(0, 250), t.setUint8(1, e.byteLength), t.setUint8(2, 2);
        var s = this.calculateCommunicateChecksum(t);
        t.setUint8(3, s), this.writeCommunicateCommand(e)
      }
    }, {
      key: "onMsgValueChange",
      value: function(e) {
        s(i(c.prototype), "onMsgValueChange", this).call(this, e);
        var t = e.value;
        l.default.debug("========= 收到设备消息 =========\n", u.ab2hex(t));
        var o = new Uint8Array(t);
        if (e.characteristicId !== this.notifyComUUID) {
          if (o.length < 8 || 252 != o[0] || 252 != o[o.length - 1]) return 252 != o[0] && console.log("指令错误：指令不是以FC开头"), void(252 != o[o.length - 1] && console.log("指令错误：指令不是以FC结尾"));
          var h = u.ab2hex(t).toUpperCase(),
            a = u.decodeStr(h);
          o = u.hexStringToByteArray(a);
          var n = 5,
            r = this.getBitAtPosition(o[2], 7),
            g = this.getBitAtPosition(o[2], 6),
            v = this.getBitAtPosition(o[2], 5);
          1 == r ? (n = 9, console.log("指令用户ID字节数：4")) : 1 == g ? (n = 6, console.log("指令用户ID字节数：1")) : (n = 5, console.log("主命令位置：5"), console.log("指令用户ID字节数：0"));
          1 == v && (o[n + 1], o[n + 2], n, n += 2, console.log("指令有子命令字节数：2")), 48 == o[n] ? this.dealWith30(o, n) : 96 == o[n] ? this.dealWith60(o, n) : 136 == o[n] ? this.dealWith88(o, n) : 1 == o[n] ? this.dealWith01(o, n) : console.log("其他未识别的应答指令"), null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(u.ab2hex(t))
        } else {
          if (o.length < 4 || 250 != o[0]) return;
          this.dealWithCustomProtocol(o)
        }
      }
    }, {
      key: "clearUiLockTimer",
      value: function() {
        null != this.uiLockTimer && (clearTimeout(this.uiLockTimer), this.uiLockTimer = null)
      }
    }, {
      key: "dealWithCustomProtocol",
      value: function(e) {
        2 == e[2] && (this.model = u.ab2hexFromStart(e, 6, 3))
      }
    }, {
      key: "dealWith01",
      value: function(e, t) {
        console.log("---------------------------- 01 指令 ----------------------------");
        var s = t,
          i = e[s + 1];
        console.log("组件类别 = ", i);
        var o = e[s + 2];
        console.log("硬件版本长度：" + o);
        var h = null;
        if (o > 0) {
          var a = e.slice(s + 3, s + 3 + o);
          a ? (h = this.utf8ArrayToString(a), console.log("硬件版本：" + h)) : console.log("硬件版本 = null")
        }
        var l = e[s + 3 + o];
        console.log("固件版本长度：" + l);
        var n = null;
        if (l > 0) {
          var r = e.slice(s + 3 + o + 1, s + 3 + o + 1 + l);
          r ? (n = this.utf8ArrayToString(r), console.log("固件版本：" + n)) : console.log("固件版本 = null")
        }
        var u = -1;
        if (n && "string" == typeof n) {
          var c = n.split("_");
          if (c.length >= 1) {
            var g = c[0],
              v = g;
            (g.startsWith("V") || g.startsWith("v")) && (v = g.slice(1, g.length)), this.isNumeric(v) && (u = Number(v))
          }
        }
        1 === i ? (this.hardwareVersion = h, this.mcuSoftwareVersion = n, this.mcuSoftwareNumVersion = u, console.log("MCU的版本号(数字) = " + u)) : 3 === i ? (this.flipCoverHardwareVersion = h, this.flipCoverSoftwareVersion = n, this.flipCoverSoftwareNumVersion = u, console.log("翻盖板版本号(数字) = " + u)) : console.log("未识别的组件类别 B1 = " + i + "，仅打印不存储");
        var m = s + 1 + 1 + o + 1 + l + 1 + 1;
        if (m + 1 < e.length - 1) {
          var w = e[m],
            S = e[m + 1];
          console.log("有协议版本号：主序号：" + w + "; 子序号：" + S), this.protocolVersionNO1 = w, this.protocolVersionNO2 = S
        } else console.log("没有协议版本号")
      }
    }, {
      key: "dealWith30",
      value: function(e, t) {
        var s = this;
        console.log("---------------------------- 30 指令 ----------------------------");
        var i = t,
          o = e[i + 5];
        this.isOnSeat = this.getBitAtPosition(o, 7), console.log("着座状态(B5.b7) = ", this.isOnSeat);
        var h = e[i + 1];
        this.isAuto = this.getBitAtPosition(h, 7), this.isWaterSpray = this.getBitAtPosition(h, 6), this.largeSprayState = this.getBitAtPosition(h, 6), console.log("喷嘴出水(B1-b6) = ", this.isWaterSpray), this.workState = this.getByteValue(h, 0, 5), console.log("工作状态(B1.b0-b4) = ", u.ab2hex(u.int8ToBuffer(this.workState)).toUpperCase()), this.isSelfInspectionReady = 0 != this.workState || 31 != this.workState, console.log("马桶是否就绪 = ", this.isSelfInspectionReady), this.isHibernating = 1 == this.workState ? 1 : 0, this.isPreWetting = 17 == this.workState ? 1 : 0;
        var l = this.toiletMode,
          n = !1,
          r = "",
          c = 0,
          g = !1;
        switch (this.workState) {
          case 0:
          case 1:
          case 2:
            0 == this.workState ? r = "上电初始化" : 1 == this.workState ? r = "休眠中" : 2 == this.workState && (r = "待机中"), this.userId = 0, this.cleanModeId = 0, l = a.CleanMode.NONE, this.moveWash = 0, this.wideWashMode = 0, this.windSwing = 0, 1 == this.isOnSeat ? 1 == this.isAuto && (this.lastAutoToiletMode == a.CleanMode.NONE && (this.lastAutoToiletMode = a.CleanMode.AUTO_HIP_WASH), l = this.lastAutoToiletMode) : (this.isAuto, this.lastAutoToiletMode = a.CleanMode.NONE);
            break;
          case 3:
            r = "喷嘴清洁中", l = a.CleanMode.NOZZLE_CLEAN, this.moveWash = 0, this.wideWashMode = 0, this.windSwing = 0;
            break;
          case 4:
            1 == this.isAuto ? (this.lastAutoToiletMode == a.CleanMode.NONE && (this.lastAutoToiletMode = a.CleanMode.AUTO_HIP_WASH), r = (l = this.lastAutoToiletMode) == a.CleanMode.AUTO_HIP_WASH ? "自动臀洗-暖风阶段" : "自动妇洗-暖风阶段") : (l = a.CleanMode.DRY, r = "暖风中"), n = !0, this.moveWash = 0, this.wideWashMode = 0, this.windSwing = 0;
            break;
          case 5:
            r = "臀洗中", 1 == this.isAuto ? (l = a.CleanMode.AUTO_HIP_WASH, this.lastAutoToiletMode = a.CleanMode.AUTO_HIP_WASH) : l = a.CleanMode.HIP_WASH, this.moveWash = 0, this.wideWashMode = 0, this.windSwing = 0;
            break;
          case 6:
            r = "妇洗中", 1 == this.isAuto ? (l = a.CleanMode.AUTO_WOMAN_WASH, this.lastAutoToiletMode = a.CleanMode.AUTO_WOMAN_WASH) : l = a.CleanMode.WOMAN_WASH, this.moveWash = 0, this.wideWashMode = 0, this.windSwing = 0;
            break;
          case 7:
            r = "助便强洗中", l = a.CleanMode.DEFECT_WASH, this.moveWash = 0, this.wideWashMode = 0, this.windSwing = 0;
            break;
          case 8:
            r = "坐浴中", l = a.CleanMode.SITZ_BATH, this.moveWash = 0, this.wideWashMode = 0, this.windSwing = 0;
            break;
          case 9:
            r = "强弱按摩", g = !0, l = this.isAuto ? a.CleanMode.AUTO_HIP_WASH : a.CleanMode.HIP_WASH, this.moveWash = 0, this.wideWashMode = 0, this.windSwing = 0;
            break;
          case 10:
            break;
          case 11:
            r = "臀洗移动中", 1 == this.isAuto ? (l = a.CleanMode.AUTO_HIP_WASH, this.lastAutoToiletMode = a.CleanMode.AUTO_HIP_WASH) : l = a.CleanMode.HIP_WASH, this.moveWash = 1, this.wideWashMode = 1, this.windSwing = 0;
            break;
          case 12:
            r = "妇洗移动中", 1 == this.isAuto ? (l = a.CleanMode.AUTO_WOMAN_WASH, this.lastAutoToiletMode = a.CleanMode.AUTO_WOMAN_WASH) : l = a.CleanMode.WOMAN_WASH, this.moveWash = 1, this.wideWashMode = 1, this.windSwing = 0;
            break;
          case 13:
            r = "助便移动中", l = a.CleanMode.DEFECT_WASH, this.moveWash = 1, this.wideWashMode = 1, this.windSwing = 0;
            break;
          case 14:
            r = "坐浴移动中", l = a.CleanMode.SITZ_BATH, this.moveWash = 1, this.wideWashMode = 1, this.windSwing = 0;
            break;
          case 15:
            1 == this.isAuto ? (this.lastAutoToiletMode == a.CleanMode.NONE && (this.lastAutoToiletMode = a.CleanMode.AUTO_HIP_WASH), r = (l = this.lastAutoToiletMode) == a.CleanMode.AUTO_HIP_WASH ? "自动臀洗-暖风移动中" : "自动妇洗-暖风移动中") : (l = a.CleanMode.DRY, r = "暖风移动中"), n = !0, this.moveWash = 0, this.wideWashMode = 0, this.windSwing = 1;
            break;
          case 16:
            c = 1, r = "自清洁中";
            break;
          case 17:
            r = "预湿润中"
        }
        console.log("自动模式(B1.b7) = ", this.isAuto, 0 == this.isAuto ? " 手动" : " 自动"), console.log("解析工作状态 = ", this.workState + " " + r), this.isStrongWeakMessage = g, this.isOnDry = n, this.isSelfClean = c, this.toiletMode != l && (this.toiletMode = l, this.toiletMode != a.CleanMode.NONE ? this.startCountDown() : this.stopCountDown());
        var v = e[i + 2],
          m = [];
        this.getBitAtPosition(v, 6) ? (console.log("故障码(B2.b6) = 流量异常"), this.flowAbnormal = 1, m.push(a.ErrorTypes.TRAFFIC_ABNORMAL)) : this.flowAbnormal = 0, this.getBitAtPosition(v, 5) ? (console.log("故障码(B2.b5) = 出水超温"), this.outletOverTemperature = 1, m.push(a.ErrorTypes.OUTLET_OVERTEMP)) : this.outletOverTemperature = 0, this.getBitAtPosition(v, 4) ? (console.log("故障码(B2.b4) = 进水超温"), this.inletOverTemperature = 1, m.push(a.ErrorTypes.INLET_OVERTEMP)) : this.inletOverTemperature = 0, this.getBitAtPosition(v, 3) ? (console.log("故障码(B2.b3) = 进水超时"), this.inletOverTime = 1, m.push(a.ErrorTypes.INLET_OVERTIME)) : this.inletOverTime = 0, this.getBitAtPosition(v, 2) ? (console.log("故障码(B2.b2) = 出水传感器故障"), this.outletSensorFault = 1, m.push(a.ErrorTypes.OUTLET_SENSOR_FAULT)) : this.outletSensorFault = 0, this.getBitAtPosition(v, 1) ? (console.log("故障码(B2.b1) = 水箱传感器故障"), this.waterBoxSensorFault = 1, m.push(a.ErrorTypes.TANK_SENSOR_FAULT)) : this.waterBoxSensorFault = 0, this.getBitAtPosition(v, 0) ? (console.log("故障码(B2.b0) = 进水传感器故障"), this.inletSensorFault = 1, m.push(a.ErrorTypes.INLET_SENSOR_FAULT)) : this.inletSensorFault = 0;
        var w = e[i + 3];
        this.getBitAtPosition(w, 7) ? (console.log("故障码(B3.b7) = 电压检测故障"), this.voltageDetectionFault = 1, m.push(a.ErrorTypes.VOLTAGE_DETECT_FAULT)) : this.voltageDetectionFault = 0, this.getBitAtPosition(w, 6) ? (console.log("故障码(B3.b6) = 亮度传感器故障"), this.brightnessSensorFault = 1, m.push(a.ErrorTypes.BRIGHTNESS_SENSOR_FAULT)) : this.brightnessSensorFault = 0, this.getBitAtPosition(w, 5) ? (console.log("故障码(B3.b5) = 座圈超温"), this.seatTempOver = 1, m.push(a.ErrorTypes.SEAT_OVERTEMP)) : this.seatTempOver = 0, this.getBitAtPosition(w, 4) ? (console.log("故障码(B3.b4) = 烘干超温"), this.warmAirOver = 1, m.push(a.ErrorTypes.DRY_OVERTEMP)) : this.warmAirOver = 0, this.getBitAtPosition(w, 2) ? (console.log("故障码(B3.b2) = 环温传感器故障"), this.ambientSensorFault = 1, m.push(a.ErrorTypes.AMBIENT_SENSOR_FAULT)) : this.ambientSensorFault = 0, this.getBitAtPosition(w, 1) ? (console.log("故障码(B3.b1) = 座圈传感器故障"), this.seatTempError = 1, m.push(a.ErrorTypes.SEAT_SENSOR_FAULT)) : this.seatTempError = 0, this.getBitAtPosition(w, 0) ? (console.log("故障码(B3.b0) = 暖风传感器故障"), this.warmAirSensorFault = 1, m.push(a.ErrorTypes.DRY_SENSOR_FAULT)) : this.warmAirSensorFault = 0;
        var S = e[i + 4];
        this.getBitAtPosition(S, 7) ? (console.log("故障码(B4.b7) = 智力泡模块故障"), this.bubbleModuleFault = 1, m.push(a.ErrorTypes.BUBBLE_MODULE_FAULT)) : this.bubbleModuleFault = 0, this.getBitAtPosition(S, 6) ? (console.log("故障码(B4.b6) = 冲刷缺故障"), this.washoutFault = 1, m.push(a.ErrorTypes.FLUSH_MODULE_FAULT)) : this.washoutFault = 0, this.getBitAtPosition(S, 5) ? (console.log("故障码(B4.b5) = 齿轮箱异常"), this.gearboxAbnormal = 1, m.push(a.ErrorTypes.ABNORMAL_GEARBOX)) : this.gearboxAbnormal = 0, this.errorCodes = m, this.deviceInfo.useLightSmartToiletDiferentProtocol ? this.deviceInfo.use30B5AsSmartPowerSave && (this.smartPowerSave = this.getBitAtPosition(o, 0), console.log("智能节电开关(B5.b0) = ", this.smartPowerSave)) : console.log("是否省电中(B5.b0) = ", this.getBitAtPosition(o, 0));
        var f = this.getBitAtPosition(o, 2);
        this.hasHuman = f, console.log("人体感应(B5.b2) = ", f), this.footSensorSwitch = this.getBitAtPosition(o, 3), console.log("脚感控制开关(B5.b3) = ", this.footSensorSwitch), this.coverOn = this.getBitAtPosition(o, 4), console.log("盖板状态(B5.b4) = ", this.coverOn), this.ringOn = this.getBitAtPosition(o, 5), console.log("座圈状态(B5.b5) = ", this.ringOn);
        var d = e[i + 6],
          p = 2 == (d >> 0 & 3) ? 1 : 0;
        this.deviceInfo.useLightSmartToiletDiferentProtocol || (1 == p ? 0 == this.flushLargeSwitch && (this.startFlushLargeTime = new Date) : null != this.startFlushLargeTime && (this.closeFlushTimer(), this.isReflushEnable = !1, this.flushTimer = setTimeout((function() {
          s.isReflushEnable = !0, null != s.msgValueChangeCallBack && s.msgValueChangeCallBack(null)
        }), 3e4), this.startFlushLargeTime = null)), this.flushLargeSwitch = p, console.log("大冲开关(B6.b0-b1) = ", this.flushLargeSwitch);
        var b = 1 == (d >> 0 & 3) ? 1 : 0;
        this.deviceInfo.useLightSmartToiletDiferentProtocol || (1 == b ? 0 == this.flushSmallSwitch && (this.startFlushSmallTime = new Date) : null != this.startFlushSmallTime && (this.closeFlushTimer(), this.isReflushEnable = !1, this.flushTimer = setTimeout((function() {
          s.isReflushEnable = !0, null != s.msgValueChangeCallBack && s.msgValueChangeCallBack(null)
        }), 3e4), this.startFlushSmallTime = null)), this.flushSmallSwitch = b, console.log("小冲开关(B6.b0-b1) = ", this.flushSmallSwitch), this.dredgeSwitch = 3 == (d >> 0 & 3) ? 1 : 0, console.log("疏通开关(B6.b0-b1) = ", this.dredgeSwitch), this.autoTemp = this.getBitAtPosition(d, 2), console.log("四季温感开关(B6.b2) = ", this.autoTemp), this.deodorizationSwitch = this.getBitAtPosition(d, 3), console.log("除臭状态(铂金)(B6.b3) = ", this.deodorizationSwitch), this.uvWaterDisinfectSwitch = this.getBitAtPosition(d, 5), console.log("UV杀菌开关(B6.b5) = ", this.uvWaterDisinfectSwitch);
        var y = e[i + 7];
        this.ringRun = this.getBitAtPosition(y, 0), console.log("翻圈中(B7.b0) = ", this.ringRun), this.coverRun = this.getBitAtPosition(y, 1), console.log("翻盖中(B7.b1) = ", this.coverRun), this.preWettingSwitch = this.getBitAtPosition(y, 2), console.log("预润湿开关(B7.b2) = ", this.preWettingSwitch), this.autoSmallFlushSwitch = this.getBitAtPosition(y, 3), console.log("自动小冲开关(B7.b3) = ", this.autoSmallFlushSwitch), this.autoCloseCoverWithFlushSwitch = this.getBitAtPosition(y, 4), console.log("关盖冲厕开关(B7.b4) = ", this.autoCloseCoverWithFlushSwitch), this.bubbleMotor = this.getBitAtPosition(y, 5), console.log("加液盒开关(B7.b5) = ", this.bubbleMotor), this.deviceInfo.useLightSmartToiletDiferentProtocol ? (this.isReflushEnable = 1 == this.getBitAtPosition(y, 7), this.isWaterStored = 1 == this.getBitAtPosition(y, 7), console.log("轻智能款蓄水状态(B7.b7) =", this.isWaterStored)) : (this.isWaterStored = 1 == this.getBitAtPosition(y, 7), console.log("智能款蓄水位(B7.b7) = ", this.isWaterStored));
        var B = e[i + 8],
          P = this.getByteValue(B, 4, 4),
          T = this.getByteValue(B, 0, 4);
        if (12 == P) {
          this.cleanModeId = this.getLocalCleanModeId(T);
          var _ = "男士快洗";
          switch (this.cleanModeId) {
            case 1:
              _ = "童洗模式";
              break;
            case 2:
              _ = "经期护理";
              break;
            case 3:
              _ = "老人舒洗";
              break;
            case 4:
              _ = "男士快洗";
              break;
            case 5:
              _ = "女士快洗";
              break;
            case 6:
              _ = "快速助便"
          }
          console.log("私人定制模式(B8)：" + _ + "; cleanModeId = " + this.cleanModeId)
        } else this.cleanModeId = 0, this.userId = 0, console.log("私人定制模式(B8)：关闭; cleanModeId = " + this.cleanModeId);
        var W = e[i + 9];
        this.airTempLevel = this.getByteValue(W, 0, 3), console.log("风温档位(B9.b0-b2) = ", this.airTempLevel), this.waterTempLevel = this.getByteValue(W, 3, 3), console.log("水温档位(B9.b3-b5) = ", this.waterTempLevel), this.gestureSwitch = this.getBitAtPosition(W, 6), console.log("手势开关(B9.b6) = ", this.gestureSwitch), this.autoCoverSwitch = this.getBitAtPosition(W, 7), console.log("自动翻盖开关(B9.b7) = ", this.autoCoverSwitch);
        var k = e[i + 10],
          A = this.deviceInfo.cleanParamType;
        A ? 2 == A ? this.cleanModeId > 0 ? 2 == this.cleanModeId || 5 == this.cleanModeId ? (this.womanWaterPressure = this.getByteValue(k, 0, 3) + 1, console.log("妇洗水压档位(B10.b0-b2) = ", this.womanWaterPressure), this.womanNozzlePosition = this.getByteValue(k, 3, 3) + 1, console.log("妇洗喷嘴位置(B10.b3-b5) = ", this.womanNozzlePosition), wx.setStorageSync("womanWashWaterPressure", this.womanWaterPressure), wx.setStorageSync("womanWashNozzlePosition", this.womanNozzlePosition)) : (this.hipwashWaterPressure = this.getByteValue(k, 0, 3) + 1, console.log("臀洗水压档位(B10.b0-b2) = ", this.hipwashWaterPressure), this.hipwashNozzlePosition = this.getByteValue(k, 3, 3) + 1, console.log("臀洗喷嘴位置(B10.b3-b5) = ", this.hipwashNozzlePosition), wx.setStorageSync("hipWashWaterPressure", this.hipwashWaterPressure), wx.setStorageSync("hipWashNozzlePosition", this.hipwashNozzlePosition)) : 1 == T ? (this.womanWaterPressure = this.getByteValue(k, 0, 3) + 1, console.log("妇洗水压档位(B10.b0-b2) = ", this.womanWaterPressure), this.womanNozzlePosition = this.getByteValue(k, 3, 3) + 1, console.log("妇洗喷嘴位置(B10.b3-b5) = ", this.womanNozzlePosition), wx.setStorageSync("womanWashWaterPressure", this.womanWaterPressure), wx.setStorageSync("womanWashNozzlePosition", this.womanNozzlePosition)) : (this.hipwashWaterPressure = this.getByteValue(k, 0, 3) + 1, console.log("臀洗水压档位(B10.b0-b2) = ", this.hipwashWaterPressure), this.hipwashNozzlePosition = this.getByteValue(k, 3, 3) + 1, console.log("臀洗喷嘴位置(B10.b3-b5) = ", this.hipwashNozzlePosition), wx.setStorageSync("hipWashWaterPressure", this.hipwashWaterPressure), wx.setStorageSync("hipWashNozzlePosition", this.hipwashNozzlePosition)) : 3 == A ? 1 == T ? (this.womanWaterPressure = this.getByteValue(k, 0, 3) + 1, console.log("妇洗水压档位(B10.b0-b2) = ", this.womanWaterPressure), this.womanNozzlePosition = this.getByteValue(k, 3, 3) + 1, console.log("妇洗喷嘴位置(B10.b3-b5) = ", this.womanNozzlePosition), wx.setStorageSync("womanWashWaterPressure", this.womanWaterPressure), wx.setStorageSync("womanWashNozzlePosition", this.womanNozzlePosition)) : 4 == T ? (this.defectWaterPressure = this.getByteValue(k, 0, 3) + 1, console.log("助便洗水压档位(B10.b0-b2) = ", this.defectWaterPressure), this.defectNozzlePosition = this.getByteValue(k, 3, 3) + 1, console.log("助便洗喷嘴位置(B10.b3-b5) = ", this.defectNozzlePosition)) : (this.hipwashWaterPressure = this.getByteValue(k, 0, 3) + 1, console.log("臀洗水压档位(B10.b0-b2) = ", this.hipwashWaterPressure), this.hipwashNozzlePosition = this.getByteValue(k, 3, 3) + 1, console.log("臀洗喷嘴位置(B10.b3-b5) = ", this.hipwashNozzlePosition), wx.setStorageSync("hipWashWaterPressure", this.hipwashWaterPressure), wx.setStorageSync("hipWashNozzlePosition", this.hipwashNozzlePosition)) : (this.hipwashWaterPressure = this.getByteValue(k, 0, 3) + 1, console.log("臀洗水压档位(B10.b0-b2) = ", this.hipwashWaterPressure), this.womanWaterPressure = this.getByteValue(k, 0, 3) + 1, console.log("妇洗水压档位(B10.b0-b2) = ", this.womanWaterPressure), this.hipwashNozzlePosition = this.getByteValue(k, 3, 3) + 1, console.log("臀洗喷嘴位置(B10.b3-b5) = ", this.hipwashNozzlePosition), this.womanNozzlePosition = this.getByteValue(k, 3, 3) + 1, console.log("妇洗喷嘴位置(B10.b3-b5) = ", this.womanNozzlePosition), wx.setStorageSync("womanWashWaterPressure", this.womanWaterPressure), wx.setStorageSync("womanWashNozzlePosition", this.womanNozzlePosition), wx.setStorageSync("hipWashWaterPressure", this.hipwashWaterPressure), wx.setStorageSync("hipWashNozzlePosition", this.hipwashNozzlePosition)) : this.cleanModeId > 0 ? 2 == this.cleanModeId || 5 == this.cleanModeId ? (this.womanWaterPressure = this.getByteValue(k, 0, 3) + 1, console.log("妇洗水压档位(B10.b0-b2) = ", this.womanWaterPressure), this.womanNozzlePosition = this.getByteValue(k, 3, 3) + 1, console.log("妇洗喷嘴位置(B10.b3-b5) = ", this.womanNozzlePosition), wx.setStorageSync("womanWashWaterPressure", this.womanWaterPressure), wx.setStorageSync("womanWashNozzlePosition", this.womanNozzlePosition)) : (this.hipwashWaterPressure = this.getByteValue(k, 0, 3) + 1, console.log("臀洗水压档位(B10.b0-b2) = ", this.hipwashWaterPressure), this.hipwashNozzlePosition = this.getByteValue(k, 3, 3) + 1, console.log("臀洗喷嘴位置(B10.b3-b5) = ", this.hipwashNozzlePosition), wx.setStorageSync("hipWashWaterPressure", this.hipwashWaterPressure), wx.setStorageSync("hipWashNozzlePosition", this.hipwashNozzlePosition)) : 1 == T ? (this.womanWaterPressure = this.getByteValue(k, 0, 3) + 1, console.log("妇洗水压档位(B10.b0-b2) = ", this.womanWaterPressure), this.womanNozzlePosition = this.getByteValue(k, 3, 3) + 1, console.log("妇洗喷嘴位置(B10.b3-b5) = ", this.womanNozzlePosition), wx.setStorageSync("womanWashWaterPressure", this.womanWaterPressure), wx.setStorageSync("womanWashNozzlePosition", this.womanNozzlePosition)) : (this.hipwashWaterPressure = this.getByteValue(k, 0, 3) + 1, console.log("臀洗水压档位(B10.b0-b2) = ", this.hipwashWaterPressure), this.hipwashNozzlePosition = this.getByteValue(k, 3, 3) + 1, console.log("臀洗喷嘴位置(B10.b3-b5) = ", this.hipwashNozzlePosition), wx.setStorageSync("hipWashWaterPressure", this.hipwashWaterPressure), wx.setStorageSync("hipWashNozzlePosition", this.hipwashNozzlePosition)), this.nightLightSwitch = this.getBitAtPosition(k, 6), console.log("夜灯开关(B10.b6) = ", this.nightLightSwitch), this.lightSensorSwitch = this.getBitAtPosition(k, 7), console.log("光感夜灯(B10.b7) = ", this.lightSensorSwitch);
        var L = e[i + 11];
        if (this.wideWashLevel = this.getByteValue(L, 0, 3) + 1, console.log("清洗幅度(B11.b0-b2) = ", this.wideWashLevel), this.seatTempLevel = L >> 3 & 7, console.log("座温档位(B11.b3-b5) = ", this.seatTempLevel), this.smartPowerSave = this.getBitAtPosition(L, 6), console.log("智能节电开关(B11.b6) = ", this.smartPowerSave), this.autoFlushSwitch = this.getBitAtPosition(L, 7), console.log("自动冲刷(B11.b7) = ", this.autoFlushSwitch), this.isBeforeProtocolVersion(this.PROTOCOL_VERSION_NO1_10, this.PROTOCOL_VERSION_NO2_08) && !this.deviceInfo.use30FilterLevelB12B13) {
          var C = e[i + 12];
          this.filterGrade = 255 & C, console.log("滤芯等级(B12) = ", this.filterGrade);
          var M = e[i + 13];
          this.filterLevel = 255 & M, console.log("滤芯剩余寿命(B12B13) = ", this.filterLevel), this.filterLevel < 0 ? this.filterLevel = 0 : this.filterLevel > 100 && (this.filterLevel = 100)
        } else {
          var z = e[i + 12],
            O = e[i + 13] << 8 | z;
          this.filterLevel = parseFloat((O / 10).toFixed(1)), console.log("滤芯剩余寿命(B12B13) = ", this.filterLevel), this.filterLevel < 0 ? this.filterLevel = 0 : this.filterLevel > 100 && (this.filterLevel = 100)
        }
        this.deviceInfo.isShowFilterBuyBtn && this.deviceInfo.hasFilterAlarm && (this.filterInsufficient = this.filterLevel < 20 ? 1 : 0);
        var N = e[i + 14];
        this.openLoopBubble = this.getBitAtPosition(N, 3), console.log("开圈发泡开关(B14.b3) = ", this.openLoopBubble), this.autoBubble = this.getBitAtPosition(N, 4), console.log("落座发泡开关(B14.b4) = ", this.autoBubble);
        var H = this.getBitAtPosition(N, 5);
        if (this.deviceInfo.useLightSmartToiletDiferentProtocol);
        else if (H) 0 == this.bubbleSwitch && (this.startBubbleTime = new Date);
        else {
          var V = this.deviceInfo.bubbleLockTime;
          V || (V = 30), null != this.startBubbleTime && (this.closeBubbleTimer(), this.isBubbleEnable = !1, this.bubbleDisableReason = 0, this.startBubbleTime = null, this.bubbleLockTimer = setTimeout((function() {
            s.isBubbleEnable = !0, s.bubbleLockTimer = null, null != s.msgValueChangeCallBack && s.msgValueChangeCallBack(null)
          }), 1e3 * V))
        }
        this.isSelfClean ? (this.bubbleSwitch = 0, console.log("发泡开关(自清洁开启) = ", this.bubbleSwitch)) : (this.bubbleSwitch = H, console.log("发泡开关(B14.b5) = ", this.bubbleSwitch)), this.bubbleLevel = this.getByteValue(N, 6, 2), console.log("魔力泡液位(B14.b6-b7) = ", this.bubbleLevel);
        var I = e[i + 15];
        this.windSpeedLevel = this.getByteValue(I, 0, 2) + 1, console.log("风速档位(B15.b0-b1) = ", this.windSpeedLevel), this.flipSenseDistance = this.getByteValue(I, 4, 4), console.log("感应距离档位(B15.b4-b7) = ", this.flipSenseDistance);
        var F = e[i + 16];
        this.flushMode = this.getByteValue(F, 0, 2), console.log("冲刷模式(B16.b0-b1) = ", this.flushMode), this.isBeforeProtocolVersion(this.PROTOCOL_VERSION_NO1_10, this.PROTOCOL_VERSION_NO2_08) && (this.atmosphereLightSwitch = 0 == this.getByteValue(F, 4, 2) ? 0 : 1, console.log("氛围灯开关(B16.b4-b5) = ", this.atmosphereLightSwitch), this.atmosphereLightMode = this.getByteValue(F, 4, 2), console.log("氛围灯模式(B16.b4-b5) = ", this.atmosphereLightMode)), this.autoCoverSensitive = this.getBitAtPosition(F, 6), this.waveSensingMode = this.getBitAtPosition(F, 6), console.log("自动翻盖感应灵敏度(B16.b6) = ", this.autoCoverSensitive);
        var D = e[i + 17];
        this.remoteControllerUserId = 255 & D, console.log("当前用户ID(B17) = ", this.remoteControllerUserId);
        var E = e[i + 18];
        this.autoDeodorization = this.getBitAtPosition(E, 0), console.log("自动除臭开关(铂金)(B18.b0) = ", this.autoDeodorization), console.log("自动除臭开关(触媒)(B18.b1) = ", this.getBitAtPosition(E, 1)), this.isReplaceNozzleOn = this.getBitAtPosition(E, 2), console.log("更换喷嘴(B18.b2) = ", this.isReplaceNozzleOn), this.physiotherapySwitch = this.getBitAtPosition(E, 5), console.log("红蓝光理疗开关(B18.b5) = ", this.physiotherapySwitch), this.physiotherapyMode = this.getByteValue(E, 6, 2), console.log("红蓝光理疗模式(B18.b6-b7) = ", this.physiotherapyMode);
        var R = e[i + 19],
          U = e[i + 20];
        console.log("B19 = " + R), console.log("B20 = " + U), this.dryOrCleanRemainTime = (255 & U) << 8 | 255 & R, console.log("清洗/烘干剩余时间(B19-B20) = ", this.dryOrCleanRemainTime)
      }
    }, {
      key: "dealWith60",
      value: function(e, t) {
        console.log("---------------------------- 60 指令 ----------------------------");
        var s = t;
        console.log("offset = " + s);
        var i = e[s + 1],
          o = (255 & e[s + 2]) << 8 | 255 & i;
        this.sensingDistance = o, console.log("感应距离调节(B1-B2) = ", o);
        var h = e[s + 3],
          a = (255 & e[s + 4]) << 8 | 255 & h;
        console.log("感应区域起始位置(B3-B4) = ", a);
        var l = e[s + 5],
          n = (255 & e[s + 6]) << 8 | 255 & l;
        console.log("感应区域结束位置(B3-B4) = ", n);
        var r = e[s + 7];
        this.isBeforeProtocolVersion(this.PROTOCOL_VERSION_NO1_10, this.PROTOCOL_VERSION_NO2_08) || (this.atmosphereLightSwitch = this.getBitAtPosition(r, 0), console.log("氛围灯开关(B7.b0) = " + this.atmosphereLightSwitch)), this.isSeatTooLong = this.getBitAtPosition(r, 1), console.log("久坐提醒开关(B7.b1) = " + this.isSeatTooLong), this.filterLifeAlarmEnable = this.getBitAtPosition(r, 2), console.log("滤芯寿命提醒开关(B7.b2) = " + this.filterLifeAlarmEnable), this.powerOffMemory = this.getBitAtPosition(r, 3), console.log("数智记忆开关(B7.b3) = " + this.powerOffMemory), this.bandWide = this.getBitAtPosition(r, 5), console.log("微波带宽(B7.b5) = " + this.bandWide), this.regularFlushSwitch = this.getBitAtPosition(r, 6), console.log("定期冲刷开关(B7.b6) = " + this.regularFlushSwitch);
        var u = this.getBitAtPosition(r, 7);
        console.log("除臭开关(香氛)(B7.b7) = " + u);
        var c = e[s + 8];
        this.isQuickMode = c >> 6 & 3, console.log("开启感应距离检测模式(B8.b6-b7) = " + this.isQuickMode), this.aiVoiceSettingSwitch = c >> 4 & 1, console.log("(AI语音开关B8.b4) = " + this.aiVoiceSettingSwitch);
        var g = e[s + 9];
        if (this.foamTimeOnBrushRing = g, console.log("发泡剩余时间(B9) = " + this.foamTimeOnBrushRing), this.isBeforeProtocolVersion(this.PROTOCOL_VERSION_NO1_10, this.PROTOCOL_VERSION_NO2_08)) {
          var v = e[s + 10],
            m = e[s + 11];
          console.log("B10 = " + v), console.log("B11 = " + m), this.atmosphereLightColorTemp = (255 & m) << 8 | 255 & v, console.log("氛围灯色温(B10-B11) = ", this.atmosphereLightColorTemp);
          var w = e[s + 12];
          return this.atmosphereLightBrightness = w, void console.log("氛围灯亮度(B12) = ", this.atmosphereLightBrightness)
        }
        var S = e[s + 10];
        this.atmosphereLightGroupNum = S, console.log("氛围灯组数量(B10) = ", this.atmosphereLightGroupNum);
        this.atomsphereLightGroup = [];
        for (var f = 0; f < this.atmosphereLightGroupNum; f++) {
          var d = s + 10 + 8 * f,
            p = {
              colorTemp: (255 & e[d + 2]) << 8 | 255 & e[d + 1],
              brightness: e[d + 3],
              colorR: e[d + 4],
              colorG: e[d + 5],
              colorB: e[d + 6],
              mode: e[d + 7],
              flash: e[d + 8]
            };
          this.atomsphereLightGroup.push(p)
        }
        if (1 == this.atomsphereLightGroup.length) this.atmosphereLightBrightness = this.atomsphereLightGroup[0].brightness, this.atmosphereLightColorTemp = this.atomsphereLightGroup[0].colorTemp, this.atmosphereLightMode = this.atomsphereLightGroup[0].mode, this.atmosphereLightFlash = this.atomsphereLightGroup[0].flash, this.atmosphereLightFlashSwitch = this.atmosphereLightFlash > 0 ? 1 : 0;
        else if (this.atomsphereLightGroup.length > 1 && null != this.deviceInfo.mainAtmosphereLightIndex) {
          var b = this.deviceInfo.mainAtmosphereLightIndex;
          this.atmosphereLightBrightness = this.atomsphereLightGroup[b].brightness, this.atmosphereLightColorTemp = this.atomsphereLightGroup[b].colorTemp, this.atmosphereLightMode = this.atomsphereLightGroup[b].mode, this.atmosphereLightFlash = this.atomsphereLightGroup[b].flash, this.atmosphereLightFlashSwitch = this.atmosphereLightFlash > 0 ? 1 : 0
        }
        var y = s + 10 + 8 * this.atmosphereLightGroupNum,
          B = (e[y + 1], e[y + 2], e[y + 3]);
        this.autoFlushWithCloseCoverSwitch = this.getBitAtPosition(B, 7), console.log("冲厕关盖开关：" + this.autoFlushWithCloseCoverSwitch)
      }
    }, {
      key: "dealWith88",
      value: function(e, t) {
        console.log("---------------------------- 88 指令 ----------------------------");
        e[t + 1];
        var s = e[t + 2],
          i = (255 & e[t + 3]) << 8 | 255 & s;
        this.quickDistance = i, console.log("感应距离(快速模式)：", this.quickDistance)
      }
    }, {
      key: "writeDeviceInfo",
      value: function(e) {
        var t = new ArrayBuffer(10),
          s = new DataView(t);
        s.setUint8(0, 250), s.setUint8(1, t.byteLength), s.setUint8(2, 1), s.setUint8(3, 5), s.setUint8(4, 1), s.setUint8(5, 1);
        for (var i = 6, o = 0; o < e.length; o += 2) {
          var h = parseInt(e.substr(o, 2), 16);
          s.setUint8(i, h), i += 1
        }
        var a = this.calculateCommunicateChecksum(s);
        s.setUint8(9, a), this.writeCommunicateCommand(t)
      }
    }, {
      key: "queryCountDown",
      value: function() {
        this._setValue(17, 0)
      }
    }, {
      key: "quaryVersionInfo",
      value: function(e) {
        this._setValue(1, e)
      }
    }, {
      key: "quaryDeviceState",
      value: function() {
        this._setValue(17, 0)
      }
    }, {
      key: "quaryDeviceSettings",
      value: function() {
        this._setValue(17, 1)
      }
    }, {
      key: "quaryFilterState",
      value: function() {
        this._setValue(17, 0)
      }
    }, {
      key: "setPowerOffMemory",
      value: function(e) {
        this.powerOffMemory = e ? 1 : 0, this._set40H(24, e ? 1 : 0)
      }
    }, {
      key: "enableFilter",
      value: function(e) {
        this.filterLifeAlarmEnable = e ? 1 : 0, this._set40H(25, e ? 1 : 0)
      }
    }, {
      key: "setSeatTooLong",
      value: function(e) {
        this.isSeatTooLong = e ? 1 : 0, this._set40H(26, e ? 1 : 0)
      }
    }, {
      key: "setCloseCoverAutoSmallFlush",
      value: function(e) {}
    }, {
      key: "setAutoCover",
      value: function(e) {
        this._set40H(0, e ? 1 : 0)
      }
    }, {
      key: "setLightSensor",
      value: function(e) {
        this._set40H(2, e ? 1 : 0)
      }
    }, {
      key: "setSmartPowerSave",
      value: function(e) {
        this._set40H(3, e ? 1 : 0)
      }
    }, {
      key: "setAutoFlush",
      value: function(e) {
        this._set40H(5, e ? 1 : 0)
      }
    }, {
      key: "setPetWash",
      value: function(e) {
        this.isPetWash = e ? 1 : 0
      }
    }, {
      key: "setRegularFlush",
      value: function(e) {
        this.regularFlushSwitch = e ? 1 : 0, this._set40H(23, e ? 1 : 0)
      }
    }, {
      key: "setRegularSelfClean",
      value: function(e, t) {
        this.regularSelfCleanSwitch = e ? 1 : 0, this.regularSelfCleanGear = t, console.log("协议未定，无法发送该指令")
      }
    }, {
      key: "setAutoCloseSensitive",
      value: function(e) {
        this.autoCoverSensitive = e, 0 == e ? this._set47H(0) : this._set47H(1)
      }
    }, {
      key: "setAutoCloseSensitive8B",
      value: function(e) {
        this.autoCoverSensitive = e, this.waveSensingMode = e, 0 == e ? this._set8BH(0) : this._set8BH(1)
      }
    }, {
      key: "setFlipSenseDistance",
      value: function(e) {
        this.flipSenseDistance = e, this._set48H(e)
      }
    }, {
      key: "setAutoUvWaterDisinfect",
      value: function(e) {
        this.uvWaterDisinfectSwitch = e ? 1 : 0, this._set40H(7, e ? 1 : 0)
      }
    }, {
      key: "startDeodorization",
      value: function(e) {
        this._set40H(10, e ? 1 : 0)
      }
    }, {
      key: "setAutoBubble",
      value: function(e) {
        this._set40H(12, e ? 1 : 0)
      }
    }, {
      key: "setGesture",
      value: function(e) {
        this._set40H(13, e ? 1 : 0)
      }
    }, {
      key: "setAutoFootSensor",
      value: function(e) {
        this.footSensorSwitch = e ? 1 : 0, this._set40H(14, e ? 1 : 0)
      }
    }, {
      key: "setAutoTemp",
      value: function(e) {
        this.autoTemp = e ? 1 : 0, this._set40H(15, e ? 1 : 0)
      }
    }, {
      key: "setOpenLoopBubble",
      value: function(e) {
        this._set40H(17, e ? 1 : 0)
      }
    }, {
      key: "setPreWetting",
      value: function(e) {
        this._set40H(18, e ? 1 : 0)
      }
    }, {
      key: "setAutoSmallFlush",
      value: function(e) {
        this.autoSmallFlushSwitch = e ? 1 : 0, this._set40H(19, e ? 1 : 0)
      }
    }, {
      key: "setAutoCloseCoverWithFlush",
      value: function(e) {
        this.autoCloseCoverWithFlushSwitch = e, this._set40H(20, e ? 1 : 0)
      }
    }, {
      key: "setFlushWithCloseCover",
      value: function(e) {
        this.autoFlushWithCloseCoverSwitch = e, this._set40H(28, e ? 1 : 0)
      }
    }, {
      key: "setNightLightSwitch",
      value: function(e) {
        this._set41H(0, e ? 1 : 0)
      }
    }, {
      key: "setBubbleMotor",
      value: function(e) {
        this._set41H(9, e ? 1 : 0)
      }
    }, {
      key: "setPhysiotherapy",
      value: function(e) {
        this._set41H(11, e ? 1 : 0)
      }
    }, {
      key: "startReplaceNozzle",
      value: function(e) {
        this.isReplaceNozzleOn = e ? 1 : 0, this._set41H(12, e ? 1 : 0)
      }
    }, {
      key: "setAutoDeodorization",
      value: function(e) {
        this.autoDeodorization = e ? 1 : 0;
        this.deviceInfo.deodorizationType;
        console.log("自动除臭开关（铂金）：" + (e ? "开" : "关")), this._set40H(10, e ? 1 : 0)
      }
    }, {
      key: "startQuickSensingMode",
      value: function() {
        this.quickDistance = this.sensingDistance, this.quickAngle = this.sensingAngle, this._set8CH(1)
      }
    }, {
      key: "setSensingDistance",
      value: function(e) {
        var t = this.quickDistance,
          s = this.quickAngle;
        e ? (this.sensingDistance = parseInt(t), this.sensingAngle = parseInt(s)) : (t = this.sensingDistance, s = this.sensingAngle), this.setSensingDistance1(t)
      }
    }, {
      key: "setSensingDistance1",
      value: function(e) {
        console.log("设置 distance = " + e), this.sensingDistance = parseInt(e);
        var t = 255 & e,
          s = (65280 & e) >> 8;
        this._set89H(t, s)
      }
    }, {
      key: "setSensingRange",
      value: function(e, t) {
        var s = 255 & e,
          i = (65280 & e) >> 8,
          o = 255 & t,
          h = (65280 & t) >> 8;
        this._set8AH(s, i, o, h)
      }
    }, {
      key: "setAtmosphereLight",
      value: function(e) {
        this.atmosphereLightSwitch = e ? 1 : 0, this._set72H(1, 0, e ? 1 : 0)
      }
    }, {
      key: "setAtmosphereLightBrightness",
      value: function(e) {
        this.atmosphereLightBrightness = e, console.log(">>>氛围灯亮度值：" + e), this._set74H(0, 0, 0, e)
      }
    }, {
      key: "setLightColor",
      value: function(e, t, s) {
        this._set79H(0, 0, e, t, s)
      }
    }, {
      key: "setAtmosphereLightBreathe",
      value: function(e) {
        this.atmosphereLightFlashSwitch = e ? 1 : 0, this._set7BH(0, e ? 1 : 0)
      }
    }, {
      key: "setAiVoiceSwitch",
      value: function(e) {
        this.aiVoiceSettingSwitch = e ? 1 : 0, this._set72H(0, 9, e ? 1 : 0)
      }
    }, {
      key: "setFoamTimeOnBrushRing",
      value: function(e) {
        this.foamTimeOnBrushRing = e, this._set3FH(5, e)
      }
    }, {
      key: "setRestoreFactorySettings",
      value: function() {
        this._set06H()
      }
    }, {
      key: "startCover",
      value: function(e) {
        console.log("启动翻盖"), this._set33H(e ? 1 : 0)
      }
    }, {
      key: "startRing",
      value: function(e) {
        console.log("启动翻圈"), this._set34H(e ? 1 : 0)
      }
    }, {
      key: "startFlushLarge",
      value: function() {
        console.log("启动大冲"), this._set35H(0)
      }
    }, {
      key: "startFlushSmall",
      value: function() {
        console.log("启动小冲"), this._set35H(1)
      }
    }, {
      key: "resetFilter",
      value: function() {
        console.log("启动滤芯复位"), this._set45H(1, 100)
      }
    }, {
      key: "startBubble",
      value: function() {
        console.log("启动智力泡"), this.startBubble1(!0)
      }
    }, {
      key: "startBubble1",
      value: function(e) {
        console.log("启动智力泡"), this._set46H(e ? 1 : 0)
      }
    }, {
      key: "setAtmosphereLightSwitchAndMode",
      value: function(e, t) {
        this.atmosphereLightSwitch = e ? 1 : 0, this.atmosphereLightMode = t;
        var s = 0;
        s = e ? 0 : t, this._set49H(s)
      }
    }, {
      key: "startHibernate",
      value: function(e) {
        console.log("启动休眠"), this._set17H(e ? 1 : 0)
      }
    }, {
      key: "setWindTemp",
      value: function(e) {
        this.airTempLevel = e, this._set3DH(this.airTempLevel)
      }
    }, {
      key: "setWindSpeed",
      value: function(e) {
        this.windSpeedLevel = e, this._set3EH(e - 1)
      }
    }, {
      key: "setWaterTemp",
      value: function(e) {
        this.waterTempLevel = e, this._set3BH(this.waterTempLevel)
      }
    }, {
      key: "setSeatTemp",
      value: function(e) {
        this.seatTempLevel = e, this._set3CH(e)
      }
    }, {
      key: "setHipwashNozzlePosition",
      value: function(e) {
        this.hipwashNozzlePosition = e, this._set3AH(0, e - 1)
      }
    }, {
      key: "setWomanNozzlePosition",
      value: function(e) {
        this.womanNozzlePosition = e, this._set3AH(1, e - 1)
      }
    }, {
      key: "setHipwashWaterPressure",
      value: function(e) {
        this.hipwashWaterPressure = e, this._set39H(0, e - 1)
      }
    }, {
      key: "setWomanWaterPressure",
      value: function(e) {
        this.womanWaterPressure = e, this._set39H(1, e - 1)
      }
    }, {
      key: "setWideWashLevel",
      value: function(e) {
        this.wideWashLevel = e, this._set3AH(3, e - 1)
      }
    }, {
      key: "startManCleanMode",
      value: function(e) {
        this.userId = 0, this.cleanModeId = 0, e ? this._set31H(0) : this._set32H()
      }
    }, {
      key: "startWomanCleanMode",
      value: function(e) {
        this.userId = 0, this.cleanModeId = 0, e ? this._set31H(2) : this._set32H()
      }
    }, {
      key: "startAutoHipCleanMode",
      value: function(e) {
        this.userId = 0, this.cleanModeId = 0, e ? this._set31H(1) : this._set32H()
      }
    }, {
      key: "startAutoWomanCleanMode",
      value: function(e) {
        this.userId = 0, this.cleanModeId = 0, e ? this._set31H(3) : this._set32H()
      }
    }, {
      key: "startDryMode",
      value: function(e) {
        this.userId = 0, this.cleanModeId = 0, e ? this._set31H(7) : this._set32H()
      }
    }, {
      key: "startDefecationMode",
      value: function(e) {
        this.userId = 0, this.cleanModeId = 0, e ? this._set31H(6) : this._set32H()
      }
    }, {
      key: "startSitzBathMode",
      value: function(e) {
        this.userId = 0, this.cleanModeId = 0, e ? this._set31H(5) : this._set32H()
      }
    }, {
      key: "startStrongWeakMode",
      value: function(e) {
        this.userId = 0, this.cleanModeId = 0, e ? this._set31H(10) : this._set32H()
      }
    }, {
      key: "startNozzleClean",
      value: function(e) {
        this.userId = 0, this.cleanModeId = 0, e ? this._set37H(1) : this._set32H()
      }
    }, {
      key: "startMove",
      value: function(e) {
        this.toiletMode == a.CleanMode.WOMAN_WASH || this.toiletMode == a.CleanMode.AUTO_WOMAN_WASH ? (this.moveWash = e, this._set36H(0, e ? 1 : 0)) : (this.wideWashMode = e, this._set36H(1, e ? 1 : 0))
      }
    }, {
      key: "startSelfClean",
      value: function(e) {
        this.isSelfClean = e ? 1 : 0, this._set61H(this.isSelfClean)
      }
    }, {
      key: "startQuickClean",
      value: function(e) {}
    }, {
      key: "startLiftClean",
      value: function(e) {}
    }, {
      key: "startNozzleDry",
      value: function(e) {}
    }, {
      key: "startAutoNozzleDry",
      value: function(e) {}
    }, {
      key: "setInfiniteSenseDistance",
      value: function(e) {}
    }, {
      key: "stopCleanMode",
      value: function(e) {
        this._set32H(0)
      }
    }, {
      key: "doOnlyDry",
      value: function(e) {
        this.startToiletCustomFunction(e, !0, !0)
      }
    }, {
      key: "doParaSetting",
      value: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
        e ? this.startToiletCustomFunction(e, !0) : this.startToiletFunction()
      }
    }, {
      key: "stopCustomCleanMode",
      value: function() {
        this.cleanModeId = 0, this.userId = 0, this.stopCleanMode()
      }
    }, {
      key: "startToiletCustomFunction",
      value: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          s = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        this._set53H(e, t, s)
      }
    }, {
      key: "startToiletFunction",
      value: function(e) {
        this._startToiletFunction(e)
      }
    }, {
      key: "_startToiletFunction",
      value: function(e) {
        this.toiletMode != a.CleanMode.WOMAN_WASH && (this.toiletMode, a.CleanMode.AUTO_WOMAN_WASH)
      }
    }, {
      key: "_set06H",
      value: function() {
        this._setValue(6, 0)
      }
    }, {
      key: "_set17H",
      value: function(e) {
        this._setValue(23, e)
      }
    }, {
      key: "_set31H",
      value: function(e) {
        var t = new ArrayBuffer(12),
          s = new DataView(t);
        s.setUint8(6, 49), s.setUint8(7, e);
        var i = 0;
        i |= this.airTempLevel << 0, i |= this.waterTempLevel << 3, i |= this.gestureSwitch << 6, i |= this.autoCoverSwitch << 7, s.setUint8(8, i);
        var o = 0;
        2 == e || 3 == e ? (o |= this.womanWaterPressure - 1 << 0, o |= this.womanNozzlePosition - 1 << 3) : (o |= this.hipwashWaterPressure - 1 << 0, o |= this.hipwashNozzlePosition - 1 << 3), o |= this.nightLightSwitch << 6, o |= this.lightSensorSwitch << 7, s.setUint8(9, o);
        var h = 0,
          a = this.wideWashLevel;
        this.wideWashLevel > 0 && (a -= 1), h |= a << 0, h |= this.seatTempLevel << 3, h |= this.smartPowerSave << 6, h |= this.autoFlushSwitch << 7, s.setUint8(10, h);
        var l = this._updateDefaultValue(s);
        this.writeCommand(l.buffer)
      }
    }, {
      key: "_set32H",
      value: function() {
        this._setValue(50, 0)
      }
    }, {
      key: "_set33H",
      value: function(e) {
        this._setValue(51, e)
      }
    }, {
      key: "_set34H",
      value: function(e) {
        this._setValue(52, e)
      }
    }, {
      key: "_set35H",
      value: function(e) {
        this._setValue(53, e)
      }
    }, {
      key: "_set36H",
      value: function(e, t) {
        this._setValue(54, e, t)
      }
    }, {
      key: "_set37H",
      value: function(e) {
        this._setValue(55, e)
      }
    }, {
      key: "_set38H",
      value: function(e) {
        this._setValue(56, e)
      }
    }, {
      key: "_set39H",
      value: function(e, t) {
        this._setValue(57, e, t)
      }
    }, {
      key: "_set3AH",
      value: function(e, t) {
        this._setValue(58, e, t)
      }
    }, {
      key: "_set3BH",
      value: function(e) {
        this._setValue(59, e)
      }
    }, {
      key: "_set3CH",
      value: function(e) {
        this._setValue(60, e)
      }
    }, {
      key: "_set3DH",
      value: function(e) {
        this._setValue(61, e)
      }
    }, {
      key: "_set3EH",
      value: function(e) {
        this._setValue(62, e)
      }
    }, {
      key: "_set3FH",
      value: function(e, t) {
        var s = 255 & t,
          i = (65280 & t) >> 8;
        this._setValue(63, e, s, i)
      }
    }, {
      key: "_set40H",
      value: function(e, t) {
        this._setValue(64, e, t)
      }
    }, {
      key: "_set41H",
      value: function(e, t) {
        this._setValue(65, e, t)
      }
    }, {
      key: "_set42H",
      value: function(e) {
        this._setValue(66, 0)
      }
    }, {
      key: "_set43H",
      value: function(e) {
        this._setValue(67, e)
      }
    }, {
      key: "_set44H",
      value: function(e) {
        this._setValue(68, e)
      }
    }, {
      key: "_set45H",
      value: function(e, t) {
        var s = 255 & t,
          i = (65280 & t) >> 8;
        this._setValue(69, e, s, i)
      }
    }, {
      key: "_set46H",
      value: function(e) {
        this._setValue(70, e)
      }
    }, {
      key: "_set47H",
      value: function(e) {
        this._setValue(71, e)
      }
    }, {
      key: "_set48H",
      value: function(e) {
        this._setValue(72, e)
      }
    }, {
      key: "_set49H",
      value: function(e) {
        this._setValue(73, e)
      }
    }, {
      key: "_set4AH",
      value: function(e) {
        this._setValue(74, e)
      }
    }, {
      key: "_set4CH",
      value: function(e) {
        this._setValue(76, e)
      }
    }, {
      key: "_set4DH",
      value: function(e, t) {
        this._setValue(77, e, t)
      }
    }, {
      key: "_set4EH",
      value: function(e, t) {
        this._setValue(78, e, t)
      }
    }, {
      key: "_set4FH",
      value: function(e, t, s) {
        this._setValue(79, e, t, s)
      }
    }, {
      key: "_set50H",
      value: function(e, t) {
        this._setValue(80, e, t)
      }
    }, {
      key: "_set51H",
      value: function(e) {
        this._setValue(81, e)
      }
    }, {
      key: "_set52H",
      value: function(e, t) {
        this._setValue(82, e, t)
      }
    }, {
      key: "_set53H",
      value: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          s = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
          i = this.createStartCustomWashCmd(e, !0, t, s);
        this.writeCommand(i)
      }
    }, {
      key: "createStartCustomWashCmd",
      value: function(e) {
        var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
          s = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
          i = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
        t && (this.cleanModeId = e.cleanModeId, this.userId = e.userId);
        var o = e.type,
          h = e.move && 1 == e.move ? 1 : 0,
          a = e.wideWash && 1 == e.wideWash ? 1 : 0,
          l = e.cleanTime,
          n = e.dryTime,
          r = 0,
          u = this.getDeviceCleanModeId(e.cleanModeId),
          c = "男士快洗";
        switch (e.cleanModeId) {
          case 1:
            c = "童洗模式";
            break;
          case 2:
            c = "经期护理";
            break;
          case 3:
            c = "老人舒洗";
            break;
          case 4:
            c = "男士快洗";
            break;
          case 5:
            c = "女士柔洗";
            break;
          case 6:
            c = "快速助便"
        }
        console.log("定制模式: " + c + "; value = " + u);
        var g = 0,
          v = "臀洗";
        i ? (g = 7, v = "暖风") : 1 == o ? (g = 0, v = "臀洗") : 2 == o ? (g = 2, v = "妇洗") : 3 == o ? (g = 6, v = "助便洗") : 4 == o && (g = 0, r = 1, v = "强弱按摩洗"), console.log("清洗模式(水花): " + v + "; value = " + g), null != e.wideWashLevel && (this.wideWashLevel = e.wideWashLevel), null != e.womanWaterPressure && (this.womanWaterPressure = e.womanWaterPressure), null != e.womanNozzlePosition && (this.womanNozzlePosition = e.womanNozzlePosition), null != e.hipwashWaterPressure && (this.hipwashWaterPressure = e.hipwashWaterPressure), null != e.hipwashNozzlePosition && (this.hipwashNozzlePosition = e.hipwashNozzlePosition), null != e.waterTempLevel && (this.waterTempLevel = e.waterTempLevel), null != e.airTempLevel && (this.airTempLevel = e.airTempLevel);
        var m = 6,
          w = 9,
          S = new ArrayBuffer(m + w + 1),
          f = new DataView(S);
        f.setUint8(m + 0, 83), f.setUint8(m + 1, s ? 1 : 0), f.setUint8(m + 2, u), f.setUint8(m + 3, g);
        var d = 0;
        d |= e.airTempLevel << 0, d |= e.waterTempLevel << 3, d |= h << 6, d |= a << 7, f.setUint8(m + 4, d), console.log("风温 = " + e.airTempLevel), console.log("水温 = " + e.waterTempLevel), console.log("移动按摩开关 = " + h), console.log("宽幅清洗开关 = " + a);
        var p = 0;
        2 == g || 3 == g || 7 == g && (2 == e.cleanModeId || 5 == e.cleanModeId) ? (p |= e.womanWaterPressure - 1 << 0, p |= e.womanNozzlePosition - 1 << 3, console.log("妇洗水压 = " + (e.womanWaterPressure - 1)), console.log("喷嘴位置 = " + (e.womanNozzlePosition - 1))) : (p |= e.hipwashWaterPressure - 1 << 0, p |= e.hipwashNozzlePosition - 1 << 3, console.log("臀洗水压 = " + (e.hipwashWaterPressure - 1)), console.log("喷嘴位置 = " + (e.hipwashNozzlePosition - 1))), p |= r << 7, f.setUint8(m + 5, p), console.log("强弱按摩开关 = " + r);
        var b = 0;
        (b |= e.wideWashLevel << 0) > 0 && (b -= 1), f.setUint8(m + 6, b), console.log("幅度 = " + b);
        var y = 0;
        y = l / 60 & 255, console.log("清洗时长 = " + y + "分钟"), f.setUint8(m + 7, y);
        var B = 0;
        B = n / 60 & 255, console.log("烘干时长 = " + B + "分钟"), f.setUint8(m + 8, B);
        var P = this._updateDefaultValue(f);
        return P.buffer
      }
    }, {
      key: "_set61H",
      value: function(e) {
        this._setValue(97, e)
      }
    }, {
      key: "_set72H",
      value: function(e, t, s) {
        this._setValue(114, e, t, s)
      }
    }, {
      key: "_set73H",
      value: function(e, t, s) {
        var i = 255 & t,
          o = (65280 & t) >> 8,
          h = 255 & s,
          a = (65280 & s) >> 8;
        this._setValue(116, e, i, o, h, a)
      }
    }, {
      key: "_set74H",
      value: function(e, t, s, i) {
        var o = 255 & t,
          h = (65280 & t) >> 8;
        this._setValue(116, e, o, h, s, i)
      }
    }, {
      key: "_set79H",
      value: function(e, t, s, i, o) {
        var h = 255 & t,
          a = (65280 & t) >> 8;
        this._setValue(121, e, h, a, s, i, o)
      }
    }, {
      key: "_set7BH",
      value: function(e, t) {
        this._setValue(123, e, t)
      }
    }, {
      key: "_set89H",
      value: function(e, t) {
        this._setValue(137, e, t)
      }
    }, {
      key: "_set8AH",
      value: function(e, t, s, i) {
        this._setValue(138, e, t, s, i)
      }
    }, {
      key: "_set8BH",
      value: function(e) {
        this._setValue(139, e)
      }
    }, {
      key: "_set8CH",
      value: function(e) {
        this._setValue(140, e)
      }
    }, {
      key: "_setValue",
      value: function(e) {
        for (var t = 6, s = arguments.length, i = new Array(s > 1 ? s - 1 : 0), o = 1; o < s; o++) i[o - 1] = arguments[o];
        var h = 1 + i.length,
          a = new ArrayBuffer(t + h + 1),
          l = new DataView(a);
        l.setUint8(t, e), i.forEach((function(e, s) {
          l.setUint8(t + s + 1, e)
        }));
        var n = this._updateDefaultValue(l);
        this.writeCommand(n.buffer)
      }
    }, {
      key: "_updateDefaultValue",
      value: function(e) {
        e.setUint8(0, 252), e.setUint8(1, 0), e.setUint8(2, 64), e.setUint8(3, c.PHONE_ADDRESS), e.setUint8(4, c.TOILET_ADDRESS), e.setUint8(5, this.userId);
        var t = e.byteLength - 1;
        e.setUint8(t, 252);
        var s = this.calculateLightChecksum(e);
        e.setUint8(1, s);
        var i = u.ab2hex(e.buffer).toUpperCase(),
          o = u.encodeStr(i),
          h = u.hexStringToByteArray(o);
        return new DataView(h.buffer, h.byteOffset, h.byteLength)
      }
    }, {
      key: "calculateLightChecksum",
      value: function(e) {
        for (var t = 0, s = 2; s < e.byteLength - 1; s++) t += e.getUint8(s);
        return 255 & t
      }
    }, {
      key: "getErrorCode",
      value: function() {
        return 1 == this.flowAbnormal || 1 == this.inletOverTime || 1 == this.waterBoxSensorFault ? 1 : 1 == this.outletOverTemperature ? 2 : 1 == this.inletOverTemperature ? 3 : 1 == this.inletSensorFault ? 4 : 1 == this.outletSensorFault ? 5 : 1 == this.seatTempOver ? 6 : 1 == this.seatTempError ? 7 : 1 == this.ambientSensorFault ? 8 : 1 == this.filterInsufficient ? 20 : 1 == this.gearboxAbnormal ? 22 : 0
      }
    }, {
      key: "startSelfInspectTimer",
      value: function() {
        var e = this;
        this.clearSelfInspectTimer(), this.selfInspectDelayTimer = setTimeout((function() {
          e.isSelfInspectionReady = !0, null != e.msgValueChangeCallBack && e.msgValueChangeCallBack(null)
        }), 3e4)
      }
    }, {
      key: "clearSelfInspectTimer",
      value: function() {
        null != this.selfInspectDelayTimer && (clearTimeout(this.selfInspectDelayTimer), this.selfInspectDelayTimer = null)
      }
    }, {
      key: "startCountDown",
      value: function() {
        var e = this;
        null == this.queryTimer && (this.queryCountDown(), this.queryTimer = setInterval((function() {
          e.queryCountDown()
        }), 1e4))
      }
    }, {
      key: "stopCountDown",
      value: function() {
        null != this.queryTimer && (clearInterval(this.queryTimer), this.queryTimer = null)
      }
    }, {
      key: "closeBubbleTimer",
      value: function() {
        this.bubbleLockTimer && (clearTimeout(this.bubbleLockTimer), this.bubbleLockTimer = null), this.isBubbleEnable = !0
      }
    }, {
      key: "closeFlushTimer",
      value: function() {
        this.flushTimer && (this.isReflushEnable = !0, clearTimeout(this.flushTimer), this.flushTimer = null)
      }
    }, {
      key: "getDeviceCleanModeId",
      value: function(e) {
        var t = 1;
        switch (e) {
          case 1:
            t = 5;
            break;
          case 2:
            t = 3;
            break;
          case 3:
            t = 4;
            break;
          case 4:
            t = 1;
            break;
          case 5:
            t = 2;
            break;
          case 6:
            t = 6
        }
        return t
      }
    }, {
      key: "getLocalCleanModeId",
      value: function(e) {
        var t = 1;
        switch (e) {
          case 1:
            t = 4;
            break;
          case 2:
            t = 5;
            break;
          case 3:
            t = 2;
            break;
          case 4:
            t = 3;
            break;
          case 5:
            t = 1;
            break;
          case 6:
            t = 6
        }
        return t
      }
    }, {
      key: "getBitAtPosition",
      value: function(e, t) {
        return e >> t & 1
      }
    }, {
      key: "getByteValue",
      value: function(e, t, s) {
        return e >> t & Math.pow(2, s) - 1
      }
    }, {
      key: "byteToInt",
      value: function(e) {
        var t = 255 & e;
        return t >= 128 ? t - 256 : t
      }
    }, {
      key: "utf8ArrayToString",
      value: function(e) {
        for (var t = "", s = 0; s < e.length;) {
          var i = e[s++];
          if (i < 128) t += String.fromCharCode(i);
          else if (i >= 192 && i < 224) {
            var o = e[s++];
            t += String.fromCharCode((31 & i) << 6 | 63 & o)
          } else if (i >= 224 && i < 240) {
            var h = e[s++],
              a = e[s++];
            t += String.fromCharCode((15 & i) << 12 | (63 & h) << 6 | 63 & a)
          }
        }
        return t
      }
    }, {
      key: "isNumeric",
      value: function(e) {
        if ("string" != typeof e) return !1;
        var t = parseFloat(e);
        return !isNaN(t) && "" !== e.trim()
      }
    }, {
      key: "getCurrentTime",
      value: function() {
        var e = new Date,
          t = e.getFullYear(),
          s = e.getMonth() + 1,
          i = e.getDate(),
          o = e.getHours(),
          h = e.getMinutes() < 10 ? "0" + e.getMinutes() : e.getMinutes(),
          a = e.getSeconds() < 10 ? "0" + e.getSeconds() : e.getSeconds(),
          l = e.getTime().toString();
        return "[" + t + "/" + s + "/" + i + " " + o + ":" + h + ":" + a + ":" + l.substring(l.length - 3) + "]"
      }
    }, {
      key: "writeToiletSettingsToNFC",
      value: function() {
        var e = new ArrayBuffer(5),
          t = new Uint8Array(e);
        if (t[0] |= 0, t[0] |= this.autoFlushSwitch << 1, t[0] |= this.gestureSwitch << 2, t[0] |= this.autoCoverSwitch << 3, t[0] |= this.waterTempLevel << 4, console.log("------------- 写入遥控器(NFC)的参数 -------------"), console.log("光感夜灯开关：0"), console.log("自动冲刷开关：" + this.autoFlushSwitch), console.log("手势开关：" + this.gestureSwitch), console.log("自动翻盖开关：" + this.autoCoverSwitch), console.log("水温档位：" + this.waterTempLevel), t[1] |= this.seatTempLevel, this.hipwashNozzlePosition > 7) {
          var s = this.hipwashNozzlePosition - 8;
          t[1] |= 8, t[1] |= s << 4
        } else t[1] |= this.hipwashNozzlePosition << 4;
        if (t[1] |= this.smartPowerSave << 7, console.log("座温档位：" + this.seatTempLevel), console.log("臀洗喷嘴位置档位：" + this.hipwashNozzlePosition), console.log("节电开关：" + this.smartPowerSave), t[2] |= this.airTempLevel, this.hipwashWaterPressure > 7) {
          var i = this.hipwashWaterPressure - 8;
          t[2] |= 8, t[2] |= i << 4
        } else t[2] |= this.hipwashWaterPressure << 4;
        return t[2] |= this.lightSensorSwitch << 7, console.log("风温档位：" + this.airTempLevel), console.log("臀洗水压档位：" + this.hipwashWaterPressure), console.log("夜灯开关：" + this.lightSensorSwitch), t[3] |= this.womanWaterPressure, t[3] |= this.womanNozzlePosition << 4, console.log("妇洗水压档位：" + this.womanWaterPressure), console.log("妇洗喷嘴位置档位：" + this.womanNozzlePosition), t[4] |= this.uvWaterDisinfectSwitch << 0, t[4] |= this.autoSmallFlushSwitch << 1, t[4] |= this.isBuzzerEnable << 2, t[4] |= this.isSeatTooLong << 3, t[4] |= this.preWettingSwitch << 4, t[4] |= this.openLoopBubble << 5, t[4] |= (this.autoBubble ? 1 : 0) << 6, t[4] |= this.footSensorSwitch << 7, console.log("UV杀菌开关：" + this.uvWaterDisinfectSwitch), console.log("自动小冲开关：" + this.autoSmallFlushSwitch), console.log("蜂鸣器开关：" + this.isBuzzerEnable), console.log("久坐提醒开关：" + this.isSeatTooLong), console.log("预湿润开关：" + this.preWettingSwitch), console.log("开圈发泡开关：" + this.openLoopBubble), console.log("落座发泡开关：" + (this.autoBubble ? 1 : 0)), console.log("脚感开关：" + this.footSensorSwitch), e
      }
    }, {
      key: "getCurrentWashParams",
      value: function(e) {
        return [this.isStrongWeakMessage ? 1 : 0, this.wideWashMode, this.wideWashLevel, this.waterTempLevel, e == a.CleanMode.WOMAN_WASH || e == a.CleanMode.AUTO_WOMAN_WASH ? this.womanWaterPressure : this.hipwashWaterPressure, e == a.CleanMode.WOMAN_WASH || e == a.CleanMode.AUTO_WOMAN_WASH ? this.womanNozzlePosition : this.hipwashNozzlePosition, this.windSwing, this.airTempLevel, this.windSpeedLevel]
      }
    }, {
      key: "isBeforeProtocolVersion",
      value: function(e, t) {
        return this.protocolVersionNO1 < e || this.protocolVersionNO1 == e && this.protocolVersionNO2 < t
      }
    }], [{
      key: "getInstance",
      value: function() {
        return this._singleton || (this._singleton = new c), this._singleton
      }
    }]), c
  }(n.default);
c.TOILET_ADDRESS = 0, c.PHONE_ADDRESS = 1, c.BROAD_ADDRESS = 255;
var g = c;
exports.default = g;