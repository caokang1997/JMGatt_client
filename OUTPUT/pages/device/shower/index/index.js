var e, t, o = require("../../../../@babel/runtime/helpers/defineProperty");
(e = require("lottie-miniprogram")) && e.__esModule;
var n = require("miniprogram-computed").behavior,
  i = require("../../../../utils/bluetooth/bleutil.js"),
  a = getApp();
Page((o(t = {
  behaviors: [n],
  data: {
    openByNFC: !1,
    showerTypePopUp: null,
    disChargeTempPopUp: null,
    onDischarge: !1,
    dischargeTimer: null,
    currentTemp: 24,
    aimTemp: 34,
    selectDischargeType: 0,
    dischrgeType: ["手持", "顶喷", "下出水"],
    showerAnim: null,
    bleConnectPopUp: null,
    scrollTop: 2,
    connectState: 1,
    Device: null
  },
  computed: {
    workState: function(e) {
      return e.onDischarge ? "冷水预排中" : "冷水预排"
    },
    currentDischageType: function(e) {
      return e.dischrgeType[e.selectDischargeType]
    },
    showerTypeIcon: function(e) {
      return 0 == e.selectDischargeType ? "/image/ic_shower_hand.png" : 1 == e.selectDischargeType ? "/image/ic_shower_top.png" : "/image/ic_shower_down.png"
    },
    dischargeIcon: function(e) {
      return e.onDischarge ? "/image/ic_shower_pause.png" : "/image/ic_shower_play.png"
    }
  },
  onClickDischarge: function() {
    this.data.onDischarge ? this.stopDischarge() : this.startDischarge()
  },
  stopDischarge: function() {
    this.setData({
      onDischarge: !1
    }), this.data.dischargeTimer && clearInterval(this.data.dischargeTimer), this.Device.startDischarge(!1, 0, 0, 0, 0)
  },
  startDischarge: function() {
    this.setData({
      currentTemp: 24,
      onDischarge: !0
    }), this.data.dischargeTimer && clearInterval(this.data.dischargeTimer);
    var e = this;
    this.data.dischargeTimer = setInterval((function() {
      var t = e.data.currentTemp + 1;
      e.setData({
        currentTemp: t
      }), t >= e.data.aimTemp && (e.showNormalToast("冷水预排完成"), clearInterval(e.data.dischargeTimer), e.setData({
        onDischarge: !1
      }), e.stopDischarge())
    }), 1e3), 0 == this.data.selectDischargeType ? this.Device.startDischarge(!0, 0, 0, 0, 1) : 1 == this.data.selectDischargeType ? this.Device.startDischarge(!0, 0, 1, 1, 0) : this.Device.startDischarge(!0, 1, 0, 0, 0)
  },
  onLoad: function(e) {
    this.data.showerTypePopUp = this.selectComponent("#showerTypeDialog"), this.data.disChargeTempPopUp = this.selectComponent("#dischargeTempDialog");
    var t = wx.getStorageSync("showerTemp");
    t && this.setData({
      aimTemp: t
    });
    var o = wx.getStorageSync("showerType");
    o && this.setData({
      selectDischargeType: o
    });
    var n = e.mac;
    this.data.openByNFC = !0, console.log("------- 生命周期onReady -------"), this.bleConnectPopUp = this.selectComponent("#dialog"), this.Device = a.getShowerController(), this.Device.mac = n
  },
  onReady: function() {},
  onShow: function() {
    this.connectBleDevice()
  },
  onHide: function() {
    console.log("------- 主页生命周期页面卸载 -------"), this.Device.stopConnnect(), this.data.dischargeTimer && clearInterval(this.data.dischargeTimer)
  },
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  onClickChosseShowerType: function() {
    this.data.showerTypePopUp.show()
  },
  onClickChosseDischargeTemp: function() {
    this.data.disChargeTempPopUp.show()
  },
  onChooseDischargeTemp: function(e) {
    this.data.disChargeTempPopUp.hide();
    var t = e.detail.selectValue;
    console.log("确定预排温度", t), wx.setStorageSync("showerTemp", t), this.setData({
      aimTemp: t
    })
  },
  onCancelDischargeTempPicker: function() {
    this.data.disChargeTempPopUp.hide()
  },
  onChooseDischargeType: function(e) {
    this.data.showerTypePopUp.hide();
    var t = e.detail.index;
    console.log("选好预排类型", t), wx.setStorageSync("showerType", t), this.setData({
      selectDischargeType: t
    })
  },
  onCancelDischargeTypePicker: function() {
    this.data.showerTypePopUp.hide()
  },
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
    }), i.checkBlePermision().then((function(t) {
      console.log(t), t.ok ? (e.setData({
        bleErrMsg: ""
      }), e.Device.startConnect((function(t, o) {
        t ? (console.log("------ 首页链接成功 -----"), e.onBleConnected()) : (e.bleConnectPopUp.isShow() || e.bleConnectPopUp.show(), e.onBleDisConnected(o))
      }), (function(t) {
        e.onMsgValueChange(t)
      }))) : e.setData({
        bleErrMsg: t.errMsg,
        connectState: 2
      })
    }))
  },
  onBleConnected: function() {
    var e = this;
    this.isDeviceConnected = !0, console.log("---- 连接成功了 ----"), this.setData({
      connectState: 1
    });
    var t = setTimeout((function() {
      e.bleConnectPopUp.hide(), clearInterval(t), e.data.openByNFC && (e.data.openByNFC = !1, e.startDischarge())
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
})), o(t, "onMsgValueChange", (function(e) {})), t));