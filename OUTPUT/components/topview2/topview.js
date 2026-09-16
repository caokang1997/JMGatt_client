var t, e = require("../../@babel/runtime/helpers/defineProperty"),
  o = require("miniprogram-computed").behavior;
Component({
  behaviors: [o],
  properties: (t = {
    version2: {
      type: Boolean,
      value: !1
    },
    seatTempLevel: {
      type: Number,
      value: 3
    },
    isOnWorking: {
      type: Boolean,
      value: !1
    },
    workState: {
      type: String,
      value: "-"
    },
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
    }
  }, e(t, "seatTempLevel", {
    type: Number,
    value: 4
  }), e(t, "errorMsg", {
    type: String,
    value: "座温传感器故障，请及时处理"
  }), e(t, "errorCode", {
    type: Number,
    value: 0
  }), t),
  data: {
    currentIndex: 0,
    animationData: {},
    statusBarHeight: wx.getStorageSync("statusBarHeight") + "px",
    navigationBarHeight: wx.getStorageSync("navigationBarHeight") + "px",
    menuButtonHeight: wx.getStorageSync("menuButtonHeight") + "px",
    navigationBarAndStatusBarHeight: wx.getStorageSync("statusBarHeight") + wx.getStorageSync("navigationBarHeight") + "px"
  },
  computed: {
    toiletPhoto: function(t) {
      return 0 == t.seatTempLevel ? ["https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_side.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_front.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_top_view.png"] : 1 == t.seatTempLevel ? ["https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_side_1.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_front.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_top_view.png"] : 2 == t.seatTempLevel ? ["https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_side_2.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_front.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_top_view.png"] : 3 == t.seatTempLevel ? ["https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_side_3.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_front.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_top_view.png"] : 4 == t.seatTempLevel ? ["https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_side_4.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_front.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_top_view.png"] : 5 == t.seatTempLevel ? ["https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_side_5.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_front.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_top_view.png"] : ["https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_side.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_front.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_top_view.png"]
    },
    workIcon: function(t) {
      return "大冲中" == t.workState ? "ic_flush_large" : "小冲中" == t.workState ? "ic_flush_small" : "ic_flush_bubble"
    },
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
    },
    onClickCustomSetting: function(t) {
      this.triggerEvent("onclickcustomsetting")
    }
  }
});