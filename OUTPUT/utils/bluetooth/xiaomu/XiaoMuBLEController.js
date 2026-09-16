Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e = require("../../../@babel/runtime/helpers/regeneratorRuntime"),
  t = require("../../../@babel/runtime/helpers/asyncToGenerator"),
  n = require("../../../@babel/runtime/helpers/classCallCheck"),
  o = require("../../../@babel/runtime/helpers/createClass"),
  c = require("./apis.js"),
  i = require("../../bluetooth/bleutil.js"),
  l = require("../../eventBus.js"),
  a = function() {
    function a() {
      n(this, a), this.onConnect = !1, this.mac = "", this.deviceId = null, this.serviceUUID = "0000FFE0-0000-1000-8000-00805F9B34FB", this.notifyUUID = "0000FFE1-0000-1000-8000-00805F9B34FB", this.writeUUID = "0000FFE1-0000-1000-8000-00805F9B34FB", this.serviceComUUID = "000000F0-0000-1000-8000-00805F9B34FB", this.notifyComUUID = "0000F002-0000-1000-8000-00805F9B34FB", this.writeComUUID = "0000F001-0000-1000-8000-00805F9B34FB", this.connectCallBack = null, this.msgValueChangeCallBacks = [], this.msgValueChangeCallBack = null, this.findTimer = !1, this.timeout = 1e4;
      var e = this;
      wx.onBLEConnectionStateChange((function(t) {
        console.log("--- 连接状态变化 ---"), console.log("device ".concat(t.deviceId, " state has changed, connected: ").concat(t.connected)), t.deviceId === e.deviceId && (e.onConnectResult(t.connected, ""), l.emit("event", {
          connect: t.connected
        }))
      })), l.on("bleValueChangeEvent", (function(t) {
        if (console.log("蓝牙notify消息", t), null != t.value) {
          var n = t.value;
          console.log("蓝牙notify消息 --- 1 characteristic.id = ", n.deviceId), console.log("蓝牙notify消息 --- 1 this.id = ", e.deviceId), n.deviceId === e.deviceId && (e.onMsgValueChange(n), null != e.msgValueChangeCallBack && e.msgValueChangeCallBack(n.value))
        }
      }))
    }
    var s;
    return o(a, [{
      key: "setMsgValueChangeCallBack",
      value: function(e) {
        this.msgValueChangeCallBack = e
      }
    }, {
      key: "stopConnnect",
      value: function() {
        console.log("--- 断开连接 ---", this.deviceId);
        var e = this.deviceId;
        null != e && wx.closeBLEConnection({
          deviceId: e,
          success: function(e) {
            console.log(e)
          }
        })
      }
    }, {
      key: "startConnect",
      value: function(e, t) {
        var n = this;
        this.onConnect = !1, console.log("启动蓝牙连接", (new Date).toLocaleString());
        var o = this;
        this.connectStatus = !1, this.connectCallBack = e, this.msgValueChangeCallBack = t;
        var l = this.mac,
          a = this.timeout;
        (0, c.openBlueToothAdapter)().catch((function(e) {
          console.log("打开蓝牙适配器失败", e), n.onConnectResult(!1, "打开蓝牙适配器失败")
        })).then((function(e) {
          return (0, c.getBlueToothDevices)()
        })).then((function(e) {
          console.log("获取已发现的蓝牙设备", e);
          var t = e.devices.filter((function(e) {
              return i.getMac(e) === o.mac
            })),
            s = t.length > 0 ? t[0] : null;
          if (s) {
            var r = s.deviceId;
            return o.deviceId = r, console.log("connectable = ", s.connectable), (0, c.createBLEConnection)({
              deviceId: r
            }).then((function(e) {
              return o._doStartPrepareBle(r)
            }))
          }
          return wx.startBluetoothDevicesDiscovery({
            allowDuplicatesKey: !0
          }), (0, c.startBluetoothDeviceFound)({
            mac: l,
            timeout: a
          }).catch((function(e) {
            wx.stopBluetoothDevicesDiscovery(), n.onConnectResult(!1, "蓝牙搜索失败")
          })).then((function(e) {
            return wx.stopBluetoothDevicesDiscovery(), o.deviceId = e, (0, c.createBLEConnection)({
              deviceId: e
            })
          }))
        })).then((function(e) {
          wx.stopBluetoothDevicesDiscovery(), n._doStartPrepareBle(o.deviceId)
        })).catch((function(e) {
          console.log("失败了", e), n.onConnectResult(!1, "连接失败")
        }))
      }
    }, {
      key: "_doStartPrepareBle",
      value: (s = t(e().mark((function t(n) {
        return e().wrap((function(e) {
          for (;;) switch (e.prev = e.next) {
            case 0:
              return console.log("===== 处理蓝牙服务 start ====="), wx.onBLECharacteristicValueChange((function(e) {
                console.log("eventbus发送消息"), l.emit("bleValueChangeEvent", {
                  value: e
                })
              })), e.next = 4, (0, c.prepareBleService)(n);
            case 4:
              this.onConnect = !1, this.onConnectResult(!0, ""), this.onDeviceReady(n), console.log("===== 处理蓝牙服务 end =====");
            case 8:
            case "end":
              return e.stop()
          }
        }), t, this)
      }))), function(e) {
        return s.apply(this, arguments)
      })
    }, {
      key: "onDeviceReady",
      value: function(e) {
        l.emit("event", {
          bleReady: !0
        })
      }
    }, {
      key: "onConnectResult",
      value: function(e, t) {
        console.log("------------------ 蓝牙连接回调 ------------------"), null != this.connectCallBack && this.connectCallBack(e, t)
      }
    }, {
      key: "calculateChecksum",
      value: function(e) {
        for (var t = 0, n = 2; n < e.byteLength - 2; n++) t += e.getUint8(n);
        return 255 & t
      }
    }, {
      key: "calculateCommunicateChecksum",
      value: function(e) {
        for (var t = 0, n = 0; n < e.byteLength - 1; n++) t += e.getUint8(n);
        return 255 & t
      }
    }, {
      key: "writeCommunicateCommand",
      value: function(e) {
        console.log("下发指令 = ", i.ab2hex(e)), console.log("服务UUID = ", this.serviceComUUID), console.log("特征UUID = ", this.writeComUUID), wx.writeBLECharacteristicValue({
          deviceId: this.deviceId,
          serviceId: this.serviceComUUID,
          characteristicId: this.writeComUUID,
          value: e
        })
      }
    }, {
      key: "writeCommand",
      value: function(e) {
        console.log("下发指令 = ", i.ab2hex(e)), wx.writeBLECharacteristicValue({
          deviceId: this.deviceId,
          serviceId: this.serviceUUID,
          characteristicId: this.writeUUID,
          value: e
        })
      }
    }, {
      key: "onMsgValueChange",
      value: function(e) {}
    }]), a
  }();
exports.default = a;