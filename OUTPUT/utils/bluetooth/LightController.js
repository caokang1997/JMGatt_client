Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e, t = require("../../@babel/runtime/helpers/classCallCheck"),
  n = require("../../@babel/runtime/helpers/createClass"),
  i = require("../../@babel/runtime/helpers/get"),
  a = require("../../@babel/runtime/helpers/getPrototypeOf"),
  s = require("../../@babel/runtime/helpers/inherits"),
  o = require("../../@babel/runtime/helpers/createSuper"),
  l = (e = require("./BLEController.js")) && e.__esModule ? e : {
    default: e
  };
var r = require("../bluetooth/bleutil.js"),
  u = function(e) {
    s(u, e);
    var l = o(u);

    function u() {
      var e;
      t(this, u);
      for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++) i[a] = arguments[a];
      return (e = l.call.apply(l, [this].concat(i))).model = "-", e.powerOn = 0, e.brightness = 0, e.colorR = 0, e.colorG = 0, e.colorB = 0, e.mode = 0, e.lightModes = new Array(19).fill({
        speed: 0,
        brightness: 0
      }), e
    }
    return n(u, [{
      key: "openLight",
      value: function(e) {
        console.log("开关灯", e);
        var t = e ? 1 : 0,
          n = new ArrayBuffer(19),
          i = new DataView(n);
        i.setUint8(14, 114), i.setUint8(15, 1), i.setUint8(16, 0), i.setUint8(17, t), this._updateDefaultValue(i), this.writeCommand(n)
      }
    }, {
      key: "openLightWithRGB",
      value: function(e, t, n, i, a) {
        console.log("开关灯(带亮度和RGB)", e);
        var s = e ? 1 : 0,
          o = new ArrayBuffer(22),
          l = new DataView(o);
        l.setUint8(14, 122), l.setUint8(15, 1), l.setUint8(16, s), l.setUint8(17, n), l.setUint8(18, i), l.setUint8(19, a), l.setUint8(20, t), this._updateDefaultValue(l), this.writeCommand(o)
      }
    }, {
      key: "queryLightInfo",
      value: function() {
        console.log("系统参数查询");
        var e = new ArrayBuffer(17),
          t = new DataView(e);
        t.setUint8(14, 113), t.setUint8(15, 0), this._updateDefaultValue(t), this.writeCommand(e)
      }
    }, {
      key: "setModeBrightness",
      value: function(e, t) {
        console.log("控制器设置亮度 模式 = ", e, " 亮度 = ", t);
        var n = new ArrayBuffer(21),
          i = new DataView(n);
        i.setUint8(14, 116), i.setUint8(15, 1), i.setUint8(16, 0), i.setUint8(17, 0), i.setUint8(18, e), i.setUint8(19, t), this._updateDefaultValue(i), this.writeCommand(n)
      }
    }, {
      key: "setColorTemp",
      value: function(e) {
        console.log("设置色温");
        var t = new ArrayBuffer(21),
          n = new DataView(t);
        n.setUint8(14, 115), n.setUint8(15, 1), n.setUint8(16, 0), n.setUint8(17, 0), n.setUint8(18, 255 & e), n.setUint8(19, e >> 8 & 255), this._updateDefaultValue(n), this.writeCommand(t)
      }
    }, {
      key: "setRGB",
      value: function(e, t, n) {
        console.log("设置RGB");
        var i = new ArrayBuffer(22),
          a = new DataView(i);
        a.setUint8(14, 121), a.setUint8(15, 1), a.setUint8(16, 0), a.setUint8(17, 0), a.setUint8(18, e), a.setUint8(19, t), a.setUint8(20, n), this._updateDefaultValue(a), this.writeCommand(i)
      }
    }, {
      key: "openMusicLightMode",
      value: function(e) {
        console.log("开关拾音模式");
        var t = e ? 1 : 0,
          n = new ArrayBuffer(17),
          i = new DataView(n);
        i.setUint8(14, 134), i.setUint8(15, t), this._updateDefaultValue(i), this.writeCommand(n)
      }
    }, {
      key: "setMusicLightMode",
      value: function(e) {
        console.log("设置拾音模式");
        var t = new ArrayBuffer(17),
          n = new DataView(t);
        n.setUint8(14, 135), n.setUint8(15, e), this._updateDefaultValue(n), this.writeCommand(t)
      }
    }, {
      key: "setModeSpeed",
      value: function(e, t) {
        console.log("设置模式速度");
        var n = new ArrayBuffer(19),
          i = new DataView(n);
        i.setUint8(14, 126), i.setUint8(15, 1), i.setUint8(16, e), i.setUint8(17, t), this._updateDefaultValue(i), this.writeCommand(n)
      }
    }, {
      key: "querySystemState",
      value: function() {
        console.log("系统状态查询");
        var e = new ArrayBuffer(17),
          t = new DataView(e);
        t.setUint8(14, 48), t.setUint8(15, 0), this._updateDefaultValue(t), this.writeCommand(e)
      }
    }, {
      key: "queryMode",
      value: function() {
        console.log("模式查询");
        var e = new ArrayBuffer(17),
          t = new DataView(e);
        t.setUint8(14, 49), t.setUint8(15, 0), this._updateDefaultValue(t), this.writeCommand(e)
      }
    }, {
      key: "setLightMode",
      value: function(e) {
        console.log("模式设置");
        var t = new ArrayBuffer(18),
          n = new DataView(t);
        n.setUint8(14, 123), n.setUint8(15, 1), n.setUint8(16, e), this._updateDefaultValue(n), this.writeCommand(t)
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
        console.log("设备已就绪"), i(a(u.prototype), "onDeviceReady", this).call(this, e), this.startQueryAll()
      }
    }, {
      key: "startQueryAll",
      value: function() {
        var e = this;
        setTimeout((function() {
          e.queryMode()
        }), 1e3), setTimeout((function() {
          e.queryLightInfo()
        }), 1500)
      }
    }, {
      key: "requestMtu",
      value: function(e) {
        console.log("2.1.请求设置mtu为512 >>>>>>name: " + e), wx.setBLEMTU({
          deviceId: e,
          mtu: 128,
          success: function(t) {
            console.log("mtu设置成功 >>>>>>deviceName: " + e + " 当前mtu: " + t.mtu)
          },
          fail: function() {
            console.log("mtu设置失败 >>>>>>deviceName: " + e)
          }
        })
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
        n.length < 16 || 252 != n[0] || 252 != n[n.length - 1] || (48 == n[14] ? (console.log("30指令上报"), this.dealWith30(n)) : 49 == n[14] ? (console.log("31指令参数同步应答"), this.dealWith31(n)) : console.log("其他应答指令"), null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(r.ab2hex(t)))
      }
    }, {
      key: "hexToUint8Array",
      value: function(e) {
        if (e.length % 2 != 0) throw new Error("Hex string must have even number of characters");
        for (var t = new Uint8Array(e.length / 2), n = 0; n < e.length; n += 2) {
          var i = parseInt(e.substr(n, 2), 16);
          t[n / 2] = i
        }
        return t
      }
    }, {
      key: "dealResponse",
      value: function() {
        var e = "FC E2 00 00 00 01 0D D2 06 00 00 00 00 00 30 01 08 00 00 00 88 13 1F FF 00 00 0A FC ";
        e = e.replace(/\s/g, ""), console.log("input = ", e);
        var t = this.hexToUint8Array(e);
        console.log(t), 48 == t[14] ? (console.log("30指令上报"), this.dealWith30(t)) : 49 == t[14] ? (console.log("31指令参数同步应答"), this.dealWith31(t)) : console.log("其他应答指令")
      }
    }, {
      key: "dealWith30",
      value: function(e) {
        var t = e[15];
        console.log("B1 = ", t);
        var n = t >> 0 & 1;
        this.powerOn = n, console.log("powerOn = ", this.powerOn);
        var i = e[16];
        console.log("B2 = ", i), this.mode = i;
        e[17], e[18], e[19], e[20], e[21];
        var a = e[22];
        console.log("亮度 = ", a), this.brightness = a;
        var s = e[23];
        console.log("R = ", s), this.colorR = s;
        var o = e[24];
        console.log("G = ", o), this.colorG = o;
        var l = e[25];
        console.log("B = ", l), this.colorB = l
      }
    }, {
      key: "dealWith31",
      value: function(e) {
        var t = e[15];
        console.log("模式总数", t);
        for (var n = 15, i = 0; i < t; i++) {
          var a = e[++n],
            s = e[++n];
          console.log("模式", i, "亮度 =", a, " 速度 =", s), this.lightModes[i + 1] = {
            speed: s,
            brightness: a
          }
        }
      }
    }, {
      key: "dealWithCustomProtocol",
      value: function(e) {
        2 == e[2] && (this.model = r.BleUtil.ab2hexFromStart(e, 6, 3))
      }
    }, {
      key: "writeDeviceInfo",
      value: function(e) {
        console.log("写入设备信息");
        var t = new ArrayBuffer(10),
          n = new DataView(t);
        n.setUint8(0, 250), n.setUint8(1, t.byteLength), n.setUint8(2, 1), n.setUint8(3, 5), n.setUint8(4, 1), n.setUint8(5, 1);
        for (var i = 6, a = 0; a < e.length; a += 2) {
          var s = parseInt(e.substr(a, 2), 16);
          n.setUint8(i, s), i += 1
        }
        var o = this.calculateCommunicateChecksum(n);
        n.setUint8(9, o), this.writeCommunicateCommand(t)
      }
    }]), u
  }(l.default);
exports.default = u;