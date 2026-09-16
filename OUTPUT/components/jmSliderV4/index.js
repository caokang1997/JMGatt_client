var e = require("miniprogram-computed").behavior;
Component({
  behaviors: [e],
  properties: {
    enable: {
      type: Boolean,
      value: !0,
      observer: function(e, a) {}
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
      value: ["常温", "最低", "偏低", "标准", "偏高", "最高"]
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
      var a = e.titles || [];
      return 0 === a.length ? "" : a[Math.max(0, Math.min(e.value - e.min, a.length - 1))]
    },
    mainColor: function(e) {
      return e.enable, "#724FFD"
    },
    mainSliderWidth: function(e) {
      if (e.value < e.min) return console.log("========== 滑块故障 =========="), console.log("========== data.value ==========", e.value), console.log("========== data.min ==========", e.min), "width: calc(0% + 48rpx)";
      if (e.value > e.max) return console.log("========== 滑块越界(>max) ==========", e.value, e.max), "width: calc(100% + 0rpx)";
      var a = 100 * (e.value - e.min) / (e.max - e.min),
        t = 48 * (1 - (e.value - e.min) / (e.max - e.min));
      return "width: calc(".concat(a, "% + ").concat(t, "rpx)")
    }
  },
  methods: {
    sliderchanging: function(e) {
      var a = e.detail.value;
      this.setData({
        value: a
      })
    },
    sliderchange: function(e) {
      var a = e.detail.value;
      this.setData({
        value: a
      }), this.triggerEvent("onchange", {
        value: a
      })
    },
    onUnableClick: function(e) {
      console.log("不可用点击");
      var a = this.data.value;
      this.triggerEvent("onchange", {
        value: a
      })
    },
    onClickItem: function(e) {
      if (this.data.enable) {
        var a = e.currentTarget.dataset.index + this.data.min;
        this.setData({
          value: a
        }), this.triggerEvent("onchange", {
          value: a
        })
      } else this.onUnableClick(e)
    }
  }
});