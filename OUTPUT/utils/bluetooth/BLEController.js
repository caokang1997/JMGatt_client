Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e, t = require("../../@babel/runtime/helpers/regeneratorRuntime"),
  n = require("../../@babel/runtime/helpers/asyncToGenerator"),
  o = require("../../@babel/runtime/helpers/classCallCheck"),
  c = require("../../@babel/runtime/helpers/createClass"),
  i = (e = require("../debuglog.js")) && e.__esModule ? e : {
    default: e
  },
  a = require("./xiaomu/apis.js");
var l = require("../bluetooth/bleutil.js"),
  r = require("../eventBus.js"),
  s = function() {
    function e() {
      o(this, e), this.activeState = 1, this.isActive = !0, this.isConnected = !1, this.onConnect = !1, this.mac = "", this.jmZtmxm = "000000", this.deviceId = null, this.serviceUUID = "0000FFE0-0000-1000-8000-00805F9B34FB", this.notifyUUID = "0000FFE1-0000-1000-8000-00805F9B34FB", this.writeUUID = "0000FFE1-0000-1000-8000-00805F9B34FB", this.serviceComUUID = "000000F0-0000-1000-8000-00805F9B34FB", this.notifyComUUID = "0000F002-0000-1000-8000-00805F9B34FB", this.writeComUUID = "0000F001-0000-1000-8000-00805F9B34FB", this.connectCallBack = null, this.readyCallBack = null, this.msgValueChangeCallBacks = [], this.msgValueChangeCallBack = null, this.findTimer = !1, this.timeout = 1e4;
      var t = this;
      wx.onBLEConnectionStateChange((function(e) {
        console.log("--- 连接状态变化 ---"), console.log("device ".concat(e.deviceId, " state has changed, connected: ").concat(e.connected)), e.deviceId === t.deviceId && (t.onConnectResult(e.connected, ""), t.isConnected = e.connected, r.emit("event", {
          mac: t.mac,
          connect: e.connected
        }))
      })), r.on("bleValueChangeEvent", (function(e) {
        if (null != e.value) {
          var n = e.value;
          n.deviceId === t.deviceId && (t.onMsgValueChange(n), null != t.msgValueChangeCallBack && t.msgValueChangeCallBack(n.value))
        }
      }))
    }
    var s;
    return c(e, [{
      key: "setMsgValueChangeCallBack",
      value: function(e) {
        this.msgValueChangeCallBack = e
      }
    }, {
      key: "setReadyCallBack",
      value: function(e) {
        this.readyCallBack = e
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
      key: "connectAndroidBle",
      value: function(e, t) {
        var n = e.toUpperCase().replace(/:/g, "").replace(/(.{2})(?=.)/g, "$1:").replace(/:$/, "");
        this.deviceId = n;
        var o = new Promise((function(e, o) {
            wx.createBLEConnection({
              deviceId: n,
              timeout: t
            }).then((function() {
              console.log("连接设备成功"), e()
            })).catch((function(t) {
              1509007 == t.errno ? e() : (console.error("重新连接设备失败:", t), o(t))
            }))
          })),
          c = new Promise((function(e, n) {
            setTimeout((function() {
              n(new Error("连接超时"))
            }), t)
          }));
        return Promise.race([o, c])
      }
    }, {
      key: "connectIOSBle",
      value: function(e, t) {
        var n = this;
        return new Promise((function(o, c) {
          (0, a.getBlueToothDevices)().then((function(r) {
            console.log("获取已发现的蓝牙设备", r);
            var s = r.devices.filter((function(e) {
                return l.getMac(e) === n.mac
              })),
              u = s.length > 0 ? s[0] : null;
            if (u) {
              var h = u.deviceId;
              return n.deviceId = h, console.log("connectable = ", u.connectable), (0, a.createBLEConnection)({
                deviceId: h
              }).then((function(e) {
                return n._doStartPrepareBle(h)
              })).catch((function(e) {
                n.onConnectResult(!1, "蓝牙搜索失败"), c(e)
              }))
            }
            return i.default.follow("蓝牙基类", "开始搜索"), wx.startBluetoothDevicesDiscovery({
              allowDuplicatesKey: !0
            }), (0, a.startBluetoothDeviceFound)({
              mac: e,
              timeout: t
            }).then((function(e) {
              return i.default.follow("蓝牙基类", "停止搜索"), wx.stopBluetoothDevicesDiscovery(), n.deviceId = e, wx.createBLEConnection({
                deviceId: e
              }).then((function() {
                console.log("重新连接设备成功"), o()
              })).catch((function(e) {
                console.error("重新连接设备失败:", e), c(e)
              }))
            })).catch((function(e) {
              i.default.follow("蓝牙基类", "停止搜索2"), wx.stopBluetoothDevicesDiscovery(), n.onConnectResult(!1, "蓝牙搜索失败"), c(e)
            }))
          })).then((function(e) {
            i.default.follow("蓝牙基类", "停止搜索3"), wx.stopBluetoothDevicesDiscovery()
          }))
        }))
      }
    }, {
      key: "connectHarmonyBle",
      value: function(e, t) {
        var n = this;
        return new Promise((function(o, c) {
          return i.default.follow("蓝牙基类", "开始搜索"), wx.startBluetoothDevicesDiscovery({
            allowDuplicatesKey: !0
          }), (0, a.startBluetoothDeviceFound)({
            mac: e,
            timeout: t
          }).then((function(e) {
            return i.default.follow("蓝牙基类", "停止搜索"), wx.stopBluetoothDevicesDiscovery(), n.deviceId = e, wx.createBLEConnection({
              deviceId: e
            }).then((function() {
              console.log("重新连接设备成功"), o()
            })).catch((function(e) {
              console.error("重新连接设备失败:", e), c(e)
            }))
          })).catch((function(e) {
            i.default.follow("蓝牙基类", "停止搜索2"), wx.stopBluetoothDevicesDiscovery(), n.onConnectResult(!1, "蓝牙搜索失败"), c(e)
          }))
        }))
      }
    }, {
      key: "startConnect",
      value: function(e, t) {
        var n = this;
        this.activeState = 1, this.isActive = !0, this.onConnect = !1, console.log("启动蓝牙连接", (new Date).toLocaleString());
        var o = this;
        this.connectStatus = !1, this.connectCallBack = e, this.msgValueChangeCallBack = t;
        var c = this.mac,
          l = this.timeout;
        console.log("==== 蓝牙地址 ====", this.mac), (0, a.openBlueToothAdapter)().catch((function(e) {
          console.log("打开蓝牙适配器失败", e), n.onConnectResult(!1, "打开蓝牙适配器失败")
        })).then((function(e) {
          return "android" === wx.getSystemInfoSync().platform.toLowerCase() ? n.connectAndroidBle(c, l) : "ohos" === wx.getSystemInfoSync().platform.toLowerCase() ? n.connectHarmonyBle(c, l) : n.connectIOSBle(c, l)
        })).then((function(e) {
          i.default.follow("startConnect 成功，_doStartPrepareBle"), n._doStartPrepareBle(o.deviceId)
        })).catch((function(e) {
          i.default.follow("startConnect 失败"), n.stopConnnect(), console.log("失败了", e), n.onConnectResult(!1, "连接失败")
        }))
      }
    }, {
      key: "_doStartPrepareBle",
      value: (s = n(t().mark((function e(n) {
        return t().wrap((function(e) {
          for (;;) switch (e.prev = e.next) {
            case 0:
              return console.log("===== 处理蓝牙服务 start ====="), wx.onBLECharacteristicValueChange((function(e) {
                r.emit("bleValueChangeEvent", {
                  value: e
                })
              })), e.next = 4, (0, a.prepareBleService)(n);
            case 4:
              this.onConnect = !1, this.onConnectResult(!0, ""), this.onDeviceReady(n), console.log("===== 处理蓝牙服务 end =====");
            case 8:
            case "end":
              return e.stop()
          }
        }), e, this)
      }))), function(e) {
        return s.apply(this, arguments)
      })
    }, {
      key: "onDeviceReady",
      value: function(e) {
        r.emit("event", {
          bleReady: !0
        }), this.readyCallBack && this.readyCallBack()
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
        console.log("下发指令 = ", l.ab2hex(e)), wx.writeBLECharacteristicValue({
          deviceId: this.deviceId,
          serviceId: this.serviceComUUID,
          characteristicId: this.writeComUUID,
          value: e
        })
      }
    }, {
      key: "writeCommand",
      value: function(e) {
        i.default.follow("下发指令 = ", l.ab2hex(e)), wx.writeBLECharacteristicValue({
          deviceId: this.deviceId,
          serviceId: this.serviceUUID,
          characteristicId: this.writeUUID,
          value: e
        })
      }
    }, {
      key: "onMsgValueChange",
      value: function(e) {}
    }, {
      key: "getDeviceName",
      value: function() {
        var e = this.mac,
          t = this.jmZtmxm,
          n = wx.getStorageSync(e);
        return n || l.getDeviceProductNameByTypeCode(t)
      }
    }, {
      key: "setDeviceName",
      value: function(e) {
        var t = this.mac;
        wx.setStorageSync(t, e)
      }
    }]), e
  }();
exports.default = s;