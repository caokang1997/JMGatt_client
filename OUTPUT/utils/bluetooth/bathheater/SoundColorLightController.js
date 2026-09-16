Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e, t = require("../../../@babel/runtime/helpers/classCallCheck"),
  o = require("../../../@babel/runtime/helpers/createClass"),
  i = require("../../../@babel/runtime/helpers/get"),
  n = require("../../../@babel/runtime/helpers/getPrototypeOf"),
  l = require("../../../@babel/runtime/helpers/inherits"),
  s = require("../../../@babel/runtime/helpers/createSuper"),
  r = (e = require("../ota/OtaBleController.js")) && e.__esModule ? e : {
    default: e
  };
var a = require("../bleutil.js"),
  u = function(e) {
    l(u, e);
    var r = s(u);

    function u() {
      var e;
      t(this, u);
      for (var o = arguments.length, i = new Array(o), n = 0; n < o; n++) i[n] = arguments[n];
      return (e = r.call.apply(r, [this].concat(i))).musicLight = 0, e.lightMode = 0, e.ambientLight = 0, e.colorR = 0, e.colorG = 0, e.colorB = 0, e.brightness = 0, e.model = "-", e.lightMode = 0, e.lightModes = new Array(19).fill({
        id: 0,
        speed: 1,
        brightness: 5
      }), e
    }
    return o(u, [{
      key: "getLightModeById",
      value: function(e) {
        return this.lightModes.find((function(t) {
          return t.id == e
        }))
      }
    }, {
      key: "openLight",
      value: function(e) {
        console.log("开关灯", e);
        var t = e ? 1 : 0,
          o = new ArrayBuffer(19),
          i = new DataView(o);
        i.setUint8(14, 114), i.setUint8(15, 1), i.setUint8(16, 0), i.setUint8(17, t), this._updateDefaultValue_SoundColorLight(i), this.writeCommand(o)
      }
    }, {
      key: "openLightWithRGB",
      value: function(e, t, o, i, n) {
        console.log("开关灯(带亮度和RGB)", e);
        var l = e ? 1 : 0,
          s = new ArrayBuffer(22),
          r = new DataView(s);
        r.setUint8(14, 122), r.setUint8(15, 1), r.setUint8(16, l), r.setUint8(17, o), r.setUint8(18, i), r.setUint8(19, n), r.setUint8(20, t), this._updateDefaultValue_SoundColorLight(r), this.writeCommand(s)
      }
    }, {
      key: "queryLightInfo",
      value: function() {
        console.log("系统参数查询");
        var e = new ArrayBuffer(17),
          t = new DataView(e);
        t.setUint8(14, 113), t.setUint8(15, 0), this._updateDefaultValue_SoundColorLight(t), this.writeCommand(e)
      }
    }, {
      key: "setModeBrightness",
      value: function(e, t) {
        this._startLightControl(116, 0, 0, 0, e, t)
      }
    }, {
      key: "setColorTemp",
      value: function(e) {
        console.log("设置色温"), this._startLightControl(115, 1, 0, 0, 255 & e, e >> 8 & 255)
      }
    }, {
      key: "hexToRgb",
      value: function(e) {
        if (3 === (e = e.replace(/^#/, "")).length) e = e.split("").map((function(e) {
          return e + e
        })).join("");
        else if (6 !== e.length) throw new Error("无效的十六进制颜色值");
        return {
          r: parseInt(e.slice(0, 2), 16),
          g: parseInt(e.slice(2, 4), 16),
          b: parseInt(e.slice(4, 6), 16)
        }
      }
    }, {
      key: "setHexLightColor",
      value: function(e) {
        var t = this.hexToRgb(e),
          o = t.r,
          i = t.g,
          n = t.b;
        this.setRGB(o, i, n)
      }
    }, {
      key: "setRGB",
      value: function(e, t, o) {
        console.log("设置RGB"), this._startLightControl(121, 0, 0, 0, e, t, o)
      }
    }, {
      key: "openAmbientLight",
      value: function(e) {
        console.log("开关氛围灯"), this._startLightControl(114, 0, 0, e ? 1 : 0)
      }
    }, {
      key: "openMusicLightMode",
      value: function(e) {
        console.log("开关拾音模式"), this._startLightControl(134, control)
      }
    }, {
      key: "setMusicLightMode",
      value: function(e) {
        console.log("设置拾音模式"), this._startLightControl(135, e)
      }
    }, {
      key: "setModeSpeed",
      value: function(e, t) {
        console.log("设置模式速度"), this._startLightControl(126, 0, e, t)
      }
    }, {
      key: "querySystemState",
      value: function() {
        console.log("系统状态查询"), this._startLightControl(48, 0)
      }
    }, {
      key: "queryMode",
      value: function() {
        console.log("模式查询"), this._startLightControl(49, 0)
      }
    }, {
      key: "setMusicLight",
      value: function(e) {
        console.log("模式设置"), this._startLightControl(114, 0, 3, e ? 1 : 0)
      }
    }, {
      key: "setLightMode",
      value: function(e) {
        console.log("模式设置"), this._startLightControl(123, 0, e)
      }
    }, {
      key: "_startLightControl",
      value: function(e) {
        for (var t = arguments.length, o = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) o[i - 1] = arguments[i];
        var n = new ArrayBuffer(8 + o.length),
          l = new DataView(n);
        l.setUint8(6, e), o.forEach((function(e, t) {
          console.log("index = ".concat(t, "  value = ").concat(e)), l.setUint8(7 + t, e)
        })), this._updateDefaultValue_SoundColorLight(l), this.writeCommand(n)
      }
    }, {
      key: "_updateDefaultValue_SoundColorLight",
      value: function(e) {
        e.setUint8(0, 252), e.setUint8(1, 0), e.setUint8(2, 64), e.setUint8(3, 1), e.setUint8(4, 13), e.setUint8(5, 0);
        var t = e.byteLength - 1;
        e.setUint8(t, 252);
        var o = this.calculateLightChecksum(e);
        e.setUint8(1, o)
      }
    }, {
      key: "calculateLightChecksum",
      value: function(e) {
        console.log("校验码计算", e);
        for (var t = 0, o = 2; o < e.byteLength - 1; o++) t += e.getUint8(o);
        return 255 & t
      }
    }, {
      key: "onDeviceReady",
      value: function(e) {
        console.log("设备已就绪"), i(n(u.prototype), "onDeviceReady", this).call(this, e)
      }
    }, {
      key: "onMsgValueChange",
      value: function(e) {
        i(n(u.prototype), "onMsgValueChange", this).call(this, e);
        var t = e.value;
        console.log("============= 灯光的消息监听通知 =============\n", a.ab2hex(t));
        var o = new Uint8Array(t);
        e.characteristicId !== this.notifyComUUID && (o.length < 16 || 252 != o[0] || 252 != o[o.length - 1] || 13 == o[3] && (48 == o[6] ? (console.log("30指令上报"), this.dealWith30_SoundColorLight(o)) : 49 == o[6] ? (console.log("31指令参数同步应答"), this.dealWith31_SoundColorLight(o)) : console.log("其他应答指令"), null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(a.ab2hex(t))))
      }
    }, {
      key: "dealWith30_SoundColorLight",
      value: function(e) {
        var t = e[7],
          o = t >> 4 & 1;
        this.musicLight = o, console.log("拾音开关状态 = ", this.musicLight);
        var i = t >> 0 & 1;
        this.ambientLight = i;
        var n = e[8];
        console.log("灯光模式"), this.lightMode = 15 & n, console.log("灯光模式 = ", this.lightMode);
        var l = e[14];
        console.log("亮度 = ", l), this.brightness = l, this.colorR = e[15], this.colorG = e[16], this.colorB = e[17]
      }
    }, {
      key: "updateLightModeSpeed",
      value: function(e, t, o) {
        this.lightModes[e] = {
          id: e,
          speed: o,
          brightness: t
        }
      }
    }, {
      key: "dealWith31_SoundColorLight",
      value: function(e) {
        var t = e[7];
        console.log("模式总数", t);
        for (var o = 7, i = 0, n = 0; n < t; n++) {
          var l = e[++o],
            s = e[++o];
          console.log("模式", i, "亮度 =", l, " 速度 =", s), this.lightModes[i] = {
            id: i,
            speed: s,
            brightness: l
          }, i += 1
        }
      }
    }]), u
  }(r.default);
exports.default = u;