Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e = require("../../../@babel/runtime/helpers/toConsumableArray"),
  t = require("../../../@babel/runtime/helpers/classCallCheck"),
  n = require("../../../@babel/runtime/helpers/createClass"),
  i = require("../../../@babel/runtime/helpers/get"),
  a = require("../../../@babel/runtime/helpers/getPrototypeOf"),
  o = require("../../../@babel/runtime/helpers/inherits"),
  r = require("../../../@babel/runtime/helpers/createSuper"),
  s = (l(require("../BLEController.js")), l(require("../../debuglog.js"))),
  u = l(require("./SoundColorLightController.js"));

function l(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}
var h = require("../bleutil.js"),
  d = function(u) {
    o(d, u);
    var l = r(d);

    function d() {
      var e;
      t(this, d);
      for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++) i[a] = arguments[a];
      return (e = l.call.apply(l, [this].concat(i))).deviceInfo = {}, e.model = "-", e.light = 0, e.lightBrightness = 100, e.nightLightBrightness = 100, e.nightLight = 0, e.weakWarm = 0, e.strongWarm = 0, e.wind = 0, e.dry = 0, e.ventilation = 0, e.airClean = 0, e.swing = 0, e.powerstate = 0, e.beeperOn = 1, e.offlineVoiceSwitch = 0, e.aiClean = 0, e.holidayMode = 0, e.warmHouse = 0, e.aiCleanRemain = 0, e.odorLevel = 0, e.odorConcentration = 0, e.autoDeodorEnable = 0, e.autoDehumidifyEnable = 0, e.autoDeodorThresholdLevel = 0, e.autoDeodorThreshold = 200, e.autoDehumidifyThreshold = 60, e.aiCleanEnable = 0, e.personLightEnable = 0, e.personDeodorEnable = 0, e.personVentilationEnable = 0, e.personShutdownEnable = 0, e.personVoiceWakeFreeEnable = 0, e.temp = 18, e.humidity = 50, e.disableWindSpeedLevel = 0, e.windSpeedLevel = 1, e.reverseWindSpeedLevel = 1, e.dryRemain = 120, e.windRemain = 120, e.ventilationRemain = 120, e.modeRemain = 120, e.warmRemain = 120, e.airCleanRemain = 30, e.delayLightOffTime = 30, e.ventilationMaxTime = 120, e.windMaxTime = 120, e.warmMaxTime = 120, e.warmWeakMaxTime = 120, e.customModeId = 0, e.aimTemp = 42, e.personSenseStartTime = {
        enable: !0,
        startHour: 6,
        startMinute: 0,
        endHour: 22,
        endMinute: 0
      }, e.nightLightTime = {
        enable: !0,
        startHour: 18,
        startMinute: 0,
        endHour: 6,
        endMinute: 0
      }, e.autoTempSceneTime = {
        enable: !0,
        startHour: 18,
        startMinute: 0,
        endHour: 6,
        endMinute: 0
      }, e.manMode = {
        action: 3,
        actionTime: 30,
        warmTemp: 42,
        isTempHumidityBalanceOn: !1,
        isDryDeHumidifyOn: !0
      }, e.womanMode = {
        action: 3,
        actionTime: 40,
        warmTemp: 42,
        isTempHumidityBalanceOn: !1,
        isDryDeHumidifyOn: !0
      }, e.dryMode = {
        isRapidVentilation: !0,
        warmTemp: 42,
        warmTime: 45,
        isColdDrying: !0
      }, e.linkSceneList = [], e.appointmentList = [], e.senseDistance = 100, e
    }
    return n(d, [{
      key: "setDeviceInfo",
      value: function(e) {
        this.deviceInfo = e
      }
    }, {
      key: "getManModeMaxTime",
      value: function() {
        return this.manMode.isDryDeHumidifyOn ? this.manMode.actionTime + 15 : this.manMode.actionTime
      }
    }, {
      key: "getWoManModeMaxTime",
      value: function() {
        return this.womanMode.isDryDeHumidifyOn ? this.womanMode.actionTime + 15 : this.womanMode.actionTime
      }
    }, {
      key: "getDryMaxTime",
      value: function() {
        var e, t = this.dryMode.isRapidVentilation ? 5 : 0;
        return e = this.deviceInfo && this.deviceInfo.hasColdDrying ? 5 : 0, this.dryMode.warmTime + t + e
      }
    }, {
      key: "openPower",
      value: function(e) {
        this._startControl(50, e ? 0 : 1)
      }
    }, {
      key: "openLight",
      value: function(e) {
        this._startControl(68, e ? 1 : 0)
      }
    }, {
      key: "openNightLight",
      value: function(e) {
        this._startControl(51, e ? 1 : 0)
      }
    }, {
      key: "openDry",
      value: function(e) {
        this._startControl(56, e ? 1 : 0)
      }
    }, {
      key: "openVentilation",
      value: function(e) {
        this._startControl(53, e ? 1 : 0)
      }
    }, {
      key: "openWeakWarmWind",
      value: function(e) {
        this._startControl(52, e ? 1 : 0)
      }
    }, {
      key: "openStrongWarmWind",
      value: function(e) {
        this._startControl(52, e ? 2 : 0)
      }
    }, {
      key: "openWind",
      value: function(e) {
        this._startControl(54, e ? 1 : 0)
      }
    }, {
      key: "openAirClean",
      value: function(e) {
        this._startControl(84, e ? 1 : 0)
      }
    }, {
      key: "openSwing",
      value: function(e) {
        console.log("value = " + e), this._startControl(64, e)
      }
    }, {
      key: "_startControl",
      value: function(e) {
        for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
        var a = new ArrayBuffer(8 + n.length),
          o = new DataView(a);
        o.setUint8(6, e), n.forEach((function(e, t) {
          o.setUint8(7 + t, e)
        })), this._updateDefaultValue(o), this.writeCommand(a)
      }
    }, {
      key: "onDeviceReady",
      value: function(e) {
        var t = this;
        console.log("===== onDeviceReady ===== 00000 "), console.log("设备已就绪"), i(a(d.prototype), "onDeviceReady", this).call(this, e), this.appointmentList = [], setTimeout((function() {
          t.quaryDeviceSettingState()
        }), 1e3), setTimeout((function() {
          t.quaryDeviceRealTimeState()
        }), 1500), setTimeout((function() {
          t.updateTime()
        }), 2e3)
      }
    }, {
      key: "quaryDeviceSettingState",
      value: function() {
        s.default.debug("查询设置类参数 31"), this._startControl(17, 0)
      }
    }, {
      key: "quaryDeviceRealTimeState",
      value: function() {
        s.default.debug("查询实时类参数 30"), this._startControl(17, 1)
      }
    }, {
      key: "quaryTimeInfoState",
      value: function() {
        var e = this;
        s.default.debug("查询信息时段 0x52"), this._startControl(82, 255), setTimeout((function() {
          e._startControl(17, 0)
        }), 200)
      }
    }, {
      key: "quaryCustomMode",
      value: function() {
        s.default.debug("查询私人定制模式 0x51"), this._startControl(81, 255)
      }
    }, {
      key: "quaryManMode",
      value: function() {
        s.default.debug("查询男士定制模式 0x51"), this._startControl(81, 1)
      }
    }, {
      key: "quaryWomanMode",
      value: function() {
        s.default.debug("查询母婴定制模式 0x51"), this._startControl(81, 2)
      }
    }, {
      key: "quaryDryMode",
      value: function() {
        s.default.debug("查询干燥模式 0x53"), this._startControl(83)
      }
    }, {
      key: "setAppointment",
      value: function(t) {
        var n = t || {},
          i = "number" == typeof n.index ? n.index : 0,
          a = 0;
        a |= (1 & ("delete" === n.op ? 0 : 1)) << 7;
        var o = !(!n.startDate || !n.endDate);
        o && (a |= 64), a |= 63 & i;
        var r = Array.isArray(n.repeatDays) ? n.repeatDays : null,
          s = void 0 === n.enabled || !!n.enabled,
          u = 254 & this._appointmentRepeatMask(r),
          l = [a, u |= s ? 1 : 0];
        o && (l.push.apply(l, e(this._appointmentDateBytes(n.startDate))), l.push.apply(l, e(this._appointmentDateBytes(n.endDate))));
        var h = "number" == typeof n.hour ? n.hour : 8,
          d = "number" == typeof n.minute ? n.minute : 0;
        l.push(255 & h, 255 & d);
        var c = 1 === n.action || "aiclean" === n.action ? 1 : 0;
        l.push(c);
        var f = "number" == typeof n.temperature ? n.temperature : 42,
          m = "number" == typeof n.duration ? n.duration : 30;
        l.push(255 & f, 255 & m), this._startControl.apply(this, [78].concat(l))
      }
    }, {
      key: "deleteAppointment",
      value: function(e, t) {
        this.setAppointment({
          op: "delete",
          index: "number" == typeof t ? t : 0,
          action: e
        })
      }
    }, {
      key: "queryAppointment",
      value: function(e, t) {
        this._startControl(79, e, t)
      }
    }, {
      key: "_appointmentRepeatMask",
      value: function(e) {
        if (!Array.isArray(e) || 0 === e.length) return 0;
        var t = 0;
        return e.forEach((function(e) {
          var n = Number(e);
          isNaN(n) || (0 === n && (t |= 128), n >= 1 && n <= 6 && (t |= 1 << n))
        })), 254 & t
      }
    }, {
      key: "_appointmentDateBytes",
      value: function(e) {
        var t = e instanceof Date ? e : new Date(e);
        return [t.getFullYear() - 2e3 & 255, t.getMonth() + 1 & 255, 255 & t.getDate(), 255 & t.getHours(), 255 & t.getMinutes(), 255 & t.getSeconds()]
      }
    }, {
      key: "updateTime",
      value: function() {
        s.default.debug("下发时间同步");
        var e = new Date,
          t = e.getFullYear() - 2e3,
          n = e.getMonth() + 1,
          i = e.getDate(),
          a = e.getHours(),
          o = e.getMinutes(),
          r = e.getSeconds(),
          u = e.getDay(),
          l = this.solarToLunar(e),
          h = l.year - 2e3,
          d = l.month,
          c = l.day;
        this._startControl(2, h, d, c, t, n, i, a, o, r, u)
      }
    }, {
      key: "solarToLunar",
      value: function(e) {
        return {
          year: e.getFullYear(),
          month: e.getMonth() + 1,
          day: e.getDate()
        }
      }
    }, {
      key: "setLightDelayOffTime",
      value: function(e) {
        console.log("==== 确认延时熄灯(5) ===="), this._startControl(60, 7, e)
      }
    }, {
      key: "setWindSpeedLevel",
      value: function(e) {
        this._startControl(59, 0, e)
      }
    }, {
      key: "setReverseWindSpeedLevel",
      value: function(e) {
        this._startControl(59, 1, e)
      }
    }, {
      key: "setWindDurationTime",
      value: function(e) {
        this._startControl(60, 2, e)
      }
    }, {
      key: "setWarmDurationTime",
      value: function(e) {
        this._startControl(60, 0, e)
      }
    }, {
      key: "setWarmWeakDurationTime",
      value: function(e) {
        this._startControl(60, 0, e)
      }
    }, {
      key: "setVentilationDurationTime",
      value: function(e) {
        this._startControl(60, 1, e)
      }
    }, {
      key: "setLightBrightness",
      value: function(e) {
        this._startControl(65, 0, e)
      }
    }, {
      key: "setNightLightBrightness",
      value: function(e) {
        this._startControl(65, 1, e)
      }
    }, {
      key: "setAimWarmTemp",
      value: function(e) {
        s.default.debug("取暖温度设置 = ", e), this._startControl(61, e)
      }
    }, {
      key: "setAutoSensor",
      value: function(e) {
        this.personSenseStartTime.enable = e, this._startControl(69, 4, e ? 1 : 0)
      }
    }, {
      key: "setPersonLightEnable",
      value: function(e) {
        this.setAutoSensor(e)
      }
    }, {
      key: "setPersonDeodorEnable",
      value: function(e) {
        var t = e ? 1 : 0;
        this.personDeodorEnable = t, 1 == this.personDeodorEnable && (this.personVentilationEnable = 0), this._startControl(69, 7, t)
      }
    }, {
      key: "setPersonVentilationEnable",
      value: function(e) {
        var t = e ? 1 : 0;
        this.personVentilationEnable = t, 1 == this.personVentilationEnable && (this.personDeodorEnable = 0), this._startControl(69, 8, t)
      }
    }, {
      key: "setPersonShutdownEnable",
      value: function(e) {
        var t = e ? 1 : 0;
        this.personShutdownEnable = t, this._startControl(69, 9, t)
      }
    }, {
      key: "setAutoDeodorEnable",
      value: function(e) {
        var t = e ? 1 : 0;
        this.autoDeodorEnable = t, this._startControl(69, 0, t)
      }
    }, {
      key: "setAutoDehumidifyEnable",
      value: function(e) {
        var t = e ? 1 : 0;
        this.autoDehumidifyEnable = t, this._startControl(69, 1, t)
      }
    }, {
      key: "setAutoDeodorThreshold",
      value: function(e) {
        var t = "number" == typeof e ? e : 0;
        this.autoDeodorThreshold = t;
        var n = 255 & t,
          i = t >> 8 & 255;
        this._startControl(74, n, i)
      }
    }, {
      key: "setAutoDehumidifyThreshold",
      value: function(e) {
        var t = "number" == typeof e ? e : 0;
        this.autoDehumidifyThreshold = t, this._startControl(70, 255 & t)
      }
    }, {
      key: "setAutoSensorTime",
      value: function(e, t, n, i) {
        this.personSenseStartTime.startHour = e, this.personSenseStartTime.startMinute = t, this.personSenseStartTime.endHour = n, this.personSenseStartTime.endMinute = i, this._startControl(71, 1, e, t, n, i)
      }
    }, {
      key: "setBeeper",
      value: function(e) {
        this.beeperOn = e ? 1 : 0, this._startControl(114, 1, 5, e ? 1 : 0)
      }
    }, {
      key: "setOfflineVoiceSwitch",
      value: function(e) {
        this.offlineVoiceSwitch = e ? 1 : 0, this._startControl(114, 0, 9, e ? 1 : 0)
      }
    }, {
      key: "setNightLightSensor",
      value: function(e) {
        this.nightLightTime.enable = e, this._startControl(69, 6, e ? 1 : 0)
      }
    }, {
      key: "setHolidayMode",
      value: function(e) {
        var t = e ? 1 : 0;
        this.holidayMode = t, this._startControl(69, 11, t)
      }
    }, {
      key: "setPersonVoiceWakeFree",
      value: function(e) {
        var t = e ? 1 : 0;
        this.personVoiceWakeFreeEnable = t, this._startControl(69, 10, t)
      }
    }, {
      key: "setNightLightTime",
      value: function(e, t, n, i) {
        this.nightLightTime.startHour = e, this.nightLightTime.startMinute = t, this.nightLightTime.endHour = n, this.nightLightTime.endMinute = i, this._startControl(71, 0, e, t, n, i)
      }
    }, {
      key: "setAutoTempSceneTimeRange",
      value: function(e, t, n, i) {
        this.autoTempSceneTime.startHour = e, this.autoTempSceneTime.startMinute = t, this.autoTempSceneTime.endHour = n, this.autoTempSceneTime.endMinute = i, this._startControl(71, 3, e, t, n, i)
      }
    }, {
      key: "quaryAutoTempSceneTimeRange",
      value: function() {
        this._startControl(82, 3)
      }
    }, {
      key: "setAutoDry",
      value: function(e, t, n, i) {
        this._startControl(80, e ? 1 : 0, t, n, i ? 1 : 0)
      }
    }, {
      key: "startManMode",
      value: function(e) {
        var t = e ? 1 : 0;
        this._startControl(75, 0, t)
      }
    }, {
      key: "startWomanBabyMode",
      value: function(e) {
        var t = e ? 2 : 0;
        this._startControl(75, 0, t)
      }
    }, {
      key: "setCustomSetting",
      value: function(e, t, n, i, a, o) {
        s.default.debug("mode = ".concat(e));
        var r = t,
          u = 0;
        n && (u |= 2), i && (u |= 1), s.default.debug("温湿平衡 = ".concat(n)), s.default.debug("干爽除湿 = ".concat(i)), s.default.debug("B4 = 0b".concat(u.toString(2).padStart(8, "0")));
        var l = a,
          h = o;
        this._startControl(75, 1, e, r, u, 17, l, h)
      }
    }, {
      key: "resetAll",
      value: function() {
        this._startControl(6)
      }
    }, {
      key: "_send89",
      value: function(e) {
        this.senseDistance = e;
        var t = 255 & e,
          n = (65280 & e) >> 8;
        this._startControl(137, t, n)
      }
    }, {
      key: "_updateDefaultValue",
      value: function(e) {
        e.setUint8(0, 252), e.setUint8(1, 0), e.setUint8(2, 64), e.setUint8(3, 1), e.setUint8(4, 2), e.setUint8(5, 0);
        var t = e.byteLength - 1;
        e.setUint8(t, 252);
        var n = this.calculateLightChecksum(e);
        e.setUint8(1, n)
      }
    }, {
      key: "calculateLightChecksum",
      value: function(e) {
        for (var t = 0, n = 2; n < e.byteLength - 1; n++) t += e.getUint8(n);
        return 255 & t
      }
    }, {
      key: "onMsgValueChange",
      value: function(e) {
        i(a(d.prototype), "onMsgValueChange", this).call(this, e);
        var t = e.value;
        console.log("============= 消息监听通知 =============\n", h.ab2hex(t));
        var n = new Uint8Array(t);
        n.length < 8 || 252 != n[0] || 252 != n[n.length - 1] || 13 != n[3] && (console.log("--------- 浴霸的消息"), 48 == n[6] ? (console.log("30指令上报"), this.dealWith30(n)) : 49 == n[6] ? (console.log("31指令上报"), this.dealWith31(n)) : 81 == n[6] ? (console.log("51指令上报"), this.dealWith51(n)) : 82 == n[6] ? (console.log("52指令上报"), this.dealWith52(n)) : 83 == n[6] ? (console.log("53指令上报"), this.dealWith53(n)) : 137 == n[6] ? (console.log("89指令上报"), this.dealWith89(n)) : 26 == n[6] ? (console.log("1A指令上报"), this.dealWith1A(n)) : 78 == n[6] ? (console.log("4E指令上报"), this.dealWith4E(n)) : 79 == n[6] ? (console.log("4F指令上报"), this.dealWith4F(n)) : console.log("其他应答指令"), null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(h.ab2hex(t)))
      }
    }, {
      key: "dealWith51",
      value: function(e) {
        var t = e[7],
          n = {};
        n.warmTemp = e[8], console.log("取暖温度：" + n.warmTemp);
        var i = e[9];
        n.isTempHumidityBalanceOn = 1 == (i >> 1 & 1), console.log("温湿平衡：" + n.isTempHumidityBalanceOn), n.isDryDeHumidifyOn = 1 == (i >> 0 & 1), console.log("干爽除湿：" + n.isDryDeHumidifyOn), n.action = e[11], console.log("功能码(action): " + n.action), n.actionTime = e[12], 1 == t ? this.manMode = n : 2 == t && (this.womanMode = n)
      }
    }, {
      key: "dealWith53",
      value: function(e) {
        this.dryMode.isRapidVentilation = 1 == e[7], s.default.debug("快速换气", this.dryMode.isRapidVentilation), this.dryMode.warmTemp = e[8], s.default.debug("干燥温度", this.dryMode.warmTemp), this.dryMode.warmTime = e[9], s.default.debug("干燥时间", this.dryMode.warmTime), 10 < e.length && (this.dryMode.isColdDrying = e[10])
      }
    }, {
      key: "dealWith52",
      value: function(e) {
        for (var t = 1; t + 6 < e.length - 1; t += 5) {
          var n = e[6 + t];
          if (6 + t + 4 < e.length - 1) {
            var i = e[6 + t + 1],
              a = e[6 + t + 2],
              o = e[6 + t + 3],
              r = e[6 + t + 4];
            switch (n) {
              case 0:
                this.nightLightTime.startHour = i, this.nightLightTime.startMinute = a, this.nightLightTime.endHour = o, this.nightLightTime.endMinute = r, s.default.debug("夜灯"), s.default.debug("开始时间 ".concat(i, ":").concat(a, " - ").concat(o, ":").concat(r));
                break;
              case 1:
                this.personSenseStartTime.startHour = i, this.personSenseStartTime.startMinute = a, this.personSenseStartTime.endHour = o, this.personSenseStartTime.endMinute = r, s.default.debug("人感"), s.default.debug("开始时间 ".concat(i, ":").concat(a, " - ").concat(o, ":").concat(r));
                break;
              case 3:
                this.autoTempSceneTime.startHour = i, this.autoTempSceneTime.startMinute = a, this.autoTempSceneTime.endHour = o, this.autoTempSceneTime.endMinute = r, s.default.debug("四季温感场景时段 ".concat(i, ":").concat(a, " - ").concat(o, ":").concat(r));
                break;
              default:
                s.default.debug("其他不处理")
            }
          }
        }
      }
    }, {
      key: "dealWith89",
      value: function(e) {
        var t = e[7],
          n = e[8];
        this.senseDistance = (255 & n) << 8 | 255 & t, s.default.debug("感应距离设置值：", this.senseDistance)
      }
    }, {
      key: "dealWith4E",
      value: function(e) {
        var t = e[7],
          n = 1 == (t >> 6 & 1),
          i = 255 === t ? 255 : 63 & t,
          a = t >> 7 & 1,
          o = e[8],
          r = 1 == (1 & o),
          u = 254 & o,
          l = 9,
          h = null,
          d = null;
        n && (h = e.slice(l, l + 6), l += 6, d = e.slice(l, l + 6), l += 6);
        var c = e[l],
          f = e[l + 1],
          m = e[l + 2];
        s.default.info("执行动作 action = ", m);
        var p = {
          index: i,
          op: a,
          enabled: r,
          repeatMask: u,
          startDate: h,
          endDate: d,
          hour: c,
          minute: f,
          action: m,
          temperature: e[l + 3],
          duration: e[l + 4]
        };
        Array.isArray(this.appointmentList) || (this.appointmentList = []);
        var g = this.appointmentList.slice(),
          v = g.findIndex((function(e) {
            return e && e.index === p.index && e.action === p.action
          }));
        v >= 0 ? 0 == a ? g.splice(v, 1) : g[v] = p : 1 == a && g.push(p), this.appointmentList = g
      }
    }, {
      key: "dealWith4F",
      value: function(e) {
        this.deviceInfo.use4FAllInfo ? this._dealWithAppointmentAllInfo(e, !1) : this._dealWithAppointmentInfo(e, !1)
      }
    }, {
      key: "_dealWithAppointmentInfo",
      value: function(e, t) {
        var n = e[7];
        s.default.info("预约数 = ", n);
        var i = e[8],
          a = 1 == (i >> 6 & 1),
          o = 255 === i ? 255 : 63 & i,
          r = t ? i >> 7 & 1 : null,
          u = e[9],
          l = 1 == (1 & u),
          h = 254 & u,
          d = 10,
          c = null,
          f = null;
        a && (c = e.slice(d, d + 6), d += 6, f = e.slice(d, d + 6), d += 6);
        var m = e[d],
          p = e[d + 1],
          g = e[d + 2];
        s.default.info("执行动作 action = ", g);
        var v = {
          index: o,
          op: r,
          enabled: l,
          repeatMask: h,
          startDate: c,
          endDate: f,
          hour: m,
          minute: p,
          action: g,
          temperature: e[d + 3],
          duration: e[d + 4]
        };
        Array.isArray(this.appointmentList) || (this.appointmentList = []);
        var y = this.appointmentList.slice(),
          b = y.findIndex((function(e) {
            return e && e.index === v.index && e.action === v.action
          }));
        b >= 0 ? y[b] = v : y.push(v), this.appointmentList = y, s.default.info("预约数量 = ", this.appointmentList.length)
      }
    }, {
      key: "_dealWithAppointmentAllInfo",
      value: function(e, t) {
        var n = e[7];
        s.default.info("总预约数 = ", n);
        for (var i = [], a = 8, o = function() {
            if (a + 1 >= e.length - 1) return s.default.info("预约数据长度不足，停止解析，已解析条数 = ", i.length), "break";
            var n = e[a],
              o = 1 == (n >> 6 & 1),
              u = 255 === n ? 255 : 63 & n;
            s.default.info(r + ".预约序号 = ", u);
            var l = t ? n >> 7 & 1 : null,
              h = e[a += 1],
              d = 1 == (1 & h);
            s.default.info(r + ".使能开关 = ", d);
            var c = 254 & h;
            a += 1;
            var f = null,
              m = null;
            o && (f = e.slice(a, a + 6), a += 6, m = e.slice(a, a + 6), a += 6);
            var p = e[a],
              g = e[a + 1];
            s.default.info(r + ".执行时间 小时 = ", p), s.default.info(r + ".执行时间 分钟 = ", g);
            var v = e[a + 2];
            s.default.info(r + ".执行动作 = ", v);
            var y = e[a + 3];
            s.default.info(r + ".取暖温度 = ", y);
            var b = e[a + 4];
            s.default.info(r + ".时长 = ", b), a += 5;
            var k = {
                index: u,
                op: l,
                enabled: d,
                repeatMask: c,
                startDate: f,
                endDate: m,
                hour: p,
                minute: g,
                action: v,
                temperature: y,
                duration: b
              },
              T = i.findIndex((function(e) {
                return e && e.index === k.index && e.action === k.action
              }));
            T >= 0 ? i[T] = k : i.push(k)
          }, r = 0; r < n; r++) {
          if ("break" === o()) break
        }
        this.appointmentList = i, s.default.info("实际预约数量 = ", this.appointmentList.length)
      }
    }, {
      key: "dealWith31",
      value: function(e) {
        console.log("---- 31 指令 ----");
        var t = e[7],
          n = 1 == (t >> 7 & 1);
        s.default.debug("人体感应开关 = ", n), this.personSenseStartTime.enable = n;
        var i = 1 == (t >> 1 & 1);
        s.default.debug("夜灯时段开关 = ", i), this.nightLightTime.enable = i;
        var a = 1 == (t >> 0 & 1);
        s.default.debug("蜂鸣器开关 = ", a), this.beeperOn = a;
        var o = t >> 4 & 1;
        this.autoDeodorEnable = o;
        var r = t >> 3 & 1;
        this.autoDehumidifyEnable = r;
        var u = e[8] >> 4 & 1;
        if (this.personShutdownEnable = u, 9 < e.length) {
          var l = e[9],
            h = l >> 7 & 1,
            d = l >> 6 & 1,
            c = l >> 5 & 1,
            f = l >> 4 & 1,
            m = l >> 3 & 1,
            p = l >> 2 & 1;
          this.aiCleanEnable = h, this.holidayMode = d, this.personLightEnable = c, this.personDeodorEnable = f, this.personVentilationEnable = m, this.personVoiceWakeFreeEnable = p, s.default.debug("AI 智净使能开关 = ", h), s.default.debug("假日模式使能开关 = ", d), s.default.debug("人感照明开关 = ", c), s.default.debug("人感除臭开关 = ", f), s.default.debug("人感换气开关 = ", m), s.default.debug("人感关机开关 = ", u), s.default.debug("人感语音免唤醒开关 = ", p)
        }
        var g = e[11];
        this.aimTemp = g, s.default.debug("取暖温度 = ", g);
        var v = e[12];
        if (this.lightBrightness = v, this.nightLightBrightness = v, 13 < e.length && (this.autoDehumidifyThreshold = e[13]), 25 < e.length) {
          var y = e[24],
            b = 65535 & (e[25] << 8 | y);
          this.autoDeodorThreshold = b, s.default.info("异味溶度(1) = " + this.autoDeodorThreshold)
        }
        if (this.ventilationMaxTime = e[15], s.default.debug("换气时长设置 = ", this.ventilationMaxTime), this.windMaxTime = e[16], s.default.debug("吹风时长设置 = ", this.windMaxTime), this.warmMaxTime = e[17], s.default.debug("暖风时长设置 = ", this.warmMaxTime), this.warmWeakMaxTime = e[17], s.default.debug("弱暖时长设置 = ", this.warmWeakMaxTime), this.delayLightOffTime = e[23], s.default.debug("延时照明设置 = ", this.delayLightOffTime), 27 < e.length - 1) {
          var k = e[26],
            T = e[27];
          this.senseDistance = (255 & T) << 8 | 255 & k, s.default.debug("感应距离设置值：", this.senseDistance)
        }
      }
    }, {
      key: "dealWith30",
      value: function(e) {
        console.log("---- 30 指令 ----");
        e[8];
        var t = e[9],
          n = e[11],
          i = (e[12], e[10]);
        this.warmHouse = t >> 0 & 1, s.default.debug("暖房状态 = ", this.warmHouse);
        var a = i >> 7 & 1;
        this.light = a, s.default.debug("照明状态 = ", a);
        var o = i >> 6 & 1;
        this.nightLight = o, s.default.debug("夜灯状态 = ", o);
        var r = i >> 5 & 1;
        this.ventilation = r, s.default.debug("换气状态 = ", r);
        var u = i >> 4 & 1;
        this.wind = u, s.default.debug("吹风状态 = ", u);
        var l = i >> 3 & 1;
        this.dry = l, s.default.debug("干燥状态 = ", l);
        var h = i >> 1 & 1;
        this.weakWarm = h, s.default.debug("弱暖状态 = ", h);
        var d = i >> 0 & 1;
        this.strongWarm = d, s.default.debug("强暖状态 = ", d);
        var c = 3 & n;
        this.swing = c, s.default.debug("摆风 = ", c);
        var f = n >> 7 & 1;
        this.airClean = f, s.default.debug("空气优化 = ", f);
        var m = (28 & n) >> 2;
        s.default.debug("正向电机风速 = ", m), this.windSpeedLevel = m;
        var p = e[13],
          g = (28 & p) >> 2;
        s.default.debug("反向电机风速 = ", g), this.reverseWindSpeedLevel = g;
        var v = p >> 5 & 1;
        this.aiClean = v, s.default.debug("AI 智净是否在运行中 = ", v);
        var y = p >> 7 & 1;
        this.disableWindSpeedLevel = y, s.default.debug("是否禁用风速档位 = ", this.disableWindSpeedLevel);
        var b = e[14];
        this.customModeId = b, s.default.debug("场景模式 = ", b);
        var k = e[15];
        this.temp = k, s.default.debug("实时温度 = ", k);
        var T = e[16];
        this.humidity = T, s.default.debug("实时湿度 = ", T);
        var C = e[17];
        if (this.lightBrightness = C, s.default.debug("实时亮度 = ", C), 18 < e.length) {
          var D = e[18] >> 4 & 15;
          this.odorLevel = D, s.default.debug("实时异味值 = ", D)
        }
        var M = e[19];
        s.default.debug("换气剩余时长 = ", M), this.ventilationRemain = M;
        var S = e[20];
        s.default.debug("吹风剩余时长 = ", S), this.windRemain = S;
        var _ = e[21];
        s.default.debug("取暖剩余时长 = ", _), this.warmRemain = _;
        var L = e[22];
        s.default.debug("干燥剩余时长 = ", L), this.dryRemain = L;
        var w = e[26];
        s.default.debug("延时关机剩余时长 = ", w);
        var W = e[27];
        s.default.debug("延时照明剩余时长 = ", W);
        var A = e[28];
        if (this.deviceInfo.is30CmdSmartModeRemainTimeUse22Byte ? (this.modeRemain = A, s.default.debug("自定义模式剩余时长 = ", A)) : (this.airCleanRemain = A, s.default.debug("空气优化剩余时长 = ", A)), 29 < e.length - 1) {
          var x = e[29];
          this.modeRemain = x, s.default.debug("自定义模式剩余时长 = ", x)
        }
        if (30 < e.length - 1) {
          var E = e[30];
          this.aiCleanRemain = E, s.default.debug("AI 智净剩余时长 = ", E)
        }
        if (31 < e.length - 1) {
          var H = e[31],
            R = 32 < e.length - 1 ? e[32] : 0,
            V = 32 < e.length - 1 ? R << 8 | H : R;
          this.odorConcentration = V, s.default.debug("实时异味浓度 = ", V)
        }
      }
    }, {
      key: "openLinkScene",
      value: function(t, n, i) {
        var a = [];
        a.push(n.category), a.push.apply(a, e(n.mac)), a.push.apply(a, e(n.barCode));
        for (var o = 0; o < n.params.length; o += 5) {
          var r = n.params[o],
            s = n.params[o + 1] << 24 | n.params[o + 2] << 16 | n.params[o + 3] << 8 | n.params[o + 4];
          a.push(r), a.push.apply(a, e(s.toString(16).padStart(8, "0").match(/.{1,2}/g).map((function(e) {
            return parseInt(e, 16)
          }))))
        }
        a.push(i.category), a.push.apply(a, e(i.mac)), a.push.apply(a, e(i.barCode));
        for (var u = 0; u < i.params.length; u += 5) {
          var l = i.params[u],
            h = i.params[u + 1] << 24 | i.params[u + 2] << 16 | i.params[u + 3] << 8 | i.params[u + 4];
          a.push(l), a.push.apply(a, e(h.toString(16).padStart(8, "0").match(/.{1,2}/g).map((function(e) {
            return parseInt(e, 16)
          }))))
        }
        this._startControl.apply(this, [25, 1, t].concat(a))
      }
    }, {
      key: "closeLinkScene",
      value: function(e) {
        this._startControl(25, 0, e, 255)
      }
    }, {
      key: "queryLinkSceneList",
      value: function(e) {
        this._startControl(26, e, 255)
      }
    }, {
      key: "dealWith1A",
      value: function(e) {
        console.log("---- 1A 指令 ----");
        var t = e[offset + 1],
          n = e[offset + 2],
          i = this.linkSceneList.find((function(e) {
            return e.id === t
          }));
        i ? (i.links || (i.links = []), i.links.includes(n) || i.links.push(n)) : (s.default.debug("未找到场景 = ", t), links = [n], this.linkSceneList.push({
          id: t,
          links: links
        }))
      }
    }], [{
      key: "getInstance",
      value: function(e) {
        if (e) {
          if (this.instances.has(e)) return this.instances.get(e);
          var t = new d;
          return t.mac = e, this.instances.set(e, t), t
        }
        return this._singleton || (this._singleton = new d), this._singleton
      }
    }]), d
  }(u.default);
d.instances = new Map;
var c = d;
exports.default = c;