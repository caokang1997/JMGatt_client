Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ab2hex = u, exports.default = void 0;
var e, t = require("../../../@babel/runtime/helpers/classCallCheck"),
  i = require("../../../@babel/runtime/helpers/createClass"),
  s = require("../../../@babel/runtime/helpers/get"),
  a = require("../../../@babel/runtime/helpers/getPrototypeOf"),
  l = require("../../../@babel/runtime/helpers/inherits"),
  n = require("../../../@babel/runtime/helpers/createSuper"),
  o = (e = require("../xiaomu/XiaoMuBLEController.js")) && e.__esModule ? e : {
    default: e
  };
var h = require("../../bluetooth/bleutil.js"),
  r = require("../../eventBus.js");

function u(e) {
  return Array.prototype.map.call(new Uint8Array(e), (function(e) {
    return ("00" + e.toString(16)).slice(-2)
  })).join("")
}
var c = function(e) {
  l(c, e);
  var o = n(c);

  function c() {
    var e;
    t(this, c);
    for (var i = arguments.length, s = new Array(i), a = 0; a < i; a++) s[a] = arguments[a];
    return (e = o.call.apply(o, [this].concat(s))).jmZtmxm = "000000", e.selectedCustomModes = [1, 2, 3], e.isSceneLinkage = !0, e.model = "-", e.waterTempLevel = 0, e.autoCoverSwitch = 0, e.gestureSwitch = 0, e.autoFlushSwitch = 0, e.lightSensorSwitch = 0, e.smartPowerSave = 0, e.hipwashNozzlePosition = 1, e.seatTempLevel = 0, e.nightLightSwitch = 0, e.hipwashWaterPressure = 1, e.airTempLevel = 0, e.womanWaterPressure = 1, e.womanNozzlePosition = 1, e.autoBubble = 0, e.wideWashLevel = 0, e.flushLargeSwitch = 0, e.flushSmallSwitch = 0, e.bubbleSwitch = 0, e.footSensorSwitch = 0, e.preWettingSwitch = 0, e.seatTempError = 0, e.seatTempOver = 0, e.seatStatus = 0, e.isBubbleEnable = !0, e.bubbleDisableReason = 0, e.startFlushLargeTime = null, e.startFlushSmallTime = null, e.startBubbleTime = null, e.bubbleLockTimer = null, e
  }
  return i(c, [{
    key: "initDevice",
    value: function() {
      this.waterTempLevel = 0, this.autoCoverSwitch = 0, this.gestureSwitch = 0, this.autoFlushSwitch = 0, this.lightSensorSwitch = 0, this.smartPowerSave = 0, this.hipwashNozzlePosition = 1, this.seatTempLevel = 0, this.nightLightSwitch = 0, this.hipwashWaterPressure = 1, this.airTempLevel = 0, this.womanWaterPressure = 1, this.womanNozzlePosition = 1, this.autoBubble = 0, this.wideWashLevel = 0, this.flushLargeSwitch = 0, this.flushSmallSwitch = 0, this.bubbleSwitch = 0, this.footSensorSwitch = 0, this.preWettingSwitch = 0, this.seatTempError = 0, this.isBubbleEnable = !0, this.bubbleDisableReason = 0, this.startFlushLargeTime = null, this.startFlushSmallTime = null, this.startBubbleTime = null, this.bubbleLockTimer = null
    }
  }, {
    key: "setScene",
    value: function(e) {
      this.isSceneLinkage = e
    }
  }, {
    key: "quaryDeviceState",
    value: function() {
      console.log("------ 查询外设状态 -----");
      var e = new ArrayBuffer(12),
        t = new DataView(e);
      t.setUint8(0, 243), t.setUint8(1, 244), t.setUint8(2, e.byteLength - 4), t.setUint8(3, c.BLE_ADDRESS), t.setUint8(4, c.TOILET_ADDRESS), t.setUint8(5, 226), t.setUint8(6, 0), t.setUint8(7, 0), t.setUint8(8, 0), t.setUint8(9, 0);
      var i = this.calculateChecksum(t);
      t.setUint8(10, i), t.setUint8(11, 252), this.writeCommand(e)
    }
  }, {
    key: "setLightSensor",
    value: function(e) {
      console.log("光感夜灯", e);
      this.lightSensorSwitch = e ? 1 : 0;
      var t = new ArrayBuffer(12),
        i = new DataView(t);
      i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, t.byteLength - 4), i.setUint8(3, c.BLE_ADDRESS), i.setUint8(4, c.TOILET_ADDRESS), i.setUint8(5, 25);
      var s = 0;
      s |= this.waterTempLevel << 4, s |= this.autoCoverSwitch << 3, s |= this.gestureSwitch << 2, s |= this.autoFlushSwitch << 1, s |= 0, i.setUint8(6, s);
      var a = 0;
      a |= this.smartPowerSave << 7, a |= this.hipwashNozzlePosition << 4, a |= this.seatTempLevel << 0, i.setUint8(7, a);
      var l = 0;
      l |= this.lightSensorSwitch << 7, l |= this.hipwashWaterPressure << 4, l |= this.airTempLevel << 0, i.setUint8(8, l);
      var n = 0;
      n |= this.wideWashLevel << 4, i.setUint8(9, n);
      var o = this.calculateChecksum(i);
      i.setUint8(10, o), i.setUint8(11, 252), console.log("执行马桶的功能 == ", u(t)), this.writeCommand(t)
    }
  }, {
    key: "setAutoBubble",
    value: function(e) {
      console.log("自动发泡"), this.autoBubble = e ? 1 : 0;
      var t = new ArrayBuffer(10),
        i = new DataView(t);
      i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, t.byteLength - 4), i.setUint8(3, c.BLE_ADDRESS), i.setUint8(4, c.TOILET_ADDRESS), i.setUint8(5, 31), i.setUint8(6, 32);
      var s = 0;
      s |= e ? 2 : 4, i.setUint8(7, s);
      var a = this.calculateChecksum(i);
      i.setUint8(8, a), i.setUint8(9, 252), console.log("执行自动发泡的功能 == ", u(t)), this.writeCommand(t)
    }
  }, {
    key: "setPreWetting",
    value: function(e) {
      console.log("预湿润"), this.autoBubble = e ? 1 : 0;
      var t = new ArrayBuffer(10),
        i = new DataView(t);
      i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, t.byteLength - 4), i.setUint8(3, c.BLE_ADDRESS), i.setUint8(4, c.TOILET_ADDRESS), i.setUint8(5, 31), i.setUint8(6, 48);
      var s = 0;
      e && (s |= 4), i.setUint8(7, s);
      var a = this.calculateChecksum(i);
      i.setUint8(8, a), i.setUint8(9, 252), console.log("执行预湿润的功能 == ", u(t)), this.writeCommand(t)
    }
  }, {
    key: "setAutoFlush",
    value: function(e) {
      console.log("自动冲刷");
      this.autoFlushSwitch = e ? 1 : 0;
      var t = new ArrayBuffer(12),
        i = new DataView(t);
      i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, t.byteLength - 4), i.setUint8(3, c.BLE_ADDRESS), i.setUint8(4, c.TOILET_ADDRESS), i.setUint8(5, 25);
      var s = 0;
      s |= this.waterTempLevel << 4, s |= this.autoCoverSwitch << 3, s |= this.gestureSwitch << 2, s |= this.autoFlushSwitch << 1, s |= 0, i.setUint8(6, s);
      var a = 0;
      a |= this.smartPowerSave << 7, a |= this.hipwashNozzlePosition << 4, a |= this.seatTempLevel << 0, i.setUint8(7, a);
      var l = 0;
      l |= this.lightSensorSwitch << 7, l |= this.hipwashWaterPressure << 4, l |= this.airTempLevel << 0, i.setUint8(8, l);
      var n = 0;
      n |= this.wideWashLevel << 4, i.setUint8(9, n);
      var o = this.calculateChecksum(i);
      i.setUint8(10, o), i.setUint8(11, 252), console.log("执行马桶的功能 == ", u(t)), this.writeCommand(t)
    }
  }, {
    key: "setAutoFootSensor",
    value: function(e) {
      console.log("脚感控制", e), this.footSensorSwitch = e ? 1 : 0;
      var t = new ArrayBuffer(10),
        i = new DataView(t);
      i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, t.byteLength - 4), i.setUint8(3, c.BLE_ADDRESS), i.setUint8(4, c.TOILET_ADDRESS), i.setUint8(5, 31), i.setUint8(6, 36);
      var s = 0;
      s |= e ? 1 : 2, i.setUint8(7, s);
      var a = this.calculateChecksum(i);
      i.setUint8(8, a), i.setUint8(9, 252), console.log("执行脚感的功能 == ", u(t)), this.writeCommand(t)
    }
  }, {
    key: "setSeatTemp",
    value: function(e) {
      console.log("座温设置", e), this.seatTempLevel = e, this.startToiletFunction(25)
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
      var e = new ArrayBuffer(10),
        t = new DataView(e);
      t.setUint8(0, 243), t.setUint8(1, 244), t.setUint8(2, e.byteLength - 4), t.setUint8(3, c.BLE_ADDRESS), t.setUint8(4, c.TOILET_ADDRESS), t.setUint8(5, 31), t.setUint8(6, 32);
      t.setUint8(7, 1);
      var i = this.calculateChecksum(t);
      t.setUint8(8, i), t.setUint8(9, 252), console.log("执行启动魔力泡的功能 == ", u(e)), this.writeCommand(e)
    }
  }, {
    key: "startToiletFunction",
    value: function(e) {
      console.log("执行马桶的功能", e);
      var t = new ArrayBuffer(13),
        i = new DataView(t);
      i.setUint8(0, 243), i.setUint8(1, 244), i.setUint8(2, t.byteLength - 4), i.setUint8(3, c.BLE_ADDRESS), i.setUint8(4, c.TOILET_ADDRESS), i.setUint8(5, e);
      var s = 0;
      s |= this.waterTempLevel << 4, s |= this.autoCoverSwitch << 3, s |= this.gestureSwitch << 2, s |= this.autoFlushSwitch << 1, s |= this.nightLightSwitch << 0, i.setUint8(6, s);
      var a = 0;
      a |= this.smartPowerSave << 7, a |= 7 == e || 3 == e ? this.womanNozzlePosition << 4 : this.hipwashNozzlePosition << 4, a |= this.seatTempLevel << 0, i.setUint8(7, a);
      var l = 0;
      l |= this.lightSensorSwitch << 7, l |= 7 == e || 3 == e ? this.womanWaterPressure << 4 : this.hipwashWaterPressure << 4, l |= this.airTempLevel << 0, i.setUint8(8, l);
      var n = 0;
      n |= this.wideWashLevel << 4, i.setUint8(9, n);
      i.setUint8(10, 0);
      var o = this.calculateChecksum(i);
      i.setUint8(11, o), i.setUint8(12, 252), console.log("执行马桶的功能 == ", u(t)), this.writeCommand(t)
    }
  }, {
    key: "onDeviceReady",
    value: function(e) {
      s(a(c.prototype), "onDeviceReady", this).call(this, e), console.log("######## 查询设备信息 ########"), this.quaryDeviceState()
    }
  }, {
    key: "onMsgValueChange",
    value: function(e) {
      var t = e.value;
      console.log("============= 消息监听通知 =============\n", u(t));
      var i = new Uint8Array(t);
      if (e.characteristicId !== this.notifyComUUID) i.length < 7 || 243 != i[0] || 244 != i[1] || (i[3] == c.TOILET_ADDRESS ? 250 == i[5] ? this.dealWithFA(i) : 236 == i[5] ? this.dealWithEC(i) : 32 == i[5] ? this.dealWith20(i) : 233 == i[5] ? this.dealWithE9(i) : 234 == i[5] ? this.dealWithEA(i) : 226 == i[5] && this.dealWithE2(i) : i[3] == c.BLE_ADDRESS && 33 == i[4] && this.dealWithCommand(i));
      else {
        if (i.length < 4 || 250 != i[0]) return;
        this.dealWithCustomProtocol(i)
      }
    }
  }, {
    key: "dealWithCustomProtocol",
    value: function(e) {
      2 == e[2] && (this.model = h.ab2hexFromStart(e, 6, 3))
    }
  }, {
    key: "dealWithE2",
    value: function(e) {
      console.log("外设状态查询");
      var t = e[6];
      this.waterTempLevel = t >> 4, console.log("水温档位", this.waterTempLevel), this.autoCoverSwitch = t >> 3 & 1, this.gestureSwitch = t >> 2 & 1, this.autoFlushSwitch = t >> 1 & 1, this.lightSensorSwitch = t >> 0 & 1;
      var i = e[7];
      this.waterTempLevel = i >> 7 & 1, this.hipwashNozzlePosition = i >> 4 & 7, this.seatTempLevel = 15 & i, console.log("座温", this.seatTempLevel);
      var s = e[8];
      this.nightLightSwitch = s >> 7 & 1, this.hipwashWaterPressure = s >> 4 & 7, this.airTempLevel = s >> 0 & 7;
      var a = e[9];
      this.womanWaterPressure = a >> 7 & 1, this.womanNozzlePosition = a >> 4 & 7
    }
  }, {
    key: "dealWithCommand",
    value: function(e) {
      switch (console.log("下发指令"), e[5]) {
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
    key: "dealWithSeatStatusChange",
    value: function(e) {
      console.log("着座状态变化处理", e), this.isSceneLinkage && (console.log("发送着座状态变化", e), r.emit("iotEvent", {
        seatStatus: 1 == e
      }))
    }
  }, {
    key: "dealWithE9",
    value: function(e) {
      var t = e[6] >> 7 & 1;
      console.log("着座状态", t), this.seatStatus != t && this.dealWithSeatStatusChange(t), this.seatStatus = t;
      e[7];
      var i = e[8],
        s = i >> 1 & 1;
      this.seatTempError = s;
      var a = i >> 5 & 1;
      this.seatTempOver = a;
      e[9];
      var l = e[10] >> 3 & 1;
      console.log("全自动状态", l)
    }
  }, {
    key: "dealWithFA",
    value: function(e) {
      var t = this,
        i = e[6],
        s = i >> 1 & 1;
      this.autoFlushSwitch = s;
      var a = 15 & e[7];
      this.seatTempLevel = a, console.log("座温档位", a);
      var l = e[8] >> 7 & 1;
      this.lightSensorSwitch = l;
      e[9];
      var n = e[10],
        o = n >> 2 & 1;
      1 == o ? 0 == this.flushSmallSwitch && (this.startFlushSmallTime = new Date) : null != this.startFlushSmallTime && (this.closeBubbleTimer(), this.isBubbleEnable = !1, this.bubbleDisableReason = 1, this.bubbleLockTimer = setTimeout((function() {
        t.isBubbleEnable = !0, null != t.msgValueChangeCallBack && t.msgValueChangeCallBack(null)
      }), 3e4), this.startFlushSmallTime = null), this.flushSmallSwitch = o;
      var h = n >> 3 & 1;
      1 == h ? 0 == this.flushSmallSwitch && (this.startFlushLargeTime = new Date) : null != this.startFlushLargeTime && (this.closeBubbleTimer(), this.bubbleDisableReason = 2, this.isBubbleEnable = !1, this.bubbleLockTimer = setTimeout((function() {
        t.isBubbleEnable = !0, null != t.msgValueChangeCallBack && t.msgValueChangeCallBack(null)
      }), 3e4), this.startFlushLargeTime = null), this.flushLargeSwitch = h, console.log("大冲", h);
      e[11];
      var r = e[12],
        u = r >> 3 & 1;
      this.autoBubble = u;
      var c = r >> 2 & 1;
      c ? 0 == this.bubbleSwitch && (console.log("自动"), this.startBubbleTime = new Date) : null != this.startBubbleTime && (this.closeBubbleTimer(), this.isBubbleEnable = !1, this.bubbleDisableReason = 0, this.bubbleLockTimer = setTimeout((function() {
        t.isBubbleEnable = !0, null != t.msgValueChangeCallBack && t.msgValueChangeCallBack(null)
      }), 3e4), this.startBubbleTime = null), this.bubbleSwitch = c, console.log("泡沫盾状态", c);
      var m = r >> 5 & 1;
      this.preWettingSwitch = m;
      var b = e[13] >> 5 & 1;
      this.footSensorSwitch = b
    }
  }, {
    key: "dealWithEC",
    value: function(e) {
      var t = e[6],
        i = t >> 1 & 1;
      console.log("小冲状态", i);
      var s = t >> 1 & 1;
      console.log("大冲状态", s)
    }
  }, {
    key: "dealWith20",
    value: function(e) {
      var t = e[6],
        i = t >> 1 & 1;
      console.log("自动发泡关闭", i);
      var s = t >> 2 & 1;
      console.log("自动发泡开启", s)
    }
  }, {
    key: "dealWithEA",
    value: function(e) {
      var t = e[6],
        i = t >> 1 & 1;
      console.log("座圈状态", i);
      var s = t >> 3 & 1;
      console.log("盖板状态", s)
    }
  }, {
    key: "writeDeviceInfo",
    value: function(e) {
      console.log("写入设备信息:", e);
      var t = new ArrayBuffer(10),
        i = new DataView(t);
      i.setUint8(0, 250), i.setUint8(1, t.byteLength), i.setUint8(2, 1), i.setUint8(3, 5), i.setUint8(4, 1), i.setUint8(5, 1);
      for (var s = 6, a = 0; a < e.length; a += 2) {
        var l = parseInt(e.substr(a, 2), 16);
        i.setUint8(s, l), s += 1
      }
      var n = this.calculateCommunicateChecksum(i);
      i.setUint8(9, n), this.writeCommunicateCommand(t)
    }
  }, {
    key: "readDeviceInfo",
    value: function() {
      console.log("读取设备信息");
      var e = new ArrayBuffer(4),
        t = new DataView(e);
      t.setUint8(0, 250), t.setUint8(1, e.byteLength), t.setUint8(2, 2);
      var i = this.calculateCommunicateChecksum(t);
      t.setUint8(3, i), this.writeCommunicateCommand(e)
    }
  }, {
    key: "closeBubbleTimer",
    value: function() {
      this.bubbleLockTimer && (clearTimeout(this.bubbleLockTimer), this.bubbleLockTimer = null)
    }
  }, {
    key: "startConnect",
    value: function(e, t) {
      this.closeBubbleTimer(), s(a(c.prototype), "startConnect", this).call(this, e, t)
    }
  }, {
    key: "stopConnnect",
    value: function() {
      this.closeBubbleTimer(), s(a(c.prototype), "stopConnnect", this).call(this)
    }
  }]), c
}(o.default);
c.BLE_ADDRESS = 146, c.TOILET_ADDRESS = 33, c.BROAD_ADDRESS = 0, c.FLIP_COVER_ADDRESS = 34;
var m = c;
exports.default = m;