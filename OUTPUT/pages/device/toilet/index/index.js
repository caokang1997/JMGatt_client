var e = i(require("../../../../utils/bluetooth/bleutil.js")),
  t = (i(require("../../../../utils/bluetooth/ToiletController.js")), i(require("../../../../utils/UserInfoManager.js")));

function i(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}
var n = require("miniprogram-computed").behavior,
  o = require("../../../../utils/bluetooth/bleutil.js"),
  s = require("../../../../utils/eventBus"),
  l = t.default.getInstance(),
  a = getApp();
Page({
  behaviors: [n],
  data: {
    jmZtmxm: "000000",
    model: "zq6440",
    currentPageIsOnTop: !1,
    deviceName: "九牧智能马桶",
    bleErrMsg: "",
    isDeviceConnected: !1,
    isDeviceReady: !1,
    onUiLock: !1,
    uiLockTimer: null,
    bleConnectPopUp: null,
    telephonePopUp: null,
    scrollTop: 2,
    isCoverOn: !1,
    isCoverRun: !1,
    isRingOn: !1,
    isRingRun: !1,
    flushingLarge: !1,
    flushingSmall: !1,
    flushLargeOnDevice: !1,
    flushSmallOnDevice: !1,
    seatTempLevel: 0,
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
    showCoverRing: function(e) {
      return "134341" == e.jmZtmxm || "175416" == e.jmZtmxm
    },
    isCoverEnable: function(e) {
      return !e.isCoverRun && !e.isRingRun
    },
    isRingEnable: function(e) {
      return !e.isCoverRun && !e.isRingRun
    },
    showAllTemp: function(e) {
      return "134341" == e.jmZtmxm || "175416" == e.jmZtmxm
    },
    isDeviceConnected: function(e) {
      return 1 == e.connectState
    },
    isOnWorking: function(e) {
      return 1 == e.connectState && (e.flushLargeOnDevice || e.flushSmallOnDevice || e.bubbleOnDevice || e.isCoverRun || e.isRingRun)
    },
    workTitle: function(e) {
      return e.flushingLarge ? "大冲中" : e.flushingSmall ? "小冲中" : e.bubble ? "发泡中" : e.isCoverRun ? "翻盖中" : e.isRingRun ? "翻圈中" : "-"
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
    var i = this;
    null != this.data.uiLockTimer && clearTimeout(this.data.uiLockTimer), this.data.onUiLock = !0;
    var n = this;
    this.data.uiLockTimer = setTimeout((function() {
      i.data.onUiLock = !1, n.onMsgValueChange(null)
    }), t)
  },
  sendCommand: function(e) {
    this.sendCommandWithTime(e, 3e3)
  },
  onClickCover: function(e) {
    if (this.data.isCoverRun || this.data.isRingRun) this.showNormalToast("请稍候");
    else {
      var t = !this.data.isCoverOn;
      t ? (console.log("开盖"), this.setData({
        isCoverOn: !0,
        isCoverRun: !0
      })) : (console.log("关盖"), this.setData({
        isCoverOn: !1,
        isRingOn: !1,
        isCoverRun: !0
      })), this.sendCommandWithTime(!0, 3e3), this.Toilet.startCover(t)
    }
  },
  onClickRing: function(e) {
    if (this.data.isCoverRun || this.data.isRingRun) this.showNormalToast("请稍候");
    else {
      var t = !this.data.isRingOn;
      t ? this.setData({
        isCoverOn: !0,
        isRingOn: !0,
        isRingRun: !0
      }) : this.setData({
        isRingOn: !1,
        isRingRun: !0
      }), this.sendCommandWithTime(!0, 3e3), this.Toilet.startRing(t)
    }
  },
  onClickflushingLarge: function(e) {
    this.data.flushingSmall || this.data.flushingLarge ? this.showNormalToast("冲水中,请稍候") : (this.setData({
      flushingLarge: !0,
      flushingSmall: !1,
      bubble: !1
    }), this.sendCommandWithTime(!0, 300), this.Toilet.startFlushLarge())
  },
  onClickflushingSmall: function(e) {
    this.data.flushingSmall || this.data.flushingLarge ? this.showNormalToast("冲水中,请稍候") : (this.setData({
      flushingSmall: !0,
      flushingLarge: !1,
      bubble: !1
    }), this.sendCommandWithTime(!0, 300), this.Toilet.startFlushSmall())
  },
  onClickBubble: function(e) {
    this.data.flushingSmall || this.data.flushingLarge ? this.showNormalToast("冲水中,请稍候") : this.data.bubble ? this.showNormalToast("发泡中,请稍候") : this.data.isNextBubbleEnable ? (this.setData({
      isNextBubbleEnable: !1,
      bubble: !0,
      flushingSmall: !1,
      flushingLarge: !1
    }), this.sendCommandWithTime(!0, 300), this.Toilet.startBubble()) : 0 == this.data.bubbleDisableReason ? this.showNormalToast("发泡结束后30秒才能再开启") : 1 != this.data.bubbleDisableReason && 2 != this.data.bubbleDisableReason || this.showNormalToast("冲刷后30秒才能再开启")
  },
  onClickErrorBar: function(e) {
    this.data.currentPageIsOnTop = !1;
    var t = this.data.toiletError,
      i = this.data.model;
    wx.navigateTo({
      url: "/pages/common/help/help",
      success: function(e) {
        e.eventChannel.emit("error", {
          model: i,
          data: t
        })
      }
    })
  },
  onClickSetting: function(e) {
    this.data.currentPageIsOnTop = !1, console.log("打开设置"), wx.navigateTo({
      url: "/pages/device/toilet/setting/setting?jmZtmxm=" + this.data.jmZtmxm
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
    console.log("------- options -------", t), this.initFaultList(), s.on("event", this.customEventHandler);
    var i = t.mac;
    if (console.log("------- 生命周期onLoad -------"), this.bleConnectPopUp = this.selectComponent("#dialog"), this.telephonePopUp = this.selectComponent("#telephone-dialog"), this.Toilet = a.getToiletController(), this.Toilet.mac = i, t.jmZtmxm) {
      this.data.jmZtmxm = t.jmZtmxm, this.Toilet.jmZtmxm = t.jmZtmxm;
      var n = e.default.getDeviceModelByJmZtmxm(t.jmZtmxm).toLowerCase();
      this.setData({
        model: n
      })
    }
    this.Toilet.initDevice()
  },
  customEventHandler: function(e) {
    if (null != e.bleReady && 1 == e.bleReady && (this.isDeviceConnected = !0, this.setData({
        connectState: 1
      }), this.bleConnectPopUp.hide()), null != e.blePermission && !e.blePermission) {
      var t = e.bleErrMsg;
      this.isDeviceConnected = !1, this.setData({
        bleErrMsg: t,
        connectState: 2
      }), this.bleConnectPopUp.show()
    }
    null != e.appOnHide && e.appOnHide && null != this.Toilet && this.Toilet.stopConnnect()
  },
  onShow: function() {
    var e = this;
    this.data.currentPageIsOnTop = !0, console.log("------- 马桶生命周期onShow -------"), null != this.Toilet && (0 == this.data.connectState && (console.log("------- \b启动连接 -------"), this.connectBleDevice()), this.onMsgValueChange(null), this.Toilet.setMsgValueChangeCallBack((function(t) {
      e.onMsgValueChange(t)
    }))), this.updateDeviceName()
  },
  updateDeviceName: function() {
    var t = this.Toilet.mac,
      i = wx.getStorageSync(t);
    if (i) this.setData({
      deviceName: i
    });
    else {
      var n = e.default.getDeviceProductNameByTypeCode(this.Toilet.jmZtmxm);
      this.setData({
        deviceName: n
      })
    }
  },
  onHide: function() {
    console.log("------- 生命周期onHide -------"), this.data.currentPageIsOnTop && null != this.Toilet && this.Toilet.stopConnnect()
  },
  onUnload: function() {
    console.log("------- 主页生命周期页面卸载 -------"), s.off("event", this.customEventHandler), null != this.data.uiLockTimer && clearTimeout(this.data.uiLockTimer)
  },
  connectBleDevice: function() {
    this.data.isDeviceReady = !1;
    var e = this;
    this.bleConnectPopUp.show(), this.setData({
      connectState: 0
    }), o.checkBlePermision().then((function(t) {
      console.log(t), t.ok ? (e.setData({
        bleErrMsg: ""
      }), e.Toilet.startConnect((function(t, i) {
        t ? (console.log("------ 首页链接成功 -----"), e.onBleConnected()) : (e.bleConnectPopUp.isShow() || e.bleConnectPopUp.show(), e.onBleDisConnected(i))
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
        seatTempLevel: this.Toilet.seatTempLevel,
        bubble: 1 == this.Toilet.bubbleSwitch,
        bubbleOnDevice: 1 == this.Toilet.bubbleSwitch,
        toiletErrorCode: t,
        isNextBubbleEnable: this.Toilet.isBubbleEnable,
        bubbleDisableReason: this.Toilet.bubbleDisableReason,
        isCoverOn: 1 == this.Toilet.coverOn,
        isRingOn: 1 == this.Toilet.ringOn,
        isCoverRun: 1 == this.Toilet.coverRun,
        isRingRun: 1 == this.Toilet.ringRun
      }), this.setData({
        isDeviceReady: this.Toilet.isDeviceReady
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
  onClickBack: function(e) {
    l.setConnectUrl("")
  }
});