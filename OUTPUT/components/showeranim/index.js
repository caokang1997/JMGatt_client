var t, e = (t = require("lottie-miniprogram")) && t.__esModule ? t : {
  default: t
};
Component({
  properties: {},
  data: {
    lottieanim: null
  },
  lifetimes: {
    ready: function() {
      var t = this;
      wx.createSelectorQuery().in(this).select("#canvas").node((function(o) {
        var a = o.node,
          i = a.getContext("2d"),
          n = wx.getSystemInfoSync().pixelRatio;
        a.width = 200 * n, a.height = 320 * n, e.default.setup(a), t.data.lottieanim = e.default.loadAnimation({
          loop: !0,
          autoplay: !1,
          path: "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/shower3/data.json",
          rendererSettings: {
            context: i
          }
        })
      })).exec()
    }
  },
  methods: {
    stopAnim: function() {
      this.data.lottieanim && (console.log("暂停动画"), this.data.lottieanim.pause())
    },
    startAnim: function() {
      this.data.lottieanim && (console.log("开启动画"), this.data.lottieanim.play())
    }
  }
});