var e = require("../../../utils/bluetooth/bleutil.js"),
  t = getApp();
Page({
  data: {
    openByNFC: !1,
    openLight: !1,
    tabIndex: 0,
    scene: "goHomeScene",
    bleConnectPopUp: null,
    scrollTop: 2,
    connectState: 1,
    Device: null
  },
  onLoad: function(e) {
    console.log("options=", e), this.data.openByNFC = !0;
    var o = e.scene;
    this.data.scene = o, "goHomeScene" == o ? this.startGoHomeScene() : "awayHomeScene" == o && this.startAwayHomeScene();
    var n = e.mac;
    this.bleConnectPopUp = this.selectComponent("#dialog"), this.Device = t.getLightController(), this.Device.mac = n
  },
  onShow: function() {
    this.connectBleDevice()
  },
  onHide: function() {
    console.log("------- 主页生命周期页面卸载 -------"), this.Device.stopConnnect()
  },
  startAwayHomeScene: function() {
    console.log("启动离家场景");
    this.startScene([{
      iotId: "JOqjtlhD5JwIu64KYzaG000000",
      params: {
        illumination: 0
      }
    }, {
      iotId: "hBkS6YS8pTwrcZv8Z60M000000",
      params: {
        illumination: 0,
        mode: 332
      }
    }, {
      iotId: "JOqjtlhD5JwIu64KYzaG000000",
      params: {
        motorControl: 1
      }
    }, {
      iotId: "aZX0CxWzAWK3KXp3ppTi000000",
      params: {
        powerstate: 0
      }
    }, {
      iotId: "m8VEYfwM5xKfWsG6Kv7f000000",
      params: {
        CoverPlateStatus: 0
      }
    }]).then((function(e) {
      200 != e.data.code || wx.showToast({
        title: "场景执行成功",
        icon: "success"
      })
    })).catch((function(e) {
      wx.showToast({
        title: "场景执行失败",
        icon: "error"
      })
    }))
  },
  startGoHomeScene: function() {
    console.log("启动回家场景");
    this.startScene([{
      iotId: "JOqjtlhD5JwIu64KYzaG000000",
      params: {
        illumination: 1
      }
    }, {
      iotId: "hBkS6YS8pTwrcZv8Z60M000000",
      params: {
        illumination: 1,
        mode: 356
      }
    }, {
      iotId: "JOqjtlhD5JwIu64KYzaG000000",
      params: {
        motorControl: 2
      }
    }, {
      iotId: "aZX0CxWzAWK3KXp3ppTi000000",
      params: {
        powerstate: 1
      }
    }, {
      iotId: "m8VEYfwM5xKfWsG6Kv7f000000",
      params: {
        CoverPlateStatus: 1
      }
    }]).then((function(e) {
      200 != e.data.code || wx.showToast({
        title: "场景执行成功",
        icon: "success"
      })
    })).catch((function(e) {
      wx.showToast({
        title: "场景执行失败",
        icon: "error"
      })
    }))
  },
  startScene: function(e) {
    return new Promise((function(t, o) {
      wx.request({
        url: "https://myiot.jomoo.com.cn/appbackends/scenelink/execSceneLink",
        data: e,
        method: "POST",
        success: function(e) {
          200 == e.data.code ? t(e) : o(e)
        },
        fail: function(e) {
          o(e)
        }
      })
    }))
  },
  onClickOpenLight: function() {
    console.log("开灯"), this.data.openLight = !0, this.Device.openLight(!0)
  },
  onClickCloseLight: function() {
    console.log("关灯"), this.data.openLight = !1, this.Device.openLight(!1)
  },
  connectBleDevice: function() {
    var t = this;
    this.bleConnectPopUp.show(), this.setData({
      connectState: 0
    }), e.checkBlePermision().then((function(e) {
      console.log(e), e.ok ? (t.setData({
        bleErrMsg: ""
      }), t.Device.startConnect((function(e, o) {
        e ? (console.log("------ 首页链接成功 -----"), t.onBleConnected()) : (t.bleConnectPopUp.isShow() || t.bleConnectPopUp.show(), t.onBleDisConnected(o))
      }), (function(e) {
        t.onMsgValueChange(e)
      }))) : t.setData({
        bleErrMsg: e.errMsg,
        connectState: 2
      })
    }))
  },
  onBleConnected: function() {
    var e = this;
    this.isDeviceConnected = !0, console.log("---- 连接成功了 ----"), this.setData({
      connectState: 1
    });
    var t = this;
    if (this.data.openByNFC) {
      this.data.openByNFC = !1;
      var o = setTimeout((function() {
        t.bleConnectPopUp.hide();
        var n = t.data.scene;
        "goHomeScene" == n ? (console.log("---- 开灯 ----"), e.data.openLight = !0, t.Device.openLight(!0)) : "awayHomeScene" == n && (console.log("---- 关灯 ----"), e.data.openLight = !1, t.Device.openLight(!1)), clearInterval(o)
      }), 1e3)
    }
  },
  onBleDisConnected: function(e) {
    this.bleConnectPopUp.isShow() || this.bleConnectPopUp.show(), console.log("---- 连接失败了 ----"), this.setData({
      connectState: 2
    })
  },
  onMsgValueChange: function(e) {},
  onClickReconnect: function() {
    console.log("--点击重新连接--"), this.connectBleDevice()
  },
  onClickCancelConnect: function() {
    this.bleConnectPopUp.hide(), wx.exitMiniProgram()
  },
  onTabSelected: function(e) {
    this.setData({
      tabIndex: e.detail.index
    })
  },
  onModeChange: function(e) {
    var t = e.detail.mode;
    console.log("模式切换", t), 0 == t ? (this.startGoHomeScene(), this.Device.openLight(!0), wx.showToast({
      title: "启动回家模式",
      icon: "success"
    })) : 1 == t ? (this.startAwayHomeScene(), this.Device.openLight(!1), wx.showToast({
      title: "启动离家模式",
      icon: "success"
    })) : 2 == t && (this.data.openLight = !this.data.openLight, this.Device.openLight(this.data.openLight), wx.showToast({
      title: this.data.openLight ? "开启流光溢彩模式" : "关闭流光溢彩模式",
      icon: "success"
    }))
  },
  swiperChange: function(e) {
    var t = e.detail.current;
    console.log("current = ", t), this.setData({
      tabIndex: t
    })
  }
});