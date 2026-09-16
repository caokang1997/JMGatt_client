Component({
  properties: {
    step: {
      type: Number,
      value: 1
    },
    enable: {
      type: Boolean,
      value: !0
    },
    allTemp: {
      type: Boolean,
      value: !1
    }
  },
  data: {
    height: 612,
    xs: 0,
    min: 0,
    max: 6,
    paddingTop: 20,
    touched: !1,
    canvas: null,
    canvanImg: "",
    ctx: null
  },
  lifetimes: {
    ready: function() {
      this.data.xs = wx.getSystemInfoSync().windowWidth / 750;
      var t = this;
      wx.createSelectorQuery().in(this).select("#canvas2").fields({
        node: !0,
        size: !0
      }).exec((function(a) {
        t.startDraw(a)
      }))
    }
  },
  methods: {
    startDraw: function(t) {
      var a = this;
      if (console.log("-- 温度 --"), console.log(t), null != t[0]) {
        var e = t[0].width,
          i = t[0].height,
          s = t[0].node,
          d = s.getContext("2d"),
          o = wx.getSystemInfoSync().pixelRatio;
        s.width = e * o, s.height = i * o, d.scale(o, o);
        s.requestAnimationFrame((function t() {
          a.render(s, d, e, i), s.requestAnimationFrame(t)
        }))
      }
    },
    render: function(t, a, e, i) {
      a.clearRect(0, 0, e, i);
      e = this.data.touched ? 96 : 32;
      a.imageSmoothingEnabled = !0;
      i = this.data.height - this.data.paddingTop;
      var s = this.data.paddingTop;
      this.drawRect(a, "#181858", .15, 0, s, e, i, 16);
      var d = (this.data.height - this.data.paddingTop) / this.data.max;
      s = this.data.height - this.data.step * d, i = this.data.height - s;
      var o = 0 * this.data.xs,
        h = s * this.data.xs,
        n = 0 * this.data.xs,
        r = h + i * this.data.xs,
        l = t.getContext("2d").createLinearGradient(o, h, n, r);
      this.getLinearGradient(l, this.data.step), this.drawRect(a, l, 1, 0, s, e, i, 16);
      for (var c = 20 * this.data.xs, p = 24 * this.data.xs, u = 0; u < this.data.max; u++) {
        u + 1 == this.data.step ? (a.fillStyle = "#000000", a.font = "500 " + p + "px Arial") : this.data.allTemp || u + 1 == 1 || u + 1 == 3 || u + 1 == 5 ? (a.fillStyle = "#9E9EB0", a.font = c + "px Arial") : (a.fillStyle = "#D0D4E7", a.font = c + "px Arial");
        var x = this.getLevelByIndex(u),
          g = (d * (this.data.max - u - 1) + 1.5 * this.data.paddingTop) * this.data.xs,
          F = this.data.touched ? 60 : 20;
        a.fillText("--  " + x, F, g)
      }
    },
    getLevelByIndex: function(t) {
      switch (t) {
        case 0:
          return "常温";
        case 1:
          return "最低";
        case 2:
          return "偏低";
        case 3:
          return "标准";
        case 4:
          return "偏高";
        case 5:
          return "最高"
      }
      return ""
    },
    getLinearGradient: function(t, a) {
      switch (this.data.step) {
        case 1:
          t.addColorStop(0, "#FFFFFF"), t.addColorStop(1, "#F4F4F4");
          break;
        case 2:
          t.addColorStop(0, "#5CC3FF"), t.addColorStop(1, "#6C8AFF");
          break;
        case 3:
          t.addColorStop(0, "#77C6FF"), t.addColorStop(1, "#8A6AFF");
          break;
        case 4:
          t.addColorStop(0, "#FFE5A6"), t.addColorStop(1, "#FFA345");
          break;
        case 5:
          t.addColorStop(0, "#FFE37C"), t.addColorStop(1, "#FF666F");
          break;
        case 6:
        default:
          t.addColorStop(0, "#FF9BB6"), t.addColorStop(1, "#FF6351")
      }
    },
    drawRect: function(t, a, e, i, s, d, o, h) {
      var n = i * this.data.xs,
        r = s * this.data.xs,
        l = h * this.data.xs,
        c = d * this.data.xs,
        p = o * this.data.xs;
      t.fillStyle = a, t.globalAlpha = e, t.beginPath(), t.moveTo(n + l, r), t.lineTo(n + c - l, r), t.arcTo(n + c, r, n + c, r + l, l), t.lineTo(n + c, r + p - l), t.arcTo(n + c, r + p, n + c - l, r + p, l), t.lineTo(n + l, r + p), t.arcTo(n, r + p, n, r + p - l, l), t.lineTo(n, r + l), t.arcTo(n, r, n + l, r, l), t.closePath(), t.fill()
    },
    EventHandleStart: function(t) {
      this.data.enable && (this.setData({
        touched: !0
      }), this.triggerEvent("ontouch", {
        touched: !0
      }))
    },
    EventHandleMove: function(t) {
      if (this.data.enable) {
        var a = t.touches[0].y / this.data.xs,
          e = this.data.height / this.data.max,
          i = Number(((this.data.height - a) / e).toFixed(0));
        i < 1 ? i = 1 : i >= this.data.max && (i = this.data.max), i == this.data.step || !this.data.allTemp && 1 != i && 3 != i && 5 != i || (this.setData({
          step: i
        }), this.triggerEvent("onstep", {
          step: i
        }))
      }
    },
    EventHandle: function(t) {
      if (this.data.enable) {
        this.setData({
          touched: !1
        }), this.triggerEvent("ontouch", {
          touched: !1
        });
        var a = t.changedTouches[0].y / this.data.xs,
          e = this.data.height / this.data.max,
          i = Number(((this.data.height - a) / e).toFixed(0));
        i < 1 ? i = 1 : i >= this.data.max && (i = this.data.max), i == this.data.step || !this.data.allTemp && 1 != i && 3 != i && 5 != i || (this.setData({
          step: i
        }), this.triggerEvent("onstep", {
          step: i
        }))
      }
    }
  }
});