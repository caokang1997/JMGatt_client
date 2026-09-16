var e = require("./switch.js"),
  n = require("./config.js"),
  r = require("./permissionBridge.js"),
  i = require("./bleBridge.js"),
  t = require("./httpMock.js"),
  l = require("./linkBridge.js"),
  a = require("./scenario.js"),
  c = null;

function o() {
  return e.isMockOn()
}

function s(n, i) {
  var l = n || {};
  return e.applyUrlOption(l), o() ? (l.mac || (l.mac = i.device.mac), l.jmZtmxm || (l.jmZtmxm = i.device.jmZtmxm), r.install(), i.installHttp && t.install(), console.log("[MOCK] " + i.label + "已启用模拟数据，依据：" + e.reason()), l) : l
}
module.exports = {
  isMockOn: o,
  reason: e.reason,
  setPanelOverride: e.setPanelOverride,
  clearPanelOverride: e.clearPanelOverride,
  prepareShowerIndex: function(e) {
    return s(e, {
      label: "淋浴器主页",
      device: n.DEFAULT_SHOWER,
      installHttp: !0
    })
  },
  attachShowerDevice: function(e) {
    if (o() && e) {
      i.install(e);
      var n = i.getVirtualDevice();
      c || (c = new a(n)), c.play()
    }
  },
  detachShowerDevice: function(e) {
    o() && (c && c.pause(), e && "function" == typeof e.stopConnnect && e.stopConnnect(), i.uninstall(e))
  },
  prepareBathlink: function(e, n) {
    var r = l.deviceForCategory(null == n ? 3 : n);
    return s(e, {
      label: "沐浴模式联动页",
      device: {
        mac: r.mac,
        jmZtmxm: r.typeCode
      },
      installHttp: !1
    })
  },
  shutdown: function() {
    c && (c.destroy(), c = null), i.uninstall(), t.uninstall(), r.uninstall()
  },
  getVirtualDevice: i.getVirtualDevice,
  getScenario: function() {
    return c
  },
  linkBridge: l,
  httpMock: t,
  permissionBridge: r,
  config: n
};