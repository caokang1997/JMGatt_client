require("./utils/log.js");
var t = require("./utils/bluetooth/toilet/ToiletController").default,
  e = (require("./utils/bluetooth/toilet/TechramicToiletController").default, require("./utils/bluetooth/LightController").default),
  l = require("./utils/bluetooth/ShowerController").default,
  o = require("./utils/bluetooth/BathroomController").default,
  i = require("./utils/bluetooth/Shower2Controller").default,
  a = require("./utils/bluetooth/xiaomu/XiaoMuBathHeaterController").default,
  n = require("./utils/bluetooth/xiaomu/XiaoMuToiletController").default,
  r = require("./utils/bluetooth/BathHubController").default,
  u = require("./utils/bluetooth/bleutil.js"),
  h = require("./utils/eventBus");
App({
  onHide: function() {
    console.log("---------------------- 小程序被隐藏 ----------------------"), h.emit("event", {
      appOnHide: !0
    })
  },
  onShow: function() {
    console.log("---------------------- 小程序被打开 ----------------------"), this.getSettingSubscriptions()
  },
  onLaunch: function(t) {
    var e = wx.getSystemInfoSync(),
      l = e.statusBarHeight,
      o = e.platform,
      i = wx.getMenuButtonBoundingClientRect(),
      a = i.top,
      n = i.height;
    if (wx.setStorageSync("statusBarHeight", l), wx.setStorageSync("menuButtonHeight", n || 32), a && 0 !== a && n && 0 !== n) {
      var r = 2 * (a - l) + n;
      wx.setStorageSync("navigationBarHeight", r)
    } else wx.setStorageSync("navigationBarHeight", "android" === o ? 48 : 40)
  },
  getSettingSubscriptions: function() {
    u.authorize().then((function(t) {
      t.ok || console.log("------------- 用户取消小程序在微信的蓝牙权限 ------------"), h.emit("event", {
        blePermission: t.ok,
        bleErrMsg: "请打开小程序蓝牙开关：点击小程序右上角三个点(或五角星)后，点击“设置”，设置成使用小程序时允许使用蓝牙"
      })
    }))
  },
  getToiletController: function() {
    return null == this.globalData.ToiletDevice && (this.globalData.ToiletDevice = new t), this.globalData.ToiletDevice
  },
  getLightController: function() {
    return null == this.globalData.LightDevice && (this.globalData.LightDevice = new e), this.globalData.LightDevice
  },
  getShowerController: function() {
    return null == this.globalData.ShowerDevice && (this.globalData.ShowerDevice = new l), this.globalData.ShowerDevice
  },
  getShower2Controller: function() {
    return null == this.globalData.Shower2Device && (this.globalData.Shower2Device = new i), this.globalData.Shower2Device
  },
  getBathroomController: function() {
    return null == this.globalData.BathroomDevice && (this.globalData.BathroomDevice = new o), this.globalData.BathroomDevice
  },
  getXiaoMuBathHeaterController: function() {
    return null == this.globalData.XiaoMuBathHeaterDevice && (this.globalData.XiaoMuBathHeaterDevice = new a), this.globalData.XiaoMuBathHeaterDevice
  },
  getXiaoMuToiletController: function() {
    return null == this.globalData.XiaoMuToiletDevice && (this.globalData.XiaoMuToiletDevice = new n), this.globalData.XiaoMuToiletDevice
  },
  getBathHubController: function() {
    return null == this.globalData.BathHubController && (this.globalData.BathHubController = new r), this.globalData.BathHubController
  },
  isFastClick: function() {
    var t = this;
    return this.globalData.hasClick ? (console.log(this.getCurrentTime(), " 点击太快"), !0) : (this.globalData.hasClick = !0, h.emit("fastClickEvent", {
      hasClick: !0
    }), setTimeout((function() {
      t.globalData.hasClick = !1, h.emit("fastClickEvent", {
        hasClick: !1
      })
    }), 650), !1)
  },
  getCurrentTime: function() {
    var t = new Date,
      e = t.getFullYear(),
      l = t.getMonth() + 1,
      o = t.getDate(),
      i = t.getHours(),
      a = t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes(),
      n = t.getSeconds() < 10 ? "0" + t.getSeconds() : t.getSeconds(),
      r = t.getTime().toString();
    return "[" + e + "/" + l + "/" + o + " " + i + ":" + a + ":" + n + ":" + r.substring(r.length - 3) + "]"
  },
  globalData: {
    JomooDevice: null,
    LightDevice: null,
    ShowerDevice: null,
    Shower2Device: null,
    ToiletDevice: null,
    BathroomDevice: null,
    XiaoMuBathHeaterDevice: null,
    XiaoMuToiletDevice: null,
    BathHubController: null,
    hasClick: !1,
    chatSessionId: null,
    chatSessionDeviceId: null,
    chatSessionDeviceModel: null
  }
});