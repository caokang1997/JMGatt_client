var o = function(o) {
    console.log("---- showToast ----"), wx.showToast({
      title: o,
      icon: "none",
      duration: 3e3
    })
  },
  t = function(o) {
    return (o = o.toString())[1] ? o : "0".concat(o)
  };
module.exports = {
  formatTime: function(o) {
    var n = o.getFullYear(),
      e = o.getMonth() + 1,
      r = o.getDate(),
      c = o.getHours(),
      s = o.getMinutes(),
      a = o.getSeconds();
    return "".concat([n, e, r].map(t).join("/"), " ").concat([c, s, a].map(t).join(":"))
  },
  showToast: o,
  ensureNetwork: function(t) {
    var n = t || "网络异常，请检查网络后重试";
    return new Promise((function(t) {
      wx.getNetworkType({
        success: function(e) {
          var r = "none" !== (e && e.networkType ? e.networkType : "none");
          r || o(n), t(r)
        },
        fail: function() {
          o(n), t(!1)
        }
      })
    }))
  },
  isDevTools: function() {
    try {
      var o = wx.getDeviceInfo();
      return console.log("当前运行环境：", o.platform), "devtools" === o.platform
    } catch (o) {
      return !1
    }
  }
};