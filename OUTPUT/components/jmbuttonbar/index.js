var o = require("miniprogram-computed").behavior;
Component({
  behaviors: [o],
  properties: {
    showContent: {
      type: Boolean,
      value: !0
    },
    title: {
      type: String,
      value: "-"
    },
    icon: {
      type: String,
      value: "jd176s/ic_nightlight"
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
    info: "111"
  },
  computed: {
    imageIcon: function(o) {
      return o.on ? "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/" + o.icon + "_on.png" : "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/" + o.icon + "_off.png"
    }
  },
  methods: {
    onClickButton: function() {
      console.log("click Button");
      var o = !this.data.on;
      this.triggerEvent("onclick", {
        action: o
      })
    }
  }
});