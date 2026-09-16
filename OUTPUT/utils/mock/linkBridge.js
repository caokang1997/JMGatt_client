var e = require("../eventBus.js");

function r() {
  var e = require("../link/LinkController.js");
  return {
    shower: e.MOCK_SHOWER_DEVICE,
    bathHeater: e.MOCK_BATH_HEATER_DEVICE
  }
}
module.exports = {
  emitOffline: function(r) {
    r && (console.log("[MOCK] 模拟设备掉线 mac =", r), e.emit("event", {
      mac: r,
      connect: !1
    }))
  },
  getMockDevices: r,
  deviceForCategory: function(e) {
    var n = r();
    return 2 === Number(e) ? n.bathHeater : n.shower
  },
  attachPeerController: function(e) {
    var r = (require("../link/LinkController.js").default || require("../link/LinkController.js")).getInstance(e);
    return r.isConnected = !0, r
  }
};