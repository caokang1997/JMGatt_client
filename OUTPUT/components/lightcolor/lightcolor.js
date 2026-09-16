Component({
  properties: {
    brightness: {
      type: Number,
      default: 1
    }
  },
  data: {},
  methods: {
    onBrightnessChange: function(e) {
      console.log("亮度变化", e.detail.value), this.triggerEvent("onBrightnessChange", {
        brightness: e.detail.value
      })
    },
    onColorTempChange: function(e) {
      console.log("色温变化", e.detail.value)
    },
    selectColor: function(e) {
      if (null != e.detail.rgb) {
        var t = e.detail.rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/),
          n = parseInt(t[1]),
          r = parseInt(t[2]),
          o = parseInt(t[3]);
        this.triggerEvent("onColorChange", {
          rgb: {
            r: n,
            g: r,
            b: o
          }
        })
      }
    }
  }
});