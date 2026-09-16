var e = t(require("../../../../utils/bluetooth/bleutil.js"));
t(require("../../../../utils/bluetooth/ToiletController.js"));

function t(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}
var n = require("miniprogram-computed").behavior,
  i = require("../../../../utils/bluetooth/bleutil.js"),
  o = require("../../../../utils/eventBus"),
  l = getApp();
Page({
  behaviors: [n],
  data: {
    customItem: null,
    selectedList: [],
    customList: [{
      title: "老人模式",
      icon: "all/ic_custom_oldman"
    }, {
      title: "妇洗模式",
      icon: "all/ic_custom_woman"
    }, {
      title: "经期模式",
      icon: "all/ic_custom_woman_period"
    }, {
      title: "儿童模式",
      icon: "all/ic_custom_child"
    }, {
      title: "助便模式",
      icon: "all/ic_custom_strong"
    }, {
      title: "男士快洗模式",
      icon: "all/ic_custom_manfast"
    }],
    jmZtmxm: "000000",
    model: "zq6440",
    currentPageIsOnTop: !1,
    deviceName: "小牧轻智能马桶",
    bleErrMsg: "",
    isDeviceConnected: !1,
    onUiLock: !1,
    uiLockTimer: null,
    bleConnectPopUp: null,
    telephonePopUp: null,
    scrollTop: 2,
    flushingLarge: !1,
    flushingSmall: !1,
    flushLargeOnDevice: !1,
    flushSmallOnDevice: !1,
    seatTempLevel: 2,
    bubble: !1,
    bubbleOnDevice: !1,
    toiletErrorCode: 0,
    connectState: 0,
    isNextBubbleEnable: !0,
    bubbleDisableReason: 0,
    Toilet: null,
    faultList: {}
  },
  computed: {
    currentCustomTitle: function(e) {
      return null == e.customItem ? "" : e.customItem.title
    },
    showAllTemp: function(e) {
      return "134341" == e.jmZtmxm
    },
    isDeviceConnected: function(e) {
      return 1 == e.connectState
    },
    isOnWorking: function(e) {
      return e.flushingLarge || e.flushingSmall || e.bubble || null != e.customItem
    },
    workTitle: function(e) {
      return e.flushingLarge ? "大冲中" : e.flushingSmall ? "小冲中" : e.bubble ? "发泡中" : null != e.customItem ? e.customItem.title : "-"
    },
    isFlushingLargeEnable: function(e) {
      return !e.flushingLarge && !e.flushingSmall
    },
    isFlushingSmallEnable: function(e) {
      return !e.flushingLarge && !e.flushingSmall
    },
    isBubbleEnable: function(e) {
      return !e.flushingLarge && !e.flushingSmall && !e.bubble && e.isNextBubbleEnable
    },
    toiletError: function(e) {
      var t = e.toiletErrorCode;
      return e.faultList[t] ? e.faultList[t] : {
        title: "",
        reason: "",
        solution: []
      }
    }
  },
  initFaultList: function() {
    this.data.faultList = {
      1: {
        title: "座温传感器故障,请及时处理",
        reason: "座温传感器故障",
        solution: ["请尝试断开马桶电源后，重新上电", "如果故障仍不能排除时，请联系当地经销商或致电服务热线。"]
      },
      2: {
        title: "座温超温,请及时处理",
        reason: "座温超温",
        solution: ["请尝试断开马桶电源后，重新上电", "如果故障仍不能排除时，请联系当地经销商或致电服务热线。"]
      }
    }
  },
  onReady: function() {},
  onClickReconnect: function() {
    this.connectBleDevice()
  },
  onClickCancelConnect: function() {
    this.bleConnectPopUp.hide(), wx.redirectTo({
      url: "/pages/scan/scan"
    })
  },
  onPageScroll: function(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  sendCommandWithTime: function(e, t) {
    var n = this;
    null != this.data.uiLockTimer && clearTimeout(this.data.uiLockTimer), this.data.onUiLock = !0;
    var i = this;
    this.data.uiLockTimer = setTimeout((function() {
      n.data.onUiLock = !1, i.onMsgValueChange(null), n.setData({
        customItem: null
      })
    }), t)
  },
  sendCommand: function(e) {
    this.sendCommandWithTime(e, 3e3)
  },
  onClickCustom: function(e) {
    console.log(e);
    var t = e.currentTarget.dataset.item;
    null == this.data.customItem || this.data.customItem.title != t.title ? (this.setData({
      customItem: t,
      flushingLarge: !1,
      flushingSmall: !1,
      bubble: !1
    }), this.sendCommandWithTime(!0, 5e3)) : this.setData({
      customItem: null
    })
  },
  onClickflushingLarge: function(e) {
    this.data.flushingSmall || this.data.flushingLarge ? this.showNormalToast("冲水中,请稍候") : (this.setData({
      customItem: null,
      flushingLarge: !0,
      flushingSmall: !1,
      bubble: !1
    }), this.sendCommandWithTime(!0, 5e3))
  },
  onClickflushingSmall: function(e) {
    this.data.flushingSmall || this.data.flushingLarge ? this.showNormalToast("冲水中,请稍候") : (this.setData({
      customItem: null,
      flushingSmall: !0,
      flushingLarge: !1,
      bubble: !1
    }), this.sendCommandWithTime(!0, 5e3))
  },
  onClickBubble: function(e) {
    this.data.flushingSmall || this.data.flushingLarge ? this.showNormalToast("冲水中,请稍候") : this.data.bubble ? this.showNormalToast("发泡中,请稍候") : this.data.isNextBubbleEnable ? (this.setData({
      customItem: null,
      isNextBubbleEnable: !1,
      bubble: !0,
      flushingSmall: !1,
      flushingLarge: !1
    }), this.sendCommandWithTime(!0, 5e3)) : 0 == this.data.bubbleDisableReason ? this.showNormalToast("发泡结束后30秒才能再开启") : 1 != this.data.bubbleDisableReason && 2 != this.data.bubbleDisableReason || this.showNormalToast("冲刷后30秒才能再开启")
  },
  onClickErrorBar: function(e) {
    this.data.currentPageIsOnTop = !1;
    var t = this.data.toiletError,
      n = this.data.model;
    wx.navigateTo({
      url: "/pages/common/help/help",
      success: function(e) {
        e.eventChannel.emit("error", {
          model: n,
          data: t
        })
      }
    })
  },
  onClickSetting: function(e) {
    this.data.currentPageIsOnTop = !1, console.log("打开设置"), wx.navigateTo({
      url: "/pages/device/xmtoilet/setting/index?jmZtmxm=111111"
    })
  },
  onClickCallService: function(e) {
    console.log("打开拨号"), this.onClickCallPhone()
  },
  onClickCallPhone: function() {
    this.telephonePopUp.hide(), wx.makePhoneCall({
      phoneNumber: "4001919999",
      success: function(e) {
        console.log("拨打电话成功！")
      },
      fail: function(e) {
        console.log("拨打电话失败！")
      }
    })
  },
  onClickCancelPhone: function() {
    this.telephonePopUp.hide()
  },
  onTempSelected: function(e) {
    console.log(e);
    var t = e.detail.step - 1;
    console.log("座温 = ", t), this.Toilet.setSeatTemp(t)
  },
  onLoad: function(t) {
    var n = this;
    if (console.log("------- options -------", t), this.initFaultList(), o.on("event", this.customEventHandler), console.log("------- 生命周期onLoad -------"), this.bleConnectPopUp = this.selectComponent("#dialog"), this.telephonePopUp = this.selectComponent("#telephone-dialog"), this.Toilet = l.getXiaoMuToiletController(), this.isDeviceConnected = !0, t.jmZtmxm) {
      this.data.jmZtmxm = t.jmZtmxm, this.Toilet.jmZtmxm = t.jmZtmxm;
      var i = e.default.getDeviceModelByJmZtmxm(t.jmZtmxm).toLowerCase();
      this.setData({
        model: i
      })
    }
    this.onMsgValueChange(null), this.Toilet.setMsgValueChangeCallBack((function(e) {
      n.onMsgValueChange(e)
    })), o.on("event", this.customEventHandler)
  },
  customEventHandler: function(e) {
    null != e.appOnHide && e.appOnHide && null != e.appOnHide && e.appOnHide && wx.navigateBack()
  },
  onShow: function() {
    console.log("------- 智能马桶主页onShow -------"), this.updateDeviceName();
    for (var e = [], t = this.Toilet.selectedCustomModes, n = 0; n < t.length; ++n) {
      var i = t[n],
        o = this.data.customList[i];
      e.push(o)
    }
    this.setData({
      selectedList: e
    })
  },
  updateDeviceName: function() {
    var t = this.Toilet.mac,
      n = wx.getStorageSync(t);
    if (n) this.setData({
      deviceName: n
    });
    else {
      var i = e.default.getDeviceProductNameByTypeCode(this.Toilet.jmZtmxm);
      this.setData({
        deviceName: i
      })
    }
  },
  onHide: function() {
    console.log("------- 智能马桶主页onHide -------"), this.getOpenerEventChannel().emit("acceptDataFromOpenedPage", {
      disconnect: !0
    })
  },
  onUnload: function() {
    console.log("------- 主页生命周期页面卸载 -------"), o.off("event", this.customEventHandler), null != this.data.uiLockTimer && clearTimeout(this.data.uiLockTimer)
  },
  connectBleDevice: function() {
    var e = this;
    this.bleConnectPopUp.show(), this.setData({
      connectState: 0
    }), i.checkBlePermision().then((function(t) {
      console.log(t), t.ok ? (e.setData({
        bleErrMsg: ""
      }), e.Toilet.startConnect((function(t, n) {
        t ? (console.log("------ 首页链接成功 -----"), e.onBleConnected()) : (e.bleConnectPopUp.isShow() || e.bleConnectPopUp.show(), e.onBleDisConnected(n))
      }), (function(t) {
        e.onMsgValueChange(t)
      }))) : e.setData({
        bleErrMsg: t.errMsg,
        connectState: 2
      })
    }))
  },
  onBleConnected: function() {},
  onBleDisConnected: function(e) {
    this.bleConnectPopUp.isShow() || this.bleConnectPopUp.show(), this.setData({
      connectState: 2
    })
  },
  onMsgValueChange: function(e) {
    if (this.data.onUiLock) console.log("ui锁定中");
    else {
      console.log("isBubbleEnable = ", this.Toilet.isBubbleEnable);
      var t = 0;
      1 == this.Toilet.seatTempError ? t = 1 : 1 == this.Toilet.seatTempOver && (t = 2), this.setData({
        flushingLarge: 1 == this.Toilet.flushLargeSwitch,
        flushingSmall: 1 == this.Toilet.flushSmallSwitch,
        flushLargeOnDevice: 1 == this.Toilet.flushLargeSwitch,
        flushSmallOnDevice: 1 == this.Toilet.flushSmallSwitch,
        bubble: 1 == this.Toilet.bubbleSwitch,
        bubbleOnDevice: 1 == this.Toilet.bubbleSwitch,
        toiletErrorCode: t,
        isNextBubbleEnable: this.Toilet.isBubbleEnable,
        bubbleDisableReason: this.Toilet.bubbleDisableReason
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
  onClickCustomSetting: function() {
    wx.navigateTo({
      url: "/pages/device/xmtoilet/customsetting/index"
    })
  },
  onSpeedChange: function(e) {
    var t = e.detail.value;
    this.setData({
      seatTempLevel: t
    })
  }
});