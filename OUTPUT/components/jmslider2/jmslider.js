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
    valueTitles: ["常温", "最低", "偏低", "标准", "偏高", "最高"],
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
    showValueTitle: function(e) {
      return e.valueTitles[e.value - 1]
    },
    activeLineWidth: function(e) {
      return 2 * e.progress + 48
    },
    spotLeft: function(e) {
      return 2 * e.progress
    }
  },
  methods: {
    onDefaultValue: function(e) {
      var t;
      console.log("onDefaultValue");
      var a = e;
      if (a > 255) a = 255, t = 231;
      else if (a < 0) t = 0;
      else {
        t = 231 * (1 * (a - this.data.minvalue) / (this.data.maxvalue - this.data.minvalue))
      }
      var o = parseInt(100 * (t / 231 * 1));
      this.setData({
        buttonLeft: t,
        progress: t,
        precent: o,
        value: a
      })
    },
    tapLine: function(e) {
      console.log("tapLine");
      var t = e.touches[e.touches.length - 1].clientX - this.data.sliderLeft - 12;
      t > 231 && (t = 231), t < 0 && (t = 0);
      var a = t / 231 * 1,
        o = parseInt(100 * a),
        n = parseInt((this.data.maxvalue - this.data.minvalue) * a + this.data.minvalue);
      this.setData({
        buttonLeft: t,
        progress: t,
        precent: o,
        value: n
      }), this.triggerEvent("onchange", {
        value: n
      })
    },
    buttonStart: function(t) {
      console.log("buttonStart"), e = t.touches[0]
    },
    moveTo: function(t) {
      var a = t.touches[t.touches.length - 1],
        o = a.clientX - e.clientX;
      e = a;
      var n = this.data.buttonLeft + o;
      n > 231 && (n = 231), n < 0 && (n = 0);
      var l = n / 231 * 1,
        u = parseInt(100 * l),
        s = parseInt((this.data.maxvalue - this.data.minvalue) * l + this.data.minvalue);
      console.log("moveto buttonLeft = ", n), console.log("moveto precent = ", u), console.log("moveto value = ", s), this.setData({
        buttonLeft: n,
        progress: n,
        precent: u,
        value: s
      })
    },
    touchEnd: function(e) {
      console.log("touchEnd"), console.log(this.data.value), this.triggerEvent("onchange", {
        value: this.data.value
      })
    }
  }
});