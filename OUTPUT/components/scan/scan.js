Component({
  properties: {
    hasDevice: {
      type: Boolean,
      value: "-"
    }
  },
  data: {
    hintMsg: ""
  },
  lifetimes: {
    attached: function() {
      var t = "";
      t = "android" === wx.getSystemInfoSync().platform.toLowerCase() ? "并确保手机位置服务和手机" : "并确保手机", this.setData({
        hintMsg: t
      })
    },
    detached: function() {}
  }
});