var e = require("miniprogram-computed").behavior;
Component({
  behaviors: [e],
  properties: {
    enable: {
      type: Boolean,
      value: !0,
      observer: function(e, t) {}
    },
    min: {
      type: Number,
      value: 0
    },
    max: {
      type: Number,
      value: 5
    },
    value: {
      type: Number,
      value: 0,
      observer: function(e) {}
    },
    title: {
      type: String,
      value: "幅度"
    },
    titles: {
      type: Array,
      value: []
    },
    unit: {
      type: String,
      value: ""
    }
  },
  data: {
    canvasContext: null,
    canvasWidth: 0,
    canvasHeight: 0,
    sliderWidth: 0
  },
  computed: {
    valueContent: function(e) {
      return "%" == e.unit || "℃" == e.unit ? e.value + e.unit : e.titles[e.value - e.min]
    },
    mainColor: function(e) {
      return e.enable, "#724FFD"
    },
    mainSliderWidth: function(e) {
      if (e.value < e.min) return console.log("========== 滑块故障 =========="), console.log("========== data.value ==========", e.value), console.log("========== data.min ==========", e.min), "width: calc(0% + 48rpx)";
      var t = 100 * (e.value - e.min) / (e.max - e.min),
        a = 48 * (1 - (e.value - e.min) / (e.max - e.min));
      return "width: calc(".concat(t, "% + ").concat(a, "rpx)")
    }
  },
  methods: {
    sliderchanging: function(e) {
      var t = e.detail.value;
      this.setData({
        value: t
      })
    },
    sliderchange: function(e) {
      var t = e.detail.value;
      this.setData({
        value: t
      }), this.triggerEvent("onchange", {
        value: t
      })
    },
    onUnableClick: function(e) {
      console.log("不可用点击");
      var t = this.data.value;
      this.triggerEvent("onchange", {
        value: t
      })
    },
    onClickItem: function(e) {
      if (this.data.enable) {
        var t = e.currentTarget.dataset.index + this.data.min;
        this.setData({
          value: t
        }), this.triggerEvent("onchange", {
          value: t
        })
      } else this.onUnableClick(e)
    }
  }
});