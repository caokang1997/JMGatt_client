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
      return e.mode >= 1 && e.mode <= 5
    }
  },
  data: {
    musicModes: [{
      mode: 1,
      title: "流光模式",
      url: "http://qiniu.labsci.top/bg_music_mode_0.png"
    }, {
      mode: 2,
      title: "幻彩模式",
      url: "http://qiniu.labsci.top/bg_music_mode_2.png"
    }, {
      mode: 3,
      title: "跳动模式",
      url: "http://qiniu.labsci.top/bg_music_mode_1.png"
    }, {
      mode: 4,
      title: "聚会模式",
      url: "http://qiniu.labsci.top/bg_music_mode_3.png"
    }, {
      mode: 5,
      title: "白光模式",
      url: "http://qiniu.labsci.top/bg_light_mode_4.png"
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