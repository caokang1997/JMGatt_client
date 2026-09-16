var t = require("miniprogram-computed").behavior;
Component({
  behaviors: [t],
  properties: {
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
    },
    useCustomBack: {
      type: Boolean,
      value: !1
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
      var a = 2 * t.scrolltop / t.navigationBarAndStatusBarHeightValue;
      return a > 1 ? a = 1 : a < 0 && (a = 0), "rgba(255, 255, 255, " + a + ")"
    }
  },
  methods: {
    onBack: function() {
      console.log("--- 点击返回键 ---"), this.data.useCustomBack ? (console.log("--- 外部处理返回键 ---"), this.triggerEvent("onClickBack", {})) : (console.log("--- navbar内部处理返回键 ---"), this.data.backscan ? wx.redirectTo({
        url: "/pages/scan/scan"
      }) : wx.navigateBack(), this.triggerEvent("onClickBack", {}))
    }
  }
});