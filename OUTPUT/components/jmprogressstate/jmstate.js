var e = require("miniprogram-computed").behavior;
Component({
  behaviors: [e],
  properties: {
    centerValue: {
      type: String,
      value: "18:36"
    },
    topTitle: {
      type: String,
      value: "杀菌中"
    },
    viewHeight: {
      type: Number,
      value: 520
    },
    labels: {
      type: Array,
      value: ["清洗阶段", "暖风阶段"],
      observer: function(e, t) {
        this.increaseProgress()
      }
    },
    progress: {
      type: Number,
      value: 60,
      observer: function(e, t) {
        console.log("重绘圆环进度 newVla = " + e + "; oldVal = " + t), this.data.progress = e, this.data.ctx && this.drawProgress()
      }
    }
  },
  lifetimes: {
    created: function() {
      console.log("created 执行")
    },
    attached: function() {
      console.log("attached 执行")
    },
    ready: function() {
      console.log("ready 执行");
      var e = this;
      console.log("lifetime"), wx.createSelectorQuery().in(this).select("#myCanvas").fields({
        node: !0,
        size: !0
      }).exec((function(t) {
        if (null != t[0]) {
          console.log(t);
          var o = t[0].node;
          e.data.ctx = o.getContext("2d"), e.data.dpr = wx.getSystemInfoSync().pixelRatio, console.log("dpr = " + e.data.dpr), o.width = e.getDpSize(480), o.height = e.getDpSize(480), console.log("canvas.width = " + o.width), console.log("canvas.height = " + o.height), e.drawProgress()
        }
      }))
    }
  },
  data: {
    ctx: null,
    colors: ["#8357FD", "#CEBDFF"],
    dpr: 1
  },
  methods: {
    drawProgress: function() {
      var e = this;
      console.log("开始绘制进度环");
      var t = this.data.ctx;
      console.log("ctx = " + t);
      var o = this.getDpSize(240),
        r = this.getDpSize(240),
        a = this.getDpSize(220),
        s = this.getDpSize(40);
      console.log("centerX = " + o), console.log("centerY = " + r), t.clearRect(0, 0, t.canvas.width, t.canvas.height), t.save(), t.translate(o, r), t.rotate(135 * Math.PI / 180), t.beginPath(), t.strokeStyle = "rgba(0,44,86,0.13)", t.lineWidth = s, t.lineCap = "round";
      var i = 0 + 3 * Math.PI / 2 * 1;
      t.arc(0, 0, a, 0, i, !1), t.stroke(), t.beginPath();
      var n = t.createLinearGradient(0, 0, 300, 0);
      this.data.colors.forEach((function(t, o) {
        n.addColorStop(o / (e.data.colors.length - 1), t)
      })), t.strokeStyle = n, t.lineWidth = s, t.lineCap = "round", console.log("绘制进度:progress = " + this.data.progress);
      var l = 0 + this.data.progress / 100 * (3 * Math.PI / 2);
      t.arc(0, 0, a, 0, l, !1), t.stroke(), this.drawDashedLinesToCenter(t, 0, 0, this.getDpSize(194), 4, 8, 40, 0, 280), t.restore()
    },
    drawDashedLinesToCenter: function(e, t, o, r, a, s, i) {
      var n = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : 0,
        l = arguments.length > 8 && void 0 !== arguments[8] ? arguments[8] : 360;
      e.strokeStyle = "#8B62FD", e.lineWidth = a;
      for (var c = l - n, h = Math.floor(c / s), g = 0; g < h; g++) {
        var d = n + g * s,
          p = d * (Math.PI / 180),
          u = t + r * Math.cos(p),
          v = o + r * Math.sin(p),
          f = t - u,
          m = o - v,
          S = i / r,
          w = u + f * S,
          y = v + m * S;
        e.beginPath(), e.moveTo(u, v), e.lineTo(w, y), e.stroke()
      }
    },
    formatMyTime: function(e) {
      var t = e / 60,
        o = e % 60,
        r = "";
      return r = t < 10 ? "0" + t : "" + t, r += o < 10 ? "0" + o : "" + o, console.log("剩余时间：" + r), r
    },
    animateProgress: function(e) {
      var t = this,
        o = Date.now(),
        r = this.data.progress;
      ! function a() {
        var s = Date.now(),
          i = Math.min((s - o) / 1e3, 1),
          n = r + (e - r) * i;
        t.setData({
          progress: Math.round(n)
        }), t.drawProgress(), i < 1 && requestAnimationFrame(a)
      }()
    },
    increaseProgress: function() {
      this.data.progress < 100 && this.animateProgress(this.data.progress + 10)
    },
    getDpSize: function(e) {
      return 2 * e
    }
  }
});