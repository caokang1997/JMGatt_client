var a = require("miniprogram-computed").behavior;
Component({
  dpr: 2,
  MAX_ANGLE: 150,
  behaviors: [a],
  properties: {
    title: {
      type: String,
      value: "title"
    },
    rangingAngle: {
      type: Number,
      value: 120,
      observer: function(a, t) {
        this.setData({
          startAngle: (180 - a * this.data.ANGLE_SCALE) / 360 * Math.PI
        }), this.setData({
          endAngle: this.data.startAngle + a * this.data.ANGLE_SCALE / 360 * 2 * Math.PI
        }), this.startDraw(), this.startDraw1()
      }
    },
    rangingDistance: {
      type: Number,
      value: 60,
      observer: function(a, t) {
        this.setData({
          targetDistance: this.data.arcRatius * this.data.MIN_DISTANCE / 100 + this.data.arcRatius * (100 - this.data.MIN_DISTANCE) / 100 * a / 100
        }), this.startDraw(), this.startDraw1()
      }
    },
    settingDistance: {
      type: Number,
      value: 60,
      observer: function(a, t) {
        this.startDraw(), this.startDraw1()
      }
    },
    hasHuman: {
      type: Boolean,
      value: !0,
      observer: function(a, t) {
        this.startDraw(), this.startDraw1()
      }
    },
    isQuickMode: {
      type: Boolean,
      value: !1,
      observer: function(a, t) {
        this.startDraw(), this.startDraw1()
      }
    }
  },
  data: {
    ctx: null,
    ctx1: null,
    screenWidth: 600,
    DRAW_WIDTH: 600,
    DRAW_HEIGHT: 400,
    ANGLE_SCALE: 1,
    MAX_ANGLE: 180,
    MIN_DISTANCE: 20,
    defaultStartAngle: 0,
    defaultEndAngle: 180,
    dpr: 3,
    canvasWidth: 600,
    canvasHeight: 600,
    arcRatius: 100,
    centerX: 100,
    centerY: 100,
    startAngle: 0,
    endAngle: 180,
    targetDistance: 100,
    marginTop: 10,
    marginBottom: 20,
    whiteRadius: 5,
    posWhiteRadius: 4.5,
    posPurpleRadius: 2,
    img: null,
    animTimer: null,
    progress1: 0,
    progress2: 25,
    progress3: 50,
    progress4: 75
  },
  lifetimes: {
    ready: function() {
      var a = this,
        t = this;
      console.log("lifetimes: ready()"), wx.createSelectorQuery().in(this).select("#myCanvas").fields({
        node: !0,
        size: !0
      }).exec((function(e) {
        if (null != e[0]) {
          console.log(e);
          var i = e[0].node;
          a.data.ctx = i.getContext("2d");
          var s = wx.getSystemInfoSync().pixelRatio;
          a.data.dpr = s, console.log("dpr = " + s), i.width = a.getDpSize(a.data.DRAW_WIDTH / 2) * s, i.height = a.getDpSize(a.data.DRAW_HEIGHT / 2) * s, a.data.ctx.scale(s, s), a.setData({
            canvasWidth: i.width / a.data.dpr,
            canvasHeight: i.height / a.data.dpr
          }), a.setData({
            centerX: a.data.canvasWidth / 2,
            centerY: a.data.marginTop * a.data.dpr,
            arcRatius: i.height / a.data.dpr - a.data.marginTop * a.data.dpr - a.data.marginBottom * a.data.dpr
          }), a.setData({
            defaultStartAngle: (180 - a.data.MAX_ANGLE) / 2 * (2 * Math.PI / 360)
          }), a.setData({
            defaultEndAngle: a.data.defaultStartAngle + a.data.MAX_ANGLE * (2 * Math.PI / 360)
          }), a.setData({
            targetDistance: a.data.arcRatius * a.data.rangingDistance / 100
          }), a.setData({
            startAngle: (180 - a.data.rangingAngle) / 360 * Math.PI
          }), a.setData({
            endAngle: a.data.startAngle + a.data.rangingAngle / 360 * 2 * Math.PI
          }), console.log("canvasWidth = " + a.data.canvasWidth), console.log("canvasHeight = " + a.data.canvasHeight), console.log("arcRatius = " + a.data.arcRatius), console.log("centerX = " + a.data.centerX), console.log("centerY = " + a.data.centerY), console.log("targetDistance = " + a.data.targetDistance), t.startDraw()
        } else console.log("res[0] == null")
      })), wx.createSelectorQuery().in(this).select("#myCanvas1").fields({
        node: !0,
        size: !0
      }).exec((function(e) {
        if (null != e[0]) {
          console.log(e);
          var i = e[0].node;
          a.data.ctx1 = i.getContext("2d");
          var s = wx.getSystemInfoSync().pixelRatio;
          a.data.dpr = s, console.log("dpr1 = " + s), i.width = a.getDpSize(a.data.DRAW_WIDTH / 2) * s, i.height = a.getDpSize(a.data.DRAW_HEIGHT / 2) * s, a.data.ctx1.scale(s, s), t.startDraw1()
        } else console.log("res[0] == null")
      }))
    },
    attached: function() {
      var a = this;
      null != this.data.animTimer && (clearInterval(this.data.animTimer), this.data.animTimer = null), this.data.animTimer = setInterval((function() {
        var t = a.data.progress1 + 1;
        t >= 100 && (t = 0);
        var e = a.data.progress2 + 1;
        e >= 100 && (e = 0);
        var i = a.data.progress3 + 1;
        i >= 100 && (i = 0);
        var s = a.data.progress4 + 1;
        s >= 100 && (s = 0), console.log(), a.data.progress1 = t, a.data.progress2 = e, a.data.progress3 = i, a.data.progress4 = s, a.startDraw(), a.startDraw1()
      }), 50, 50)
    },
    detached: function() {
      null != this.data.animTimer && (clearInterval(this.data.animTimer), this.data.animTimer = null)
    }
  },
  computed: {
    humanX: function(a) {
      return 2 * a.centerX / a.dpr - 2 * a.targetDistance / a.dpr * Math.sin(a.rangingAngle * a.ANGLE_SCALE * Math.PI / 360) - 109.5 + "rpx"
    },
    humanY: function(a) {
      return 2 * a.marginTop + 2 * a.targetDistance / a.dpr * Math.cos(a.rangingAngle * a.ANGLE_SCALE * Math.PI / 360) - 115.5 + 10 + "rpx"
    }
  },
  methods: {
    startDraw: function() {
      var a = this.data.ctx;
      if (null != a) {
        a.clearRect(0, 0, a.canvas.width, a.canvas.height);
        var t = a.createLinearGradient(this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr, this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr + this.data.arcRatius);
        t.addColorStop(0, "rgba(190,226,251, 0.0)"), t.addColorStop(1, "rgba(91,188,255, 0.5)"), a.fillStyle = t, a.beginPath(), a.arc(this.data.centerX, this.data.centerY, this.data.arcRatius, this.data.defaultStartAngle, this.data.defaultEndAngle, !1), a.lineTo(this.data.centerX, this.data.centerY), a.closePath(), a.fill();
        var e = a.createLinearGradient(this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr, this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr + this.data.arcRatius);
        e.addColorStop(0, "rgba(190,226,251, 0.0)"), e.addColorStop(1, "rgba(91,188,255, 0.5)"), a.fillStyle = e, a.beginPath(), a.arc(this.data.centerX, this.data.centerY, .75 * this.data.arcRatius, this.data.defaultStartAngle, this.data.defaultEndAngle, !1), a.lineTo(this.data.centerX, this.data.centerY), a.closePath(), a.fill();
        var i = a.createLinearGradient(this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr, this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr + this.data.arcRatius);
        i.addColorStop(0, "rgba(190,226,251, 0.0)"), i.addColorStop(1, "rgba(91,188,255, 0.7)"), a.fillStyle = i, a.beginPath(), a.arc(this.data.centerX, this.data.centerY, .5 * this.data.arcRatius, this.data.defaultStartAngle, this.data.defaultEndAngle, !1), a.lineTo(this.data.centerX, this.data.centerY), a.closePath(), a.fill();
        var s = a.createLinearGradient(this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr, this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr + this.data.arcRatius);
        if (s.addColorStop(0, "rgba(190,226,251, 0.0)"), s.addColorStop(1, "rgba(91,188,255, 1)"), a.fillStyle = s, a.beginPath(), a.arc(this.data.centerX, this.data.centerY, .25 * this.data.arcRatius, this.data.defaultStartAngle, this.data.defaultEndAngle, !1), a.lineTo(this.data.centerX, this.data.centerY), a.closePath(), a.fill(), this.data.hasHuman || !this.data.isQuickMode) {
          var r = this.data.progress1;
          r >= 100 && (r -= 100);
          var d = this.data.targetDistance * (r / 100),
            n = a.createLinearGradient(this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr, this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr + d);
          n.addColorStop(0, "rgba(114,79,253, " + (1 - 1 * r / 100) + ")"), n.addColorStop(1, "rgba(114,79,253, " + (1 - 1 * r / 100) + ")"), a.fillStyle = n, a.beginPath(), a.arc(this.data.centerX, this.data.centerY, d, this.data.startAngle, this.data.endAngle, !1), a.lineTo(this.data.centerX, this.data.centerY), a.closePath(), a.fill();
          var h = this.data.progress2;
          h >= 100 && (h -= 100);
          var l = this.data.targetDistance * (h / 100);
          (n = a.createLinearGradient(this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr, this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr + l)).addColorStop(0, "rgba(114,79,253, " + (1 - 1 * h / 100) + ")"), n.addColorStop(1, "rgba(114,79,253, " + (1 - 1 * h / 100) + ")"), a.fillStyle = n, a.beginPath(), a.arc(this.data.centerX, this.data.centerY, l, this.data.startAngle, this.data.endAngle, !1), a.lineTo(this.data.centerX, this.data.centerY), a.closePath(), a.fill();
          var o = this.data.progress3;
          o >= 100 && (o -= 100);
          var c = this.data.targetDistance * (o / 100);
          (n = a.createLinearGradient(this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr, this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr + c)).addColorStop(0, "rgba(114,79,253, " + (1 - 1 * o / 100) + ")"), n.addColorStop(1, "rgba(114,79,253, " + (1 - 1 * o / 100) + ")"), a.fillStyle = n, a.beginPath(), a.arc(this.data.centerX, this.data.centerY, c, this.data.startAngle, this.data.endAngle, !1), a.lineTo(this.data.centerX, this.data.centerY), a.closePath(), a.fill();
          var g = this.data.progress4;
          g >= 100 && (g -= 100);
          var p = this.data.targetDistance * (g / 100);
          (n = a.createLinearGradient(this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr, this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr + p)).addColorStop(0, "rgba(114,79,253, " + (1 - 1 * g / 100) + ")"), n.addColorStop(1, "rgba(114,79,253, " + (1 - g / 100) + ")"), a.fillStyle = n, a.beginPath(), a.arc(this.data.centerX, this.data.centerY, p, this.data.startAngle, this.data.endAngle, !1), a.lineTo(this.data.centerX, this.data.centerY), a.closePath(), a.fill()
        }
      }
    },
    startDraw1: function() {
      var a = this.data.ctx1;
      if (null != a && (a.clearRect(0, 0, a.canvas.width, a.canvas.height), this.data.hasHuman || !this.data.isQuickMode)) {
        a.save(), a.setLineDash([3 * this.data.dpr, 3 * this.data.dpr], 0), a.strokeStyle = "#724FFD", a.lineWidth = 1 * this.data.dpr, a.translate(this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr), a.rotate(this.data.startAngle), a.beginPath(), a.moveTo(0, 0), a.lineTo(this.data.targetDistance, 0), a.closePath(), a.stroke(), a.setLineDash([3 * this.data.dpr, 3 * this.data.dpr], 0), a.strokeStyle = "#724FFD", a.rotate(this.data.endAngle - this.data.startAngle), a.moveTo(0, 0), a.lineTo(this.data.targetDistance, 0), a.stroke(), a.restore(), a.save(), a.translate(this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr), a.rotate(this.data.startAngle), a.beginPath(), a.fillStyle = "white", a.arc(this.data.targetDistance, 0, this.data.posWhiteRadius * this.data.dpr, 0, 2 * Math.PI, !1), a.closePath(), a.fill(), a.beginPath(), a.fillStyle = "#724FFD", a.arc(this.data.targetDistance, 0, this.data.posPurpleRadius * this.data.dpr, 0, 2 * Math.PI, !1), a.closePath(), a.fill(), a.rotate(this.data.endAngle - this.data.startAngle), a.beginPath(), a.fillStyle = "white", a.arc(this.data.targetDistance, 0, this.data.posWhiteRadius * this.data.dpr, 0, 2 * Math.PI, !1), a.closePath(), a.fill(), a.beginPath(), a.fillStyle = "#724FFD", a.arc(this.data.targetDistance, 0, this.data.posPurpleRadius * this.data.dpr, 0, 2 * Math.PI, !1), a.closePath(), a.fill(), a.restore(), a.save(), a.setLineDash([3 * this.data.dpr, 3 * this.data.dpr], 0), a.beginPath(), a.strokeStyle = "#A0A0A0", a.lineWidth = 1 * this.data.dpr, a.translate(this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr), a.rotate(this.data.defaultStartAngle), a.moveTo(0, 0), a.lineTo(this.data.arcRatius, 0), a.stroke(), a.rotate(this.data.MAX_ANGLE * (2 * Math.PI / 360)), a.moveTo(0, 0), a.lineTo(this.data.arcRatius, 0), a.stroke(), a.restore();
        var t = this.data.whiteRadius * this.data.dpr;
        a.fillStyle = "white", a.beginPath(), a.arc(this.data.centerX, this.data.centerY, t, 0, 2 * Math.PI, !1), a.lineTo(this.data.centerX, this.data.centerY), a.closePath(), a.fill(), a.setLineDash([8 * this.data.dpr, 5 * this.data.dpr], 0), a.beginPath(), a.strokeStyle = "white", a.lineWidth = 1.5 * this.data.dpr, a.moveTo(this.data.canvasWidth / 2, this.data.marginTop * this.data.dpr), a.lineTo(this.data.canvasWidth / 2, this.data.targetDistance + this.data.marginTop * this.data.dpr), a.stroke(), a.font = 12 * this.data.dpr + "px Arial", a.textAlign = "middle", a.fillStyle = "#724FFD", a.fillText("距离" + (this.data.settingDistance / 100).toFixed(1) + "米", this.data.canvasWidth / 2 - 25 * this.data.dpr, this.data.targetDistance + this.data.marginTop * this.data.dpr + 15 * this.data.dpr)
      }
    },
    getDpSize: function(a) {
      return a * this.data.dpr
    }
  }
});