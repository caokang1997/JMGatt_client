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
    isShowState: {
      type: Boolean,
      value: !1
    },
    insufficientName: {
      type: String,
      value: "不足"
    }
  },
  data: {},
  computed: {
    showState: function(t) {
      return t.isShowState
    },
    imageIcon: function(t) {
      return "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/" + t.icon + ".png"
    }
  },
  methods: {
    onClickButton: function() {
      console.log("click Button");
      var t = !this.data.on;
      this.triggerEvent("onclick", {
        action: t
      })
    }
  }
});