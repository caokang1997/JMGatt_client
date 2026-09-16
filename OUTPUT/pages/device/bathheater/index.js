var e, n = require("../../../@babel/runtime/helpers/defineProperty"),
  t = require("miniprogram-computed").behavior,
  i = require("../../../utils/bluetooth/bleutil.js"),
  a = getApp();
Page((n(e = {
  behaviors: [t],
  data: {
    openByNFC: !1,
    bleConnectPopUp: null,
    connectState: 1,
    Device: null,
    strongWarm: !1,
    weakWarm: !1,
    dry: !1,
    wind: !1,
    ventilation: !1,
    nightLight: !1,
    light: !1,
    temp: 0,
    dryRemain: 0,
    windRemain: 0,
    ventilationRemain: 0,
    warmRemain: 0,
    parseTimeM: function(e) {
      var n, t = 0,
        i = 0;
      return e > 59 ? (t = Math.floor(e / 60), i = e % 60) : e > 0 && (i = e), n = t > 9 ? "" + t : t > 0 ? "0" + t : "00", i > 9 ? n = n + ":" + i : i > 0 ? n = n + ":0" + i : n += ":00", n
    }
  },
  computed: {
    firstTime: function(e) {
      return e.dry ? e.parseTimeM(e.dryRemain) : e.windRemain ? e.parseTimeM(e.windRemain) : e.warmRemain ? e.parseTimeM(e.warmRemain) : e.parseTimeM(120)
    },
    firstTitle: function(e) {
      return e.dry ? "干燥剩余时长" : e.windRemain ? "清新剩余时长" : e.warmRemain ? "暖风剩余时长" : "干燥时长"
    },
    secondTime: function(e) {
      return e.ventilation ? e.parseTimeM(e.ventilationRemain) : "02:00"
    },
    secondTitle: function(e) {
      return e.ventilation ? "换气剩余时长" : "换气时长"
    }
  },
  clickVentilation: function() {
    var e = !this.data.ventilation;
    this.setData({
      ventilation: e
    }), this.Device.openVentilation(e)
  },
  clickOpenLight: function() {
    var e = !this.data.light;
    this.setData({
      light: e
    }), this.Device.openLight(e)
  },
  clickNightLight: function() {
    var e = !this.data.nightLight;
    this.setData({
      nightLight: e
    }), this.Device.openNightLight(e)
  },
  clickWarmWeak: function() {
    var e = !this.data.weakWarm;
    this.setData({
      weakWarm: e
    }), e ? this.Device.openWarmWind(1) : this.Device.openWarmWind(0)
  },
  clickWarmStrong: function() {
    var e = !this.data.strongWarm;
    this.setData({
      strongWarm: e
    }), e ? this.Device.openWarmWind(2) : this.Device.openWarmWind(0)
  },
  clickOneKeyClose: function() {
    this.Device.oneKeyClose(!0)
  },
  clickWind: function() {
    var e = !this.data.wind;
    this.setData({
      wind: e
    }), this.Device.openWind(e)
  },
  clickIon: function() {
    this.Device.openIon(!0)
  },
  clickDry: function() {
    var e = !this.data.dry;
    this.setData({
      dry: e
    }), this.Device.openDry(e)
  },
  onLoad: function(e) {
    var n = this;
    this.data.openByNFC = !0, console.log("------- 生命周期onReady -------"), this.bleConnectPopUp = this.selectComponent("#dialog"), this.Device = a.getXiaoMuBathHeaterController(), this.onMsgValueChange(null), this.Device.setMsgValueChangeCallBack((function(e) {
      n.onMsgValueChange(e)
    }))
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {
    console.log("------- 主页生命周期页面卸载 -------"), this.getOpenerEventChannel().emit("acceptDataFromOpenedPage", {
      disconnect: !0
    }), wx.navigateBack()
  },
  onUnload: function() {},
  showNormalToast: function(e) {
    wx.showToast({
      title: e,
      icon: "none",
      duration: 2e3
    })
  },
  onClickCancelConnect: function() {
    this.bleConnectPopUp.hide(), wx.navigateBack()
  },
  connectBleDevice: function() {
    var e = this;
    this.bleConnectPopUp.show(), this.setData({
      connectState: 0
    }), i.checkBlePermision().then((function(n) {
      console.log(n), n.ok ? (e.setData({
        bleErrMsg: ""
      }), e.Device.startConnect((function(n, t) {
        n ? (console.log("------ 首页链接成功 -----"), e.onBleConnected()) : (e.bleConnectPopUp.isShow() || e.bleConnectPopUp.show(), e.onBleDisConnected(t))
      }), (function(n) {
        e.onMsgValueChange(n)
      }))) : e.setData({
        bleErrMsg: n.errMsg,
        connectState: 2
      })
    }))
  },
  onBleConnected: function() {
    var e = this;
    this.isDeviceConnected = !0, console.log("---- 连接成功了 ----"), this.setData({
      connectState: 1
    });
    var n = setTimeout((function() {
      e.bleConnectPopUp.hide(), clearInterval(n), e.data.openByNFC && (e.data.openByNFC = !1)
    }), 1e3)
  },
  onBleDisConnected: function(e) {
    this.bleConnectPopUp.isShow() || this.bleConnectPopUp.show(), console.log("---- 连接失败了 ----"), this.setData({
      connectState: 2
    })
  },
  onClickReconnect: function() {
    console.log("--点击重新连接--"), this.connectBleDevice()
  }
}, "onClickCancelConnect", (function() {
  this.bleConnectPopUp.hide(), wx.navigateBack()
})), n(e, "onMsgValueChange", (function(e) {
  var n = 1 == this.Device.strongWarm,
    t = 1 == this.Device.weakWarm,
    i = 1 == this.Device.dry,
    a = 1 == this.Device.wind,
    o = 1 == this.Device.ventilation,
    c = 1 == this.Device.nightLight,
    s = 1 == this.Device.light;
  this.setData({
    temp: this.Device.temp,
    dryRemain: this.Device.dryRemain,
    windRemain: this.Device.windRemain,
    ventilationRemain: this.Device.ventilationRemain,
    warmRemain: this.Device.warmRemain,
    strongWarm: n,
    weakWarm: t,
    dry: i,
    wind: a,
    ventilation: o,
    nightLight: c,
    light: s
  })
})), e));