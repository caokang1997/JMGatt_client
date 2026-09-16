Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e, t = require("../../@babel/runtime/helpers/classCallCheck"),
  a = require("../../@babel/runtime/helpers/createClass"),
  r = require("../../@babel/runtime/helpers/get"),
  i = require("../../@babel/runtime/helpers/getPrototypeOf"),
  n = require("../../@babel/runtime/helpers/inherits"),
  l = require("../../@babel/runtime/helpers/createSuper"),
  s = (e = require("./BLEController.js")) && e.__esModule ? e : {
    default: e
  };
var o = require("../bluetooth/bleutil.js"),
  u = function(e) {
    n(u, e);
    var s = l(u);

    function u() {
      var e;
      t(this, u);
      for (var a = arguments.length, r = new Array(a), i = 0; i < a; i++) r[i] = arguments[i];
      return (e = s.call.apply(s, [this].concat(r))).model = "-", e
    }
    return a(u, [{
      key: "setBit",
      value: function(e, t) {
        return e | 1 << t
      }
    }, {
      key: "startClock",
      value: function(e, t) {
        console.log("开始校准时间");
        var a = new ArrayBuffer(10),
          r = new DataView(a);
        r.setUint8(0, 252);
        var i = new Date,
          n = i.getFullYear() - 2e3;
        r.setUint8(2, n);
        var l = i.getMonth() + 1;
        r.setUint8(3, l);
        var s = i.getDate();
        r.setUint8(4, s);
        var u = i.getDay();
        r.setUint8(5, u), r.setUint8(6, e), r.setUint8(7, t);
        var c = i.getSeconds();
        r.setUint8(8, c), r.setUint8(9, 252);
        var h = r.getUint8(2) + r.getUint8(3) + r.getUint8(4) & 255;
        r.setUint8(1, h);
        var v = "0000FF01-0000-1000-8000-00805F9B34FB";
        "A4C138AC0718" == this.mac && (v = "00010203-0405-0607-0809-0a0b0c0d2b11"), console.log("下发指令 = ", o.ab2hex(a)), console.log("writeComUUID=", v), wx.writeBLECharacteristicValue({
          deviceId: this.deviceId,
          serviceId: "0000FF00-0000-1000-8000-00805F9B34FB",
          characteristicId: v,
          value: a
        })
      }
    }, {
      key: "startTimer",
      value: function() {
        console.log("开始校准时间");
        var e = new ArrayBuffer(10),
          t = new DataView(e);
        t.setUint8(0, 252);
        var a = new Date,
          r = a.getFullYear() - 2e3;
        t.setUint8(2, r);
        var i = a.getMonth() + 1;
        t.setUint8(3, i);
        var n = a.getDate();
        t.setUint8(4, n);
        var l = a.getDay();
        t.setUint8(5, l);
        var s = a.getHours();
        t.setUint8(6, s);
        var u = a.getMinutes();
        t.setUint8(7, u);
        var c = a.getSeconds();
        t.setUint8(8, c), t.setUint8(9, 252);
        var h = t.getUint8(2) + t.getUint8(3) + t.getUint8(4) & 255;
        t.setUint8(1, h);
        var v = "0000FF01-0000-1000-8000-00805F9B34FB";
        "A4C138AC0718" == this.mac && (v = "00010203-0405-0607-0809-0a0b0c0d2b11"), console.log("下发指令 = ", o.ab2hex(e)), console.log("writeComUUID=", v), wx.writeBLECharacteristicValue({
          deviceId: this.deviceId,
          serviceId: "0000FF00-0000-1000-8000-00805F9B34FB",
          characteristicId: v,
          value: e
        })
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
        r(i(u.prototype), "onDeviceReady", this).call(this, e), setTimeout((function() {}), 1e3)
      }
    }, {
      key: "onMsgValueChange",
      value: function(e) {
        var t = e.value;
        console.log("============= 消息监听通知 =============\n", o.ab2hex(t));
        var a = new Uint8Array(t);
        if (e.characteristicId === this.notifyComUUID) {
          if (a.length < 4 || 250 != a[0]) return;
          return this.dealWithCustomProtocol(a), void(null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(o.ab2hex(t)))
        }
        a.length < 7 || 243 != a[0] || 244 != a[1] || null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(o.ab2hex(t))
      }
    }, {
      key: "dealWithCustomProtocol",
      value: function(e) {
        2 == e[2] && (this.model = o.BleUtil.ab2hexFromStart(e, 6, 3))
      }
    }, {
      key: "writeDeviceInfo",
      value: function(e) {
        console.log("写入设备信息");
        var t = new ArrayBuffer(10),
          a = new DataView(t);
        a.setUint8(0, 250), a.setUint8(1, t.byteLength), a.setUint8(2, 1), a.setUint8(3, 5), a.setUint8(4, 1), a.setUint8(5, 1);
        for (var r = 6, i = 0; i < e.length; i += 2) {
          var n = parseInt(e.substr(i, 2), 16);
          a.setUint8(r, n), r += 1
        }
        var l = this.calculateCommunicateChecksum(a);
        a.setUint8(9, l), this.writeCommunicateCommand(t)
      }
    }]), u
  }(s.default);
exports.default = u;