var t = require("miniprogram-computed").behavior;
Component({
  behaviors: [t],
  properties: {
    titleInCenter: {
      type: Boolean,
      value: !0
    },
    backscan: {
      type: Boolean,
      value: !1
    },
    color: {
      type: String,
      value: null
    },
    withback: {
      type: Boolean,
      value: !1
    },
    title: {
      type: String,
      value: "-"
    },
    scrolltop: {
      type: Number,
      value: 1
    }
  },
  data: {
    statusBarHeight: wx.getStorageSync("statusBarHeight") + "px",
    navigationBarHeight: wx.getStorageSync("navigationBarHeight") + "px",
    menuButtonHeight: wx.getStorageSync("menuButtonHeight") + "px",
    navigationBarAndStatusBarHeight: wx.getStorageSync("statusBarHeight") + wx.getStorageSync("navigationBarHeight") + "px",
    navigationBarAndStatusBarHeightValue: wx.getStorageSync("statusBarHeight") + wx.getStorageSync("navigationBarHeight")
  },
  computed: {
    navBarColor: function(t) {
      if (null != t.color) return t.color;
      var a = 1 * t.scrolltop / t.navigationBarAndStatusBarHeightValue;
      return a > 1 ? a = 1 : a < 0 && (a = 0), "rgba(255, 255, 255, " + a + ")"
    }
  },
  methods: {
    onBack: function() {
      console.log("--- 点击返回键 ---"), this.data.backscan ? (this.triggerEvent("onBackScan"), wx.redirectTo({
        url: "/pages/scan/scan"
      })) : wx.navigateBack()
    }
  }
});