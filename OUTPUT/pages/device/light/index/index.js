var e;
(e = require("../../../../utils/bluetooth/ToiletController.js")) && e.__esModule;
var o = require("miniprogram-computed").behavior,
  t = require("../../../../utils/bluetooth/bleutil.js"),
  n = getApp();
Page({
  behaviors: [o],
  data: {
    selMode: 1,
    powerOn: !0,
    colorR: 0,
    colorG: 0,
    colorB: 0,
    brightness: 0,
    selectedModeBrightness: 1,
    selectedModeSpeed: 1,
    tabIndex: 0,
    mode: 0,
    speed: 1,
    bleErrMsg: "",
    isDeviceConnected: !1,
    onUiLock: !1,
    uiLockTimer: null,
    bleConnectPopUp: null,
    scrollTop: 2,
    connectState: 1,
    Device: null
  },
  computed: {},
  onReady: function() {},
  onClickReconnect: function() {
    console.log("--点击重新连接--"), this.connectBleDevice()
  },
  onClickCancelConnect: function() {
    this.bleConnectPopUp.hide(), wx.navigateBack()
  },
  onPageScroll: function(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  sendCommand: function(e) {
    var o = this;
    null != this.data.uiLockTimer && clearTimeout(this.data.uiLockTimer), this.data.onUiLock = !0;
    this.data.uiLockTimer = setTimeout((function() {
      o.Device.startQueryAll(), o.data.onUiLock = !1
    }), 3e3)
  },
  onLoad: function(e) {
    var o = e.mac;
    console.log("------- 生命周期onReady -------"), this.bleConnectPopUp = this.selectComponent("#dialog"), this.Device = n.getLightController(), this.Device.mac = o
  },
  onShow: function() {
    var e = this;
    console.log("------- 生命周期onShow -------"), null != this.Device && (this.connectBleDevice(), this.Device.setMsgValueChangeCallBack((function(o) {
      e.onMsgValueChange(o)
    })))
  },
  onHide: function() {
    console.log("------- 生命周期onHide -------"), this.Device.stopConnnect()
  },
  onUnload: function() {
    console.log("------- 主页生命周期页面卸载 -------")
  },
  onPowerBtnClick: function(e) {
    console.log("点击总开关", e.detail.on);
    var o = e.detail.on;
    this.setData({
      powerOn: o
    }), this.sendCommand(!0), this.Device.openLight(o)
  },
  onColorChange: function(e) {
    if (null != this.Device) {
      var o = e.detail.rgb;
      console.log("单色颜色选择 r:", o.r, " g:", o.g, " b:", o.b), this.sendCommand(!0), this.data.mode = 0, this.Device.setRGB(o.r, o.g, o.b)
    }
  },
  onBrightnessChange: function(e) {
    if (null != this.Device) {
      var o = e.detail.brightness;
      console.log("亮度调节 - mode", this.data.mode), console.log("亮度调节 - brightness", o), this.sendCommand(!0), this.Device.setModeBrightness(this.data.mode, o)
    }
  },
  onSpeedChange: function(e) {
    var o = e.detail.speed;
    console.log("速度调节 - mode", this.data.mode), console.log("速度调节 - speed", o), this.sendCommand(!0), this.Device.setModeSpeed(mode, o)
  },
  onModeChange: function(e) {
    var o = e.detail.mode;
    console.log("模式切换", o), this.setData({
      mode: o
    }), this.onMsgValueChange(null), this.sendCommand(!0), this.Device.setLightMode(o)
  },
  connectBleDevice: function() {
    var e = this;
    this.bleConnectPopUp.show(), this.setData({
      connectState: 0
    }), t.checkBlePermision().then((function(o) {
      console.log(o), o.ok ? (e.setData({
        bleErrMsg: ""
      }), e.Device.startConnect((function(o, t) {
        o ? (console.log("------ 首页链接成功 -----"), e.onBleConnected()) : (e.bleConnectPopUp.isShow() || e.bleConnectPopUp.show(), e.onBleDisConnected(t))
      }), (function(o) {
        e.onMsgValueChange(o)
      }))) : e.setData({
        bleErrMsg: o.errMsg,
        connectState: 2
      })
    }))
  },
  onBleConnected: function() {
    var e = this;
    this.isDeviceConnected = !0, console.log("---- 连接成功了 ----"), this.setData({
      connectState: 1
    });
    var o = setTimeout((function() {
      e.bleConnectPopUp.hide(), clearInterval(o)
    }), 1e3)
  },
  onBleDisConnected: function(e) {
    this.bleConnectPopUp.isShow() || this.bleConnectPopUp.show(), console.log("---- 连接失败了 ----"), this.setData({
      connectState: 2
    })
  },
  onClickRealTimeReport: function() {
    this.Device.dealResponse()
  },
  onClickColdWaterOpen: function() {
    this.Device.startDischarge(!0, 1, 1, 1, 1)
  },
  onClickColdWaterOpen1: function() {
    this.Device.startDischarge(!0, 1, 0, 0, 0)
  },
  onClickColdWaterOpen2: function() {
    this.Device.startDischarge(!0, 0, 1, 0, 0)
  },
  onClickColdWaterOpen3: function() {
    this.Device.startDischarge(!0, 0, 0, 1, 0)
  },
  onClickColdWaterOpen4: function() {
    this.Device.startDischarge(!0, 0, 0, 0, 1)
  },
  onClickColdWaterClose: function() {
    this.Device.startDischarge(!1, 1, 1, 1, 1)
  },
  onClickOpenLight: function() {
    console.log("点击开灯"), this.Device.openLight(!0)
  },
  onClickCloseLight: function() {
    console.log("点击关灯"), this.Device.openLight(!1)
  },
  onClickGetLightPar: function() {
    this.Device.getPar(!1)
  },
  onClickOpenLightWithRed: function() {
    console.log("开灯,亮度50,红色"), this.Device.openLightWithRGB(!0, 50, 255, 0, 0)
  },
  onClickSetMode: function() {
    console.log("设置灯光模式 " + this.data.selMode), this.Device.setLightMode(this.data.selMode);
    var e = this.data.selMode + 1;
    18 == e && (e = 1), this.setData({
      selMode: e
    })
  },
  onClickQueryLight: function() {
    console.log("系统参数查询"), this.Device.queryLightInfo()
  },
  onClickChangeBrightness: function() {
    console.log("点击调整模式 =", 8, " 亮度 = ", 5), this.Device.setModeBrightness(8, 5)
  },
  onClickBrightness: function(e) {
    console.log("点击调整亮度"), this.Device.setModeBrightness(1, e)
  },
  onClickBrightness50: function() {
    this.onClickBrightness(50)
  },
  onClickBrightness100: function() {
    this.onClickBrightness(100)
  },
  onClickBrightness10: function() {
    this.onClickBrightness(10)
  },
  onClickColorTemp: function() {
    console.log("点击调整色温"), this.Device.setColorTemp(5e3)
  },
  onClickRGB: function() {
    console.log("点击调整RGB -- 红"), this.Device.setRGB(255, 0, 0)
  },
  onClickOpenMusicLightMode: function() {
    console.log("点击开关拾音模式"), this.Device.openMusicLightMode(1)
  },
  onClickMusicLightMode: function() {
    console.log("点击调整拾音模式"), this.Device.setMusicLightMode(1)
  },
  onClickModeSpeed: function() {
    console.log("点击调整速度 mode = 8 速度 = 10"), this.Device.setModeSpeed(8, 10);
    var e = 11;
    e > 5 && (e = 1), this.setData({
      speed: e
    })
  },
  onClickQueryMode: function() {
    console.log("点击模式查询"), this.Device.queryMode()
  },
  onMsgValueChange: function(e) {
    if (this.data.onUiLock) console.log("ui锁定中");
    else {
      this.Device.brightness > 100 && (this.Device.brightness = 100);
      var o = this.data.mode,
        t = this.Device.lightModes[o].brightness,
        n = this.Device.lightModes[o].speed;
      0 == t && (t = 1), t > 100 && (t = 100), 0 == n && (n = 1), n > 10 && (n = 10), console.log("选中的模式 = ", o), console.log("选中的模式亮度 = ", t), console.log("选中的模式速度 = ", n), this.setData({
        powerOn: 1 == this.Device.powerOn,
        colorR: this.Device.colorR,
        colorG: this.Device.colorG,
        colorB: this.Device.colorG,
        brightness: this.Device.brightness,
        selectedModeBrightness: t,
        selectedModeSpeed: n
      })
    }
  },
  showNormalToast: function(e) {
    wx.showToast({
      title: e,
      icon: "none",
      duration: 2e3
    })
  },
  onTabSelected: function(e) {
    console.log("tab选中", e), this.setData({
      tabIndex: e.detail.index
    })
  }
});