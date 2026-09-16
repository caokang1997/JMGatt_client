var e = require("../../../utils/bluetooth/bleutil.js");
Component({
  appOnShow: !1,
  options: {
    multipleSlots: !0
  },
  properties: {
    dragFullScreen: {
      type: Boolean,
      value: !1
    },
    scrollTop: {
      type: Number,
      value: 0
    },
    backScan: {
      type: Boolean,
      value: !1
    },
    titleInCenter: {
      type: Boolean,
      value: !0
    },
    withback: {
      type: Boolean,
      value: !0
    },
    showDialogOnDisconnected: {
      type: Boolean,
      value: !0
    },
    enableAutoDisconnect: {
      type: Boolean,
      value: !0
    },
    title: {
      type: String,
      value: ""
    },
    bgUrl: {
      type: String,
      value: "jd176s/bg_bathheater_top.png",
      observer: function(e, n) {
        0 != e.length ? this.setData({
          showBg: !0
        }) : this.setData({
          showBg: !1
        })
      }
    },
    bgUrlHeight: {
      type: Number,
      value: "868"
    },
    mainTop: {
      type: Number,
      value: "760"
    },
    productPhotoUrl: {
      type: String,
      value: "jd176s/ic_product.png",
      observer: function(e, n) {
        0 != e.length ? this.setData({
          showProduct: !0
        }) : this.setData({
          showProduct: !1
        })
      }
    }
  },
  pageLifetimes: {
    show: function() {
      console.log("页面显示,组件可能可见"), this.onShow()
    },
    hide: function() {
      console.log("页面隐藏,组件不可见")
    }
  },
  lifetimes: {
    created: function() {
      console.log("-- 组件create --"), this.bleConnectPopUp = this.selectComponent("#connect-dialog")
    },
    ready: function() {
      console.log("-- 组件ready --")
    },
    attached: function() {
      this.listenAppShowEvent()
    },
    detached: function() {
      wx.offAppShow((function(e) {})), wx.onAppHide((function(e) {}))
    }
  },
  data: {
    showBg: !0,
    showProduct: !0,
    connectState: 0
  },
  methods: {
    setDevice: function(e) {
      console.log("-- 更新设备 --"), this.Device = e
    },
    listenAppShowEvent: function() {
      var e = this;
      this.appOnShow = !0, wx.onAppShow((function(n) {
        console.log("组件 app可见"), e.appOnShow = !0
      })), wx.onAppHide((function(n) {
        console.log("组件 app不可见"), e.appOnShow = !1, e.data.enableAutoDisconnect && null != e.Device && e.Device.stopConnnect()
      }))
    },
    onShow: function() {
      console.log("组件 onShow"), this.appOnShow && (null == this.Device || this.Device.isConnected || this.connectBleDevice())
    },
    onHide: function() {},
    startConnect: function() {
      this.connectBleDevice()
    },
    disConnect: function() {
      null != this.Device && this.Device.stopConnnect()
    },
    connectBleDevice: function() {
      if (null != this.Device) {
        var n = this;
        this.bleConnectPopUp.show(), this.setData({
          connectState: 0
        }), e.checkBlePermision().then((function(e) {
          console.log(e), e.ok ? (n.setData({
            bleErrMsg: ""
          }), n.Device.startConnect((function(e, t) {
            e ? (console.log("------ 首页链接成功 -----"), n.onBleConnected()) : (n.bleConnectPopUp.isShow() || n.bleConnectPopUp.show(), n.onBleDisConnected(t))
          }), (function(e) {}))) : n.setData({
            bleErrMsg: e.errMsg,
            connectState: 2
          })
        }))
      }
    },
    onBleConnected: function() {
      var e = this;
      this.triggerEvent("onBleConnected", {}), this.isDeviceConnected = !0, this.setData({
        connectState: 1
      });
      var n = setTimeout((function() {
        e.bleConnectPopUp.hide(), clearInterval(n)
      }), 1e3)
    },
    onBleDisConnected: function(e) {
      this.triggerEvent("onBleDisConnected", {}), this.data.showDialogOnDisconnected ? this.bleConnectPopUp.isShow() || this.bleConnectPopUp.show() : this.bleConnectPopUp.isShow() && this.bleConnectPopUp.hide(), console.log("---- 连接失败了 ----"), this.setData({
        connectState: 2
      })
    },
    onClickReconnect: function() {
      console.log("--点击重新连接--"), this.connectBleDevice()
    },
    onClickCancelConnect: function() {
      if (this.bleConnectPopUp.hide(), this.data.backScan) return this.triggerEvent("onBackScan"), void wx.redirectTo({
        url: "/pages/scan/scan"
      });
      wx.navigateBack()
    },
    onBackScan: function(e) {
      this.triggerEvent("onBackScan")
    },
    handleScroll: function(e) {
      this.data.dragFullScreen && this.setData({
        scrollTop: e.detail.scrollTop
      })
    }
  }
});