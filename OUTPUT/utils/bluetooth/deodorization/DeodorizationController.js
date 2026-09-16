Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e = require("../../../@babel/runtime/helpers/classCallCheck"),
  t = require("../../../@babel/runtime/helpers/createClass"),
  i = require("../../../@babel/runtime/helpers/get"),
  o = require("../../../@babel/runtime/helpers/getPrototypeOf"),
  n = require("../../../@babel/runtime/helpers/inherits"),
  s = require("../../../@babel/runtime/helpers/createSuper"),
  l = r(require("../../debuglog.js")),
  a = r(require("../BLEController.js"));

function r(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}
var h = require("../bleutil.js"),
  c = function(a) {
    n(c, a);
    var r = s(c);

    function c() {
      var t;
      e(this, c);
      for (var i = arguments.length, o = new Array(i), n = 0; n < i; n++) o[n] = arguments[n];
      return (t = r.call.apply(r, [this].concat(o))).model = "-", t.isShortCmd = !1, t.disinfectSwitch = 0, t.deodorizationSwitch = 0, t.workMode = 0, t.disinfectSettingTime = 30, t.deodorizationSettingTime = 60, t.disinfectRemainTime = 30, t.deodorizationRemainTime = 60, t.appointTotalNum = 0, t.appointList = [], t
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
      key: "setAppointList",
      value: function(e) {
        this.appointList = e
      }
    }, {
      key: "openDisinfect",
      value: function(e) {
        console.log("开关杀菌：", e), this.disinfectSwitch = e ? 1 : 0, 1 == this.disinfectSwitch && (this.deodorizationSwitch = 0, this.workMode = 0), this._startControl(51, e ? 1 : 0)
      }
    }, {
      key: "openDeodorization",
      value: function(e) {
        console.log("开关除臭：", e), this.deodorizationSwitch = e ? 1 : 0, 1 == this.deodorizationSwitch && (this.disinfectSwitch = 0, this.workMode = 0), this._startControl(52, e ? 1 : 0)
      }
    }, {
      key: "setWorkMode",
      value: function(e) {
        console.log("设置工作模式：", e), this.workMode = e, 0 == this.workMode && (this.disinfectSwitch = 0, this.deodorizationSwitch = 0), this._startControl(50, e)
      }
    }, {
      key: "setSettingTime",
      value: function(e, t) {
        0 == e ? this.disinfectSettingTime = t : 1 == e && (this.deodorizationSettingTime = t), console.log("设置时长: 模式 = ", e, "; 值 = ", t);
        var i = this.isShortCmd ? 8 : 18,
          o = new ArrayBuffer(i),
          n = new DataView(o),
          s = 14;
        this.isShortCmd && (s = 4), n.setUint8(s, 53), n.setUint8(s + 1, e), n.setUint8(s + 2, t), this._updateDefaultValue(n), this.writeCommand(o)
      }
    }, {
      key: "sendSystemTime",
      value: function() {
        var e = new ArrayBuffer(17),
          t = new DataView(e);
        t.setUint8(4, 13);
        var i = new Date,
          o = i.getFullYear() - 2e3,
          n = i.getMonth() + 1,
          s = i.getDate(),
          l = i.getHours(),
          a = i.getMinutes(),
          r = i.getSeconds(),
          h = i.getDay();
        0 == h && (h = 7), console.log("年：", o), console.log("月：", n), console.log("日：", s), console.log("时：", l), console.log("分：", a), console.log("秒：", r), console.log("周：", h), t.setUint8(5, 0), t.setUint8(6, 0), t.setUint8(7, 0), t.setUint8(8, 0), t.setUint8(9, 255 & o), t.setUint8(10, 255 & n), t.setUint8(11, 255 & s), t.setUint8(12, 255 & l), t.setUint8(13, 255 & a), t.setUint8(14, 255 & r), t.setUint8(15, 255 & h), this._updateDefaultValue(t), this.writeCommand(e)
      }
    }, {
      key: "quaryAppoint",
      value: function(e) {
        console.log("====== 下发查询预约指令 ======"), console.log("预约序号（0xFF为查询全部）：" + e);
        var t = this.isShortCmd ? 7 : 17,
          i = new ArrayBuffer(t),
          o = new DataView(i),
          n = 14;
        this.isShortCmd && (n = 4), o.setUint8(n, 62), o.setUint8(n + 1, e), this._updateDefaultValue(o), this.writeCommand(i)
      }
    }, {
      key: "editAppoint",
      value: function(e, t, i) {
        console.log("====== 下发编辑预约指令 ======"), console.log("预约总个数：" + t), console.log("预约序号：" + e.id), console.log("预约类别（0-删除，1-添加/编辑）：" + i), console.log("重复性：" + e.repeatTime), console.log("使能：" + e.enable), console.log("开始时间（时钟）：" + e.hour), console.log("开始时间（分钟）：" + e.minute), console.log("杀菌时长（分钟）：" + e.disinfectTime), console.log("除臭时长（分钟）：" + e.deodorizationTime);
        var o = this.isShortCmd ? 14 : 24,
          n = new ArrayBuffer(o),
          s = new DataView(n),
          l = 14;
        this.isShortCmd && (l = 4), s.setUint8(l, 61), s.setUint8(l + 1, t), s.setUint8(l + 2, e.id), s.setUint8(l + 3, i);
        var a = this.codeRepeat(e.repeatTime, e.enable);
        s.setUint8(l + 4, a), s.setUint8(l + 5, e.hour), s.setUint8(l + 6, e.minute), s.setUint8(l + 7, 255 & e.disinfectTime), s.setUint8(l + 8, 255 & e.deodorizationTime), this._updateDefaultValue(s), this.writeCommand(n)
      }
    }, {
      key: "onDeviceReady",
      value: function(e) {
        var t = this;
        i(o(c.prototype), "onDeviceReady", this).call(this, e), console.log("设备就绪1"), setTimeout((function() {
          t.quaryDeviceState()
        }), 1e3), setTimeout((function() {
          t.quaryAppoint(255)
        }), 1500), this.isShortCmd && (setTimeout((function() {
          t.sendSystemTime()
        }), 2e3), setTimeout((function() {
          t.sendSystemTime()
        }), 2500))
      }
    }, {
      key: "quaryDeviceState",
      value: function() {
        this._startControl(17, 0)
      }
    }, {
      key: "_startControl",
      value: function(e, t) {
        var i = this.isShortCmd ? 7 : 17,
          o = new ArrayBuffer(i),
          n = new DataView(o),
          s = 14;
        this.isShortCmd && (s = 4), n.setUint8(s, e), n.setUint8(s + 1, t), this._updateDefaultValue(n), this.writeCommand(o)
      }
    }, {
      key: "_updateDefaultValue",
      value: function(e) {
        e.setUint8(0, 252), e.setUint8(1, 0), this.isShortCmd ? (e.setUint8(2, 1), e.setUint8(3, 21)) : (e.setUint8(2, 1), e.setUint8(3, 0), e.setUint8(4, 0), e.setUint8(5, 0), e.setUint8(6, 2), e.setUint8(7, 3), e.setUint8(8, 1), e.setUint8(9, 1), e.setUint8(10, 0), e.setUint8(11, 0), e.setUint8(12, 0), e.setUint8(13, 0));
        var t = e.byteLength - 1;
        e.setUint8(t, 252);
        var i = this.calculateLightChecksum(e);
        e.setUint8(1, i)
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
        l.default.debug("======== 消息监听通知 ========\n", h.ab2hex(t));
        var i = new Uint8Array(t);
        if (e.characteristicId === this.notifyComUUID) {
          if (i.length < 4 || 250 != i[0]) return;
          return this.dealWithCustomProtocol(i), void(null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(h.ab2hex(t)))
        }
        this.isShortCmd ? this.dealValueChangeShortCmd(i, t) : this.dealValueChangeLongCmd(i, t)
      }
    }, {
      key: "dealValueChangeLongCmd",
      value: function(e, t) {
        e.length < 16 || 252 != e[0] || 252 != e[e.length - 1] || (48 == e[14] ? (console.log("30指令上报"), this.dealWith30(e)) : 62 == e[14] ? (console.log("3E指令上报"), this.dealWith3E(e)) : 61 == e[14] ? console.log("3D指令上报") : console.log("其他应答指令"), null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(h.ab2hex(t)))
      }
    }, {
      key: "dealValueChangeShortCmd",
      value: function(e, t) {
        e.length < 7 || 252 != e[0] || 252 != e[e.length - 1] || (48 == e[4] ? (console.log("30指令上报"), this.dealWith30(e)) : 62 == e[4] ? (console.log("3E指令上报"), this.dealWith3E(e)) : 61 == e[4] ? console.log("3D指令上报") : 13 == e[4] ? (console.log("0D指令上报"), this.sendSystemTime()) : console.log("其他应答指令"), null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(h.ab2hex(t)))
      }
    }, {
      key: "dealWith3D",
      value: function(e) {
        var t = 14;
        this.isShortCmd && (t = 4);
        var i = e[t + 1];
        this.appointTotalNum = i, console.log("预约总数：" + this.appointTotalNum);
        var o = e[t + 2];
        console.log("预约序号：" + o);
        var n = e[t + 3];
        console.log("预约类别：" + n);
        var s = e[t + 4];
        console.log("预约重复性：" + s);
        var l = e[t + 5];
        console.log("预约开始时钟：" + l);
        var a = e[t + 6];
        console.log("预约开始分钟：" + a);
        var r = e[t + 7];
        console.log("预约杀菌时长：" + r);
        var h = e[t + 8];
        console.log("预约除臭时长：" + h);
        var c = this.appointList.find((function(e) {
          return e.id == o
        }));
        if (c) console.log("更新预约"), c.hour = l, c.minute = a, c.startTime = (l < 10 ? "0" + l : "" + l) + ":" + (a < 10 ? "0" + a : "" + a), c.disinfectTime = r, c.deodorizationTime = h, c.repeatStr = this.parseRepeat(s, c);
        else {
          console.log("新增预约");
          var u = {};
          u.id = o, u.hour = l, u.minute = a, u.startTime = (l < 10 ? "0" + l : "" + l) + ":" + (a < 10 ? "0" + a : "" + a), u.disinfectTime = r, u.deodorizationTime = h, u.repeatStr = this.parseRepeat(s, u);
          var d = this.appointList.slice();
          d.splice(d.length, 0, u), this.appointList = d
        }
      }
    }, {
      key: "dealWith3E",
      value: function(e) {
        console.log("dealWith3E appointList.length = " + this.appointList.length);
        var t = 14;
        this.isShortCmd && (t = 4);
        var i = e[t + 1];
        if (this.appointTotalNum = i, console.log("预约总数：" + this.appointTotalNum), 0 != this.appointTotalNum) {
          var o = e[t + 2];
          console.log("预约序号：" + o);
          var n = e[t + 3];
          console.log("预约重复性：" + n);
          var s = e[t + 4];
          console.log("预约开始时钟：" + s);
          var l = e[t + 5];
          console.log("预约开始分钟：" + l);
          var a = e[t + 6];
          console.log("预约杀菌时长：" + a);
          var r = e[t + 7];
          console.log("预约除臭时长：" + r);
          var h = this.appointList.find((function(e) {
            return e.id == o
          }));
          if (h) console.log("更新预约"), h.hour = s, h.minute = l, h.startTime = (s < 10 ? "0" + s : "" + s) + ":" + (l < 10 ? "0" + l : "" + l), h.disinfectTime = a, h.deodorizationTime = r, h.repeatStr = this.parseRepeat(n, h);
          else {
            console.log("新增预约");
            var c = {};
            c.id = o, c.hour = s, c.minute = l, c.startTime = (s < 10 ? "0" + s : "" + s) + ":" + (l < 10 ? "0" + l : "" + l), c.disinfectTime = a, c.deodorizationTime = r, c.repeatStr = this.parseRepeat(n, c);
            var u = this.appointList.slice();
            u.splice(u.length, 0, c), this.appointList = u
          }
          console.log("dealWith3E appointList.length = " + this.appointList.length)
        } else this.appointList.length = 0
      }
    }, {
      key: "dealWith30",
      value: function(e) {
        var t = 14;
        this.isShortCmd && (t = 4);
        var i = e[t + 1];
        this.workMode = i, console.log("工作模式：", this.workMode);
        var o = e[t + 4],
          n = o >> 6 & 1;
        this.deodorizationSwitch = n, console.log("除臭开关：", this.deodorizationSwitch);
        var s = o >> 7 & 1;
        this.disinfectSwitch = s, console.log("杀菌开关：", this.disinfectSwitch);
        var l = e[t + 5];
        this.isShortCmd ? (this.disinfectSettingTime = l, console.log("杀菌(消毒)设置时长：", this.disinfectSettingTime)) : (this.disinfectRemainTime = l, console.log("杀菌(消毒)剩余时长：", this.disinfectRemainTime));
        var a = e[t + 6];
        this.isShortCmd ? (this.disinfectRemainTime = a, console.log("杀菌(消毒)剩余时长：", this.disinfectRemainTime)) : (this.disinfectSettingTime = a, console.log("杀菌(消毒)设置时长：", this.disinfectSettingTime));
        var r = e[t + 7];
        this.isShortCmd ? (this.deodorizationSettingTime = r, console.log("除臭设置时长：", this.deodorizationSettingTime)) : (this.deodorizationRemainTime = r, console.log("除臭剩余时长：", this.deodorizationRemainTime));
        var h = e[t + 8];
        this.isShortCmd ? (this.deodorizationRemainTime = h, console.log("除臭剩余时长：", this.deodorizationRemainTime)) : (this.deodorizationSettingTime = h, console.log("除臭设置时长：", this.deodorizationSettingTime))
      }
    }, {
      key: "dealWithCustomProtocol",
      value: function(e) {
        2 == e[2] && (this.model = h.ab2hexFromStart(e, 6, 3))
      }
    }, {
      key: "parseRepeat",
      value: function(e, t) {
        var i = e >> 0 & 1,
          o = e >> 1 & 1,
          n = e >> 2 & 1,
          s = e >> 3 & 1,
          l = e >> 4 & 1,
          a = e >> 5 & 1,
          r = e >> 6 & 1,
          h = e >> 7 & 1;
        console.log("B1_0 = " + i), console.log("B1_1 = " + o), console.log("B1_2 = " + n), console.log("B1_3 = " + s), console.log("B1_4 = " + l), console.log("B1_5 = " + a), console.log("B1_6 = " + r), console.log("B1_7 = " + h), t.enable = 1 == i;
        var c = [],
          u = null;
        return 255 == e ? (c = [1, 1, 1, 1, 1, 1, 1], u = "每天") : (1 == o ? (u ? u += "、周一" : u = "周一", c.push(1)) : c.push(0), 1 == n ? (u ? u += "、周二" : u = "周二", c.push(1)) : c.push(0), 1 == s ? (u ? u += "、周三" : u = "周三", c.push(1)) : c.push(0), 1 == l ? (u ? u += "、周四" : u = "周四", c.push(1)) : c.push(0), 1 == a ? (u ? u += "、周五" : u = "周五", c.push(1)) : c.push(0), 1 == r ? (u ? u += "、周六" : u = "周六", c.push(1)) : c.push(0), 1 == h ? (u ? u += "、周日" : u = "周日", c.push(1)) : c.push(0), 1 == o && 1 == n && 1 == s && 1 == l && 1 == a && 1 == r && 1 == h && (u = "每天")), console.log(u), console.log("repeat.length = " + c.length), t.repeatTime = c, u
      }
    }, {
      key: "codeRepeat",
      value: function(e, t) {
        var i = 0;
        i |= t ? 1 : 0;
        for (var o = 0; o < e.length; o++) i |= e[o] << o + 1;
        return i
      }
    }], [{
      key: "getInstance",
      value: function() {
        return this._singleton || (this._singleton = new c), this._singleton
      }
    }]), c
  }(a.default);
exports.default = c;