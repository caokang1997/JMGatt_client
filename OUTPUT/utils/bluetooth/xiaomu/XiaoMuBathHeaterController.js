Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e, t = require("../../../@babel/runtime/helpers/classCallCheck"),
  n = require("../../../@babel/runtime/helpers/createClass"),
  o = require("../../../@babel/runtime/helpers/get"),
  i = require("../../../@babel/runtime/helpers/getPrototypeOf"),
  l = require("../../../@babel/runtime/helpers/inherits"),
  a = require("../../../@babel/runtime/helpers/createSuper"),
  s = (e = require("../xiaomu/XiaoMuBLEController.js")) && e.__esModule ? e : {
    default: e
  };
var r = require("../../bluetooth/bleutil.js"),
  u = require("../../eventBus.js"),
  h = function(e) {
    l(h, e);
    var s = a(h);

    function h() {
      var e;
      t(this, h);
      for (var n = arguments.length, o = new Array(n), i = 0; i < n; i++) o[i] = arguments[i];
      return (e = s.call.apply(s, [this].concat(o))).model = "-", e.strongWarm = 0, e.weakWarm = 0, e.ion = 0, e.dry = 0, e.wind = 0, e.ventilation = 0, e.nightLight = 0, e.light = 0, e.temp = 0, e.dryRemain = 0, e.windRemain = 0, e.ventilationRemain = 0, e.warmRemain = 0, e
    }
    return n(h, [{
      key: "registerIotEvent",
      value: function() {
        var e = this;
        u.on("iotEvent", (function(t) {
          null != t.seatStatus && (t.seatStatus ? (e.openLight(!0), setTimeout((function() {
            e.openVentilation(!0)
          }), 100)) : (e.openLight(!1), setTimeout((function() {
            e.openVentilation(!1)
          }), 100)))
        }))
      }
    }, {
      key: "openVentilation",
      value: function(e) {
        console.log("开关换气", e), this._startControl(53, e ? 1 : 0)
      }
    }, {
      key: "openLight",
      value: function(e) {
        console.log("开关照明", e), this._startControl(68, e ? 1 : 0)
      }
    }, {
      key: "openNightLight",
      value: function(e) {
        console.log("开关夜灯", e), this._startControl(51, e ? 1 : 0)
      }
    }, {
      key: "openWarmWind",
      value: function(e) {
        console.log("开关取暖", e), this._startControl(52, e)
      }
    }, {
      key: "oneKeyClose",
      value: function(e) {
        console.log("一键关闭", e), this._startControl(50, e)
      }
    }, {
      key: "openWind",
      value: function(e) {
        console.log("开关自然风", e), this._startControl(54, e)
      }
    }, {
      key: "openIon",
      value: function(e) {
        console.log("开关负离子", e), this._startControl(55, e)
      }
    }, {
      key: "openDry",
      value: function(e) {
        console.log("干燥模式", e), this._startControl(56, e)
      }
    }, {
      key: "_startControl",
      value: function(e, t) {
        var n = new ArrayBuffer(17),
          o = new DataView(n);
        o.setUint8(14, e), o.setUint8(15, t), this._updateDefaultValue(o), this.writeCommand(n)
      }
    }, {
      key: "_updateDefaultValue",
      value: function(e) {
        e.setUint8(0, 252), e.setUint8(1, 0), e.setUint8(2, 0), e.setUint8(3, 0), e.setUint8(4, 0), e.setUint8(5, 1), e.setUint8(6, 13), e.setUint8(7, 210), e.setUint8(8, 6), e.setUint8(9, 0), e.setUint8(10, 0), e.setUint8(11, 0), e.setUint8(12, 0), e.setUint8(13, 0);
        var t = e.byteLength - 1;
        e.setUint8(t, 252);
        var n = this.calculateLightChecksum(e);
        e.setUint8(1, n)
      }
    }, {
      key: "calculateLightChecksum",
      value: function(e) {
        console.log("校验码计算", e);
        for (var t = 0, n = 2; n < e.byteLength - 1; n++) t += e.getUint8(n);
        return 255 & t
      }
    }, {
      key: "onDeviceReady",
      value: function(e) {
        console.log("设备已就绪"), o(i(h.prototype), "onDeviceReady", this).call(this, e)
      }
    }, {
      key: "onMsgValueChange",
      value: function(e) {
        var t = e.value;
        console.log("============= 消息监听通知 =============\n", r.ab2hex(t));
        var n = new Uint8Array(t);
        if (e.characteristicId === this.notifyComUUID) {
          if (n.length < 4 || 250 != n[0]) return;
          return this.dealWithCustomProtocol(n), void(null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(r.ab2hex(t)))
        }
        n.length < 16 || 252 != n[0] || 252 != n[n.length - 1] || (48 == n[14] ? (console.log("30指令上报"), this.dealWith30(n)) : console.log("其他应答指令"), null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(r.ab2hex(t)))
      }
    }, {
      key: "dealWith30",
      value: function(e) {
        console.log("---- 30 指令 ----");
        e[15];
        var t = e[16],
          n = t >> 0 & 1;
        console.log("强暖", n), this.strongWarm = n;
        var o = t >> 1 & 1;
        console.log("弱暖", o), this.weakWarm = o;
        var i = t >> 2 & 1;
        console.log("负离子", i), this.ion = i;
        var l = t >> 3 & 1;
        console.log("干燥", l), this.dry = l;
        var a = t >> 4 & 1;
        console.log("自然风", a), this.wind = a;
        var s = t >> 5 & 1;
        console.log("换气", s), this.ventilation = s;
        var r = t >> 6 & 1;
        console.log("小夜灯", r), this.nightLight = r;
        var u = t >> 7 & 1;
        console.log("照明", u), this.light = u;
        var h = e[20];
        this.temp = h;
        var c = e[26];
        this.ventilationRemain = c, console.log("换气剩余", c);
        var g = e[28];
        this.windRemain = g, console.log("吹风剩余", g);
        var v = e[30];
        this.warmRemain = v, console.log("取暖剩余", v);
        var m = e[32];
        this.dryRemain = m, console.log("干燥剩余", m)
      }
    }, {
      key: "dealWithCustomProtocol",
      value: function(e) {
        2 == e[2] && (this.model = r.BleUtil.ab2hexFromStart(e, 6, 3))
      }
    }]), h
  }(s.default);
exports.default = h;