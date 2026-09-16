Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = exports.MOCK_SHOWER_DEVICE = exports.MOCK_MODE = exports.MOCK_BATH_HEATER_DEVICE = void 0;
var e, t = require("../../@babel/runtime/helpers/toConsumableArray"),
  r = require("../../@babel/runtime/helpers/regeneratorRuntime"),
  a = require("../../@babel/runtime/helpers/asyncToGenerator"),
  n = require("../../@babel/runtime/helpers/classCallCheck"),
  i = require("../../@babel/runtime/helpers/createClass"),
  o = require("../../@babel/runtime/helpers/get"),
  c = require("../../@babel/runtime/helpers/getPrototypeOf"),
  u = require("../../@babel/runtime/helpers/inherits"),
  s = require("../../@babel/runtime/helpers/createSuper"),
  l = (e = require("../bluetooth/BLEController.js")) && e.__esModule ? e : {
    default: e
  },
  m = require("../bluetooth/xiaomu/apis.js");
var h = require("../eventBus.js"),
  C = require("./frameCodec.js"),
  d = require("../mock/switch.js").isMockOn();
exports.MOCK_MODE = d;
var p = {
  mac: "AABBCCDD7776",
  typeCode: "777776",
  deviceId: "mock-shower-deviceId",
  productName: "九牧智能淋浴器(777776)·模拟",
  model: "shower-777776",
  categoryId: 3,
  RSSI: -45
};
exports.MOCK_SHOWER_DEVICE = p;
exports.MOCK_BATH_HEATER_DEVICE = {
  mac: "AABBCCDD7778",
  typeCode: "777778",
  deviceId: "mock-bathheater-deviceId",
  productName: "九牧智能浴霸(777778)·模拟",
  model: "g8061a",
  categoryId: 2,
  RSSI: -50
};
var f = !1;
var v = function(e) {
  u(b, e);
  var l, v = s(b);

  function b() {
    var e;
    n(this, b);
    for (var t = arguments.length, r = new Array(t), a = 0; a < t; a++) r[a] = arguments[a];
    return (e = v.call.apply(v, [this].concat(r))).role = "", e.dataLogCallback = null, e._prepared = !1, e._mockReplyTimers = [], e
  }
  return i(b, [{
    key: "setDataLogCallback",
    value: function(e) {
      this.dataLogCallback = e
    }
  }, {
    key: "_emitLog",
    value: function(e, t, r) {
      this.dataLogCallback && this.dataLogCallback({
        direction: e,
        frame: t,
        hex: C.toHex(t),
        parsed: r || null,
        role: this.role,
        mac: this.mac
      })
    }
  }, {
    key: "startConnect",
    value: function(e, t) {
      var r = this;
      if (this._prepared = !1, !d) return o(c(b.prototype), "startConnect", this).call(this, e, t);
      console.log("[MOCK] LinkController.startConnect mac =", this.mac), this.connectCallBack = e, this.msgValueChangeCallBack = t, setTimeout((function() {
        r.isConnected = !0, r.connectCallBack && r.connectCallBack(!0, "mock connected"), r.onDeviceReady("mock-device-id")
      }), 300)
    }
  }, {
    key: "_doStartPrepareBle",
    value: (l = a(r().mark((function e(t) {
      return r().wrap((function(e) {
        for (;;) switch (e.prev = e.next) {
          case 0:
            if (!this._prepared) {
              e.next = 2;
              break
            }
            return e.abrupt("return");
          case 2:
            return this._prepared = !0, f || (f = !0, wx.onBLECharacteristicValueChange((function(e) {
              h.emit("bleValueChangeEvent", {
                value: e
              })
            }))), e.next = 6, (0, m.prepareBleService)(t);
          case 6:
            this.onConnect = !1, this.onConnectResult(!0, ""), this.onDeviceReady(t);
          case 9:
          case "end":
            return e.stop()
        }
      }), e, this)
    }))), function(e) {
      return l.apply(this, arguments)
    })
  }, {
    key: "stopConnnect",
    value: function() {
      if (this._mockReplyTimers.forEach((function(e) {
          return clearTimeout(e)
        })), this._mockReplyTimers = [], !d) return o(c(b.prototype), "stopConnnect", this).call(this);
      this.isConnected = !1, console.log("[MOCK] LinkController.stopConnnect mac =", this.mac), h.emit("event", {
        mac: this.mac,
        connect: !1
      })
    }
  }, {
    key: "writeCommunicateCommand",
    value: function(e) {
      var t = this,
        r = e instanceof ArrayBuffer ? new Uint8Array(e) : e;
      if (this._emitLog("send", r, C.parseFrame(r)), !d) return o(c(b.prototype), "writeCommunicateCommand", this).call(this, e instanceof ArrayBuffer ? e : r.buffer);
      console.log("[MOCK] 0xFA 帧（未实际下发）=", C.toHex(r));
      var a = this._buildMockReply(r);
      a && this._mockReplyTimers.push(setTimeout((function() {
        return t._handleUplinkFrame(a)
      }), 500))
    }
  }, {
    key: "onMsgValueChange",
    value: function(e) {
      (e.characteristicId || "").toUpperCase() === this.notifyComUUID.toUpperCase() && this._handleUplinkFrame(new Uint8Array(e.value))
    }
  }, {
    key: "_handleUplinkFrame",
    value: function(e) {
      var t = C.parseFrame(e);
      console.log("[蓝牙接收][".concat(this.role, "|").concat(this.mac, "] ").concat(C.toHex(e), "  ").concat(t && t.summary || "")), this._emitLog("recv", e, t)
    }
  }, {
    key: "sendEnableScene",
    value: function(e, t) {
      var r = C.build0F(e, t);
      return this.writeCommunicateCommand(r.buffer), r
    }
  }, {
    key: "queryTrigger",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 255,
        r = C.build0B(e, t);
      return this.writeCommunicateCommand(r.buffer), r
    }
  }, {
    key: "queryExec",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 255,
        r = C.build0D(e, t);
      return this.writeCommunicateCommand(r.buffer), r
    }
  }, {
    key: "queryEnable",
    value: function(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 255,
        r = C.build10(e, t);
      return this.writeCommunicateCommand(r.buffer), r
    }
  }, {
    key: "queryDeviceInfo",
    value: function() {
      var e = C.build02();
      return this.writeCommunicateCommand(e.buffer), e
    }
  }, {
    key: "_buildMockReply",
    value: function(e) {
      var r = e[2];
      switch (r) {
        case C.CMD.DEVICE_INFO_READ:
          var a = C.barcodeToBytes(this.jmZtmxm || "000000");
          return C.buildFrame(r, [5, 1, 1].concat(t(a)));
        case C.CMD.TRIGGER_CONFIG:
          return C.buildFrame(r, [1, e[4], e[5]]);
        case C.CMD.TRIGGER_QUERY:
          var n = 255 === e[4] ? 1 : e[4];
          return C.buildFrame(r, [e[3], n, 1, 17, 1, 0, 0, 0]);
        case C.CMD.EXEC_CONFIG:
          return C.buildFrame(r, [1, e[4], e[5]]);
        case C.CMD.EXEC_QUERY:
          var i = 255 === e[4] ? 1 : e[4],
            o = C.macToBytes(p.mac),
            c = C.barcodeToBytes(p.typeCode);
          return C.buildFrame(r, [e[3], i, 3].concat(t(o), t(c), [1, 8, 6, 0, 0, 0, 0]));
        case C.CMD.ENABLE_SET:
          return C.buildFrame(r, [1, e[3], e[4], e[5]]);
        case C.CMD.ENABLE_QUERY:
          return C.buildFrame(r, [e[3], e[4], 1]);
        default:
          return null
      }
    }
  }], [{
    key: "getInstance",
    value: function(e) {
      if (!this.instances.has(e)) {
        var t = new b;
        t.mac = e, this.instances.set(e, t)
      }
      return this.instances.get(e)
    }
  }]), b
}(l.default);
v.instances = new Map;
var b = v;
exports.default = b;