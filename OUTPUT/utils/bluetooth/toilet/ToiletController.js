Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ab2hex = d, exports.default = void 0;
var e = require("../../../@babel/runtime/helpers/classCallCheck"),
  t = require("../../../@babel/runtime/helpers/createClass"),
  i = require("../../../@babel/runtime/helpers/get"),
  s = require("../../../@babel/runtime/helpers/getPrototypeOf"),
  a = require("../../../@babel/runtime/helpers/inherits"),
  n = require("../../../@babel/runtime/helpers/createSuper"),
  l = (u(require("../BLEController.js")), require("../../../config/toilet_enum.js")),
  h = u(require("../../../utils/debuglog.js")),
  o = u(require("../ota/OTAToiletController.js"));

function u(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}
var r = require("../../bluetooth/bleutil.js");

function d(e) {
  return Array.prototype.map.call(new Uint8Array(e), (function(e) {
    return ("00" + e.toString(16)).slice(-2)
  })).join("")
}
var c = function(o) {
  a(c, o);
  var u = n(c);

  function c() {
    var t;
    e(this, c);
    for (var i = arguments.length, s = new Array(i), a = 0; a < i; a++) s[a] = arguments[a];
    return (t = u.call.apply(u, [this].concat(s))).jmZtmxm = "000000", t.onQuaryReadyCallback = null, t.deviceInfo = {}, t.E2Ready = !1, t.FAReady = !1, t.E9Ready = !1, t.DEFAULT_WIDE_WASH_LEVEL = 3, t.hasWindSpeed = !1, t.useE9Cover = !1, t.useE2CoverRing = !0, t.hasSelfClean = !1, t.hasReplaceNozzle = !1, t.isSelfInspectionReady = !1, t.isLatestWomanMode = !1, t.latestAutoCleanMode = 0, t.selectedCustomModes = [1, 3, 4, 6], t.isDeviceReady = !1, t.cleanModeId = 0, t.userId = 0, t.dryOrCleanRemainTime = 0, t.queryTimer = null, t.model = "-", t.isOnSeat = 0, t.waterTempLevel = 0, t.autoTemp = 0, t.autoCoverSwitch = 0, t.autoCoverSensitive = 0, t.flipSenseDistance = 1, t.infiniteSettingSenseDistance = 10, t.gestureSwitch = 0, t.autoFlushSwitch = 0, t.lightSensorSwitch = 0, t.smartPowerSave = 0, t.autoBubble = 0, t.foamTimeOnBrushRing = 6, t.nightLightBrightness = 2, t.autoDeodorization = 0, t.openLoopBubble = 0, t.footSensorSwitch = 0, t.preWettingSwitch = 0, t.atmosphereLightSwitch = 0, t.atmosphereLightMode = 1, t.redBlueLightSwitch = 0, t.redBlueLightMode = 1, t.redLightTime = 10, t.blueLightTime = 20, t.hipwashNozzlePosition = 1, t.seatTempLevel = 0, t.nightLightSwitch = 0, t.hipwashWaterPressure = 1, t.airTempLevel = 0, t.windSpeedLevel = 1, t.airMove = 0, t.womanWaterPressure = 1, t.womanNozzlePosition = 1, t.wideWashLevel = 1, t.flushLargeSwitch = 0, t.flushSmallSwitch = 0, t.unblockSwitch = 0, t.bubbleSwitch = 0, t.bubbleSwitchTemp = 0, t.deodorizationSwitch = 0, t.uvWaterDisinfectSwitch = 0, t.autoCloseCoverWithFlushSwitch = 0, t.autoSmallFlushSwitch = 0, t.bubbleLevel = -1, t.coverOn = 0, t.coverRun = 0, t.ringOn = 0, t.ringRun = 0, t.isBubbleEnable = !0, t.isReflushEnable = !0, t.bubbleDisableReason = 0, t.startFlushLargeTime = null, t.startFlushSmallTime = null, t.startBubbleTime = null, t.bubbleLockTimer = null, t.flushTimer = null, t.coverRingRunTimer = null, t.isSelfClean = !1, t.isQuickClean = 0, t.isLiftClean = 0, t.isNozzleDry = 0, t.isAutoNozzleDry = 0, t.isReplaceNozzleOn = !1, t.isAddLiquidBoxOn = 0, t.isAuto = !1, t.toiletMode = l.CleanMode.NONE, t.isOnDry = !1, t.moveWash = 0, t.wideWashMode = 0, t.largeSprayState = 0, t.waterShortage = 0, t.flowAbnormal = 0, t.outletOverTemperature = 0, t.inletOverTemperature = 0, t.inletSensorFault = 0, t.outletSensorFault = 0, t.seatTempError = 0, t.seatTempOver = 0, t.ambientSensorFault = 0, t.filterLifeAlarmEnable = 0, t.filterInsufficient = 0, t.filterUseTimeInMins = 0, t.filterLevel = 100, t.prepareForDry = !1, t.isMassageWash = 0, t.isStrongWeakMessage = !1, t.isOnStopStage = !1, t.isBuzzerEnable = 1, t.isSeatTooLong = 0, t.isCloseCoverAutoSmallFlush = 0, t.regularSelfCleanSwitch = 0, t.regularSelfCleanGear = 3, t.isPetWash = 0, t.medicineWashReady = 0, t.refreshingWash = 0, t.nursingWashStage = 0, t.nozzleUVDisinfectSwitch = 0, t.nozzleUVDisinfect = 0, t.aiVoiceSettingSwitch = 0, t
  }
  return t(c, [{
    key: "initDevice",
    value: function() {
      i(s(c.prototype), "initDevice", this).call(this), h.default.debug("==== 设备初始化 ===="), this.E2Ready = !1, this.FAReady = !1, this.E9Ready = !1, this.isOnStopStage = !1, this.isSelfInspectionReady = !1, this.isDeviceReady = !1, this.isOnSeat = 0, this.waterTempLevel = 0, this.autoCoverSwitch = 0, this.autoCoverSensitive = 0, this.gestureSwitch = 0, this.autoFlushSwitch = 0, this.lightSensorSwitch = 0, this.smartPowerSave = 0, this.hipwashNozzlePosition = 1, this.seatTempLevel = 0, this.nightLightSwitch = 0, this.hipwashWaterPressure = 1, this.airTempLevel = 0, this.windSpeedLevel = 1, this.womanWaterPressure = 1, this.womanNozzlePosition = 1, this.autoBubble = 0, this.openLoopBubble = 0, this.wideWashLevel = 1, this.flushLargeSwitch = 0, this.flushSmallSwitch = 0, this.unblockSwitch = 0, this.bubbleSwitch = 0, this.bubbleSwitchTemp = 0, this.footSensorSwitch = 0, this.preWettingSwitch = 0, this.isBubbleEnable = !0, this.bubbleDisableReason = 0, this.startFlushLargeTime = null, this.startFlushSmallTime = null, this.startBubbleTime = null, this.bubbleLockTimer = null, this.coverOn = 0, this.coverRun = 0, this.ringOn = 0, this.ringRun = 0, this.waterShortage = 0, this.flowAbnormal = 0, this.outletOverTemperature = 0, this.inletOverTemperature = 0, this.inletSensorFault = 0, this.outletSensorFault = 0, this.seatTempError = 0, this.seatTempOver = 0, this.ambientSensorFault = 0, this.bubbleLevel = -1, this.filterLevel = 100, this.filterUseTimeInMins = 0, this.deodorizationSwitch = 0, this.autoCloseCoverWithFlushSwitch = 0, this.autoSmallFlushSwitch = 0, this.isOnDry = !1, this.airMove = 0, this.isStrongWeakMessage = !1, this.isAuto = !1, this.isActive = !0, this.toiletMode = l.CleanMode.NONE, this.isAddLiquidBoxOn = 0, this.atmosphereLightMode = 1, this.isMassageWash = 0, this.regularSelfCleanSwitch = 0, this.regularSelfCleanGear = 3, this.isPetWash = 0, this.isLiftClean = 0, this.isNozzleDry = 0, this.isAutoNozzleDry = 0, this.infiniteSettingSenseDistance = 10, this.medicineWashReady = 0, this.refreshingWash = 0, this.nursingWashStage = 0, this.nozzleUVDisinfectSwitch = 0, this.nozzleUVDisinfect = 0, this.aiVoiceSettingSwitch = 0, this.loadLocalParam()
    }
  }, {
    key: "loadLocalParam",
    value: function() {
      var e = wx.getStorageSync("redBlueLightMode"),
        t = wx.getStorageSync("redDuration"),
        i = wx.getStorageSync("blueDuration");
      e ? this.redBlueLightMode = e : wx.setStorageSync("redBlueLightMode", this.redBlueLightMode), t ? this.redLightTime = t : wx.setStorageSync("redDuration", this.redLightTime), i ? this.blueLightTime = i : wx.setStorageSync("blueDuration", this.blueLightTime)
    }
  }, {
    key: "setDeviceInfo",
    value: function(e) {
      this.deviceInfo = e
    }
  }, {
    key: "updateSelfInspectionReady",
    value: function() {
      this.isSelfInspectionReady || (this.isSelfInspectionReady = this.E2Ready && this.E9Ready && this.FAReady, this.isSelfInspectionReady && (h.default.debug("==== 设备已就绪 ===="), this.queryCountDown()))
    }
  }, {
    key: "permanentActive",
    value: function() {
      h.default.debug("永久激活");
      var e = new ArrayBuffer(16),
        t = new DataView(e);
      t.setUint8(0, 243), t.setUint8(1, 244), t.setUint8(2, e.byteLength - 4), t.setUint8(3, c.BLE_ADDRESS), t.setUint8(4, c.TOILET_ADDRESS), t.setUint8(5, 176), t.setUint8(6, 7), t.setUint8(7, 16), t.setUint8(8, 17), t.setUint8(9, 18), t.setUint8(10, 19), t.setUint8(11, 20), t.setUint8(12, 21), t.setUint8(13, 22);
      var i = this.calculateChecksum(t);
      t.setUint8(14, i), t.setUint8(15, 252), this.writeCommand(e)
    }
  }, {
    key: "singleActive",
    value: function() {
      h.default.debug("单次激活");
      var e = new ArrayBuffer(8),
        t = new DataView(e);
      t.setUint8(0, 243), t.setUint8(1, 244), t.setUint8(2, e.byteLength - 4), t.setUint8(3, c.BLE_ADDRESS), t.setUint8(4, c.TOILET_ADDRESS), t.setUint8(5, 177);
      var i = this.calculateChecksum(t);
      t.setUint8(6, i), t.setUint8(7, 252), this.writeCommand(e)
    }
  }, {
    key: "queryCountDown",
    value: function() {
      var e = new ArrayBuffer(12),
        t = new DataView(e);
      t.setUint8(0, 243), t.setUint8(1, 244), t.setUint8(2, e.byteLength - 4), t.setUint8(3, c.BLE_ADDRESS), t.setUint8(4, c.TOILET_ADDRESS), t.setUint8(5, 194), t.setUint8(6, 0), t.setUint8(7, 0), t.setUint8(8, 0), t.setUint8(9, 0);
      var i = this.calculateChecksum(t);
      t.setUint8(10, i), t.setUint8(11, 252), this.writeCommand(e)
    }
  }, {
    key: "quaryDeviceState",
    value: function() {
      h.default.debug("查询外设状态=======");
      var e = new ArrayBuffer(12),
        t = new DataView(e);
      t.setUint8(0, 243), t.setUint8(1, 244), t.setUint8(2, e.byteLength - 4), t.setUint8(3, c.BLE_ADDRESS), t.setUint8(4, c.BROAD_ADDRESS), t.setUint8(5, 226), t.setUint8(6, 0), t.setUint8(7, 0), t.setUint8(8, 0), t.setUint8(9, 0);
      var i = this.calculateChecksum(t);
      t.setUint8(10, i), t.setUint8(11, 252), this.writeCommand(e)
    }
  }, {
    key: "quaryFilterState",
    value: function() {
      h.default.debug("查询滤芯状态=======");
      var e = new ArrayBuffer(12),
        t = new DataView(e);
      t.setUint8(0, 243), t.setUint8(1, 244), t.setUint8(2, e.byteLength - 4), t.setUint8(3, c.BLE_ADDRESS), t.setUint8(4, c.TOILET_ADDRESS), t.setUint8(5, 231), t.setUint8(6, 0), t.setUint8(7, 0), t.setUint8(8, 0), t.setUint8(9, 0);
      var i = this.calculateChecksum(t);
      t.setUint8(10, i), t.setUint8(11, 252), this.writeCommand(e)
    }
  }, {
    key: "setLightSensor",
    value: function(e) {
      this.lightSensorSwitch = e ? 1 : 0, this.startToiletFunction(25)
    }
  }, {
    key: "setNightLightSwitch",
    value: function(e) {
      this.lightSensorSwitch = e ? 1 : 0, this.startToiletFunction(25)
    }
  }, {
    key: "setSmartPowerSave",
    value: function(e) {
      this.smartPowerSave = e ? 1 : 0, this._startToiletFunction(25)
    }
  }, {
    key: "setRedBlueLightSwitch",
    value: function(e) {
      this.redBlueLightSwitch = e ? 1 : 0;
      var t = 0;
      1 == this.redBlueLightSwitch ? t |= 128 : t |= 64, t |= this.redBlueLightMode;
      var i = this.redLightTime,
        s = this.blueLightTime;
      1 == this.redBlueLightSwitch && (1 == this.redBlueLightMode ? s = 0 : 2 == this.redBlueLightMode && (i = 0)), this.setRedBlueLightParam(t, i, s)
    }
  }, {
    key: "setRedBlueLightMode1",
    value: function(e, t) {
      this.redBlueLightSwitch = e ? 1 : 0;
      var i = 0;
      1 == this.redBlueLightSwitch ? i |= 128 : i |= 64, this.redBlueLightMode = t, i |= this.redBlueLightMode;
      var s = this.redLightTime,
        a = this.blueLightTime;
      1 == this.redBlueLightSwitch && (1 == t ? a = 0 : 2 == t && (s = 0));
      var n = t;
      wx.setStorageSync("redBlueLightMode", n), this.setRedBlueLightParam(i, s, a)
    }
  }, {
    key: "setRedBlueLightMode",
    value: function(e) {
      this.setRedBlueLightMode1(this.redBlueLightSwitch, e)
    }
  }, {
    key: "setRedLightTime",
    value: function(e) {
      this.redLightTime = e;
      var t = 0;
      t |= this.redBlueLightMode;
      var i = this.redLightTime,
        s = this.blueLightTime;
      1 == this.redBlueLightMode ? s = 0 : 2 == this.redBlueLightMode && (i = 0), this.setRedBlueLightParam(t, i, s)
    }
  }, {
    key: "setBlueLightTime",
    value: function(e) {
      this.blueLightTime = e;
      var t = 0;
      t |= this.redBlueLightMode;
      var i = this.redLightTime,
        s = this.blueLightTime;
      1 == this.redBlueLightMode ? s = 0 : 2 == this.redBlueLightMode && (i = 0), this.setRedBlueLightParam(t, i, s)
    }
  }, {
    key: "setAtmosphereLight",
    value: function(e) {
      this.atmosphereLightSwitch = e ? 1 : 0;
      var t = 0;
      t |= e ? 32 : 16, this._set1FAction(51, t)
    }
  }, {
    key: "setAtmosphereLightSwitchAndMode",
    value: function(e, t) {
      this.atmosphereLightSwitch = e ? 1 : 0, this.atmosphereLightMode = t;
      var i = 0;
      i |= e ? 32 : 16, i |= t, this._set1FAction(51, i)
    }
  }, {
    key: "setAutoFootSensor",
    value: function(e) {
      this.footSensorSwitch = e ? 1 : 0;
      var t = 0;
      t |= e ? 1 : 2, this._set1FAction(36, t)
    }
  }, {
    key: "setAutoTemp",
    value: function(e) {
      this.autoTemp = e ? 1 : 0, this.startToiletCleanFunction(2, !0)
    }
  }, {
    key: "setAutoCover",
    value: function(e) {
      this.autoCoverSwitch = e ? 1 : 0, this.doParaSetting()
    }
  }, {
    key: "setStrongDry",
    value: function(e) {
      this.windSpeedLevel = e, this._setStrongDryAction(e)
    }
  }, {
    key: "setOpenLoopBubble",
    value: function(e) {
      this.openLoopBubble = e ? 1 : 0, this._setOpenLoopBubbleAction()
    }
  }, {
    key: "setAiVoiceSwitch",
    value: function(e) {
      this.aiVoiceSettingSwitch = e ? 1 : 0, e ? this._set1FAction(154, 0) : this._set1FAction(155, 0)
    }
  }, {
    key: "setAutoBubble",
    value: function(e) {
      this.autoBubble = e ? 1 : 0, this._setAutoBubbleAction()
    }
  }, {
    key: "setAutoDeodorization",
    value: function(e) {
      this.autoDeodorization = e ? 1 : 0, this.startToiletCleanFunction(18, !0)
    }
  }, {
    key: "setAutoUvWaterDisinfect",
    value: function(e) {
      this.uvWaterDisinfectSwitch = e ? 1 : 0;
      var t = 0;
      t |= e ? 64 : 32, this._set1FAction(33, t)
    }
  }, {
    key: "setAutoCloseCoverWithFlush",
    value: function(e) {
      this.autoCloseCoverWithFlushSwitch = e ? 1 : 0;
      var t = 0;
      t = 1 == this.autoCloseCoverWithFlushSwitch ? 1 : 2, this._set1FAction(37, t)
    }
  }, {
    key: "setAutoSmallFlush",
    value: function(e) {
      this.autoSmallFlushSwitch = e ? 1 : 0;
      var t = 0;
      1 == this.autoSmallFlushSwitch ? t |= 4 : t |= 8, this._set1FAction(37, t)
    }
  }, {
    key: "setAutoCloseSensitive",
    value: function(e) {
      this.autoCoverSensitive = e, 0 == e ? this._set1FAction(17, 0) : this._set1FAction(16, 0)
    }
  }, {
    key: "setFlipSenseDistance",
    value: function(e) {
      h.default.follow("自动翻盖感应距离 = ", e), this._set1FAction(18, e)
    }
  }, {
    key: "resetFilter",
    value: function() {
      this._set1FAction(199, 1)
    }
  }, {
    key: "enableFilter",
    value: function(e) {
      if (e) h.default.debug("滤芯提醒 - 开"), this.resetFilter();
      else {
        h.default.debug("滤芯提醒 - 关");
        this._set1FAction(199, 2)
      }
    }
  }, {
    key: "setFoamTimeOnBrushRing",
    value: function(e) {
      this.foamTimeOnBrushRing = e;
      var t = new ArrayBuffer(11),
        i = new DataView(t);
      i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, t.byteLength - 4), i.setUint8(3, c.BLE_ADDRESS), i.setUint8(4, c.TOILET_ADDRESS), i.setUint8(5, 31), i.setUint8(6, 32);
      i.setUint8(7, 128);
      var s = e;
      i.setUint8(8, s);
      var a = this.calculateChecksum(i);
      i.setUint8(9, a), i.setUint8(10, 252), this.writeCommand(t)
    }
  }, {
    key: "setNightLightBrightness",
    value: function(e) {
      this.nightLightBrightness = e, h.default.debug("设置夜灯亮度档位 = " + e);
      var t = new ArrayBuffer(10),
        i = new DataView(t);
      i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, t.byteLength - 4), i.setUint8(3, c.BLE_ADDRESS), i.setUint8(4, c.TOILET_ADDRESS), i.setUint8(5, 31), i.setUint8(6, 42);
      var s = 0;
      s |= e, i.setUint8(7, s);
      var a = this.calculateChecksum(i);
      i.setUint8(8, a), i.setUint8(9, 252), this.writeCommand(t)
    }
  }, {
    key: "_setStrongDryAction",
    value: function(e) {
      var t = new ArrayBuffer(10),
        i = new DataView(t);
      i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, t.byteLength - 4), i.setUint8(3, c.BLE_ADDRESS), i.setUint8(4, c.TOILET_ADDRESS), i.setUint8(5, 31), i.setUint8(6, 34);
      var s = 0;
      console.log("强力烘干风速：" + this.windSpeedLevel), s |= this.windSpeedLevel;
      var a = 1;
      s |= a << 3;
      var n = 1;
      s |= n << 4, i.setUint8(7, s);
      var l = this.calculateChecksum(i);
      i.setUint8(8, l), i.setUint8(9, 252), this.writeCommand(t)
    }
  }, {
    key: "_setOpenLoopBubbleAction",
    value: function() {
      var e = new ArrayBuffer(10),
        t = new DataView(e);
      t.setUint8(0, 243), t.setUint8(1, 244), t.setUint8(2, e.byteLength - 4), t.setUint8(3, c.BLE_ADDRESS), t.setUint8(4, c.TOILET_ADDRESS), t.setUint8(5, 31), t.setUint8(6, 32);
      var i = 0;
      1 == this.openLoopBubble ? i |= 32 : i |= 64, t.setUint8(7, i);
      var s = this.calculateChecksum(t);
      t.setUint8(8, s), t.setUint8(9, 252), this.writeCommand(e)
    }
  }, {
    key: "_setAutoBubbleAction",
    value: function() {
      var e = new ArrayBuffer(10),
        t = new DataView(e);
      t.setUint8(0, 243), t.setUint8(1, 244), t.setUint8(2, e.byteLength - 4), t.setUint8(3, c.BLE_ADDRESS), t.setUint8(4, c.TOILET_ADDRESS), t.setUint8(5, 31), t.setUint8(6, 32);
      var i = 0;
      1 == this.autoBubble ? i |= 2 : i |= 4, t.setUint8(7, i);
      var s = this.calculateChecksum(t);
      t.setUint8(8, s), t.setUint8(9, 252), this.writeCommand(e)
    }
  }, {
    key: "setPreWetting",
    value: function(e) {
      this.preWettingSwitch = e ? 1 : 0;
      var t = new ArrayBuffer(10),
        i = new DataView(t);
      i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, t.byteLength - 4), i.setUint8(3, c.BLE_ADDRESS), i.setUint8(4, c.TOILET_ADDRESS), i.setUint8(5, 31), i.setUint8(6, 48);
      var s = 0;
      e && (s |= 4), this.deviceInfo.protocol0SeatTooLongCmd && 1 == this.isSeatTooLong && (s |= 2), i.setUint8(7, s);
      var a = this.calculateChecksum(i);
      i.setUint8(8, a), i.setUint8(9, 252), this.writeCommand(t)
    }
  }, {
    key: "setSeatTooLong",
    value: function(e) {
      this.isSeatTooLong = e ? 1 : 0;
      var t = new ArrayBuffer(10),
        i = new DataView(t);
      i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, t.byteLength - 4), i.setUint8(3, c.BLE_ADDRESS), i.setUint8(4, c.TOILET_ADDRESS), i.setUint8(5, 31), i.setUint8(6, 48);
      var s = 0;
      this.deviceInfo.protocol0SeatTooLongCmd ? (e && (s |= 2), 1 == this.preWettingSwitch && (s |= 4)) : s |= 2, i.setUint8(7, s);
      var a = this.calculateChecksum(i);
      i.setUint8(8, a), i.setUint8(9, 252), this.writeCommand(t)
    }
  }, {
    key: "setCloseCoverAutoSmallFlush",
    value: function(e) {
      this.isCloseCoverAutoSmallFlush = e ? 1 : 0;
      var t = new ArrayBuffer(10),
        i = new DataView(t);
      i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, t.byteLength - 4), i.setUint8(3, c.BLE_ADDRESS), i.setUint8(4, c.TOILET_ADDRESS), i.setUint8(5, 31), i.setUint8(6, 37);
      var s = 0;
      s |= e ? 16 : 32, i.setUint8(7, s);
      var a = this.calculateChecksum(i);
      i.setUint8(8, a), i.setUint8(9, 252), this.writeCommand(t)
    }
  }, {
    key: "setAutoFlush",
    value: function(e) {
      this.autoFlushSwitch = e ? 1 : 0, this.startToiletFunction(25)
    }
  }, {
    key: "setPetWash",
    value: function(e) {
      this.isPetWash = e ? 1 : 0;
      var t = 0;
      t |= e ? 8 : 4, this._set1FAction(63, t)
    }
  }, {
    key: "setRegularFlush",
    value: function(e) {
      console.log("协议未定，无法发送该指令")
    }
  }, {
    key: "setRegularSelfClean",
    value: function(e, t) {
      this.regularSelfCleanSwitch = e ? 1 : 0, this.regularSelfCleanGear = t;
      var i = 0;
      if (e) {
        i |= 64;
        var s = t;
        this._set1FAction2(40, i, s)
      } else i |= 32, this._set1FAction(40, i)
    }
  }, {
    key: "doParaSetting",
    value: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
      e ? this.startToiletCustomFunction(e, !0) : this.startToiletFunction(25)
    }
  }, {
    key: "doOnlyDry",
    value: function(e) {
      this.isOnDry = !0, this.startToiletCustomFunction(e, !0, !0)
    }
  }, {
    key: "setWindSpeed",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      this.windSpeedLevel = e, this.doParaSetting(t)
    }
  }, {
    key: "setWindTemp",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      this.airTempLevel = e, this.doParaSetting(t)
    }
  }, {
    key: "setWaterTemp",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      this.waterTempLevel = e, this.doParaSetting(t)
    }
  }, {
    key: "setSeatTemp",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      this.seatTempLevel = e, this.doParaSetting(t)
    }
  }, {
    key: "setHipwashNozzlePosition",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      this.hipwashNozzlePosition = e, this.deviceInfo.use18ToSendPressureAndPosition ? t ? this.startToiletCustomFunction(t, !0) : this.startToiletFunction(24) : this.doParaSetting(t)
    }
  }, {
    key: "setWomanNozzlePosition",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      this.womanNozzlePosition = e, this.deviceInfo.use18ToSendPressureAndPosition ? t ? this.startToiletCustomFunction(t, !0) : this._startToiletFunction(24, !0) : this._startToiletFunction(25, !0)
    }
  }, {
    key: "setHipwashWaterPressure",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      this.hipwashWaterPressure = e, this.deviceInfo.use18ToSendPressureAndPosition ? t ? this.startToiletCustomFunction(t, !0) : this.startToiletFunction(24) : this.doParaSetting(t)
    }
  }, {
    key: "setWomanWaterPressure",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      this.womanWaterPressure = e, this.deviceInfo.use18ToSendPressureAndPosition ? t ? this.startToiletCustomFunction(t, !0) : this._startToiletFunction(24, !0) : this._startToiletFunction(25, !0)
    }
  }, {
    key: "setWideWashLevel",
    value: function(e) {
      this.wideWashLevel = e, this._startToiletFunction(25, !1)
    }
  }, {
    key: "startForceFlush",
    value: function() {
      h.default.info("==== 启动强制冲刷 ===="), this._startButtonOrder(14, 1)
    }
  }, {
    key: "startUnBlock",
    value: function(e) {
      e ? this._startButtonOrder(14, 2) : this.startFlushLarge()
    }
  }, {
    key: "_startButtonOrder",
    value: function(e, t) {
      var i = new ArrayBuffer(11),
        s = new DataView(i);
      s.setUint8(0, 243), s.setUint8(1, 244), s.setUint8(2, i.byteLength - 4), s.setUint8(3, c.BLE_ADDRESS), s.setUint8(4, c.TOILET_ADDRESS), s.setUint8(5, 31), s.setUint8(6, 94), s.setUint8(7, e), s.setUint8(8, t);
      var a = this.calculateChecksum(s);
      s.setUint8(9, a), s.setUint8(10, 252), this.writeCommand(i)
    }
  }, {
    key: "startFlushLarge",
    value: function() {
      this.startFlushTime = (new Date).getTime(), this.startToiletFunction(14)
    }
  }, {
    key: "startFlushSmall",
    value: function() {
      this.startFlushTime = (new Date).getTime(), this.startToiletFunction(15)
    }
  }, {
    key: "startDeodorization",
    value: function() {
      this.startFlushTime = (new Date).getTime(), this.startToiletFunction(18)
    }
  }, {
    key: "startBubble",
    value: function() {
      var e = new ArrayBuffer(10),
        t = new DataView(e);
      t.setUint8(0, 243), t.setUint8(1, 244), t.setUint8(2, e.byteLength - 4), t.setUint8(3, c.BLE_ADDRESS), t.setUint8(4, c.TOILET_ADDRESS), t.setUint8(5, 31), t.setUint8(6, 32);
      t.setUint8(7, 1);
      var i = this.calculateChecksum(t);
      t.setUint8(8, i), t.setUint8(9, 252), this.writeCommand(e)
    }
  }, {
    key: "startCover",
    value: function(e) {
      e ? this.startToiletFunction(this.ringOn ? 19 : 17) : this.startToiletFunction(16)
    }
  }, {
    key: "startRing",
    value: function(e) {
      e ? this.startToiletFunction(19) : this.startToiletFunction(17)
    }
  }, {
    key: "stopCleanMode",
    value: function(e) {
      this.isSelfClean = !1, this.isQuickClean = 0, this.isReplaceNozzleOn = !1, this.redBlueLightSwitch = 0, this.isMassageWash = 0, this.startToiletFunction(0)
    }
  }, {
    key: "startAutoHipCleanMode",
    value: function(e) {
      this.userId = 0, this.cleanModeId = 0, this.startToiletCleanFunction(12, e), this.queryCountDown()
    }
  }, {
    key: "startAutoWomanCleanMode",
    value: function(e) {
      this.userId = 0, this.cleanModeId = 0, e && (this.wideWashLevel = this.DEFAULT_WIDE_WASH_LEVEL), this.startToiletCleanFunction(7, e), this.queryCountDown()
    }
  }, {
    key: "startManCleanMode",
    value: function(e) {
      h.default.info("====== 开启臀洗 ======"), this.userId = 0, this.cleanModeId = 0, this.wideWashMode = 0, this.startToiletCleanFunction(8, e), this.queryCountDown()
    }
  }, {
    key: "startWomanCleanMode",
    value: function(e) {
      h.default.info("====== 开启妇洗 ======"), this.userId = 0, this.cleanModeId = 0, e && (this.wideWashLevel = this.DEFAULT_WIDE_WASH_LEVEL), this.startToiletCleanFunction(11, e), this.queryCountDown()
    }
  }, {
    key: "startDryMode",
    value: function(e) {
      h.default.info("====== 开启暖风 ======"), this.userId = 0, this.cleanModeId = 0, this.toiletMode == l.CleanMode.DRY || this.toiletMode == l.CleanMode.AUTO_HIP_WASH || this.isOnDry || this.toiletMode == l.CleanMode.AUTO_HIP_WASH || this.isOnDry ? this.airMove = !0 : this.airMove = !1, this.startToiletCleanFunction(4, e), this.queryCountDown()
    }
  }, {
    key: "startDryMoveMode",
    value: function(e) {
      h.default.info("====== 开启暖风移动 ======"), this.toiletMode == l.CleanMode.DRY || this.toiletMode == l.CleanMode.AUTO_HIP_WASH || this.isOnDry || this.toiletMode == l.CleanMode.AUTO_HIP_WASH || this.isOnDry ? this.airMove = !0 : this.airMove = !1, this.startToiletCleanFunction(5, e), this.queryCountDown()
    }
  }, {
    key: "startDefecationMode",
    value: function(e) {
      this.userId = 0, this.cleanModeId = 0, this.moveWash = 0, this.startToiletCleanFunction(10, e), this.queryCountDown()
    }
  }, {
    key: "startSitzBathMode",
    value: function(e) {
      this.userId = 0, this.cleanModeId = 0, this.startToiletCleanFunction(29, e), this.queryCountDown()
    }
  }, {
    key: "startSoftMistMode",
    value: function(e) {
      this.userId = 0, this.cleanModeId = 0, this.moveWash = 0, this.startToiletCleanFunction(29, e), this.queryCountDown()
    }
  }, {
    key: "startMassageWashMode",
    value: function(e) {
      this.userId = 0, this.cleanModeId = 0, this.isMassageWash = e ? 1 : 0;
      var t = 0;
      t |= 128, e ? (this.toiletMode == l.CleanMode.WOMAN_WASH || this.toiletMode == l.CleanMode.AUTO_WOMAN_WASH ? t |= this.womanWaterPressure << 0 : t |= this.hipwashWaterPressure << 0, this._set1FAction(41, t)) : this._set1FAction(41, t)
    }
  }, {
    key: "startSelfClean",
    value: function(e) {
      this.userId = 0, this.cleanModeId = 0;
      var t = 0;
      e ? (t |= 128, this._set1FAction(40, t)) : (this.isSelfClean = 0, this.startToiletFunction(0))
    }
  }, {
    key: "startQuickClean",
    value: function() {
      this.startBubble()
    }
  }, {
    key: "startLiftClean",
    value: function(e) {
      this.isLiftClean = e ? 1 : 0;
      this._set1FAction(63, 16)
    }
  }, {
    key: "startNozzleDry",
    value: function(e) {
      if (this.isNozzleDry = e ? 1 : 0, e) {
        16,
        this._set1FAction3(53, 16, 0, 0)
      }
      else this.startToiletFunction(0)
    }
  }, {
    key: "startAutoNozzleDry",
    value: function(e) {
      this.isAutoNozzleDry = e ? 1 : 0;
      var t = 0;
      t |= e ? 8 : 4, this._set1FAction3(53, t, 0, 0)
    }
  }, {
    key: "setInfiniteSenseDistance",
    value: function(e) {
      this.infiniteSettingSenseDistance = e, this._set1FAction2(20, 1, e)
    }
  }, {
    key: "startNozzleClean",
    value: function(e) {
      this.userId = 0, this.cleanModeId = 0, this.startToiletCleanFunction(9, e), this.queryCountDown()
    }
  }, {
    key: "startReplaceNozzle",
    value: function(e) {
      this.isReplaceNozzleOn = e, e ? (this.userId = 0, this.cleanModeId = 0, this.startToiletCleanFunction(22, e), this.queryCountDown()) : (console.log("关闭更换喷嘴"), this.startToiletFunction(0))
    }
  }, {
    key: "startAddLiquidBox",
    value: function(e) {
      this.isAddLiquidBoxOn = e ? 1 : 0;
      this._set1FAction(32, 16)
    }
  }, {
    key: "startMove",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      h.default.debug("移动按摩"), this.startToiletFunction(5, t)
    }
  }, {
    key: "startStrongWeakMassage",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      this.isStrongWeakMessage = e, h.default.debug("发送强弱按摩: " + e), e ? this.startToiletFunction(6, t) : this.toiletMode == l.CleanMode.HIP_WASH ? this.startToiletFunction(8, t) : this.startToiletFunction(0, t)
    }
  }, {
    key: "startToiletCleanFunction",
    value: function(e, t) {
      t ? (2 != e && (this.dryOrCleanRemainTime = 0), this.startToiletFunction(e)) : this.startToiletFunction(0)
    }
  }, {
    key: "startToiletFunction",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      this._startToiletFunction(e, !1, t)
    }
  }, {
    key: "_startToiletFunction",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
      h.default.error("======= 下发清洗 =======", e), h.default.error("======= 下发清洗 womanMode(1) =======", t);
      var s = !1,
        a = !1;
      7 != e && 3 != e && 11 != e || (s = !0), 1 == e || 8 == e || 10 == e || 6 == e || 12 == e ? s = !1 : 24 == e || 25 == e || 18 == e || 21 == e ? (s = this.isLatestWomanMode || t, (this.toiletMode == l.CleanMode.DRY || this.isOnDry) && (a = !0)) : 4 == e ? (s = this.isLatestWomanMode || t, h.default.debug("=== 暖风模式 ==="), a = !0) : 5 == e ? (s = this.isLatestWomanMode || t, h.default.debug("=== 移动按摩 === this.isOnDry", this.isOnDry), this.isOnDry && (h.default.debug("=== 移动按摩 ==="), a = !0), h.default.debug("移动按摩 指令 woman =", s)) : 2 == e && (s = this.isLatestWomanMode || t), 0 == e && (this.userId = 0, this.cleanModeId = 0, s = !1);
      var n = new ArrayBuffer(19),
        o = new DataView(n);
      o.setUint8(0, 243), o.setUint8(1, 244), o.setUint8(2, n.byteLength - 4), o.setUint8(3, c.BLE_ADDRESS), o.setUint8(4, c.TOILET_ADDRESS), o.setUint8(5, e);
      var u = 0;
      u |= this.waterTempLevel << 4, u |= this.autoCoverSwitch << 3, u |= this.gestureSwitch << 2, u |= this.autoFlushSwitch << 1, u |= this.nightLightSwitch << 0, o.setUint8(6, u);
      var r = 0;
      r |= this.smartPowerSave << 7, s ? (h.default.error("=== 妇洗喷嘴位置设置 ===", this.womanNozzlePosition), r |= this.womanNozzlePosition << 4) : (h.default.error("=== 臀洗喷嘴位置设置 ===", this.hipwashNozzlePosition), r |= this.hipwashNozzlePosition << 4), r |= this.seatTempLevel << 0, o.setUint8(7, r);
      var d = 0;
      d |= this.lightSensorSwitch << 7, a ? this.hasWindSpeed ? (h.default.debug("==== 下发暖风风速 =====", this.windSpeedLevel), d |= this.windSpeedLevel << 4) : s ? (h.default.debug("=== 妇洗水压设置 ===", this.womanWaterPressure), d |= this.womanWaterPressure << 4) : (h.default.debug("=== 臀洗水压设置 ===", this.hipwashWaterPressure), d |= this.hipwashWaterPressure << 4) : s ? (h.default.error("=== 妇洗水压设置 ===", this.womanWaterPressure), d |= this.womanWaterPressure << 4) : (h.default.error("=== 臀洗水压设置 ===", this.hipwashWaterPressure), d |= this.hipwashWaterPressure << 4), d |= this.airTempLevel << 0, o.setUint8(8, d);
      var v = 0;
      v |= this.wideWashLevel << 4, o.setUint8(9, v);
      var f = 0;
      o.setUint8(10, f);
      var g = 0;
      if (g |= this.windSpeedLevel << 4, o.setUint8(11, g), h.default.debug("=== 风速档位 === this.windSpeedLevel = ", this.windSpeedLevel), null != i) {
        var S = i.cleanTime % 256;
        o.setUint8(12, S);
        var m = i.cleanTime / 256;
        o.setUint8(13, m);
        var w = i.dryTime % 256;
        o.setUint8(14, w);
        var b = i.dryTime / 256;
        o.setUint8(15, b)
      }
      var L = 0;
      L |= this.cleanModeId << 0, L |= this.userId << 4, o.setUint8(16, L);
      var y = this.calculateChecksum(o);
      o.setUint8(17, y), o.setUint8(18, 252), this.writeCommand(n)
    }
  }, {
    key: "stopCustomCleanMode",
    value: function() {
      this.cleanModeId = 0, this.userId = 0, this.startToiletFunction(0)
    }
  }, {
    key: "startToiletCustomFunction",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        s = this.createStartCustomWashCmd(e, !0, t, i);
      this.writeCommand(s)
    }
  }, {
    key: "createStartCustomWashCmd",
    value: function(e) {
      var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
        i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        s = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
      h.default.info("执行私人定制清洗模式"), h.default.info("清洗时长", e.cleanTime), h.default.info("暖风时长", e.dryTime);
      var a = e.type,
        n = e.dryTime,
        o = 25,
        u = e.move,
        r = e.wideWash,
        d = e.cleanModeId,
        v = e.userId,
        f = e.cleanTime;
      e.windMove;
      h.default.info("用户ID:", v), i || 1 == d && (r = 0), t && (this.cleanModeId = e.cleanModeId, this.userId = e.userId);
      var g = this.wideWashLevel;
      null != e.wideWashLevel && (t && (this.wideWashLevel = e.wideWashLevel), g = e.wideWashLevel);
      var S = this.womanWaterPressure;
      null != e.womanWaterPressure && (t && (this.womanWaterPressure = e.womanWaterPressure), S = e.womanWaterPressure);
      var m = this.womanNozzlePosition;
      null != e.womanNozzlePosition && (t && (this.womanNozzlePosition = e.womanNozzlePosition), m = e.womanNozzlePosition);
      var w = this.hipwashWaterPressure;
      null != e.hipwashWaterPressure && (t && (this.hipwashWaterPressure = e.hipwashWaterPressure), w = e.hipwashWaterPressure);
      var b = this.hipwashNozzlePosition;
      null != e.hipwashNozzlePosition && (t && (this.hipwashNozzlePosition = e.hipwashNozzlePosition), b = e.hipwashNozzlePosition);
      var L = this.waterTempLevel;
      null != e.waterTempLevel && (t && (this.waterTempLevel = e.waterTempLevel), L = e.waterTempLevel);
      var y = this.airTempLevel;
      null != e.airTempLevel && (t && (this.airTempLevel = e.airTempLevel), y = e.airTempLevel);
      var T = this.windSpeedLevel;
      null != e.windSpeedLevel && (t && (this.windSpeedLevel = e.windSpeedLevel), T = e.windSpeedLevel), 1 == a ? null != r && 1 == r ? n > 0 ? (console.log("带烘干的臀洗"), o = 12) : (console.log("不带烘干的臀洗"), o = 8) : o = 1 : 2 == a ? o = null != u && 1 == u ? 0 == n ? 11 : 7 : 3 : 3 == a ? o = 10 : 4 == a && (o = 6);
      var U = o;
      s ? U = 4 : i && (U = 25), h.default.info("orderAction = ", U.toString(16));
      var C = new ArrayBuffer(19),
        A = new DataView(C);
      A.setUint8(0, 243), A.setUint8(1, 244), A.setUint8(2, C.byteLength - 4), A.setUint8(3, c.BLE_ADDRESS), A.setUint8(4, c.TOILET_ADDRESS), A.setUint8(5, U);
      var p = 0;
      p |= L << 4, p |= this.autoCoverSwitch << 3, p |= this.gestureSwitch << 2, p |= this.autoFlushSwitch << 1, p |= this.nightLightSwitch << 0, A.setUint8(6, p);
      var D = 0;
      D |= this.smartPowerSave << 7, 7 == o || 3 == o || 11 == o ? (D |= m << 4, h.default.debug("妇洗喷嘴位置 = " + m)) : (D |= b << 4, h.default.debug("臀洗喷嘴位置 = " + b)), D |= this.seatTempLevel << 0, A.setUint8(7, D);
      var E = 0;
      E |= this.lightSensorSwitch << 7, s || 25 == U && this.toiletMode == l.CleanMode.DRY ? this.deviceInfo.hasWindSpeedReplaceWaterPress ? (h.default.debug("风速设置(水压位置) = ", T), E |= T << 4) : 7 == o || 3 == o || 11 == o ? (h.default.debug("妇洗水压 = ", S), E |= S << 4) : (h.default.debug("臀洗水压 = ", w), E |= w << 4) : 7 == o || 3 == o || 11 == o ? (E |= S << 4, h.default.debug("妇洗水压 = ", S)) : (E |= w << 4, h.default.debug("臀洗水压 = ", w)), E |= y << 0, A.setUint8(8, E);
      var W = 0;
      W |= g << 4, A.setUint8(9, W), console.log("幅度 = " + g);
      var M = 0;
      A.setUint8(10, M);
      var F = 0,
        k = 1;
      F |= T << 4, F |= k << 0, A.setUint8(11, F);
      var R = f % 256;
      A.setUint8(12, R);
      var B = f / 256;
      A.setUint8(13, B);
      var _ = n % 256;
      A.setUint8(14, _);
      var z = n / 256;
      A.setUint8(15, z);
      var I = 0;
      I |= d << 0, I |= v << 4, A.setUint8(16, I);
      var O = this.calculateChecksum(A);
      return A.setUint8(17, O), A.setUint8(18, 252), C
    }
  }, {
    key: "onDeviceReady",
    value: function(e) {
      var t = this;
      h.default.follow("设备连接完成"), this.initDevice(), i(s(c.prototype), "onDeviceReady", this).call(this, e), null != this.msgValueChangeCallBack && (h.default.follow("同步设备状态"), h.default.follow("that.E9Ready = " + t.E9Ready), h.default.follow("that.FAReady = " + t.FAReady), h.default.follow("that.E2Ready = " + t.E2Ready), this.msgValueChangeCallBack(null)), this.quaryDeviceState(), setTimeout((function() {
        t.quaryDeviceState()
      }), 1e3), setTimeout((function() {
        t.isSelfInspectionReady || (h.default.follow("还未就绪继续查询一遍"), t.quaryDeviceState()), t.E9Ready = !0, t.FAReady = !0, t.E2Ready = !0, t.isSelfInspectionReady = !0, null != t.msgValueChangeCallBack && t.msgValueChangeCallBack(null)
      }), 1500)
    }
  }, {
    key: "setOnQuaryReadyCallback",
    value: function(e) {
      this.onQuaryReadyCallback = e
    }
  }, {
    key: "onMsgValueChange",
    value: function(e) {
      i(s(c.prototype), "onMsgValueChange", this).call(this, e);
      var t = e.value,
        a = new Uint8Array(t);
      if (h.default.debug("收到数据上报", d(a)), e.characteristicId !== this.notifyComUUID) a.length < 7 || 243 != a[0] || 244 != a[1] || (this.isValidData(a) ? a[3] == c.TOILET_ADDRESS ? 250 == a[5] ? this.dealWithFA(a) : 236 == a[5] ? this.dealWithEC(a) : 32 == a[5] ? this.dealWith20(a) : 233 == a[5] ? this.dealWithE9(a) : 234 == a[5] ? this.dealWithEA(a) : 226 == a[5] ? this.dealWithE2(a) : 194 == a[5] ? this.dealWithC2(a) : 231 == a[5] ? this.dealWithE7(a) : 237 == a[5] && this.dealWithED(a) : a[3] == c.BLE_ADDRESS && 33 == a[4] && this.dealWithCommand(a) : h.default.error("校验码错误"));
      else {
        if (a.length < 4 || 250 != a[0]) return;
        this.dealWithCustomProtocol(a)
      }
    }
  }, {
    key: "isValidData",
    value: function(e) {
      if (e.length < 4) return !1;
      if (e[2] != e.byteLength - 4) return h.default.error("数据长度不符合要求，无效数据"), !1;
      for (var t = 0, i = 2; i < e.length - 2; i++) t += e[i];
      var s = 255 & t;
      return e[e.length - 2] == s
    }
  }, {
    key: "dealWithCustomProtocol",
    value: function(e) {
      2 == e[2] && (this.model = r.ab2hexFromStart(e, 6, 3))
    }
  }, {
    key: "dealWithE7",
    value: function(e) {
      h.default.debug("--- E7 ---");
      e[7];
      var t = e[8],
        i = e[9],
        s = (192 & i) >> 6 << 8 | t,
        a = 63 & i;
      h.default.debug("E7滤芯小时数 = ", s), h.default.debug("E7滤芯分钟数 = ", a), this.filterUseTimeInMins = 60 * s + a, h.default.debug("E7总分钟数 = ", this.filterUseTimeInMins);
      var n = 100 * (13980 - this.filterUseTimeInMins) / 13980;
      this.filterLevel = Math.round(10 * n) / 10, h.default.debug("E7百分比 = ", this.filterLevel), this.filterLevel < 0 ? this.filterLevel = 0 : this.filterLevel > 100 && (this.filterLevel = 100)
    }
  }, {
    key: "dealWithED",
    value: function(e) {
      h.default.debug("--- ED ---");
      e[6];
      var t = e[7];
      1 == t ? (this.isActive = !0, h.default.debug("ED设备已激活")) : 0 == t && (this.isActive = !1, h.default.debug("ED设备未激活"))
    }
  }, {
    key: "dealWithC2",
    value: function(e) {
      h.default.debug("--- C2 ---");
      e[6], e[7];
      var t = e[8],
        i = e[9],
        s = e[10],
        a = 15 & s,
        n = s >> 4 & 1;
      (this.cleanModeId = a, this.userId = n, h.default.debug("C2 userId =", this.userId), h.default.debug("C2 cleanModeId =", this.cleanModeId), this.isOnStopStage) ? this.dryOrCleanRemainTime = 0: t + 256 * i <= 600 && (this.dryOrCleanRemainTime = t + 256 * i, h.default.debug("C2倒计时时间 = ", this.dryOrCleanRemainTime))
    }
  }, {
    key: "startCountDown",
    value: function() {
      var e = this;
      null == this.queryTimer && (this.queryCountDown(), this.queryTimer = setInterval((function() {
        e.queryCountDown()
      }), 6e3))
    }
  }, {
    key: "stopCountDown",
    value: function() {
      console.log("停止查询倒计时"), null != this.queryTimer && (clearInterval(this.queryTimer), this.queryTimer = null), this.userId = 0, this.cleanModeId = 0
    }
  }, {
    key: "dealWithE2",
    value: function(e) {
      h.default.debug("--- E2 ---");
      var t = e[6];
      this.waterTempLevel = t >> 4 & 7, this.autoCoverSwitch = t >> 3 & 1, this.gestureSwitch = t >> 2 & 1, this.autoFlushSwitch = t >> 1 & 1, this.nightLightSwitch = t >> 0 & 1, h.default.debug("E2水温 = " + this.waterTempLevel);
      var i = e[7];
      this.hipwashNozzlePosition = i >> 4 & 7, this.seatTempLevel = 15 & i, h.default.debug("E2座温 = ", this.seatTempLevel);
      var s = e[8];
      this.lightSensorSwitch = s >> 7 & 1, this.hipwashWaterPressure = s >> 4 & 7, this.airTempLevel = s >> 0 & 7, h.default.debug("E2风温 = ", this.airTempLevel);
      var a = e[9];
      if (this.womanWaterPressure = a >> 4 & 7, this.womanNozzlePosition = a >> 0 & 7, h.default.debug("E2妇洗喷嘴位置 = ", this.womanNozzlePosition), h.default.debug("E2臀洗喷嘴位置 = ", this.hipwashNozzlePosition), h.default.debug("E2妇洗水压 = ", this.womanWaterPressure), h.default.debug("E2臀洗水压 = ", this.hipwashWaterPressure), this.useE2CoverRing && (this.coverOn = a >> 7 & !0 ? 0 : 1, this.ringOn = a >> 3 & !0 ? 0 : 1, h.default.debug("E2盖板 = ", this.coverOn), h.default.debug("E2座圈 = ", this.ringOn)), e.length >= 13) {
        var n = e[10];
        this.foamTimeOnBrushRing = n, h.default.debug("E2出泡时间 = ", this.foamTimeOnBrushRing)
      }
      this.isDeviceReady = !0, this.E2Ready = !0, this.updateSelfInspectionReady();
      var l = -1,
        o = -1;
      e.length >= 16 && (l = e[13], h.default.debug("E2红光照射时长 = ", l));
      e.length >= 17 && (o = e[14], h.default.debug("E2蓝光照射时长 = ", o));
      if (l > 0 ? (this.redLightTime = l, wx.setStorageSync("redDuration", this.redLightTime), o > 0 && (this.blueLightTime = o, wx.setStorageSync("blueDuration", this.blueLightTime)), 1 == this.redBlueLightSwitch && (this.redBlueLightMode = o > 0 ? 3 : 1, wx.setStorageSync("redBlueLightMode", this.redBlueLightMode))) : o > 0 && (this.blueLightTime = o, wx.setStorageSync("blueDuration", this.blueLightTime), 1 == this.redBlueLightSwitch && (this.redBlueLightMode = 2, wx.setStorageSync("redBlueLightMode", this.redBlueLightMode))), e.length >= 18) {
        var u = e[15];
        0 == u ? this.regularSelfCleanSwitch = 0 : (this.regularSelfCleanSwitch = 1, this.regularSelfCleanGear = u), h.default.debug("E2定时自清洁开关 = ", this.regularSelfCleanSwitch), h.default.debug("E2定时自清洁时长 = ", this.regularSelfCleanGear)
      }
    }
  }, {
    key: "dealWithCommand",
    value: function(e) {
      e[5]
    }
  }, {
    key: "dealWithE9",
    value: function(e) {
      h.default.debug("--- E9 ---");
      var t = e[6];
      this.deodorizationSwitch = t >> 5 & 1;
      var i = t >> 7 & 1;
      this.isOnSeat = i, h.default.debug("E9 着座 = ", this.isOnSeat);
      var s = t >> 3 & 1;
      this.useE9Cover && (this.coverOn = s, h.default.debug("E9 盖板 = ", this.coverOn));
      var a = e[7],
        n = a >> 0 & 1;
      this.inletSensorFault = n;
      var o = a >> 2 & 1;
      this.outletSensorFault = o;
      var u = a >> 3 & 1,
        r = a >> 4 & 1;
      this.inletOverTemperature = r;
      var d = a >> 5 & 1;
      this.outletOverTemperature = d;
      var c = a >> 6 & 1;
      this.flowAbnormal = c || u;
      var v = a >> 7 & 1;
      this.waterShortage = v;
      var f = e[8],
        g = f >> 1 & 1;
      this.seatTempError = g;
      var S = f >> 5 & 1;
      this.seatTempOver = S;
      var m = f >> 0 & 1;
      this.ambientSensorFault = m;
      var w = e[10],
        b = w >> 0 & 1,
        L = w >> 1 & 1;
      h.default.debug("E9 红光状态 = ", b), h.default.debug("E9 蓝光状态 = ", L), this.redBlueLightSwitch = 1 == b || 1 == L ? 1 : 0;
      var y = 1 == (w >> 3 & 1);
      this.isAuto = y, h.default.debug("E9 自动 = ", y);
      var T = w >> 7 & !0;
      this.isStrongWeakMessage = T, h.default.debug("E9 强弱按摩 = ", this.isStrongWeakMessage);
      var U = w >> 5 & !0,
        C = e[9],
        A = this.toiletMode,
        p = !1,
        D = !1,
        E = !1,
        W = 0;
      console.log("this.isLatestWomanMode = " + this.isLatestWomanMode), 1 == C ? (this.isLatestWomanMode = !1, y || (A = l.CleanMode.NONE, this.userId = 0, this.cleanModeId = 0), D = !0, h.default.debug("E9 工作状态 = 停止待机01")) : 2 == C ? (this.isLatestWomanMode = !1, y ? 0 != this.cleanModeId && (this.dryOrCleanRemainTime = 0) : A = l.CleanMode.NONE, D = !0, h.default.debug("E9 工作状态 = 停止待机02")) : 3 == C ? (this.isLatestWomanMode = !1, A = l.CleanMode.NOZZLE_CLEAN, h.default.debug("E9 工作状态 = 喷嘴清洁")) : 131 == C ? (this.isLatestWomanMode = !1, A = l.CleanMode.REPLACE_NOZZLE, E = !0, h.default.debug("E9 工作状态 = 喷嘴更换")) : 16 == C || 144 == C ? (this.isLatestWomanMode = !1, W = 144 == C ? 1 : 0, p = !0, y && 0 == this.cleanModeId ? (this.latestAutoCleanMode == l.CleanMode.NONE && (this.latestAutoCleanMode = l.CleanMode.AUTO_HIP_WASH), A = this.latestAutoCleanMode, h.default.debug("E9 工作状态 = 暖风阶段(普通清洗)")) : (A = l.CleanMode.DRY, y && 0 != this.cleanModeId ? h.default.debug("E9 工作状态 = 暖风阶段(定制洗)") : h.default.debug("E9 工作状态 = 暖风模式"))) : U ? (this.isLatestWomanMode = !1, A = l.CleanMode.DEFECT_WASH, h.default.debug("E9 工作状态 = 助便洗")) : C >> 5 & !0 ? (this.isLatestWomanMode = !1, A = y ? l.CleanMode.AUTO_HIP_WASH : l.CleanMode.HIP_WASH, y && 0 == this.cleanModeId && (this.latestAutoCleanMode = A), h.default.debug("E9 工作状态 = " + (y ? "自动臀洗" : "臀洗"))) : C >> 6 & !0 && (this.isLatestWomanMode = !0, A = y ? l.CleanMode.AUTO_WOMAN_WASH : l.CleanMode.WOMAN_WASH, h.default.debug("E9 工作状态 = " + (y ? "自动妇洗" : "妇洗")), y && 0 == this.cleanModeId && (this.latestAutoCleanMode = l.CleanMode.AUTO_WOMAN_WASH)), 1 == (w >> 2 & 1) ? this.deviceInfo.hasSoftMistWash ? (A = l.CleanMode.SOFT_MIST, h.default.debug("E9 工作状态 = 柔雾洗")) : (A = l.CleanMode.SITZ_BATH, h.default.debug("E9 工作状态 = 舒适坐浴")) : this.deviceInfo.hasSoftMistWash ? h.default.debug("E9 柔雾洗 = 0") : h.default.debug("E9 舒适坐浴 = 0"), this.isReplaceNozzleOn = E, h.default.debug("E9 更换喷嘴 = ", this.isReplaceNozzleOn), this.airMove = W, h.default.debug("E9 暖风移动 = " + this.airMove), this.isOnStopStage = D, this.isOnDry = p, this.moveWash = C >> 7 & 1, this.wideWashMode = C >> 7 & 1, h.default.debug("E9 清洗移动 = ", this.wideWashMode), this.largeSprayState = C >> 2 & 1, h.default.debug("E9 大喷水状态 = ", this.largeSprayState);
      var M = e[11];
      if (this.deviceInfo.hasMassageWash && (this.isMassageWash = M >> 3 & 1, h.default.debug("E9 按摩洗(脉冲洗) = ", this.isMassageWash)), e[2] >= 10) {
        var F = e[11],
          k = F >> 0 & 1;
        h.default.debug("E9 自清洁开关 = " + k), this.hasSelfClean && (this.isSelfClean = 1 == k);
        var R = F >> 6 & 1;
        this.isLiftClean = R, h.default.debug("E9 抬升清洁开关 = " + this.isLiftClean)
      }
      if (e.length >= 15) {
        var B = e[12];
        this.isNozzleDry = B >> 1 & 1, h.default.debug("E9 喷杆烘干仓状态 = " + this.isNozzleDry), this.medicineWashReady = B >> 2 & 1, h.default.debug("E9 药洗药瓶就绪状态 = " + this.medicineWashReady)
      }
      if (e.length >= 16) {
        var _, z, I, O, P, N = 0,
          V = e[13];
        _ = V >> 7 & 1, h.default.debug("E9 护理臀洗 = " + _), z = V >> 6 & 1, h.default.debug("E9 护理妇洗 = " + z), I = V >> 5 & 1, h.default.debug("E9 劲爽洗(护理强洗) = " + I), O = V >> 4 & 1, h.default.debug("E9 护理柔洗阶段 = " + O), P = V >> 3 & 1, h.default.debug("E9 药洗自清洁(阶段) = " + P), 1 == _ || 1 == z || 1 == I ? (1 == O ? N = 2 : 1 == P ? N = 3 : this.isOnDry || A == l.CleanMode.DRY ? N = 4 : A != l.CleanMode.HIP_WASH && A != l.CleanMode.WOMAN_WASH || (N = 1), N > 0 && (this.nursingWashStage = N)) : this.nursingWashStage = 0, h.default.debug("E9 护理阶段码 = " + N), 1 == _ && (A = l.CleanMode.NURSING_HIP), 1 == z && (A = l.CleanMode.NURSING_WOMAN), 1 == I && (A = l.CleanMode.NURSING_STRONG)
      }
      h.default.debug("E9 新工作状态值 = ", A), h.default.debug("E9 旧工作状态值 = ", this.toiletMode), this.toiletMode != A && (this.toiletMode = A, h.default.debug("=========== 工作状态变化 ==========="), this.toiletMode != l.CleanMode.NONE ? (h.default.debug("E9 查询倒计时"), this.startCountDown()) : this.stopCountDown()), this.E9Ready = !0, this.updateSelfInspectionReady()
    }
  }, {
    key: "dealWithFA",
    value: function(e) {
      var t = this;
      h.default.debug("--- FA ---");
      var i = e[6],
        s = i >> 7 & 1;
      this.unblockSwitch = s, h.default.debug("FA疏通中 = ", this.unblockSwitch);
      var a = i >> 1 & 1;
      this.autoFlushSwitch = a;
      var n = i >> 3 & 1;
      this.autoCoverSwitch = n;
      var l = i >> 4 & 7;
      this.waterTempLevel = l, h.default.debug("FA水温 = " + this.waterTempLevel);
      var o = e[7],
        u = o >> 4 & 7;
      this.hipwashNozzlePosition = u;
      var r = o >> 7 & 1;
      this.smartPowerSave = r, h.default.debug("FA智能节电 = ", this.smartPowerSave);
      var d = 7 & o;
      this.seatTempLevel = d, h.default.debug("FA座温 = ", this.seatTempLevel);
      var c = e[8],
        v = c >> 7 & 1,
        f = c >> 4 & 7;
      this.lightSensorSwitch = v, this.hipwashWaterPressure = f, h.default.debug("FA臀洗水压 = ", this.hipwashWaterPressure), this.airTempLevel = 7 & c, h.default.debug("FA风温 = ", this.airTempLevel);
      var g = e[9],
        S = 15 & g,
        m = g >> 4 & 15;
      this.womanNozzlePosition = S, this.womanWaterPressure = m, h.default.debug("FA妇洗水压 = ", this.womanWaterPressure), h.default.debug("FA臀洗水压 = ", this.hipwashWaterPressure);
      var w = e[10];
      this.autoCloseCoverWithFlushSwitch = w >> 1 & 1, h.default.debug("FA关盖冲厕 = ", this.autoCloseCoverWithFlushSwitch), this.autoDeodorization = w >> 0 & 1, h.default.debug("FA自动除臭 = ", this.autoDeodorization);
      var b = w >> 2 & 1;
      1 == b ? 0 == this.flushSmallSwitch && (this.startFlushSmallTime = new Date) : null != this.startFlushSmallTime && (this.closeFlushTimer(), this.isReflushEnable = !1, this.flushTimer = setTimeout((function() {
        t.isReflushEnable = !0, null != t.msgValueChangeCallBack && t.msgValueChangeCallBack(null)
      }), 3e4), this.startFlushSmallTime = null), this.flushSmallSwitch = b, h.default.debug("FA小冲 = ", this.flushSmallSwitch);
      var L = (112 & w) >> 4;
      this.windSpeedLevel = L, h.default.debug("FA风速档位：", this.windSpeedLevel);
      var y = w >> 3 & 1;
      1 == y ? 0 == this.flushSmallSwitch && (this.startFlushLargeTime = new Date) : null != this.startFlushLargeTime && (this.closeFlushTimer(), this.isReflushEnable = !1, this.flushTimer = setTimeout((function() {
        t.isReflushEnable = !0, null != t.msgValueChangeCallBack && t.msgValueChangeCallBack(null)
      }), 3e4), this.startFlushLargeTime = null), this.flushLargeSwitch = y, h.default.debug("FA大冲 = ", this.flushLargeSwitch);
      var T = e[11],
        U = T >> 3 & 1,
        C = T >> 4 & 1,
        A = T >> 6 & 3;
      this.atmosphereLightSwitch = C, h.default.debug("FA氛围灯状态 = ", this.atmosphereLightSwitch), this.atmosphereLightMode = A, h.default.debug("FA氛围灯（模式）颜色 = ", this.atmosphereLightMode), this.uvWaterDisinfectSwitch = T >> 5 & 1, h.default.debug("FA紫外线杀菌状态 = ", this.uvWaterDisinfectSwitch), this.autoTemp = U, h.default.debug("FA四季温感 = ", this.autoTemp);
      var p = e[12],
        D = p >> 3 & 1;
      this.autoBubble = D;
      var E = p >> 1 & 1;
      this.filterInsufficient = E;
      var W = p >> 0 & 1;
      this.filterLifeAlarmEnable = W, h.default.debug("FA滤芯提醒使能 = ", this.filterLifeAlarmEnable);
      var M = p >> 2 & 1;
      if (M ? 0 == this.bubbleSwitchTemp && (this.startBubbleTime = new Date) : null != this.startBubbleTime && (this.closeBubbleTimer(), this.isBubbleEnable = !1, this.bubbleDisableReason = 0, h.default.debug("==== 开始泡沫盾计时 ===="), this.bubbleLockTimer = setTimeout((function() {
          h.default.debug("==== 结束泡沫盾计时 ===="), t.isBubbleEnable = !0, null != t.msgValueChangeCallBack && t.msgValueChangeCallBack(null)
        }), 1e3 * this.deviceInfo.bubbleLockTime), this.startBubbleTime = null), this.deviceInfo.hasQuickCleanMode) {
        var F = p >> 2 & 1;
        console.log("B7_2 = " + F), console.log("this.isQuickClean = " + this.isQuickClean), console.log("this.bubbleSwitch = " + this.bubbleSwitch), F ? 1 == this.isQuickClean ? (this.bubbleSwitch = 0, this.isQuickClean = 1) : (this.bubbleSwitch = 1, this.isQuickClean = 0) : (this.bubbleSwitch = 0, this.isQuickClean = 0)
      } else this.bubbleSwitch = M;
      h.default.debug("FA 快速洗 = ", this.isQuickClean), h.default.debug("FA 魔力泡 = ", this.bubbleSwitch), this.bubbleSwitchTemp = M;
      var k = p >> 4 & 1;
      this.openLoopBubble = k;
      var R = p >> 5 & 1;
      this.preWettingSwitch = R, h.default.debug("FA 预湿润开关 = ", this.preWettingSwitch);
      var B = p >> 6 & 1;
      this.isAddLiquidBoxOn = B, h.default.debug("FA 加液盒 = ", this.isAddLiquidBoxOn);
      var _ = e[13],
        z = _ >> 5 & 1;
      this.footSensorSwitch = z, h.default.debug("FA 脚感模式开关 = ", this.footSensorSwitch);
      var I = _ >> 4 & 1;
      this.autoSmallFlushSwitch = I, h.default.debug("FA 自动小冲开关 = ", this.autoSmallFlushSwitch), this.wideWashLevel = 7 & _, h.default.debug("FA幅度档位 = ", this.wideWashLevel), this.wideWashLevel < 1 && (this.wideWashLevel = 1);
      var O = -1;
      if (1 == (_ >> 6 & 1) ? O = 0 : 1 == (_ >> 7 & 1) && (O = 2), this.bubbleLevel = O, h.default.debug("FA发泡剂液位(-1:无状态,0:不足,2:充足) = ", this.bubbleLevel), e.length > 17) {
        var P = e[14],
          N = P >> 3 & 1,
          V = P >> 4 & 1,
          q = P >> 6 & 1,
          H = P >> 7 & 1;
        this.isPetWash = N, h.default.debug("FA宠物洗 = ", this.isPetWash), this.aiVoiceSettingSwitch = V, h.default.debug("FA离线语音开关 = ", this.aiVoiceSettingSwitch), this.isAutoNozzleDry = q, h.default.debug("FA自动喷杆烘干 = ", this.isAutoNozzleDry), this.isCloseCoverAutoSmallFlush = H, h.default.debug("FA男士自动关盖小冲 = ", this.isCloseCoverAutoSmallFlush)
      }
      var x = e[15],
        Q = x >> 4 & 1;
      this.isSeatTooLong = Q, h.default.debug("FA久坐提醒 = ", this.isSeatTooLong);
      var G = x >> 6 & 1;
      this.nozzleUVDisinfect = G, h.default.debug("FA喷嘴杀菌状态 = ", this.nozzleUVDisinfect);
      var j = x >> 7 & 1;
      if (this.nozzleUVDisinfectSwitch = j, h.default.debug("FA喷嘴杀菌开关 = ", this.nozzleUVDisinfectSwitch), e.length >= 19) {
        var Y = 3 & e[16];
        this.nightLightBrightness = Y, h.default.debug("FA夜灯亮度档位 = ", this.nightLightBrightness)
      }
      this.isDeviceReady = !0, this.FAReady = !0, this.updateSelfInspectionReady()
    }
  }, {
    key: "dealWithEC",
    value: function(e) {
      e[6]
    }
  }, {
    key: "dealWith20",
    value: function(e) {
      e[6]
    }
  }, {
    key: "dealWithEA",
    value: function(e) {
      h.default.debug("--- EA ---");
      var t = e[6],
        i = t >> 1 & 1;
      this.ringOn = i;
      var s = t >> 3 & 1;
      this.coverOn = s;
      var a = t >> 6 & 1;
      this.coverRun = a;
      var n = t >> 5 & 1;
      this.ringRun = n, h.default.debug("EA盖板 = ", this.coverOn), h.default.debug("EA座圈 = ", this.ringOn), 1 == this.ringRun || 1 == this.coverRun ? this.startCoverRingRunTimer() : this.stopCoverRingRunTimer();
      var l = e[8],
        o = l >> 4 & 1;
      this.autoCoverSensitive = o;
      var u = 15 & l;
      if (this.flipSenseDistance = u, h.default.debug("EA微波感应距离 = ", this.flipSenseDistance), h.default.debug("EA盖板的灵敏度 = ", o), e.length >= 11) {
        var r = e[9];
        this.infiniteSettingSenseDistance = r, h.default.debug("EA无极/AI调距档位(cm) = ", r), this.infiniteSettingSenseDistance < 10 && (this.infiniteSettingSenseDistance = 10)
      }
    }
  }, {
    key: "startCoverRingRunTimer",
    value: function() {
      var e = this;
      this.stopCoverRingRunTimer(), this.coverRingRunTimer = setTimeout((function() {
        e.ringRun = 0, e.coverRun = 0, null != e.msgValueChangeCallBack && e.msgValueChangeCallBack(null)
      }), 1e4)
    }
  }, {
    key: "stopCoverRingRunTimer",
    value: function() {
      this.coverRingRunTimer && (clearTimeout(this.coverRingRunTimer), this.coverRingRunTimer = null)
    }
  }, {
    key: "writeDeviceInfo",
    value: function(e) {
      var t = new ArrayBuffer(10),
        i = new DataView(t);
      i.setUint8(0, 250), i.setUint8(1, t.byteLength), i.setUint8(2, 1), i.setUint8(3, 5), i.setUint8(4, 1), i.setUint8(5, 1);
      for (var s = 6, a = 0; a < e.length; a += 2) {
        var n = parseInt(e.substr(a, 2), 16);
        i.setUint8(s, n), s += 1
      }
      var l = this.calculateCommunicateChecksum(i);
      i.setUint8(9, l), this.writeCommunicateCommand(t)
    }
  }, {
    key: "readDeviceInfo",
    value: function() {
      var e = new ArrayBuffer(4),
        t = new DataView(e);
      t.setUint8(0, 250), t.setUint8(1, e.byteLength), t.setUint8(2, 2);
      var i = this.calculateCommunicateChecksum(t);
      t.setUint8(3, i), this.writeCommunicateCommand(e)
    }
  }, {
    key: "closeBubbleTimer",
    value: function() {
      this.bubbleLockTimer && (h.default.error("==== 关闭泡沫盾计时 ===="), this.isBubbleEnable = !0, clearTimeout(this.bubbleLockTimer), this.bubbleLockTimer = null)
    }
  }, {
    key: "closeFlushTimer",
    value: function() {
      this.flushTimer && (this.isReflushEnable = !0, clearTimeout(this.flushTimer), this.flushTimer = null)
    }
  }, {
    key: "startConnect",
    value: function(e, t) {
      this.isDeviceReady = !1, this.closeBubbleTimer(), i(s(c.prototype), "startConnect", this).call(this, e, t)
    }
  }, {
    key: "stopConnnect",
    value: function() {
      this.isDeviceReady = !1, this.closeBubbleTimer(), i(s(c.prototype), "stopConnnect", this).call(this)
    }
  }, {
    key: "_set1FAction0",
    value: function(e) {
      var t = new ArrayBuffer(9),
        i = new DataView(t);
      i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, t.byteLength - 4), i.setUint8(3, c.BLE_ADDRESS), i.setUint8(4, c.TOILET_ADDRESS), i.setUint8(5, 31), i.setUint8(6, e);
      var s = this.calculateChecksum(i);
      i.setUint8(7, s), i.setUint8(8, 252), this.writeCommand(t)
    }
  }, {
    key: "_set1FAction",
    value: function(e, t) {
      var i = new ArrayBuffer(10),
        s = new DataView(i);
      s.setUint8(0, 243), s.setUint8(1, 244), s.setUint8(2, i.byteLength - 4), s.setUint8(3, c.BLE_ADDRESS), s.setUint8(4, c.TOILET_ADDRESS), s.setUint8(5, 31), s.setUint8(6, e), s.setUint8(7, t);
      var a = this.calculateChecksum(s);
      s.setUint8(8, a), s.setUint8(9, 252), this.writeCommand(i)
    }
  }, {
    key: "_set1FAction2",
    value: function(e, t, i) {
      var s = new ArrayBuffer(11),
        a = new DataView(s);
      a.setUint8(0, 243), a.setUint8(1, 244), a.setUint8(2, s.byteLength - 4), a.setUint8(3, c.BLE_ADDRESS), a.setUint8(4, c.TOILET_ADDRESS), a.setUint8(5, 31), a.setUint8(6, e), a.setUint8(7, t), a.setUint8(8, i);
      var n = this.calculateChecksum(a);
      a.setUint8(9, n), a.setUint8(10, 252), this.writeCommand(s)
    }
  }, {
    key: "_set1FAction3",
    value: function(e, t, i, s) {
      var a = new ArrayBuffer(12),
        n = new DataView(a);
      n.setUint8(0, 243), n.setUint8(1, 244), n.setUint8(2, a.byteLength - 4), n.setUint8(3, c.BLE_ADDRESS), n.setUint8(4, c.TOILET_ADDRESS), n.setUint8(5, 31), n.setUint8(6, e), n.setUint8(7, t), n.setUint8(8, i), n.setUint8(9, s);
      var l = this.calculateChecksum(n);
      n.setUint8(10, l), n.setUint8(11, 252), this.writeCommand(a)
    }
  }, {
    key: "setRedBlueLightParam",
    value: function(e, t, i) {
      var s = new ArrayBuffer(12),
        a = new DataView(s);
      a.setUint8(0, 243), a.setUint8(1, 244), a.setUint8(2, s.byteLength - 4), a.setUint8(3, c.BLE_ADDRESS), a.setUint8(4, c.TOILET_ADDRESS), a.setUint8(5, 31), a.setUint8(6, 53), a.setUint8(7, e), a.setUint8(8, t), a.setUint8(9, i);
      var n = this.calculateChecksum(a);
      a.setUint8(10, n), a.setUint8(11, 252), this.writeCommand(s)
    }
  }, {
    key: "getErrorCode",
    value: function() {
      return 1 == this.flowAbnormal ? 1 : 1 == this.outletOverTemperature ? 2 : 1 == this.inletOverTemperature ? 3 : 1 == this.inletSensorFault ? 4 : 1 == this.outletSensorFault ? 5 : 1 == this.seatTempOver ? 6 : 1 == this.seatTempError ? 7 : 1 == this.ambientSensorFault ? 8 : 1 == this.filterInsufficient ? 20 : 1 == this.waterShortage ? 21 : 0
    }
  }, {
    key: "getErrorCodes",
    value: function() {
      var e = [];
      return 1 == this.flowAbnormal && h.default.debug("获取所有的错误码  --- 2"), 1 == this.outletOverTemperature && (h.default.debug("获取所有的错误码  --- 3"), e.push(2)), 1 == this.inletOverTemperature && h.default.debug("获取所有的错误码  --- 4"), 1 == this.inletSensorFault && (h.default.debug("获取所有的错误码  --- 5"), e.push(4)), 1 == this.outletSensorFault && (h.default.debug("获取所有的错误码  --- 6"), e.push(5)), 1 == this.seatTempOver && (h.default.debug("获取所有的错误码  --- 7"), e.push(6)), 1 == this.seatTempError && (h.default.debug("获取所有的错误码  --- 8"), e.push(7)), 1 == this.ambientSensorFault && (h.default.debug("获取所有的错误码  --- 9"), e.push(8)), 1 == this.filterInsufficient && (h.default.debug("获取所有的错误码  --- 10"), e.push(20)), e
    }
  }, {
    key: "setBit",
    value: function(e, t, i) {
      if (t < 0 || t > 7) throw new Error("Bit position must be between 0 and 7");
      if (1 === i) return e | 1 << t;
      if (0 === i) return e & ~(1 << t);
      throw new Error("Bit value must be 0 or 1")
    }
  }, {
    key: "writeToiletSettingsToNFC",
    value: function() {
      var e = new ArrayBuffer(5),
        t = new Uint8Array(e);
      if (t[0] |= 0, t[0] |= this.autoFlushSwitch << 1, t[0] |= this.gestureSwitch << 2, t[0] |= this.autoCoverSwitch << 3, t[0] |= this.waterTempLevel << 4, console.log("------------- 写入遥控器(NFC)的参数 -------------"), console.log("光感夜灯开关：0"), console.log("自动冲刷开关：" + this.autoFlushSwitch), console.log("手势开关：" + this.gestureSwitch), console.log("自动翻盖开关：" + this.autoCoverSwitch), console.log("水温档位：" + this.waterTempLevel), t[1] |= this.seatTempLevel, this.hipwashNozzlePosition > 7) {
        var i = this.hipwashNozzlePosition - 8;
        t[1] |= 8, t[1] |= i << 4
      } else t[1] |= this.hipwashNozzlePosition << 4;
      if (t[1] |= this.smartPowerSave << 7, console.log("座温档位：" + this.seatTempLevel), console.log("臀洗喷嘴位置档位：" + this.hipwashNozzlePosition), console.log("节电开关：" + this.smartPowerSave), t[2] |= this.airTempLevel, this.hipwashWaterPressure > 7) {
        var s = this.hipwashWaterPressure - 8;
        t[2] |= 8, t[2] |= s << 4
      } else t[2] |= this.hipwashWaterPressure << 4;
      return t[2] |= this.lightSensorSwitch << 7, console.log("风温档位：" + this.airTempLevel), console.log("臀洗水压档位：" + this.hipwashWaterPressure), console.log("夜灯开关：" + this.lightSensorSwitch), t[3] |= this.womanWaterPressure, t[3] |= this.womanNozzlePosition << 4, console.log("妇洗水压档位：" + this.womanWaterPressure), console.log("妇洗喷嘴位置档位：" + this.womanNozzlePosition), t[4] |= this.uvWaterDisinfectSwitch << 0, t[4] |= this.autoSmallFlushSwitch << 1, t[4] |= this.isBuzzerEnable << 2, t[4] |= this.isSeatTooLong << 3, t[4] |= this.preWettingSwitch << 4, t[4] |= this.openLoopBubble << 5, t[4] |= (this.autoBubble ? 1 : 0) << 6, t[4] |= this.footSensorSwitch << 7, console.log("UV杀菌开关：" + this.uvWaterDisinfectSwitch), console.log("自动小冲开关：" + this.autoSmallFlushSwitch), console.log("蜂鸣器开关：" + this.isBuzzerEnable), console.log("久坐提醒开关：" + this.isSeatTooLong), console.log("预湿润开关：" + this.preWettingSwitch), console.log("开圈发泡开关：" + this.openLoopBubble), console.log("落座发泡开关：" + (this.autoBubble ? 1 : 0)), console.log("脚感开关：" + this.footSensorSwitch), e
    }
  }, {
    key: "getCurrentWashParams",
    value: function(e) {
      return [this.isStrongWeakMessage ? 1 : 0, this.wideWashMode, this.wideWashLevel, this.waterTempLevel, e == l.CleanMode.WOMAN_WASH || e == l.CleanMode.AUTO_WOMAN_WASH ? this.womanWaterPressure : this.hipwashWaterPressure, e == l.CleanMode.WOMAN_WASH || e == l.CleanMode.AUTO_WOMAN_WASH ? this.womanNozzlePosition : this.hipwashNozzlePosition, this.airMove, this.airTempLevel, this.windSpeedLevel]
    }
  }], [{
    key: "getInstance",
    value: function() {
      return this._singleton || (this._singleton = new c), this._singleton
    }
  }]), c
}(o.default);
c.BLE_ADDRESS = 146, c.TOILET_ADDRESS = 33, c.BROAD_ADDRESS = 0, c.FLIP_COVER_ADDRESS = 34;
var v = c;
exports.default = v;