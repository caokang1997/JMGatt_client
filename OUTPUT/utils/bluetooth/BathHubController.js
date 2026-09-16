Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e, t = require("../../@babel/runtime/helpers/classCallCheck"),
  a = require("../../@babel/runtime/helpers/createClass"),
  n = require("../../@babel/runtime/helpers/get"),
  l = require("../../@babel/runtime/helpers/getPrototypeOf"),
  r = require("../../@babel/runtime/helpers/inherits"),
  i = require("../../@babel/runtime/helpers/createSuper"),
  s = (e = require("./BLEController.js")) && e.__esModule ? e : {
    default: e
  };
var u = require("../bluetooth/bleutil.js"),
  o = function(e) {
    r(o, e);
    var s = i(o);

    function o() {
      var e;
      t(this, o);
      for (var a = arguments.length, n = new Array(a), l = 0; l < a; l++) n[l] = arguments[l];
      return (e = s.call.apply(s, [this].concat(n))).model = "-", e.waterInOn = 0, e.waterOutOn = 0, e.setTemp = 26, e.realTemp = 26, e
    }
    return a(o, [{
      key: "openWaterIn",
      value: function(e) {
        console.log("开关进水", e);
        var t = new ArrayBuffer(18),
          a = new DataView(t);
        a.setUint8(14, 56), a.setUint8(15, 1), a.setUint8(16, e ? 1 : 0), this._updateDefaultValue(a), this.writeCommand(t)
      }
    }, {
      key: "openWaterOut",
      value: function(e) {
        console.log("开关排水", e), this._startControl(51, e ? 1 : 0)
      }
    }, {
      key: "setWaterTemp",
      value: function(e) {
        this.setTemp = e, console.log("设置水温", e);
        var t = new ArrayBuffer(18),
          a = new DataView(t);
        a.setUint8(14, 53), a.setUint8(15, 1), a.setUint8(16, e), this._updateDefaultValue(a), this.writeCommand(t)
      }
    }, {
      key: "_startControl",
      value: function(e, t) {
        var a = new ArrayBuffer(17),
          n = new DataView(a);
        n.setUint8(14, e), n.setUint8(15, t), this._updateDefaultValue(n), this.writeCommand(a)
      }
    }, {
      key: "_updateDefaultValue",
      value: function(e) {
        e.setUint8(0, 252), e.setUint8(1, 0), e.setUint8(2, 1), e.setUint8(3, 0), e.setUint8(4, 0), e.setUint8(5, 0), e.setUint8(6, 2), e.setUint8(7, 3), e.setUint8(8, 1), e.setUint8(9, 1), e.setUint8(10, 0), e.setUint8(11, 0), e.setUint8(12, 0), e.setUint8(13, 0);
        var t = e.byteLength - 1;
        e.setUint8(t, 252);
        var a = this.calculateLightChecksum(e);
        e.setUint8(1, a)
      }
    }, {
      key: "calculateLightChecksum",
      value: function(e) {
        console.log("校验码计算", e);
        for (var t = 0, a = 2; a < e.byteLength - 1; a++) t += e.getUint8(a);
        return 255 & t
      }
    }, {
      key: "onDeviceReady",
      value: function(e) {
        console.log("设备已就绪"), n(l(o.prototype), "onDeviceReady", this).call(this, e)
      }
    }, {
      key: "onMsgValueChange",
      value: function(e) {
        var t = e.value;
        console.log("============= 消息监听通知 =============\n", u.ab2hex(t));
        var a = new Uint8Array(t);
        if (e.characteristicId === this.notifyComUUID) {
          if (a.length < 4 || 250 != a[0]) return;
          return this.dealWithCustomProtocol(a), void(null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(u.ab2hex(t)))
        }
        a.length < 16 || 252 != a[0] || 252 != a[a.length - 1] || (48 == a[14] ? (console.log("30指令上报"), this.dealWith30(a)) : console.log("其他应答指令"), null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(u.ab2hex(t)))
      }
    }, {
      key: "dealWith30",
      value: function(e) {
        console.log("---- 30 指令 ----");
        var t = e[15],
          a = t >> 2 & 1;
        this.waterInOn = a;
        var n = t >> 0 & 1;
        this.waterOutOn = n;
        var l = e[21];
        this.realTemp = l;
        var r = e[26];
        this.setTemp = r
      }
    }, {
      key: "dealWithCustomProtocol",
      value: function(e) {
        2 == e[2] && (this.model = u.BleUtil.ab2hexFromStart(e, 6, 3))
      }
    }]), o
  }(s.default);
exports.default = o;