var e = require("../eventBus.js"),
  n = require("./frameForge.js"),
  t = require("./config.js"),
  o = require("./ShowerVirtualDevice.js"),
  c = new Map,
  i = null;

function a() {
  return i || (i = new o), i
}

function s(t, o) {
  var c = n.parseExtended(o);
  c && Object.assign(t, c), e.emit("bleValueChangeEvent", {
    value: {
      deviceId: t.deviceId,
      serviceId: t.serviceUUID,
      characteristicId: t.notifyUUID,
      value: o
    }
  })
}
module.exports = {
  install: function(e) {
    if (e && !c.has(e)) {
      c.set(e, {
        startConnect: e.startConnect,
        stopConnnect: e.stopConnnect,
        writeCommand: e.writeCommand
      });
      var o = a();
      e.startConnect = function(e, n) {
        var c = this;
        console.log("[MOCK] 淋浴器模拟连接 mac =", this.mac), this.connectCallBack = e, this.msgValueChangeCallBack = n, this.deviceId = t.DEFAULT_SHOWER.deviceId, setTimeout((function() {
          c.isConnected = !0, c.onConnect = !1, c.onConnectResult(!0, ""), c.onDeviceReady(c.deviceId), o.start((function(e) {
            return s(c, e)
          }))
        }), t.CONNECT_DELAY_MS)
      }, e.stopConnnect = function() {
        console.log("[MOCK] 淋浴器模拟断开 mac =", this.mac), o.stop(), this.isConnected = !1
      }, e.writeCommand = function(e) {
        console.log("[MOCK] 下发指令（未实际写入蓝牙）=", n.toHex(e)), o.handleCommand(e)
      }
    }
  },
  uninstall: function(e) {
    (e ? [e] : Array.from(c.keys())).forEach((function(e) {
      var n = c.get(e);
      n && (e.startConnect = n.startConnect, e.stopConnnect = n.stopConnnect, e.writeCommand = n.writeCommand, c.delete(e))
    })), i && i.stop()
  },
  getVirtualDevice: a,
  feedFrame: s
};