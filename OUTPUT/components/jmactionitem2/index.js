var t = require("miniprogram-computed").behavior;
Component({
  behaviors: [t],
  properties: {
    anim: {
      type: Boolean,
      value: !0
    },
    title: {
      type: String,
      value: "-"
    },
    icon: {
      type: String,
      value: "ic_flush_large"
    },
    on: {
      type: Boolean,
      value: !1
    },
    enable: {
      type: Boolean,
      value: !0
    }
  },
  data: {
    info: "111",
    buttonAnimation: null
  },
  computed: {
    imageIcon: function(t) {
      return t.on ? "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/" + t.icon + "_on.png" : "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/" + t.icon + "_off.png"
    }
  },
  methods: {
    onClickButton: function() {
      var t = this;
      if (this.data.enable) {
        if (this.data.anim) {
          var n = wx.createAnimation({
            duration: 200,
            timingFunction: "ease"
          });
          n.scale(1.2).step(), this.setData({
            buttonAnimation: n.export()
          }), setTimeout((function() {
            n.scale(1).step(), t.setData({
              buttonAnimation: n.export()
            })
          }), 200)
        }
        console.log("click Button");
        var o = !this.data.on;
        this.triggerEvent("onclick", {
          action: o
        })
      } else this.triggerEvent("onclick", {
        action: o
      })
    }
  }
});