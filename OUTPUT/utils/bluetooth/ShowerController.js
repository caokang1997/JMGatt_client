Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e, t = require("../../@babel/runtime/helpers/classCallCheck"),
  r = require("../../@babel/runtime/helpers/createClass"),
  i = require("../../@babel/runtime/helpers/get"),
  a = require("../../@babel/runtime/helpers/getPrototypeOf"),
  n = require("../../@babel/runtime/helpers/inherits"),
  l = require("../../@babel/runtime/helpers/createSuper"),
  s = (e = require("./BLEController.js")) && e.__esModule ? e : {
    default: e
  };
var u = require("../bluetooth/bleutil.js"),
  o = function(e) {
    n(o, e);
    var s = l(o);

    function o() {
      var e;
      t(this, o);
      for (var r = arguments.length, i = new Array(r), a = 0; a < r; a++) i[a] = arguments[a];
      return (e = s.call.apply(s, [this].concat(i))).model = "-", e
    }
    return r(o, [{
      key: "setBit",
      value: function(e, t) {
        return e | 1 << t
      }
    }, {
      key: "startDischarge",
      value: function(e, t, r, i, a) {
        console.log("开启冷水预排");
        var n = new ArrayBuffer(6),
          l = new DataView(n);
        l.setUint8(0, 104), l.setUint8(1, 6), l.setUint8(2, e ? 1 : 0);
        var s = 0;
        t && (s = this.setBit(s, 0)), r && (s = this.setBit(s, 1)), i && (s = this.setBit(s, 2)), a && (s = this.setBit(s, 3)), l.setUint8(3, s);
        var u = l.getUint8(2) + l.getUint8(3) & 255;
        l.setUint8(4, u), l.setUint8(5, 22), this.writeCommand(n)
      }
    }, {
      key: "calculateLightChecksum",
      value: function(e) {
        console.log("校验码计算", e);
        for (var t = 0, r = 2; r < e.byteLength - 1; r++) t += e.getUint8(r);
        return 255 & t
      }
    }, {
      key: "onDeviceReady",
      value: function(e) {
        i(a(o.prototype), "onDeviceReady", this).call(this, e), setTimeout((function() {}), 1e3)
      }
    }, {
      key: "onMsgValueChange",
      value: function(e) {
        var t = e.value;
        console.log("============= 消息监听通知 =============\n", u.ab2hex(t));
        var r = new Uint8Array(t);
        if (e.characteristicId === this.notifyComUUID) {
          if (r.length < 4 || 250 != r[0]) return;
          return this.dealWithCustomProtocol(r), void(null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(u.ab2hex(t)))
        }
        r.length < 7 || 243 != r[0] || 244 != r[1] || null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(u.ab2hex(t))
      }
    }, {
      key: "dealWithCustomProtocol",
      value: function(e) {
        2 == e[2] && (this.model = u.BleUtil.ab2hexFromStart(e, 6, 3))
      }
    }, {
      key: "writeDeviceInfo",
      value: function(e) {
        console.log("写入设备信息");
        var t = new ArrayBuffer(10),
          r = new DataView(t);
        r.setUint8(0, 250), r.setUint8(1, t.byteLength), r.setUint8(2, 1), r.setUint8(3, 5), r.setUint8(4, 1), r.setUint8(5, 1);
        for (var i = 6, a = 0; a < e.length; a += 2) {
          var n = parseInt(e.substr(a, 2), 16);
          r.setUint8(i, n), i += 1
        }
        var l = this.calculateCommunicateChecksum(r);
        r.setUint8(9, l), this.writeCommunicateCommand(t)
      }
    }]), o
  }(s.default);
exports.default = o;