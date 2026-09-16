var t = require("miniprogram-computed").behavior;
Component({
  behaviors: [t],
  properties: {
    model: {
      type: String,
      value: "zq6440"
    },
    allTemp: {
      type: Boolean,
      value: !1
    },
    enable: {
      type: Boolean,
      value: !0
    },
    seatTempLevel: {
      type: Number,
      value: 4
    },
    errorMsg: {
      type: String,
      value: "座温传感器故障，请及时处理"
    },
    errorCode: {
      type: Number,
      value: 0
    }
  },
  data: {
    animationData: {},
    statusBarHeight: wx.getStorageSync("statusBarHeight") + "px",
    navigationBarHeight: wx.getStorageSync("navigationBarHeight") + "px",
    menuButtonHeight: wx.getStorageSync("menuButtonHeight") + "px",
    navigationBarAndStatusBarHeight: wx.getStorageSync("statusBarHeight") + wx.getStorageSync("navigationBarHeight") + "px"
  },
  computed: {
    showError: function(t) {
      return t.errorCode > 0
    },
    toiletSeatIcon: function(t) {
      return "ic_step_".concat(t.seatTempLevel)
    },
    bgIcon: function(t) {
      return "bg_step_".concat(t.seatTempLevel)
    },
    tempState: function(t) {
      switch (t.seatTempLevel) {
        case 0:
          return "常温";
        case 1:
          return "最低";
        case 2:
          return "偏低";
        case 3:
          return "标准";
        case 4:
          return "偏高";
        case 5:
        default:
          return "最高"
      }
    }
  },
  lifetimes: {
    attached: function() {
      var t = wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 500,
        timingFunction: "ease"
      });
      this.animation = t
    },
    detached: function() {}
  },
  methods: {
    onTempSelected: function(t) {
      this.triggerEvent("onstep", {
        step: t.detail.step
      }), this.setData({
        seatTempLevel: t.detail.step - 1
      })
    },
    onTouchTemp: function(t) {
      t.detail.touched ? (this.animation.scale(.8, .8).step(), this.setData({
        animationData: this.animation.export()
      })) : (this.animation.scale(1, 1).step(), this.setData({
        animationData: this.animation.export()
      }))
    },
    onClickErrorBar: function(t) {
      this.triggerEvent("onclickerrorbar")
    }
  }
});