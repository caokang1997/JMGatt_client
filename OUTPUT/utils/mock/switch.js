var n, r, t = require("./config.js"),
  u = require("../util.js").isDevTools,
  l = null,
  e = null,
  o = null;

function c() {
  return null === o && (o = u()), o
}

function O() {
  if (void 0 !== n) return n;
  n = null;
  try {
    var r = wx.getStorageSync(t.STORAGE_KEY_MOCK_ON);
    !0 !== r && !1 !== r || (n = r)
  } catch (n) {}
  return n
}

function i() {
  if (void 0 !== r) return r;
  r = null;
  try {
    var n = wx.getStorageSync("JM_MOCK_CLOUD_PASSTHROUGH");
    !0 !== n && !1 !== n || (r = n)
  } catch (n) {}
  return r
}
module.exports = {
  isMockOn: function() {
    var n = O();
    return null !== n ? n : null !== l ? l : !0 === t.FORCE_MOCK || !1 === t.FORCE_MOCK ? t.FORCE_MOCK : c()
  },
  reason: function() {
    return null !== O() ? "面板设置" : null !== l ? "URL 参数" : !0 === t.FORCE_MOCK || !1 === t.FORCE_MOCK ? "FORCE_MOCK 常量" : c() ? "开发者工具环境" : "真机环境"
  },
  applyUrlOption: function(n) {
    if (c() && n) {
      if (void 0 !== n.mock && null !== n.mock) {
        var r = String(n.mock);
        l = "1" === r || "true" === r
      }
      if (void 0 !== n.cloud && null !== n.cloud) {
        var t = String(n.cloud);
        e = "1" === t || "true" === t
      }
    }
  },
  setPanelOverride: function(r) {
    n = !!r;
    try {
      wx.setStorageSync(t.STORAGE_KEY_MOCK_ON, !!r)
    } catch (n) {}
  },
  clearPanelOverride: function() {
    n = null;
    try {
      wx.removeStorageSync(t.STORAGE_KEY_MOCK_ON)
    } catch (n) {}
  },
  isCloudPassthroughOn: function() {
    var n = i();
    return null !== n ? n : null !== e && e
  },
  cloudReason: function() {
    return null !== i() ? "面板设置" : null !== e ? "URL 参数" : "默认关闭"
  },
  setCloudPassthroughOverride: function(n) {
    r = !!n;
    try {
      wx.setStorageSync("JM_MOCK_CLOUD_PASSTHROUGH", !!n)
    } catch (n) {}
  },
  clearCloudPassthroughOverride: function() {
    r = null;
    try {
      wx.removeStorageSync("JM_MOCK_CLOUD_PASSTHROUGH")
    } catch (n) {}
  }
};