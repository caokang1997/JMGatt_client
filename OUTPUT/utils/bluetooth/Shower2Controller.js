Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e, t = require("../../@babel/runtime/helpers/classCallCheck"),
  r = require("../../@babel/runtime/helpers/createClass"),
  l = require("../../@babel/runtime/helpers/get"),
  n = require("../../@babel/runtime/helpers/getPrototypeOf"),
  a = require("../../@babel/runtime/helpers/inherits"),
  i = require("../../@babel/runtime/helpers/createSuper"),
  s = (e = require("./BLEController.js")) && e.__esModule ? e : {
    default: e
  };
var o = require("../bluetooth/bleutil.js"),
  u = function(e) {
    a(u, e);
    var s = i(u);

    function u() {
      var e;
      t(this, u);
      for (var r = arguments.length, l = new Array(r), n = 0; n < r; n++) l[n] = arguments[n];
      return (e = s.call.apply(s, [this].concat(l))).model = "-", e.waterTemp = 0, e.onDisCharge = !1, e.onShower = !1, e.selectDischargeType = 0, e
    }
    return r(u, [{
      key: "setBit",
      value: function(e, t) {
        return e | 1 << t
      }
    }, {
      key: "startDischarge",
      value: function(e, t, r, l, n) {
        console.log("开启冷水预排");
        var a = new ArrayBuffer(12),
          i = new DataView(a);
        i.setUint8(0, 0), i.setUint8(1, 0), i.setUint8(2, 0), i.setUint8(3, 0), i.setUint8(4, 0), i.setUint8(5, 0), i.setUint8(6, 0), i.setUint8(7, 252), i.setUint8(8, e ? 64 : 63), i.setUint8(9, 63), i.setUint8(10, e ? 1 : 0), i.setUint8(11, 252), this.writeCommand(a)
      }
    }, {
      key: "_updateDefaultValue",
      value: function(e) {
        e.setUint8(0, 252), e.setUint8(1, 0);
        var t = e.byteLength - 1;
        e.setUint8(t, 252);
        var r = this.calculateLightChecksum(e);
        e.setUint8(1, r)
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
        l(n(u.prototype), "onDeviceReady", this).call(this, e), setTimeout((function() {}), 1e3)
      }
    }, {
      key: "onMsgValueChange",
      value: function(e) {
        var t = e.value;
        console.log("============= 消息监听通知 =============\n", o.ab2hex(t));
        var r = new Uint8Array(t);
        r.length < 4 || 254 != r[0] || 252 != r[1] || 252 != r[r.length - 1] || (48 == r[3] ? (console.log("30指令上报"), this.dealWith30(r)) : console.log("其他应答指令"), null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(o.ab2hex(t)))
      }
    }, {
      key: "dealWith30",
      value: function(e) {
        var t = Array.prototype.map.call(e, (function(e) {
          return ("00" + e.toString(16)).slice(-2)
        })).join("");
        console.log("hex =", t);
        var r = e[4],
          l = 3 & r;
        this.onDisCharge = 1 == l, console.log("冷水预排状态 = ", this.onDisCharge);
        var n = r >> 2 & 1;
        this.onShower = 1 == n;
        var a = e[5];
        1 == (a >> 0 & 1) && (console.log("出水口 0 - 顶喷"), this.selectDischargeType = 0), 1 == (a >> 1 & 1) && (console.log("出水口 1 - 手持花洒"), this.selectDischargeType = 1), 1 == (a >> 2 & 1) && (console.log("出水口 2 - 下出水"), this.selectDischargeType = 2);
        var i = e[6];
        this.waterTemp = i, console.log("水温 = ", this.waterTemp);
        e[7]
      }
    }]), u
  }(s.default);
exports.default = u;