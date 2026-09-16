var e = require("miniprogram-computed").behavior;
Component({
  behaviors: [e],
  properties: {
    model: {
      type: String,
      value: "",
      observer: "modelChanged"
    },
    title: {
      type: String,
      value: "-"
    },
    content: {
      type: String,
      value: "-"
    },
    rssi: {
      type: Number,
      value: 0
    }
  },
  computed: {
    rssiImageIcon: function(e) {
      return e.rssi > -65 ? "/image/ic_level_3.png" : e.rssi > -75 ? "/image/ic_level_2.png" : "/image/ic_level_1.png"
    }
  },
  data: {
    avatar: "/image/default.png"
  },
  methods: {
    modelChanged: function(e) {
      var t = "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/".concat(e, "/product.png");
      console.log("url =", t), this.setData({
        avatar: t
      })
    },
    imageLoadError: function() {
      this.setData({
        avatar: "/image/default.png"
      })
    }
  }
});