var t = require("miniprogram-computed").behavior;
Component({
  behaviors: [t],
  properties: {
    title: {
      type: String,
      value: "-"
    },
    content: {
      type: String,
      value: "-"
    },
    icon: {
      type: String,
      value: "jd176s/ic_nightlight"
    },
    enable: {
      type: Boolean,
      value: !0
    },
    insufficient: {
      type: Boolean,
      value: !1
    },
    buttonText: {
      type: String,
      value: "",
      observer: function(t, n) {
        var o = t.length > 0;
        this.setData({
          showButton: o
        })
      }
    }
  },
  data: {
    showButton: !1
  },
  computed: {
    showState: function(t) {
      return "阻垢滤芯" == t.title
    },
    imageIcon: function(t) {
      return "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/" + t.icon + ".png"
    }
  },
  methods: {
    onClickBar: function() {
      this.data.showButton || this.onClickButton()
    },
    onClickButton: function() {
      console.log("click Button");
      var t = !this.data.on;
      this.triggerEvent("onclick", {
        action: t
      })
    }
  }
});