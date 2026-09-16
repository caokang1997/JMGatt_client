Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e = require("../../../@babel/runtime/helpers/classCallCheck"),
  t = require("../../../@babel/runtime/helpers/createClass"),
  i = require("../../../@babel/runtime/helpers/get"),
  n = require("../../../@babel/runtime/helpers/getPrototypeOf"),
  s = require("../../../@babel/runtime/helpers/inherits"),
  a = require("../../../@babel/runtime/helpers/createSuper"),
  l = (require("../../eventBus.js"), h(require("../../debuglog.js"))),
  o = h(require("../BLEController.js"));
require("../../lunar.js");

function h(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}
var u = require("../bleutil.js"),
  c = function(o) {
    s(c, o);
    var h = a(c);

    function c() {
      var t;
      e(this, c);
      for (var i = arguments.length, n = new Array(i), s = 0; s < i; s++) n[s] = arguments[s];
      return (t = h.call.apply(h, [this].concat(n))).model = "-", t.hasHuman = 0, t.accidentalTouchDistance = 60, t.accidentalTouchAngle = 120, t.sensingDistance = 60, t.sensingAngle = 120, t.quickCalcDistance = 60, t.quickDistance = 60, t.quickAngle = 120, t.isQuickMode = 0, t.quickDistanceIndex = 0, t.quickDistanceTemp = 0, t.quickDistanceTimer = null, t.senseStartHour = 0, t.senseStartMinute = 0, t.senseEndHour = 23, t.senseEndMinute = 59, t.lightSwitch = 0, t.lightBrightness = 0, t.lightColorTemp = 1e3, t.lightCloseDelayTime = 0, t.nightLightSwitch = 0, t.nightLightBrightness = 0, t.nightLightStartHour = 0, t.nightLightStartMinute = 0, t.nightLightEndHour = 23, t.nightLightEndMinute = 59, t.nightLightEnable = 1, t.fogMode = 0, t.fogSwitch = 0, t.waveSwitch = 0, t
    }
    return t(c, [{
      key: "startTest",
      value: function() {
        var e = this;
        setInterval((function() {
          e.onMsgValueChange()
        }), 2e3)
      }
    }, {
      key: "onDeviceReady",
      value: function(e) {
        var t = this;
        i(n(c.prototype), "onDeviceReady", this).call(this, e), console.log("设备就绪"), setTimeout((function() {
          t.quaryDeviceState()
        }), 1e3)
      }
    }, {
      key: "quaryDeviceState",
      value: function() {
        console.log("查询设备状态"), this.set11()
      }
    }, {
      key: "resetNetworkTime",
      value: function() {
        console.log("开始同步时间");
        var e = new Date,
          t = e.getFullYear(),
          i = e.getMonth() + 1,
          n = e.getDate(),
          s = e.getDay(),
          a = e.getHours(),
          l = e.getMinutes(),
          o = e.getSeconds(),
          h = [7, 1, 2, 3, 4, 5, 6][s],
          u = t - 2e3;
        console.log("year = " + u), console.log("month = " + i), console.log("day = " + n), console.log("hour = " + a), console.log("minute = " + l), console.log("second = " + o), console.log("week = " + h), this._setValue(2, 0, 0, 0, u, i, n, a, l, o, h)
      }
    }, {
      key: "setTimeRange",
      value: function(e, t, i, n, s) {
        this._setValue(66, e, t, i, n, s)
      }
    }, {
      key: "setDuration",
      value: function(e, t) {
        var i = 255 & t,
          n = (65280 & t) >> 8;
        this._setValue(59, e, i, n)
      }
    }, {
      key: "startQuickSensingMode",
      value: function() {
        this.quickDistance = this.accidentalTouchDistance, this.quickAngle = this.accidentalTouchAngle, this.set8C(0)
      }
    }, {
      key: "setSensingSwitch",
      value: function(e) {
        this.set72(1, 6, e ? 1 : 0)
      }
    }, {
      key: "setSensingSwitch1",
      value: function(e) {}
    }, {
      key: "setLightSwitch",
      value: function(e) {
        this.set72(1, 1, e ? 1 : 0)
      }
    }, {
      key: "setNightLightSwitch",
      value: function(e) {
        this.nightLightSwitch = e ? 1 : 0, this.set72(1, 2, e ? 1 : 0)
      }
    }, {
      key: "setLightBrightness",
      value: function(e) {
        this.set74(1, 0, 0, 0, e)
      }
    }, {
      key: "setLightBrightness1",
      value: function(e) {
        this.set74(200, 0, 0, 0, e)
      }
    }, {
      key: "setNightLightBrightness",
      value: function(e) {
        this.set74(201, 0, 0, 0, e)
      }
    }, {
      key: "setLightColorTemp",
      value: function(e) {
        var t = 255 & e,
          i = (65280 & e) >> 8;
        this.set73(1, 0, 0, t, i)
      }
    }, {
      key: "setSensingDistance",
      value: function(e) {
        e && (this.accidentalTouchDistance = parseInt(this.quickDistance), this.accidentalTouchAngle = parseInt(this.quickAngle));
        var t = 255 & this.accidentalTouchDistance,
          i = (65280 & this.accidentalTouchDistance) >> 8;
        this.set89(t, i)
      }
    }, {
      key: "setSensingDistance1",
      value: function(e) {
        this.accidentalTouchDistance = e;
        var t = 255 & this.accidentalTouchDistance,
          i = (65280 & this.accidentalTouchDistance) >> 8;
        this.set89(t, i)
      }
    }, {
      key: "setSensingRange",
      value: function(e, t) {
        var i = 255 & e,
          n = (65280 & e) >> 8,
          s = 255 & t,
          a = (65280 & t) >> 8;
        this.set8A(i, n, s, a)
      }
    }, {
      key: "set11",
      value: function() {
        this._setSingleValue(17, 0)
      }
    }, {
      key: "set32",
      value: function(e, t) {
        this._setValue(50, e, t)
      }
    }, {
      key: "set72",
      value: function(e, t, i) {
        this._setThreeValue(114, e, t, i)
      }
    }, {
      key: "set73",
      value: function(e, t, i, n, s) {
        this._setFiveValue(115, e, t, i, n, s)
      }
    }, {
      key: "set74",
      value: function(e, t, i, n, s) {
        this._setFiveValue(116, e, t, i, n, s)
      }
    }, {
      key: "set89",
      value: function(e, t) {
        this._setDoubleValue(137, e, t)
      }
    }, {
      key: "set8A",
      value: function(e, t, i, n) {
        this._setFourValue(138, e, t, i, n)
      }
    }, {
      key: "set8C",
      value: function(e) {
        this._setValue(140, e)
      }
    }, {
      key: "_setValue",
      value: function(e) {
        for (var t = this.getCmdStartOffset(), i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), s = 1; s < i; s++) n[s - 1] = arguments[s];
        var a = 1 + n.length,
          l = new ArrayBuffer(t + a + 1),
          o = new DataView(l);
        o.setUint8(t, e), n.forEach((function(e, i) {
          o.setUint8(t + i + 1, e)
        })), this._updateDefaultValue(o), this.writeCommand(l)
      }
    }, {
      key: "_setSingleValue",
      value: function(e, t) {
        var i = this.getCmdStartOffset(),
          n = new ArrayBuffer(i + 2 + 1),
          s = new DataView(n);
        s.setUint8(i, e), s.setUint8(i + 1, t), this._updateDefaultValue(s), this.writeCommand(n)
      }
    }, {
      key: "_setDoubleValue",
      value: function(e, t, i) {
        var n = this.getCmdStartOffset(),
          s = new ArrayBuffer(n + 3 + 1),
          a = new DataView(s);
        a.setUint8(n, e), a.setUint8(n + 1, t), a.setUint8(n + 2, i), this._updateDefaultValue(a), this.writeCommand(s)
      }
    }, {
      key: "_setThreeValue",
      value: function(e, t, i, n) {
        var s = this.getCmdStartOffset(),
          a = new ArrayBuffer(s + 4 + 1),
          l = new DataView(a);
        l.setUint8(s + 0, e), l.setUint8(s + 1, t), l.setUint8(s + 2, i), l.setUint8(s + 3, n), this._updateDefaultValue(l), this.writeCommand(a)
      }
    }, {
      key: "_setFourValue",
      value: function(e, t, i, n, s) {
        var a = this.getCmdStartOffset(),
          l = new ArrayBuffer(a + 5 + 1),
          o = new DataView(l);
        o.setUint8(a + 0, e), o.setUint8(a + 1, t), o.setUint8(a + 2, i), o.setUint8(a + 3, n), o.setUint8(a + 4, s), this._updateDefaultValue(o), this.writeCommand(l)
      }
    }, {
      key: "_setFiveValue",
      value: function(e, t, i, n, s, a) {
        var l = this.getCmdStartOffset(),
          o = new ArrayBuffer(l + 6 + 1),
          h = new DataView(o);
        h.setUint8(l + 0, e), h.setUint8(l + 1, t), h.setUint8(l + 2, i), h.setUint8(l + 3, n), h.setUint8(l + 4, s), h.setUint8(l + 5, a), this._updateDefaultValue(h), this.writeCommand(o)
      }
    }, {
      key: "_updateDefaultValue",
      value: function(e) {
        e.setUint8(0, 252), e.setUint8(1, 0), e.setUint8(2, c.CMD_CONFIG_BYTE), e.setUint8(3, c.PHONE_ADDRESS), e.setUint8(4, c.DEVICE_ADDRESS);
        var t = this.getCmdStartOffset();
        6 == t ? e.setUint8(5, 0) : 9 == t && (e.setUint8(5, 0), e.setUint8(6, 0), e.setUint8(7, 0), e.setUint8(8, 0));
        var i = this.calculateLightChecksum(e);
        e.setUint8(1, i), e.setUint8(e.byteLength - 1, 252)
      }
    }, {
      key: "calculateLightChecksum",
      value: function(e) {
        for (var t = 0, i = 2; i < e.byteLength - 1; i++) t += e.getUint8(i);
        return 255 & t
      }
    }, {
      key: "onMsgValueChange",
      value: function(e) {
        var t = e.value;
        l.default.debug("消息监听通知: ", u.ab2hex(t));
        var i = new Uint8Array(t);
        if (e.characteristicId === this.notifyComUUID) {
          if (i.length < 4 || 250 != i[0]) return;
          return this.dealWithCustomProtocol(i), void(null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(u.ab2hex(t)))
        }
        if (252 == i[0])
          if (252 == i[i.length - 1]) {
            var n = u.ab2hex(t).toUpperCase(),
              s = u.decodeStr(n);
            i = u.hexStringToByteArray(s), this.dealValueChange(i, t)
          } else console.log("帧尾不是：0xFC");
        else console.log("帧头不是：0xFC")
      }
    }, {
      key: "dealValueChange",
      value: function(e, t) {
        var i = this.getCmdStartOffset();
        48 == e[i] ? this.dealWith30(e, i) : 49 == e[i] ? this.dealWith31(e, i) : 67 == e[i] ? this.dealWith43(e, i) : 136 == e[i] && this.dealWith88(e, i), null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(u.ab2hex(t))
      }
    }, {
      key: "dealWith30",
      value: function(e, t) {
        console.log("---------- 30指令 ----------");
        var i = e[t + 1];
        this.lightSwitch = 1 & i, console.log("照明开关：", this.lightSwitch), this.nightLightSwitch = i >> 1 & 1, console.log("夜灯开关：", this.nightLightSwitch), console.log("当前灯光模式：", i >> 5 & 7);
        var n = e[t + 2];
        this.fogMode = 7 & n, console.log("除雾模式：", this.fogMode), this.fogSwitch = n >> 3 & 1, console.log("除雾开关：", this.fogSwitch), this.hasHuman = n >> 7 & 1, console.log("人体感应(0无人 1有人）：", this.hasHuman);
        var s = e[t + 9];
        this.lightBrightness = s, console.log("亮度(0-100): ", this.lightBrightness);
        var a = e[t + 10],
          l = e[t + 11];
        console.log("B10 = " + a), console.log("B11 = " + l), this.lightColorTemp = (255 & l) << 8 | 255 & a, console.log("色温：", this.lightColorTemp)
      }
    }, {
      key: "dealWith31",
      value: function(e, t) {
        console.log("---------- 31指令 ----------");
        var i = e[t + 1];
        this.waveSwitch = i >> 1 & 1, console.log("微波使能开关：", this.waveSwitch), this.nightLightEnable = i >> 5 & 1, console.log("夜灯使能开关：", this.nightLightEnable);
        var n = e[t + 5],
          s = n >> 7 & 1,
          a = 127 & n;
        this.lightCloseDelayTime = 1 == s ? 60 * a : a, console.log("灯光延时关闭时长：", this.lightCloseDelayTime);
        var l = e[t + 7];
        console.log("感应距离档位(0-9): ", l);
        var o = e[t + 8],
          h = e[t + 9];
        console.log("B8 = " + o), console.log("B9 = " + h);
        var u = (255 & h) << 8 | 255 & o;
        console.log("感应距离调节(0-5000cm)：", u), this.accidentalTouchDistance = u;
        var c = e[t + 10],
          r = e[t + 11];
        console.log("B10 = " + c), console.log("B11 = " + r);
        var g = (255 & r) << 8 | 255 & c;
        console.log("感应区域开始位置(0-5000cm)：", g);
        var f = e[t + 12],
          v = e[t + 13];
        console.log("B12 = " + f), console.log("B13 = " + v);
        var d = (255 & v) << 8 | 255 & f;
        console.log("感应区域结束位置(0-5000cm)：", d);
        var k = e[t + 14];
        this.nightLightBrightness = k, console.log("夜灯亮度：", this.nightLightBrightness)
      }
    }, {
      key: "dealWith43",
      value: function(e, t) {
        console.log("---------- 43指令 ----------");
        var i = e[t + 1],
          n = e[t + 2],
          s = e[t + 3],
          a = e[t + 4],
          l = e[t + 5];
        0 == i ? (this.nightLightStartHour = n, this.nightLightStartMinute = s, this.nightLightEndHour = a, this.nightLightEndMinute = l, console.log("时段类型：夜灯"), console.log("开始时钟：" + this.nightLightStartHour), console.log("开始分钟：" + this.nightLightStartMinute), console.log("结束时钟：" + this.nightLightEndHour), console.log("结束分钟：" + this.nightLightEndMinute)) : 1 == i && (this.senseStartHour = n, this.senseStartMinute = s, this.senseEndHour = a, this.senseEndMinute = l, console.log("时段类型：人感"), console.log("开始时钟：" + this.senseStartHour), console.log("开始分钟：" + this.senseStartMinute), console.log("结束时钟：" + this.senseEndHour), console.log("结束分钟：" + this.senseEndMinute))
      }
    }, {
      key: "dealWith88",
      value: function(e, t) {
        e[t + 1];
        var i = e[t + 2],
          n = (255 & e[t + 3]) << 8 | 255 & i;
        console.log("平均感应距离(快速模式)：", this.quickDistance), 4 == this.quickDistanceIndex ? (this.quickDistanceTemp = this.quickDistanceTemp + n, this.quickDistance = parseInt(this.quickDistanceTemp / 5), this.quickDistance < c.MIN_DISTANCE && (this.quickDistance = c.MIN_DISTANCE), console.log("平均感应距离(快速模式)：", this.quickDistance), this.quickDistanceTemp = 0, this.quickDistanceIndex = 0) : n >= 2 && (this.quickDistanceIndex++, this.quickDistanceTemp = this.quickDistanceTemp + n);
        var s = e[t + 4],
          a = e[t + 5],
          l = (this.toInt16(s, a), e[t + 6]);
        this.toInt8(l), e[t + 7]
      }
    }, {
      key: "dealWithCustomProtocol",
      value: function(e) {
        2 == e[2] && (this.model = u.ab2hexFromStart(e, 6, 3))
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
      key: "getCmdStartOffset",
      value: function() {
        var e = 5,
          t = c.CMD_CONFIG_BYTE >> 7 & 1,
          i = c.CMD_CONFIG_BYTE >> 6 & 1;
        return 1 == t ? e = 9 : 1 == i && (e = 6), e
      }
    }, {
      key: "toInt16",
      value: function(e, t) {
        var i = t << 8 | e;
        return 32768 & i ? i - 65536 : i
      }
    }, {
      key: "toInt8",
      value: function(e) {
        return 128 & e ? e - 256 : e
      }
    }], [{
      key: "getInstance",
      value: function() {
        return this._singleton || (this._singleton = new c), this._singleton
      }
    }]), c
  }(o.default);
c.DEVICE_ADDRESS = 0, c.PHONE_ADDRESS = 1, c.BROAD_ADDRESS = 255, c.CMD_CONFIG_BYTE = 0, c.MIN_DISTANCE = 60;
var r = c;
exports.default = r;