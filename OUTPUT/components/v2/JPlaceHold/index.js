Component({
  properties: {
    height: {
      type: Number,
      value: 0
    }
  },
  data: {
    statusBarHeight: wx.getStorageSync("statusBarHeight"),
    navigationBarHeight: wx.getStorageSync("navigationBarHeight"),
    menuButtonHeight: wx.getStorageSync("menuButtonHeight"),
    navigationBarAndStatusBarHeight: wx.getStorageSync("statusBarHeight") + wx.getStorageSync("navigationBarHeight")
  },
  lifetimes: {
    ready: function() {
      var t = this.data.statusBarHeight + this.data.navigationBarHeight + this.data.height;
      this.setData({
        navigationBarAndStatusBarHeight: t
      })
    }
  },
  methods: {}
});