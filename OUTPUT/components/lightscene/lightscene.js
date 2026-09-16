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
      mode: 6,
      title: "放松舒缓",
      url: "http://qiniu.labsci.top/bg_light_mode_2.png"
    }, {
      mode: 7,
      title: "幻彩水流",
      url: "http://qiniu.labsci.top/bg_light_mode_0.png"
    }, {
      mode: 8,
      title: "呼吸冥想",
      url: "http://qiniu.labsci.top/bg_light_mode_1.png"
    }, {
      mode: 9,
      title: "欢快跳跃",
      url: "http://qiniu.labsci.top/bg_light_mode_3.png"
    }]
  },
  methods: {
    onModelick: function(e) {
      var t = e.currentTarget.dataset.mode;
      console.log("模式 = ", t), this.data.mode == t ? (this.setData({
        mode: 0
      }), this.triggerEvent("onModeChange", {
        mode: 0
      })) : (this.setData({
        mode: t
      }), this.triggerEvent("onModeChange", {
        mode: t
      }))
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