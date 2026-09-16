var e = require("miniprogram-computed").behavior;
Component({
  behaviors: [e],
  properties: {
    speed: {
      type: Number,
      default: 1
    },
    brightness: {
      type: Number,
      default: 1
    },
    mode: {
      type: Number,
      default: 1
    }
  },
  computed: {
    showSpeedBrightness: function(e) {
      return e.mode >= 6 && e.mode <= 9
    }
  },
  data: {
    musicModes: [{
      mode: 0,
      title: "回家模式",
      url: "http://qiniu.labsci.top/jomoo/exhibition/ic_gohome.png"
    }, {
      mode: 1,
      title: "离家模式",
      url: "http://qiniu.labsci.top/jomoo/exhibition/ic_awayhome.png"
    }, {
      mode: 2,
      title: "流光溢彩",
      url: "http://qiniu.labsci.top/jomoo/exhibition/ic_device_light.png"
    }]
  },
  methods: {
    onModelick: function(e) {
      var t = e.currentTarget.dataset.mode;
      console.log("模式 = ", t), this.setData({
        mode: t
      }), this.triggerEvent("onModeChange", {
        mode: t
      })
    },
    onBrightnessChange: function(e) {
      console.log("亮度变化", e.detail.value), this.triggerEvent("onBrightnessChange", {
        brightness: e.detail.value
      })
    },
    onSpeedChange: function(e) {
      console.log("速度变化", e.detail.value), this.triggerEvent("onSpeedChange", {
        speed: e.detail.value
      })
    }
  }
});