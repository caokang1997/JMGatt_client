Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var t = require("../../../@babel/runtime/helpers/classCallCheck"),
  e = require("../../../@babel/runtime/helpers/createClass"),
  i = require("../../../@babel/runtime/helpers/get"),
  s = require("../../../@babel/runtime/helpers/getPrototypeOf"),
  o = require("../../../@babel/runtime/helpers/inherits"),
  n = require("../../../@babel/runtime/helpers/createSuper"),
  l = require("../../../config/toilet_enum.js"),
  r = h(require("../../debuglog.js")),
  a = h(require("../ota/TechramicOTAToiletController.js"));

function h(t) {
  return t && t.__esModule ? t : {
    default: t
  }
}
var u = require("../bleutil.js"),
  c = function(a) {
    o(c, a);
    var h = n(c);

    function c() {
      var e;
      t(this, c);
      for (var i = arguments.length, s = new Array(i), o = 0; o < i; o++) s[o] = arguments[o];
      return (e = h.call.apply(h, [this].concat(s))).isSelfInspectionReady = !0, e.selfInspectDelayTimer = null, e.onQuaryReadyCallback = null, e.mac = null, e.jmZtmxm = null, e.isDeviceReady = !1, e.deviceInfo = {}, e.workState = 0, e.isAutoMode = 0, e.isWaterSpray = 0, e.errorCodes = [], e.flowAbnormal = 0, e.outletOverTemperature = 0, e.inletOverTemperature = 0, e.inletOverTime = 0, e.inletSensorFault = 0, e.outletSensorFault = 0, e.waterBoxSensorFault = 0, e.voltageDetectionFault = 0, e.brightnessSensorFault = 0, e.seatTempOver = 0, e.warmAirOver = 0, e.ambientSensorFault = 0, e.seatTempError = 0, e.warmAirSensorFault = 0, e.bubbleModuleFault = 0, e.washoutFault = 0, e.gearboxAbnormal = 0, e.isPreWetting = 0, e.isHibernating = 0, e.isOnSeat = 0, e.coverOn = 0, e.ringOn = 0, e.coverRun = 0, e.ringRun = 0, e.flushLargeSwitch = 0, e.flushSmallSwitch = 0, e.isReflushEnable = !0, e.seatTempLevel = 0, e.autoBubble = 0, e.openLoopBubble = 0, e.foamTimeOnBrushRing = 6, e.autoCoverSwitch = 0, e.regularFlushSwitch = 0, e.autoFlushSwitch = 0, e.autoCloseCoverWithFlushSwitch = 0, e.autoSmallFlushSwitch = 0, e.footSensorSwitch = 0, e.atmosphereLightSwitch = 0, e.atmosphereLightBrightness = 0, e.nightLightSwitch = 0, e.lightSensorSwitch = 0, e.preWettingSwitch = 0, e.autoTemp = 0, e.smartPowerSave = 0, e.autoCoverSensitive = 0, e.flipSenseDistance = 0, e.filterLifeAlarmEnable = 0, e.uvWaterDisinfectSwitch = 0, e.autoDeodorization = 0, e.bubbleSwitch = 0, e.isSelfClean = 0, e.isBubbleEnable = !0, e.bubbleDisableReason = 0, e.startBubbleTime = null, e.bubbleLockTimer = null, e.hardwareVersion = null, e.mcuSoftwareVersion = null, e.mcuSoftwareNumVersion = -1, e.isBuzzerEnable = 1, e.isSeatTooLong = 0, e
    }
    return e(c, [{
      key: "initDevice",
      value: function() {
        this.isDeviceReady = !1, this.isSelfInspectionReady = !0, this.workState = 0, this.errorCodes = [], this.isSelfClean = 0, this.flowAbnormal = 0, this.outletOverTemperature = 0, this.inletOverTemperature = 0, this.inletOverTime = 0, this.inletSensorFault = 0, this.outletSensorFault = 0, this.waterBoxSensorFault = 0, this.voltageDetectionFault = 0, this.brightnessSensorFault = 0, this.seatTempOver = 0, this.warmAirOver = 0, this.ambientSensorFault = 0, this.seatTempError = 0, this.warmAirSensorFault = 0, this.bubbleModuleFault = 0, this.washoutFault = 0, this.gearboxAbnormal = 0, this.isHibernating = 0, this.isPreWetting = 0, this.isOnSeat = 0, this.coverOn = 0, this.ringOn = 0, this.coverRun = 0, this.ringRun = 0, this.flushLargeSwitch = 0, this.flushSmallSwitch = 0, this.isReflushEnable = !0, this.seatTempLevel = 0, this.autoBubble = 0, this.openLoopBubble = 0, this.foamTimeOnBrushRing = 6, this.autoCoverSwitch = 0, this.autoFlushSwitch = 0, this.autoCloseCoverWithFlushSwitch = 0, this.autoSmallFlushSwitch = 0, this.footSensorSwitch = 0, this.atmosphereLightSwitch = 0, this.atmosphereLightBrightness = 0, this.nightLightSwitch = 0, this.lightSensorSwitch = 0, this.preWettingSwitch = 0, this.autoCoverSensitive = 0, this.flipSenseDistance = 0, this.uvWaterDisinfectSwitch = 0, this.filterLifeAlarmEnable = 0, this.autoDeodorization = 0, this.regularFlushSwitch = 0, this.smartPowerSave = 0, this.bubbleSwitch = 0, this.startBubbleTime = null, this.bubbleLockTimer = null, this.hardwareVersion = null, this.mcuSoftwareVersion = null, this.mcuSoftwareNumVersion = -1, this.isBuzzerEnable = 1, this.isSeatTooLong = 0
      }
    }, {
      key: "setDeviceInfo",
      value: function(t) {
        this.deviceInfo = t
      }
    }, {
      key: "setOnQuaryReadyCallback",
      value: function(t) {
        this.onQuaryReadyCallback = t
      }
    }, {
      key: "quaryVersionInfo",
      value: function(t) {
        this._setSingleValue(1, t)
      }
    }, {
      key: "quaryDeviceState",
      value: function() {
        this._setSingleValue(17, 0)
      }
    }, {
      key: "setNightLightSwitch",
      value: function(t) {
        this._set41H(0, t)
      }
    }, {
      key: "setLightSensor",
      value: function(t) {
        this._set40H(2, t)
      }
    }, {
      key: "setSmartPowerSave",
      value: function(t) {
        this._set40H(3, t)
      }
    }, {
      key: "setAutoTemp",
      value: function(t) {
        this._set40H(15, t)
      }
    }, {
      key: "setSeatTooLong",
      value: function(t) {
        this.isSeatTooLong = t ? 1 : 0, this._set40H(26, t ? 1 : 0)
      }
    }, {
      key: "setAutoCover",
      value: function(t) {
        this.autoCoverSwitch = t ? 1 : 0, this._set40H(0, t)
      }
    }, {
      key: "setOpenLoopBubble",
      value: function(t) {
        this.openLoopBubble = t ? 1 : 0, this._set40H(17, t)
      }
    }, {
      key: "setAutoBubble",
      value: function(t) {
        this._set40H(12, t)
      }
    }, {
      key: "setPreWetting",
      value: function(t) {
        this._set40H(18, t)
      }
    }, {
      key: "setAutoFlush",
      value: function(t) {
        this._set40H(5, t)
      }
    }, {
      key: "setAutoCloseCoverWithFlush",
      value: function(t) {
        this.autoCloseCoverWithFlushSwitch = t ? 1 : 0, this._set40H(20, t)
      }
    }, {
      key: "setAutoSmallFlush",
      value: function(t) {
        this.autoSmallFlushSwitch = t ? 1 : 0, this._set40H(19, t)
      }
    }, {
      key: "setAutoFootSensor",
      value: function(t) {
        this._set40H(14, t)
      }
    }, {
      key: "setAutoUvWaterDisinfect",
      value: function(t) {
        this.uvWaterDisinfectSwitch = t ? 1 : 0, this._set40H(7, t ? 1 : 0)
      }
    }, {
      key: "setAutoDeodorization",
      value: function(t) {
        this.autoDeodorization = t ? 1 : 0;
        var e = this.deviceInfo.deodorizationType;
        1 === e ? (console.log("自动除臭开关（铂金）：" + (t ? "开" : "关")), this._set40H(10, t ? 1 : 0)) : 2 === e && (console.log("自动除臭开关（触媒）：" + (t ? "开" : "关")), this._set40H(21, t ? 1 : 0))
      }
    }, {
      key: "setRegularFlush",
      value: function(t) {
        this.regularFlushSwitch = t ? 1 : 0, this._set40H(23, t)
      }
    }, {
      key: "setAutoCloseSensitive",
      value: function(t) {
        this.autoCoverSensitive = t, 0 == t ? this._set47H(0) : this._set47H(1)
      }
    }, {
      key: "setFlipSenseDistance",
      value: function(t) {
        this.flipSenseDistance = t, this._set48H(t)
      }
    }, {
      key: "openLightNight",
      value: function(t) {
        this._set41H(0, t)
      }
    }, {
      key: "setAtmosphereLight",
      value: function(t) {
        this.atmosphereLightSwitch = t ? 1 : 0, this._set72H(1, 0, t ? 1 : 0)
      }
    }, {
      key: "setAtmosphereLightBrightness",
      value: function(t) {
        this.atmosphereLightBrightness = t, console.log("氛围灯亮度值：" + t), this._set74H(0, 0, 0, t)
      }
    }, {
      key: "setFoamTimeOnBrushRing",
      value: function(t) {
        this.foamTimeOnBrushRing = t, this._set3FH(5, t)
      }
    }, {
      key: "startSelfClean",
      value: function(t) {
        this.isSelfClean = t ? 1 : 0, this._set61H(this.isSelfClean)
      }
    }, {
      key: "stopCleanMode",
      value: function(t) {
        this.isSelfClean = 0, this._set32H(0)
      }
    }, {
      key: "startCover",
      value: function(t) {
        console.log("=启动翻盖"), this.startFlushTime = (new Date).getTime(), this._setSingleValue(51, t ? 1 : 0)
      }
    }, {
      key: "startRing",
      value: function(t) {
        console.log("=启动翻圈"), this.startFlushTime = (new Date).getTime(), this._setSingleValue(52, t ? 1 : 0)
      }
    }, {
      key: "startFlushLarge",
      value: function() {
        console.log("=启动大冲"), this.startFlushTime = (new Date).getTime(), this._setSingleValue(53, 2)
      }
    }, {
      key: "startFlushSmall",
      value: function() {
        console.log("=启动小冲"), this.startFlushTime = (new Date).getTime(), this._setSingleValue(53, 1)
      }
    }, {
      key: "startBubble",
      value: function() {
        console.log("=启动智力泡"), this.startBubble1(!0)
      }
    }, {
      key: "startBubble1",
      value: function(t) {
        console.log("=启动智力泡"), this._setSwitch(70, t)
      }
    }, {
      key: "startHibernate",
      value: function(t) {
        console.log("=启动休眠"), this._setSwitch(23, t)
      }
    }, {
      key: "setSeatTemp",
      value: function(t) {
        this._setSingleValue(60, t)
      }
    }, {
      key: "setRestoreFactorySettings",
      value: function() {
        this._set06H()
      }
    }, {
      key: "startSelfInspectTimer",
      value: function() {
        var t = this;
        this.clearSelfInspectTimer(), this.selfInspectDelayTimer = setTimeout((function() {
          t.isSelfInspectionReady = !0, null != t.msgValueChangeCallBack && t.msgValueChangeCallBack(null)
        }), 3e4)
      }
    }, {
      key: "clearSelfInspectTimer",
      value: function() {
        null != this.selfInspectDelayTimer && (clearTimeout(this.selfInspectDelayTimer), this.selfInspectDelayTimer = null)
      }
    }, {
      key: "onDeviceReady",
      value: function(t) {
        var e = this;
        i(s(c.prototype), "onDeviceReady", this).call(this, t), setTimeout((function() {
          e.quaryDeviceState()
        }), 1e3), setTimeout((function() {
          e.quaryVersionInfo(), null != e.onQuaryReadyCallback && e.onQuaryReadyCallback()
        }), 1500)
      }
    }, {
      key: "onMsgValueChange",
      value: function(t) {
        i(s(c.prototype), "onMsgValueChange", this).call(this, t), console.log("收到消息上报");
        var e = t.value;
        console.log("============= 消息监听通知 =============\n", u.ab2hex(e));
        var o = new Uint8Array(e);
        if (t.characteristicId !== this.notifyComUUID) {
          if (!(o.length < 8 || 252 != o[0] || 252 != o[o.length - 1])) {
            var n = u.ab2hex(e).toUpperCase(),
              l = u.decodeStr(n);
            48 == (o = u.hexStringToByteArray(l))[6] ? (console.log("30指令上报"), this.dealWith30(o)) : 1 == o[6] ? (console.log("01指令上报"), this.dealWith01(o)) : 96 == o[6] ? (console.log("60指令上报"), this.dealWith60(o)) : console.log("其他应答指令"), null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(u.ab2hex(e))
          }
        } else {
          if (o.length < 4 || 250 != o[0]) return;
          this.dealWithCustomProtocol(o)
        }
      }
    }, {
      key: "dealWithCustomProtocol",
      value: function(t) {
        2 == t[2] && (this.model = u.ab2hexFromStart(t, 6, 3))
      }
    }, {
      key: "getByteValue",
      value: function(t, e, i) {
        return t >> e & Math.pow(2, i) - 1
      }
    }, {
      key: "dealWith01",
      value: function(t) {
        console.log("---- 01 指令 ----");
        var e = t[7];
        r.default.info("组件类别 = ", e);
        var i = t[8],
          s = t.slice(9, 9 + i);
        this.hardwareVersion = this.utf8ArrayToString(s), r.default.info("硬件版本：" + this.hardwareVersion);
        var o = t[9 + i],
          n = t.slice(9 + i + 1, 9 + i + 1 + o);
        this.mcuSoftwareVersion = this.utf8ArrayToString(n), r.default.info("固件版本：" + this.mcuSoftwareVersion);
        var l = -1;
        if (this.mcuSoftwareVersion && "string" == typeof this.mcuSoftwareVersion) {
          r.default.info("固件版本是字符串");
          var a = this.mcuSoftwareVersion.split("_");
          if (a.length >= 1) {
            var h = a[0];
            console.log("versionStr = " + h);
            var u = h;
            (h.startsWith("V") || h.startsWith("v")) && (u = h.slice(1, h.length)), console.log("versionNumStr = " + u), this.isNumeric(u) && (l = Number(u))
          }
        }
        console.log("version = " + l), this.mcuSoftwareNumVersion = l, this.stopVersionTimer(), this.retryVersionCount = 0
      }
    }, {
      key: "dealWith60",
      value: function(t) {
        console.log("---- 60 指令 ----");
        t[7];
        var e = t[13];
        this.isSeatTooLong = this.getBitAtPosition(e, 1), console.log("久坐提醒 = " + this.isSeatTooLong), this.regularFlushSwitch = this.getBitAtPosition(e, 6), console.log("定期冲刷 = " + this.regularFlushSwitch);
        var i = t[15];
        this.foamTimeOnBrushRing = i, console.log("发泡剩余时间 = " + this.foamTimeOnBrushRing);
        var s = t[18];
        this.atmosphereLightBrightness = s, console.log("氛围灯亮度 = ", this.atmosphereLightBrightness)
      }
    }, {
      key: "dealWith30",
      value: function(t) {
        console.log("---- 30 指令 ----");
        var e = t[7];
        this.isAutoMode = this.getBitAtPosition(e, 7), this.isWaterSpray = this.getBitAtPosition(e, 6), this.workState = this.getByteValue(e, 0, 5), console.log("工作状态 = ", this.workState), this.isSelfInspectionReady = 31 != this.workState, this.isSelfInspectionReady ? this.clearSelfInspectTimer() : this.startSelfInspectTimer(), console.log("是否设备就绪 = ", this.isSelfInspectionReady), this.isPreWetting = 17 == this.workState ? 1 : 0, console.log("是否预湿润中 = ", this.isPreWetting), this.isHibernating = 1 == this.workState ? 1 : 0, console.log("是否休眠中 = ", this.isHibernating), this.isSelfClean = 16 == this.workState ? 1 : 0, console.log("自清洁 = ", this.isSelfClean);
        var i = t[8],
          s = [];
        this.getBitAtPosition(i, 6) ? (console.log("流量异常"), this.flowAbnormal = 1, s.push(l.ErrorTypes.TRAFFIC_ABNORMAL)) : this.flowAbnormal = 0, this.getBitAtPosition(i, 5) ? (console.log("出水超温"), this.outletOverTemperature = 1, s.push(l.ErrorTypes.OUTLET_OVERTEMP)) : this.outletOverTemperature = 0, this.getBitAtPosition(i, 4) ? (console.log("进水超温"), this.inletOverTemperature = 1, s.push(l.ErrorTypes.INLET_OVERTEMP)) : this.inletOverTemperature = 0, this.getBitAtPosition(i, 3) ? (console.log("进水超时"), this.inletOverTime = 1, s.push(l.ErrorTypes.INLET_OVERTIME)) : this.inletOverTime = 0, this.getBitAtPosition(i, 2) ? (console.log("出水传感器故障"), this.outletSensorFault = 1, s.push(l.ErrorTypes.OUTLET_SENSOR_FAULT)) : this.outletSensorFault = 0, this.getBitAtPosition(i, 1) ? (console.log("水箱传感器故障"), this.waterBoxSensorFault = 1, s.push(l.ErrorTypes.TANK_SENSOR_FAULT)) : this.waterBoxSensorFault = 0, this.getBitAtPosition(i, 0) ? (console.log("进水传感器故障"), this.inletSensorFault = 1, s.push(l.ErrorTypes.INLET_SENSOR_FAULT)) : this.inletSensorFault = 0;
        var o = t[9];
        this.getBitAtPosition(o, 7) ? (console.log("电压检测故障"), this.voltageDetectionFault = 1, s.push(l.ErrorTypes.VOLTAGE_DETECT_FAULT)) : this.voltageDetectionFault = 0, this.getBitAtPosition(o, 6) ? (console.log("亮度传感器故障"), this.brightnessSensorFault = 1, s.push(l.ErrorTypes.BRIGHTNESS_SENSOR_FAULT)) : this.brightnessSensorFault = 0, this.getBitAtPosition(o, 5) ? (console.log("座圈超温"), this.seatTempOver = 1, s.push(l.ErrorTypes.SEAT_OVERTEMP)) : this.seatTempOver = 0, this.getBitAtPosition(o, 4) ? (console.log("暖风超温"), this.warmAirOver = 1, s.push(l.ErrorTypes.DRY_OVERTEMP)) : this.warmAirOver = 0, this.getBitAtPosition(o, 2) ? (console.log("环温传感器故障"), this.ambientSensorFault = 1, s.push(l.ErrorTypes.AMBIENT_SENSOR_FAULT)) : this.ambientSensorFault = 0, this.getBitAtPosition(o, 1) ? (console.log("座圈传感器故障"), this.seatTempError = 1, s.push(l.ErrorTypes.SEAT_SENSOR_FAULT)) : this.seatTempError = 0, this.getBitAtPosition(o, 0) ? (console.log("暖风传感器故障"), this.warmAirSensorFault = 1, s.push(l.ErrorTypes.DRY_SENSOR_FAULT)) : this.warmAirSensorFault = 0;
        var n = t[10];
        this.getBitAtPosition(n, 7) ? (console.log("智力泡模块故障"), this.bubbleModuleFault = 1, s.push(l.ErrorTypes.BUBBLE_MODULE_FAULT)) : this.bubbleModuleFault = 0, this.getBitAtPosition(n, 6) ? (console.log("冲刷缺故障"), this.washoutFault = 1, s.push(l.ErrorTypes.FLUSH_MODULE_FAULT)) : this.washoutFault = 0, this.getBitAtPosition(n, 5) ? (console.log("齿轮箱异常"), this.gearboxAbnormal = 1, s.push(l.ErrorTypes.ABNORMAL_GEARBOX)) : this.gearboxAbnormal = 0, this.errorCodes = s;
        var r = t[11];
        this.deviceInfo.use30B5AsSmartPowerSave && (this.smartPowerSave = this.getBitAtPosition(r, 0), console.log("智能节电=", this.smartPowerSave)), this.footSensorSwitch = this.getBitAtPosition(r, 3), console.log("脚感控制=", this.footSensorSwitch), this.coverOn = this.getBitAtPosition(r, 4), console.log("盖板状态=", this.coverOn), this.ringOn = this.getBitAtPosition(r, 5), console.log("座圈状态=", this.ringOn), this.isOnSeat = this.getBitAtPosition(r, 7), console.log("着座状态 =", this.isOnSeat);
        var a = t[12];
        this.flushLargeSwitch = 2 == (a >> 0 & 3) ? 1 : 0, console.log("大冲 =", this.flushLargeSwitch), this.flushSmallSwitch = 1 == (a >> 0 & 3) ? 1 : 0, console.log("小冲 =", this.flushSmallSwitch), this.autoTemp = this.getBitAtPosition(a, 2), console.log("四季温感 =", this.autoTemp), this.uvWaterDisinfectSwitch = this.getBitAtPosition(a, 5), console.log("UV杀菌 =", this.uvWaterDisinfectSwitch);
        var h = t[13];
        this.preWettingSwitch = this.getBitAtPosition(h, 2), this.isReflushEnable = 1 == this.getBitAtPosition(h, 7), this.autoCloseCoverWithFlushSwitch = this.getBitAtPosition(h, 4), this.autoSmallFlushSwitch = this.getBitAtPosition(h, 3), console.log("预润湿 =", this.preWettingSwitch), console.log("关盖冲厕 =", this.autoCloseCoverWithFlushSwitch), console.log("自动小冲 =", this.autoSmallFlushSwitch), console.log("蓄水状态 =", this.isReflushEnable), this.coverRun = this.getBitAtPosition(h, 1), console.log("翻盖中状态 = ", this.coverRun), this.ringRun = this.getBitAtPosition(h, 0), console.log("翻圈中状态 = ", this.ringRun);
        var u = t[15];
        this.autoCoverSwitch = this.getBitAtPosition(u, 7), console.log("自动翻盖 = ", this.autoCoverSwitch);
        var c = t[16];
        this.nightLightSwitch = this.getBitAtPosition(c, 6), console.log("夜灯开关 = ", this.nightLightSwitch), this.lightSensorSwitch = this.getBitAtPosition(c, 7), console.log("光感夜灯 =", this.lightSensorSwitch);
        var g = t[17];
        this.autoFlushSwitch = this.getBitAtPosition(g, 7), console.log("自动冲刷 =", this.autoFlushSwitch), this.seatTempLevel = g >> 3 & 7, console.log("座温 =", this.seatTempLevel), this.deviceInfo.use30B5AsSmartPowerSave || (this.smartPowerSave = this.getBitAtPosition(g, 6), console.log("智能节电=", this.smartPowerSave));
        var S = t[20];
        this.openLoopBubble = this.getBitAtPosition(S, 3), console.log("开圈发泡 = ", this.openLoopBubble), this.autoBubble = this.getBitAtPosition(S, 4), console.log("自动发泡 = ", this.autoBubble);
        var v = this.getBitAtPosition(S, 5);
        this.bubbleSwitch = v, console.log("发泡中 = ", this.bubbleSwitch);
        var f = t[21];
        this.flipSenseDistance = f >> 4 & 15, console.log("自动翻盖感应距离 = ", this.flipSenseDistance);
        var m = t[22];
        this.atmosphereLightSwitch = 0 == (m >> 4 & 3) ? 0 : 1, console.log("氛围灯开关 = ", this.atmosphereLightSwitch), this.autoCoverSensitive = this.getBitAtPosition(m, 6), console.log("翻盖灵敏度 = ", this.autoCoverSensitive);
        var p = t[24];
        switch (this.deviceInfo.deodorizationType) {
          case 1:
            this.autoDeodorization = this.getBitAtPosition(p, 0), console.log("自动除臭开关(铂金) = ", this.autoDeodorization);
            break;
          case 2:
            this.autoDeodorization = this.getBitAtPosition(p, 1), console.log("自动除臭开关(触媒) = ", this.autoDeodorization)
        }
      }
    }, {
      key: "writeDeviceInfo",
      value: function(t) {
        var e = new ArrayBuffer(10),
          i = new DataView(e);
        i.setUint8(0, 250), i.setUint8(1, e.byteLength), i.setUint8(2, 1), i.setUint8(3, 5), i.setUint8(4, 1), i.setUint8(5, 1);
        for (var s = 6, o = 0; o < t.length; o += 2) {
          var n = parseInt(t.substr(o, 2), 16);
          i.setUint8(s, n), s += 1
        }
        var l = this.calculateCommunicateChecksum(i);
        i.setUint8(9, l), this.writeCommunicateCommand(e)
      }
    }, {
      key: "readDeviceInfo",
      value: function() {
        var t = new ArrayBuffer(4),
          e = new DataView(t);
        e.setUint8(0, 250), e.setUint8(1, t.byteLength), e.setUint8(2, 2);
        var i = this.calculateCommunicateChecksum(e);
        e.setUint8(3, i), this.writeCommunicateCommand(t)
      }
    }, {
      key: "closeBubbleTimer",
      value: function() {
        this.bubbleLockTimer && (clearTimeout(this.bubbleLockTimer), this.bubbleLockTimer = null)
      }
    }, {
      key: "startConnect",
      value: function(t, e) {
        this.isDeviceReady = !1, this.closeBubbleTimer(), i(s(c.prototype), "startConnect", this).call(this, t, e)
      }
    }, {
      key: "stopConnnect",
      value: function() {
        this.isDeviceReady = !1, this.closeBubbleTimer(), i(s(c.prototype), "stopConnnect", this).call(this)
      }
    }, {
      key: "queryToiletMCUVersionWithA1A0",
      value: function() {}
    }, {
      key: "_set06H",
      value: function() {
        this._setSingleValue(6, 0)
      }
    }, {
      key: "_set32H",
      value: function() {
        this._setSingleValue(50, 0)
      }
    }, {
      key: "_set3FH",
      value: function(t, e) {
        var i = 255 & e,
          s = (65280 & e) >> 8;
        this._setThreeValue(63, t, i, s)
      }
    }, {
      key: "_set40H",
      value: function(t, e) {
        this._setDoubleValue(64, t, e)
      }
    }, {
      key: "_set41H",
      value: function(t, e) {
        this._setDoubleValue(65, t, e)
      }
    }, {
      key: "_set47H",
      value: function(t) {
        this._setSingleValue(71, t)
      }
    }, {
      key: "_set48H",
      value: function(t) {
        this._setSingleValue(72, t)
      }
    }, {
      key: "_set61H",
      value: function(t) {
        this._setSingleValue(97, t)
      }
    }, {
      key: "_set72H",
      value: function(t, e, i) {
        this._setThreeValue(114, t, e, i)
      }
    }, {
      key: "_set74H",
      value: function(t, e, i, s) {
        var o = 255 & e,
          n = (65280 & e) >> 8;
        this._setFiveValue(116, t, o, n, i, s)
      }
    }, {
      key: "_setSwitch",
      value: function(t, e) {
        this._setSingleValue(t, e ? 1 : 0)
      }
    }, {
      key: "_setSingleValue",
      value: function(t, e) {
        var i = new ArrayBuffer(9),
          s = new DataView(i);
        s.setUint8(6, t), s.setUint8(7, e), this._updateDefaultValue(s), this.writeCommand(i)
      }
    }, {
      key: "_setDoubleValue",
      value: function(t, e, i) {
        var s = new ArrayBuffer(10),
          o = new DataView(s);
        o.setUint8(6, t), o.setUint8(7, e), o.setUint8(8, i ? 1 : 0), this._updateDefaultValue(o), this.writeCommand(s)
      }
    }, {
      key: "_setThreeValue",
      value: function(t, e, i, s) {
        var o = new ArrayBuffer(11),
          n = new DataView(o);
        n.setUint8(6, t), n.setUint8(7, e), n.setUint8(8, i), n.setUint8(9, s), this._updateDefaultValue(n), this.writeCommand(o)
      }
    }, {
      key: "_setFiveValue",
      value: function(t, e, i, s, o, n) {
        var l = new ArrayBuffer(13),
          r = new DataView(l);
        r.setUint8(6, t), r.setUint8(7, e), r.setUint8(8, i), r.setUint8(9, s), r.setUint8(10, o), r.setUint8(11, n), this._updateDefaultValue(r), this.writeCommand(l)
      }
    }, {
      key: "_updateDefaultValue",
      value: function(t) {
        t.setUint8(0, 252), t.setUint8(1, 0), t.setUint8(2, c.PHONE_ADDRESS), t.setUint8(3, c.TOILET_ADDRESS), t.setUint8(4, 0), t.setUint8(5, 0);
        var e = t.byteLength - 1;
        t.setUint8(e, 252);
        var i = this.calculateLightChecksum(t);
        t.setUint8(1, i)
      }
    }, {
      key: "calculateLightChecksum",
      value: function(t) {
        for (var e = 0, i = 2; i < t.byteLength - 1; i++) e += t.getUint8(i);
        return 255 & e
      }
    }, {
      key: "getErrorCodes",
      value: function() {
        var t = [];
        return 1 == this.flowAbnormal && t.push(1), 1 == this.outletOverTemperature && t.push(2), 1 == this.inletOverTemperature && t.push(3), 1 == this.inletSensorFault && t.push(4), 1 == this.outletSensorFault && t.push(5), 1 == this.seatTempOver && t.push(6), 1 == this.seatTempError && t.push(7), 1 == this.ambientSensorFault && t.push(8), t
      }
    }, {
      key: "getErrorCode",
      value: function() {
        return 1 == this.flowAbnormal ? 1 : 1 == this.outletOverTemperature ? 2 : 1 == this.inletOverTemperature ? 3 : 1 == this.inletSensorFault ? 4 : 1 == this.outletSensorFault ? 5 : 1 == this.seatTempOver ? 6 : 1 == this.seatTempError ? 7 : 1 == this.ambientSensorFault ? 8 : 1 == this.filterInsufficient ? 20 : 1 == this.gearboxAbnormal ? 22 : 0
      }
    }, {
      key: "getBitAtPosition",
      value: function(t, e) {
        return t >> e & 1
      }
    }, {
      key: "utf8ArrayToString",
      value: function(t) {
        for (var e = "", i = 0; i < t.length;) {
          var s = t[i++];
          if (s < 128) e += String.fromCharCode(s);
          else if (s >= 192 && s < 224) {
            var o = t[i++];
            e += String.fromCharCode((31 & s) << 6 | 63 & o)
          } else if (s >= 224 && s < 240) {
            var n = t[i++],
              l = t[i++];
            e += String.fromCharCode((15 & s) << 12 | (63 & n) << 6 | 63 & l)
          }
        }
        return e
      }
    }, {
      key: "isNumeric",
      value: function(t) {
        if ("string" != typeof t) return !1;
        var e = parseFloat(t);
        return !isNaN(e) && "" !== t.trim()
      }
    }], [{
      key: "getInstance",
      value: function() {
        return this._singleton || (this._singleton = new c), this._singleton
      }
    }]), c
  }(a.default);
c.TOILET_ADDRESS = 0, c.PHONE_ADDRESS = 1, c.BROAD_ADDRESS = 255;
var g = c;
exports.default = g;