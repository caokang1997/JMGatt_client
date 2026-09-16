Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e = require("../../@babel/runtime/helpers/toConsumableArray"),
  t = require("../../@babel/runtime/helpers/classCallCheck"),
  a = require("../../@babel/runtime/helpers/createClass"),
  n = require("../../@babel/runtime/helpers/get"),
  s = require("../../@babel/runtime/helpers/getPrototypeOf"),
  i = require("../../@babel/runtime/helpers/inherits"),
  u = require("../../@babel/runtime/helpers/createSuper"),
  r = l(require("../../utils/bluetooth/BLEController.js")),
  o = l(require("../../utils/debuglog.js")),
  c = require("../tool/ByteUtils.js");

function l(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}
var h = require("../../utils/bluetooth/bleutil.js"),
  p = function(r) {
    i(p, r);
    var l = u(p);

    function p() {
      var e;
      t(this, p);
      for (var a = arguments.length, n = new Array(a), s = 0; s < a; s++) n[s] = arguments[s];
      return (e = l.call.apply(l, [this].concat(n))).model = "-", e.triggerBindCallBack = null, e.remoteModeList = [], e
    }
    return a(p, [{
      key: "setTriggerBindCallBack",
      value: function(e) {
        this.triggerBindCallBack = e
      }
    }, {
      key: "onDeviceReady",
      value: function(e) {
        console.log("设备已就绪"), n(s(p.prototype), "onDeviceReady", this).call(this, e)
      }
    }, {
      key: "onMsgValueChange",
      value: function(e) {
        var t = e.value,
          a = new Uint8Array(t);
        if (e.characteristicId == this.notifyComUUID && !(a.length < 4 || 250 != a[0])) switch (a[2]) {
          case 2:
            this.dealWith02(a);
            break;
          case 6:
            this.dealWith06(a);
            break;
          case 10:
            this.dealWith0A(a);
            break;
          case 11:
            this.dealWith0B(a);
            break;
          case 12:
            this.dealWith0C(a);
            break;
          case 13:
            this.dealWith0D(a)
        }
      }
    }, {
      key: "dealWith02",
      value: function(e) {
        this.model = h.ab2hexFromStart(e, 6, 3)
      }
    }, {
      key: "dealWith06",
      value: function(e) {
        console.log("============ 收到模组 06 指令 ============");
        var t = e.length - 4 / 3;
        this.remoteModeList = [];
        for (var a = 0; a < t; a++) {
          var n = e[2 + 3 * a + 1],
            s = e[2 + 3 * a + 2],
            i = e[2 + 3 * a + 3];
          this.remoteModeList.push({
            remoteId: n,
            userId: s,
            selectedId: i
          }), console.log("遥控器按键" + (a + 1) + "-id = " + n), console.log("用户" + (a + 1) + "-id = " + s), console.log("定制模式" + (a + 1) + "-id = " + i)
        }
      }
    }, {
      key: "dealWith0A",
      value: function(e) {
        e[3], e[4], e[5]
      }
    }, {
      key: "dealWith0B",
      value: function(e) {
        e[3], e[4];
        for (var t = e[5], a = 0; a < t; a++) e[6 + 5 * a], e.slice(7 + 5 * a)
      }
    }, {
      key: "dealWith0C",
      value: function(e) {
        e[3], e[4], e[5]
      }
    }, {
      key: "dealWith0D",
      value: function(e) {
        e[3], e[4], e[5], h.ab2hexFromStart(e, 6, 6)
      }
    }, {
      key: "queryAllTrigger",
      value: function() {
        this._sendCommunicateAction(8, 255)
      }
    }, {
      key: "enableScene",
      value: function(e, t) {
        var a = [];
        a.push(e.id), a.push(255), a.push(t ? 1 : 0), this._sendCommunicateAction.apply(this, [15].concat(a))
      }
    }, {
      key: "configScene",
      value: function(e, t) {
        var a = this;
        o.default.follow("============== 配置联动场景 configScene ==============", e, t);
        var n = this,
          s = e.links,
          i = t ? "绑定" : "解绑";
        s.forEach((function(n) {
          var s = n.trigger;
          if (o.default.follow("".concat(i, "触发事件的MAC地址:"), s.mac), o.default.follow("".concat(i, "设备的MAC地址:"), a.mac), s.mac == a.mac) {
            var u = a._send0A(t, e, n);
            o.default.follow("".concat(i, "configScene _send0A"), u)
          }
          var r = n.exec;
          if (r.mac == a.mac) {
            o.default.follow("".concat(i, "执行事件的MAC地址:"), r.mac), o.default.follow("".concat(i, "设备的MAC地址:"), a.mac);
            var c = a._sendOC(t, e, n);
            o.default.follow("".concat(i, "configScene _sendOC"), c)
          }
        })), setTimeout((function() {
          n.triggerBindCallBack && n.triggerBindCallBack(!0, t)
        }), 3e3)
      }
    }, {
      key: "_query06",
      value: function() {
        this._sendCommunicateAction.apply(this, [6].concat([]))
      }
    }, {
      key: "_send05",
      value: function(e, t, a, n) {
        var s = [];
        s.push(1), s.push(e), s.push(t), s.push(a);
        for (var i = new DataView(n), u = 0; u < n.byteLength; u++) {
          var r = i.getUint8(u);
          s.push(r)
        }
        this._sendCommunicateAction.apply(this, [5].concat(s))
      }
    }, {
      key: "_send11",
      value: function(e) {
        for (var t = [], a = new DataView(e), n = 0; n < e.byteLength; n++) {
          var s = a.getUint8(n);
          t.push(s)
        }
        this._sendCommunicateAction.apply(this, [17].concat(t))
      }
    }, {
      key: "_send0A",
      value: function(e, t, a) {
        var n = [];
        n.push(e ? 1 : 0), n.push(t.id), n.push(Number(a.linkId));
        var s = a.trigger.triggers;
        return n.push(s.length), s.forEach((function(e) {
          var t = Number(e.code);
          n.push(t), t >= 3 && t <= 17 ? (n.push(Number(e.param)), n.push(0), n.push(0), n.push(0)) : (n.push(0), n.push(0), n.push(0), n.push(0))
        })), this._sendCommunicateAction.apply(this, [10].concat(n)), n
      }
    }, {
      key: "_queryOB",
      value: function(e) {
        var t = [];
        t.push(e.sceneId), t.push(), this._sendCommunicateAction.apply(this, [11].concat(t))
      }
    }, {
      key: "_sendOC",
      value: function(t, a, n) {
        o.default.follow("======> 浴霸场景响应事件配置", a);
        var s = [];
        s.push(t ? 1 : 0), s.push(a.id), s.push(Number(n.linkId)), s.push(Number(n.trigger.categoryCode)), s.push.apply(s, e(n.trigger.mac.match(/.{1,2}/g).map((function(e) {
          return parseInt(e, 16)
        })))), s.push.apply(s, e(n.trigger.barcode.match(/.{1,2}/g).map((function(e) {
          return parseInt(e, 16)
        }))));
        var i = n.exec.execs;
        return s.push(i.length), i.forEach((function(e) {
          var t = Number(e.code);
          if (e.param = Number(e.param), e.actionId = Number(e.actionId), t >= 4 && t <= 10) {
            o.default.follow("状态类触发条件 actionId =", e.actionId);
            var a = 0;
            a = c.byteUtils.setBit(a, 7, 1), a = c.byteUtils.setBits(a, 3, 6, e.actionId), s.push(a), s.push(t), s.push(e.param), s.push(0), s.push(0), s.push(0)
          } else if (2 == t) {
            var n = e.type || "min",
              i = 0;
            i = c.byteUtils.setBit(i, 7, 0), i = c.byteUtils.setBits(i, 3, 6, e.actionId), s.push(i), s.push(t), "day" == n ? (s.push(e.param), s.push(0), s.push(0), s.push(0)) : "hour" == n ? (s.push(0), s.push(e.param), s.push(0), s.push(0)) : "min" == n ? (s.push(0), s.push(0), s.push(e.param), s.push(0)) : "second" == n ? (s.push(0), s.push(0), s.push(0), s.push(e.param)) : (s.push(0), s.push(0), s.push(0), s.push(0))
          } else {
            o.default.follow("其他类触发条件 actionId =", e.actionId);
            var u = 0;
            u = c.byteUtils.setBit(u, 7, 0), u = c.byteUtils.setBits(u, 3, 6, e.actionId), s.push(u), s.push(t), s.push(e.param), s.push(0), s.push(0), s.push(0)
          }
        })), this._sendCommunicateAction.apply(this, [12].concat(s)), s
      }
    }, {
      key: "_query0D",
      value: function(e) {
        var t = [];
        t.push(e.sceneId), t.push(e.linkId), this._sendCommunicateAction.apply(this, [13].concat(t))
      }
    }, {
      key: "_sendOE",
      value: function(e) {
        var t = [];
        t.push(1), t.push(e.sceneId), t.push(e.linkId), t.push(e.actionId), this._sendCommunicateAction.apply(this, [14].concat(t))
      }
    }, {
      key: "_sendCommunicateAction",
      value: function(e) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) a[n - 1] = arguments[n];
        var s = 4 + a.length,
          i = new ArrayBuffer(s),
          u = new DataView(i);
        u.setUint8(0, 250), u.setUint8(1, i.byteLength), u.setUint8(2, e), a.forEach((function(e, t) {
          u.setUint8(3 + t, e)
        }));
        var r = this.calculateCommunicateChecksum(u);
        u.setUint8(s - 1, r), console.log("buffer", i), this.writeCommunicateCommand(i)
      }
    }], [{
      key: "getInstance",
      value: function(e) {
        if (!this.instances.has(e)) {
          var t = new p;
          t.mac = e, this.instances.set(e, t)
        }
        return this.instances.get(e)
      }
    }]), p
  }(r.default);
p.instances = new Map;
var d = p;
exports.default = d;