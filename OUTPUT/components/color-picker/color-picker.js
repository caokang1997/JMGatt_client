var t = require("../color-picker/utils/util.js"),
  e = require("miniprogram-computed").behavior;
Component({
  behaviors: [e],
  properties: {
    size: {
      type: Number,
      value: 310
    },
    left: {
      type: Number,
      value: 0
    },
    top: {
      type: Number,
      value: 0
    },
    brightness: {
      type: Number,
      value: 255
    }
  },
  lifetimes: {
    attached: function() {
      this.initSpot()
    }
  },
  data: {
    scale: wx.getSystemInfoSync().screenWidth / 750,
    rgb: "rgb(255,255,255);",
    leftValue: 0,
    topValue: 0
  },
  computed: {
    spotLeft: function(t) {
      return t.leftValue
    },
    spotTop: function(t) {
      return t.topValue
    }
  },
  methods: {
    initSpot: function() {
      var e = 310 - this.data.top - 14,
        a = ((5 * Math.PI / 2 - Math.atan2(0, 0)) % (2 * Math.PI) * 180 / Math.PI).toFixed(0),
        i = (Math.sqrt(Math.pow(0, 2) + Math.pow(0, 2)) / 50 * 255).toFixed(0);
      0 == i ? i = 1 : i > 255 && (i = 255);
      var r = t.hsv2rgb(a, i, this.data.brightness);
      this.triggerEvent("selectColor", {
        h: a,
        s: i,
        v: this.data.brightness,
        rgb: r
      }), this.setData({
        rgb: r,
        leftValue: 310,
        topValue: e
      })
    },
    _selectColor: function(e) {
      console.log(e);
      var a = e.currentTarget,
        i = 2 * (e.detail.x - a.offsetLeft - 19),
        r = 2 * (e.detail.y - a.offsetTop - 19),
        o = this.data.size,
        s = ((e.detail.x - a.offsetLeft - 14) * (100 / o)).toFixed(0) - 50,
        h = -(((e.detail.y - a.offsetTop - 14) * (100 / o)).toFixed(0) - 50),
        l = ((5 * Math.PI / 2 - Math.atan2(h, s)) % (2 * Math.PI) * 180 / Math.PI).toFixed(0),
        n = (Math.sqrt(Math.pow(s, 2) + Math.pow(h, 2)) / 50 * 255).toFixed(0);
      0 == n ? n = 1 : n > 255 && (n = 255);
      var u = t.hsv2rgb(l, n, this.data.brightness);
      this.triggerEvent("selectColor", {
        h: l,
        s: n,
        v: this.data.brightness,
        rgb: u
      }), this.setData({
        rgb: u,
        leftValue: i,
        topValue: r
      })
    },
    rpx2px: function(t) {
      return t * this.data.scale
    }
  }
});