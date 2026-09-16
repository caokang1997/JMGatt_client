Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ab2hex = r, exports.default = void 0;
var t = require("../../@babel/runtime/helpers/classCallCheck"),
  e = require("../../@babel/runtime/helpers/createClass"),
  i = require("../../@babel/runtime/helpers/get"),
  s = require("../../@babel/runtime/helpers/getPrototypeOf"),
  n = require("../../@babel/runtime/helpers/inherits"),
  l = require("../../@babel/runtime/helpers/createSuper"),
  a = o(require("./BLEController.js"));
o(require("./bleutil.js"));

function o(t) {
  return t && t.__esModule ? t : {
    default: t
  }
}
var h = require("../bluetooth/bleutil.js");

function r(t) {
  return Array.prototype.map.call(new Uint8Array(t), (function(t) {
    return ("00" + t.toString(16)).slice(-2)
  })).join("")
}
var u = 0,
  c = 101,
  v = 102,
  m = 103,
  b = 104,
  g = 105,
  w = 106,
  S = 107,
  U = function(a) {
    n(U, a);
    var o = l(U);

    function U() {
      var e;
      t(this, U);
      for (var i = arguments.length, s = new Array(i), n = 0; n < i; n++) s[n] = arguments[n];
      return (e = o.call.apply(o, [this].concat(s))).jmZtmxm = "000000", e.isDeviceReady = !1, e.model = "-", e.isOnSeat = 0, e.waterTempLevel = 0, e.autoCoverSwitch = 0, e.gestureSwitch = 0, e.autoFlushSwitch = 0, e.lightSensorSwitch = 0, e.smartPowerSave = 0, e.hipwashNozzlePosition = 1, e.seatTempLevel = 0, e.nightLightSwitch = 0, e.hipwashWaterPressure = 1, e.airTempLevel = 0, e.womanWaterPressure = 1, e.womanNozzlePosition = 1, e.autoBubble = 0, e.wideWashLevel = 0, e.flushLargeSwitch = 0, e.flushSmallSwitch = 0, e.bubbleSwitch = 0, e.footSensorSwitch = 0, e.preWettingSwitch = 0, e.seatTempError = 0, e.seatTempOver = 0, e.coverOn = 0, e.coverRun = 0, e.ringOn = 0, e.ringRun = 0, e.isBubbleEnable = !0, e.bubbleDisableReason = 0, e.startFlushLargeTime = null, e.startFlushSmallTime = null, e.startBubbleTime = null, e.bubbleLockTimer = null, e.toiletMode = u, e
    }
    return e(U, [{
      key: "initDevice",
      value: function() {
        this.isDeviceReady = !1, this.waterTempLevel = 0, this.autoCoverSwitch = 0, this.gestureSwitch = 0, this.autoFlushSwitch = 0, this.lightSensorSwitch = 0, this.smartPowerSave = 0, this.hipwashNozzlePosition = 1, this.seatTempLevel = 0, this.nightLightSwitch = 0, this.hipwashWaterPressure = 1, this.airTempLevel = 0, this.womanWaterPressure = 1, this.womanNozzlePosition = 1, this.autoBubble = 0, this.wideWashLevel = 0, this.flushLargeSwitch = 0, this.flushSmallSwitch = 0, this.bubbleSwitch = 0, this.footSensorSwitch = 0, this.preWettingSwitch = 0, this.seatTempError = 0, this.isBubbleEnable = !0, this.bubbleDisableReason = 0, this.startFlushLargeTime = null, this.startFlushSmallTime = null, this.startBubbleTime = null, this.bubbleLockTimer = null, this.coverOn = 0, this.coverRun = 0, this.ringOn = 0, this.ringRun = 0
      }
    }, {
      key: "quaryDeviceState",
      value: function() {
        console.log("------ 查询外设状态 -----");
        var t = new ArrayBuffer(12),
          e = new DataView(t);
        e.setUint8(0, 243), e.setUint8(1, 244), e.setUint8(2, t.byteLength - 4), e.setUint8(3, U.BLE_ADDRESS), e.setUint8(4, U.BROAD_ADDRESS), e.setUint8(5, 226), e.setUint8(6, 0), e.setUint8(7, 0), e.setUint8(8, 0), e.setUint8(9, 0);
        var i = this.calculateChecksum(e);
        e.setUint8(10, i), e.setUint8(11, 252), this.writeCommand(t)
      }
    }, {
      key: "setLightSensor",
      value: function(t) {
        console.log("光感夜灯", t);
        this.lightSensorSwitch = t ? 1 : 0;
        var e = new ArrayBuffer(12),
          i = new DataView(e);
        i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, e.byteLength - 4), i.setUint8(3, U.BLE_ADDRESS), i.setUint8(4, U.TOILET_ADDRESS), i.setUint8(5, 25);
        var s = 0;
        s |= this.waterTempLevel << 4, s |= this.autoCoverSwitch << 3, s |= this.gestureSwitch << 2, s |= this.autoFlushSwitch << 1, s |= 0, i.setUint8(6, s);
        var n = 0;
        n |= this.smartPowerSave << 7, n |= this.hipwashNozzlePosition << 4, n |= this.seatTempLevel << 0, i.setUint8(7, n);
        var l = 0;
        l |= this.lightSensorSwitch << 7, l |= this.hipwashWaterPressure << 4, l |= this.airTempLevel << 0, i.setUint8(8, l);
        var a = 0;
        a |= this.wideWashLevel << 4, i.setUint8(9, a);
        var o = this.calculateChecksum(i);
        i.setUint8(10, o), i.setUint8(11, 252), console.log("执行马桶的功能 == ", r(e)), this.writeCommand(e)
      }
    }, {
      key: "setAutoBubble",
      value: function(t) {
        console.log("自动发泡"), this.autoBubble = t ? 1 : 0;
        var e = new ArrayBuffer(10),
          i = new DataView(e);
        i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, e.byteLength - 4), i.setUint8(3, U.BLE_ADDRESS), i.setUint8(4, U.TOILET_ADDRESS), i.setUint8(5, 31), i.setUint8(6, 32);
        var s = 0;
        s |= t ? 2 : 4, i.setUint8(7, s);
        var n = this.calculateChecksum(i);
        i.setUint8(8, n), i.setUint8(9, 252), console.log("执行自动发泡的功能 == ", r(e)), this.writeCommand(e)
      }
    }, {
      key: "setPreWetting",
      value: function(t) {
        console.log("预湿润"), this.preWettingSwitch = t ? 1 : 0;
        var e = new ArrayBuffer(10),
          i = new DataView(e);
        i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, e.byteLength - 4), i.setUint8(3, U.BLE_ADDRESS), i.setUint8(4, U.TOILET_ADDRESS), i.setUint8(5, 31), i.setUint8(6, 48);
        var s = 0;
        t && (s |= 4), i.setUint8(7, s);
        var n = this.calculateChecksum(i);
        i.setUint8(8, n), i.setUint8(9, 252), console.log("执行预湿润的功能 == ", r(e)), this.writeCommand(e)
      }
    }, {
      key: "setAutoFlush",
      value: function(t) {
        console.log("自动冲刷");
        this.autoFlushSwitch = t ? 1 : 0;
        var e = new ArrayBuffer(12),
          i = new DataView(e);
        i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, e.byteLength - 4), i.setUint8(3, U.BLE_ADDRESS), i.setUint8(4, U.TOILET_ADDRESS), i.setUint8(5, 25);
        var s = 0;
        s |= this.waterTempLevel << 4, s |= this.autoCoverSwitch << 3, s |= this.gestureSwitch << 2, s |= this.autoFlushSwitch << 1, s |= 0, i.setUint8(6, s);
        var n = 0;
        n |= this.smartPowerSave << 7, n |= this.hipwashNozzlePosition << 4, n |= this.seatTempLevel << 0, i.setUint8(7, n);
        var l = 0;
        l |= this.lightSensorSwitch << 7, l |= this.hipwashWaterPressure << 4, l |= this.airTempLevel << 0, i.setUint8(8, l);
        var a = 0;
        a |= this.wideWashLevel << 4, i.setUint8(9, a);
        var o = this.calculateChecksum(i);
        i.setUint8(10, o), i.setUint8(11, 252), console.log("执行马桶的功能 == ", r(e)), this.writeCommand(e)
      }
    }, {
      key: "setAutoFootSensor",
      value: function(t) {
        console.log("脚感控制", t), this.footSensorSwitch = t ? 1 : 0;
        var e = new ArrayBuffer(10),
          i = new DataView(e);
        i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, e.byteLength - 4), i.setUint8(3, U.BLE_ADDRESS), i.setUint8(4, U.TOILET_ADDRESS), i.setUint8(5, 31), i.setUint8(6, 36);
        var s = 0;
        s |= t ? 1 : 2, i.setUint8(7, s);
        var n = this.calculateChecksum(i);
        i.setUint8(8, n), i.setUint8(9, 252), console.log("执行脚感的功能 == ", r(e)), this.writeCommand(e)
      }
    }, {
      key: "setSeatTemp",
      value: function(t) {
        console.log("座温设置", t), this.seatTempLevel = t, this.startToiletFunction(25)
      }
    }, {
      key: "startFlushLarge",
      value: function() {
        console.log("启动大冲"), this.startFlushTime = (new Date).getTime(), this.startToiletFunction(14)
      }
    }, {
      key: "startFlushSmall",
      value: function() {
        this.startFlushTime = (new Date).getTime(), this.startToiletFunction(15)
      }
    }, {
      key: "startBubble",
      value: function() {
        console.log("启动魔力泡");
        var t = new ArrayBuffer(10),
          e = new DataView(t);
        e.setUint8(0, 243), e.setUint8(1, 244), e.setUint8(2, t.byteLength - 4), e.setUint8(3, U.BLE_ADDRESS), e.setUint8(4, U.TOILET_ADDRESS), e.setUint8(5, 31), e.setUint8(6, 32);
        e.setUint8(7, 1);
        var i = this.calculateChecksum(e);
        e.setUint8(8, i), e.setUint8(9, 252), console.log("执行启动魔力泡的功能 == ", r(t)), this.writeCommand(t)
      }
    }, {
      key: "startCover",
      value: function(t) {
        console.log("启动翻盖", t), t ? this.startToiletFunction(this.ringOn ? 19 : 17) : this.startToiletFunction(16)
      }
    }, {
      key: "startDryMode",
      value: function(t) {
        this.startToiletCleanFunction(4, t)
      }
    }, {
      key: "startDryMoveMode",
      value: function(t) {
        this.startToiletCleanFunction(5, t)
      }
    }, {
      key: "startNozzleClean",
      value: function(t) {
        this.startToiletCleanFunction(9, t)
      }
    }, {
      key: "startManCleanMode",
      value: function(t) {
        this.startToiletCleanFunction(1, t)
      }
    }, {
      key: "startWomanCleanMode",
      value: function(t) {
        this.startToiletCleanFunction(3, t)
      }
    }, {
      key: "startDefectCleanMode",
      value: function(t) {
        this.startToiletCleanFunction(10, t)
      }
    }, {
      key: "startToiletCleanFunction",
      value: function(t, e) {
        e ? this.startToiletFunction(t) : this.startToiletFunction(0)
      }
    }, {
      key: "startRing",
      value: function(t) {
        console.log("启动翻圈", t), t ? this.startToiletFunction(19) : this.startToiletFunction(17)
      }
    }, {
      key: "startToiletFunction",
      value: function(t) {
        console.log("执行马桶的功能", t);
        var e = new ArrayBuffer(13),
          i = new DataView(e);
        i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, e.byteLength - 4), i.setUint8(3, U.BLE_ADDRESS), i.setUint8(4, U.TOILET_ADDRESS), i.setUint8(5, t);
        var s = 0;
        s |= this.waterTempLevel << 4, s |= this.autoCoverSwitch << 3, s |= this.gestureSwitch << 2, s |= this.autoFlushSwitch << 1, s |= this.nightLightSwitch << 0, i.setUint8(6, s);
        var n = 0;
        n |= this.smartPowerSave << 7, n |= 7 == t || 3 == t ? this.womanNozzlePosition << 4 : this.hipwashNozzlePosition << 4, n |= this.seatTempLevel << 0, i.setUint8(7, n);
        var l = 0;
        l |= this.lightSensorSwitch << 7, l |= 7 == t || 3 == t ? this.womanWaterPressure << 4 : this.hipwashWaterPressure << 4, l |= this.airTempLevel << 0, i.setUint8(8, l);
        var a = 0;
        a |= this.wideWashLevel << 4, i.setUint8(9, a);
        i.setUint8(10, 0);
        var o = this.calculateChecksum(i);
        i.setUint8(11, o), i.setUint8(12, 252), console.log("执行马桶的功能 == ", r(e)), this.writeCommand(e)
      }
    }, {
      key: "onDeviceReady",
      value: function(t) {
        var e = this;
        console.log("-------------- onDeviceReady --------------"), i(s(U.prototype), "onDeviceReady", this).call(this, t), setTimeout((function() {
          console.log("-------------- 查询E2 --------------"), e.quaryDeviceState()
        }), 500)
      }
    }, {
      key: "onMsgValueChange",
      value: function(t) {
        var e = t.value;
        console.log("============= 消息监听通知 =============\n", r(e));
        var i = new Uint8Array(e);
        if (t.characteristicId !== this.notifyComUUID) i.length < 7 || 243 != i[0] || 244 != i[1] || (i[3] == U.TOILET_ADDRESS ? 250 == i[5] ? this.dealWithFA(i) : 236 == i[5] ? this.dealWithEC(i) : 32 == i[5] ? this.dealWith20(i) : 233 == i[5] ? (console.log("-- E9 -- 消息"), this.dealWithE9(i)) : 234 == i[5] ? this.dealWithEA(i) : 226 == i[5] && this.dealWithE2(i) : i[3] == U.BLE_ADDRESS && 33 == i[4] && this.dealWithCommand(i));
        else {
          if (i.length < 4 || 250 != i[0]) return;
          this.dealWithCustomProtocol(i)
        }
      }
    }, {
      key: "dealWithCustomProtocol",
      value: function(t) {
        2 == t[2] && (this.model = h.ab2hexFromStart(t, 6, 3))
      }
    }, {
      key: "dealWithE2",
      value: function(t) {
        console.log("外设状态查询");
        var e = t[6];
        this.waterTempLevel = e >> 4, this.autoCoverSwitch = e >> 3 & 1, this.gestureSwitch = e >> 2 & 1, this.autoFlushSwitch = e >> 1 & 1, this.nightLightSwitch = e >> 0 & 1;
        var i = t[7];
        this.waterTempLevel = i >> 7 & 1, this.hipwashNozzlePosition = i >> 4 & 7, this.seatTempLevel = 15 & i;
        var s = t[8];
        this.lightSensorSwitch = s >> 7 & 1, this.hipwashWaterPressure = s >> 4 & 7, this.airTempLevel = s >> 0 & 7;
        var n = t[9];
        this.womanWaterPressure = n >> 4 & 7, this.womanNozzlePosition = n >> 0 & 7, this.coverOn = n >> 7 & !0 ? 0 : 1, this.ringOn = n >> 3 & !0 ? 0 : 1, console.log(" ==== 盖板 ==== ", this.coverOn), console.log(" ==== 座圈 ==== ", this.ringOn), this.isDeviceReady = !0
      }
    }, {
      key: "dealWithCommand",
      value: function(t) {
        switch (console.log("下发指令"), t[5]) {
          case 16:
            console.log("下发指令-关盖关圈");
            break;
          case 17:
            console.log("下发指令-开盖关圈");
            break;
          case 18:
            console.log("下发指令-智能除臭");
            break;
          case 19:
            console.log("下发指令-开盖开圈");
            break;
          case 14:
            console.log("下发指令-大冲");
            break;
          case 15:
            console.log("下发指令-小冲");
            break;
          case 12:
            console.log("下发指令-臀洗全自动");
            break;
          case 0:
            console.log("下发指令-停止")
        }
      }
    }, {
      key: "dealWithE9",
      value: function(t) {
        var e = t[6] >> 7 & 1;
        console.log("着座状态", e), this.isOnSeat = e;
        t[7];
        var i = t[8],
          s = i >> 1 & 1;
        this.seatTempError = s;
        var n = i >> 5 & 1;
        this.seatTempOver = n;
        var l = t[10],
          a = l >> 3 & !0,
          o = l >> 7 & !0,
          h = t[9],
          r = this.toiletMode;
        1 == h || 2 == h ? (r = u, console.log("停止待机")) : 3 == h ? (r = S, console.log("喷嘴清洁")) : 16 == h ? (r = m, console.log("暖风")) : h >> 5 & !0 ? (r = a ? g : c, a ? o ? console.log("自动-强弱按摩") : console.log("自动-臀洗") : o ? console.log("强弱按摩") : console.log("臀洗")) : h >> 6 & !0 && (r = a ? w : v, console.log(a ? "自动妇洗" : "妇洗")), l >> 5 & !0 && (r = b), this.toiletMode = r
      }
    }, {
      key: "dealWithFA",
      value: function(t) {
        var e = this,
          i = t[6],
          s = i >> 1 & 1;
        this.autoFlushSwitch = s;
        var n = 7 & t[7];
        this.seatTempLevel = n, console.log("座温档位", n);
        var l = t[8] >> 7 & 1;
        this.lightSensorSwitch = l;
        t[9];
        var a = t[10],
          o = a >> 2 & 1;
        1 == o ? 0 == this.flushSmallSwitch && (this.startFlushSmallTime = new Date) : null != this.startFlushSmallTime && (this.closeBubbleTimer(), this.isBubbleEnable = !1, this.bubbleDisableReason = 1, this.bubbleLockTimer = setTimeout((function() {
          e.isBubbleEnable = !0, null != e.msgValueChangeCallBack && e.msgValueChangeCallBack(null)
        }), 3e4), this.startFlushSmallTime = null), this.flushSmallSwitch = o;
        var h = a >> 3 & 1;
        1 == h ? 0 == this.flushSmallSwitch && (this.startFlushLargeTime = new Date) : null != this.startFlushLargeTime && (this.closeBubbleTimer(), this.bubbleDisableReason = 2, this.isBubbleEnable = !1, this.bubbleLockTimer = setTimeout((function() {
          e.isBubbleEnable = !0, null != e.msgValueChangeCallBack && e.msgValueChangeCallBack(null)
        }), 3e4), this.startFlushLargeTime = null), this.flushLargeSwitch = h, console.log("大冲", h);
        t[11];
        var r = t[12],
          u = r >> 3 & 1;
        this.autoBubble = u;
        var c = r >> 2 & 1;
        c ? 0 == this.bubbleSwitch && (console.log("自动"), this.startBubbleTime = new Date) : null != this.startBubbleTime && (this.closeBubbleTimer(), this.isBubbleEnable = !1, this.bubbleDisableReason = 0, this.bubbleLockTimer = setTimeout((function() {
          e.isBubbleEnable = !0, null != e.msgValueChangeCallBack && e.msgValueChangeCallBack(null)
        }), 3e4), this.startBubbleTime = null), this.bubbleSwitch = c, console.log("泡沫盾状态", c);
        var v = r >> 5 & 1;
        this.preWettingSwitch = v;
        var m = t[13] >> 5 & 1;
        this.footSensorSwitch = m, this.isDeviceReady = !0
      }
    }, {
      key: "dealWithEC",
      value: function(t) {
        var e = t[6],
          i = e >> 1 & 1;
        console.log("小冲状态", i);
        var s = e >> 1 & 1;
        console.log("大冲状态", s)
      }
    }, {
      key: "dealWith20",
      value: function(t) {
        var e = t[6],
          i = e >> 1 & 1;
        console.log("自动发泡关闭", i);
        var s = e >> 2 & 1;
        console.log("自动发泡开启", s)
      }
    }, {
      key: "dealWithEA",
      value: function(t) {
        var e = t[6],
          i = e >> 1 & 1;
        console.log("座圈状态", i), this.ringOn = i;
        var s = e >> 3 & 1;
        console.log("盖板状态", s), this.coverOn = s;
        var n = e >> 6 & 1;
        this.coverRun = n, console.log("盖板运动状态", this.coverRun);
        var l = e >> 5 & 1;
        this.ringRun = l, console.log("座圈运动状态", this.ringRun)
      }
    }, {
      key: "writeDeviceInfo",
      value: function(t) {
        console.log("写入设备信息:", t);
        var e = new ArrayBuffer(10),
          i = new DataView(e);
        i.setUint8(0, 250), i.setUint8(1, e.byteLength), i.setUint8(2, 1), i.setUint8(3, 5), i.setUint8(4, 1), i.setUint8(5, 1);
        for (var s = 6, n = 0; n < t.length; n += 2) {
          var l = parseInt(t.substr(n, 2), 16);
          i.setUint8(s, l), s += 1
        }
        var a = this.calculateCommunicateChecksum(i);
        i.setUint8(9, a), this.writeCommunicateCommand(e)
      }
    }, {
      key: "readDeviceInfo",
      value: function() {
        console.log("读取设备信息");
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
        this.isDeviceReady = !1, this.closeBubbleTimer(), i(s(U.prototype), "startConnect", this).call(this, t, e)
      }
    }, {
      key: "stopConnnect",
      value: function() {
        this.isDeviceReady = !1, this.closeBubbleTimer(), i(s(U.prototype), "stopConnnect", this).call(this)
      }
    }]), U
  }(a.default);
U.BLE_ADDRESS = 146, U.TOILET_ADDRESS = 33, U.BROAD_ADDRESS = 0, U.FLIP_COVER_ADDRESS = 34;
var T = U;
exports.default = T;