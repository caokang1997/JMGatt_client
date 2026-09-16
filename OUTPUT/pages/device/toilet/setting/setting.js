var e, t = (e = require("../../../../utils/bluetooth/bleutil.js")) && e.__esModule ? e : {
  default: e
};
var o = require("../../../../utils/eventBus"),
  i = require("miniprogram-computed").behavior,
  n = getApp();
Page({
  behaviors: [i],
  bleConnectPopUp: null,
  data: {
    model: "zq6640",
    jmZtmxm: "000000",
    deviceName: "",
    changeNamePopUp: null,
    isAutoBubble: !1,
    isAutoFlush: !1,
    isAutoLight: !1,
    isAutoFoot: !1,
    isPreWetting: !1,
    Toilet: null
  },
  computed: {
    showPreWet: function(e) {
      return "134341" != e.jmZtmxm && "000000" != e.jmZtmxm
    }
  },
  onLoad: function(e) {
    var t = this;
    this.data.jmZtmxm = e.jmZtmxm, console.log("--- 设置页面 ---"), console.log(e), this.bleConnectPopUp = this.selectComponent("#dialog"), this.changeNamePopUp = this.selectComponent("#dialog"), this.Toilet = n.getToiletController(), this.getDeviceName(), this.onMsgValueChange(null), this.Toilet.setMsgValueChangeCallBack((function(e) {
      t.onMsgValueChange(e)
    })), console.log("设置页面 --- 注册事件"), o.on("event", this.customEventHandler)
  },
  onReady: function() {},
  onShow: function() {},
  customEventHandler: function(e) {
    console.log("设置页面 --- 收到事件", e), null != e.connect && 0 == e.connect && (console.log("收到蓝牙断开事件", e), wx.navigateBack())
  },
  onHide: function() {},
  onUnload: function() {
    console.log("设置页面 --- 取消注册事件"), o.off("event", this.customEventHandler)
  },
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  doSwitchAutoBubble: function(e) {
    var t = e.detail.value;
    this.Toilet.setAutoBubble(t)
  },
  doSwitchAutoFlush: function(e) {
    var t = e.detail.value;
    this.Toilet.setAutoFlush(t)
  },
  doSwitchAutoFoot: function(e) {
    var t = e.detail.value;
    this.Toilet.setAutoFootSensor(t)
  },
  doSwitchAutoLight: function(e) {
    var t = e.detail.value;
    this.Toilet.setLightSensor(t)
  },
  doSwitchPreWetting: function(e) {
    var t = e.detail.value;
    this.Toilet.setPreWetting(t)
  },
  onMsgValueChange: function(e) {
    console.log("更新界面数据"), this.setData({
      isAutoBubble: 1 == this.Toilet.autoBubble,
      isAutoFlush: 1 == this.Toilet.autoFlushSwitch,
      isAutoLight: 1 == this.Toilet.lightSensorSwitch,
      isAutoFoot: 1 == this.Toilet.footSensorSwitch,
      isPreWetting: 1 == this.Toilet.preWettingSwitch
    }), console.log("更新界面数据 isAutoFoot = ", this.Toilet.footSensorSwitch)
  },
  onClickDeviceName: function() {
    this.changeNamePopUp.show()
  },
  onCancelChangeDeviceName: function(e) {
    this.changeNamePopUp.hide()
  },
  onChangeDeviceName: function(e) {
    var t = e.detail.content;
    this.changeNamePopUp.hide(), this.saveDeviceName(t), this.setData({
      deviceName: t
    })
  },
  saveDeviceName: function(e) {
    var t = this.Toilet.mac;
    wx.setStorageSync(t, e)
  },
  getDeviceName: function() {
    var e = this.Toilet.mac,
      o = this.Toilet.jmZtmxm,
      i = wx.getStorageSync(e);
    if (i) this.setData({
      deviceName: i
    });
    else {
      var n = t.default.getDeviceProductNameByTypeCode(o);
      this.setData({
        deviceName: n
      })
    }
  },
  onClickReconnect: function() {
    console.log("--点击重新连接--"), this.connectBleDevice()
  },
  onClickCancelConnect: function() {
    this.bleConnectPopUp.hide(), wx.navigateBack()
  }
});