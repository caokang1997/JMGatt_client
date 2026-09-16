var e, t = require("miniprogram-computed").behavior;
Component({
  behaviors: [t],
  properties: {
    title: {
      type: String,
      value: "-"
    },
    value: {
      type: Number,
      value: 1,
      observer: function(e, t) {
        e != t && (console.log("值变化时执行这个函数", e, t), this.onDefaultValue(e))
      }
    },
    minvalue: {
      type: Number,
      value: 0
    },
    maxvalue: {
      type: Number,
      value: 100
    }
  },
  data: {
    buttonLeft: 0,
    progress: 0,
    precent: 0,
    sliderLeft: 0
  },
  lifetimes: {
    attached: function() {
      var e = this;
      wx.createSelectorQuery().in(this).select("#container").boundingClientRect((function(t) {
        console.log("----------- res ----------", t), null != t && (console.log(t.left), e.data.sliderLeft = t.left), console.log("滑块的默认值 = ", e.data.value), e.onDefaultValue(e.data.value)
      })).exec()
    },
    detached: function() {}
  },
  computed: {
    activeLineWidth: function(e) {
      return 2 * e.progress + 48
    },
    spotLeft: function(e) {
      return 2 * e.progress
    }
  },
  methods: {
    onDefaultValue: function(e) {
      var t, a = e;
      if (a > 255) a = 255, t = 231;
      else if (a < 0) t = 0;
      else {
        t = 231 * (1 * (a - this.data.minvalue) / (this.data.maxvalue - this.data.minvalue))
      }
      var n = parseInt(100 * (t / 231 * 1));
      this.setData({
        buttonLeft: t,
        progress: t,
        precent: n,
        value: a
      })
    },
    tapLine: function(e) {
      var t = e.touches[e.touches.length - 1].clientX - this.data.sliderLeft - 12;
      t > 231 && (t = 231), t < 0 && (t = 0);
      var a = t / 231 * 1,
        n = parseInt(100 * a),
        i = parseInt((this.data.maxvalue - this.data.minvalue) * a + this.data.minvalue);
      this.setData({
        buttonLeft: t,
        progress: t,
        precent: n,
        value: i
      }), this.triggerEvent("onchange", {
        value: i
      })
    },
    buttonStart: function(t) {
      e = t.touches[0]
    },
    moveTo: function(t) {
      var a = t.touches[t.touches.length - 1],
        n = a.clientX - e.clientX;
      e = a;
      var i = this.data.buttonLeft + n;
      i > 231 && (i = 231), i < 0 && (i = 0);
      var s = i / 231 * 1,
        u = parseInt(100 * s),
        o = parseInt((this.data.maxvalue - this.data.minvalue) * s + this.data.minvalue);
      this.setData({
        buttonLeft: i,
        progress: i,
        precent: u,
        value: o
      })
    },
    touchEnd: function(e) {
      console.log(this.data.value), this.triggerEvent("onchange", {
        value: this.data.value
      })
    }
  }
});