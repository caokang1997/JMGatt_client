Component({
  properties: {
    visible: {
      type: Boolean,
      value: !0
    },
    icon: {
      type: String,
      value: "off/ic_wash_woman"
    },
    withArrow: {
      type: Boolean,
      value: !1
    },
    text: {
      type: String,
      value: "9999",
      observer: function(t, a) {
        this.startAnim()
      }
    }
  },
  data: {
    canvas: null,
    canvasContext: null,
    canvasWidth: 0,
    canvasHeight: 0,
    barWidth: 0,
    currentWidth: 0,
    startTime: 0,
    textWidth: 0
  },
  pageLifetimes: {
    show: function() {
      console.log("页面显示,组件可能可见"), this.startAnim()
    },
    hide: function() {
      console.log("页面隐藏,组件不可见")
    }
  },
  lifetimes: {
    ready: function() {
      var t = this;
      wx.createSelectorQuery().in(this).select("#myCanvas").fields({
        node: !0,
        size: !0
      }).exec((function(a) {
        if (null != a[0]) {
          var e = a[0].node,
            i = e.getContext("2d"),
            s = wx.getSystemInfoSync().pixelRatio;
          e.width = a[0].width * s, e.height = a[0].height * s, i.scale(s, s), t.setData({
            canvas: e,
            canvasContext: i,
            canvasWidth: a[0].width,
            canvasHeight: a[0].height
          }), t.startAnim()
        }
      }))
    }
  },
  methods: {
    startAnim: function() {
      var t = this.data.canvasContext;
      if (null != t) {
        var a = this.data.text;
        if (0 != a.length) {
          t.font = "20px Arial";
          var e = t.measureText(a).width;
          this.data.textWidth = e, this.data.barWidth = this.data.canvasHeight / 2, this.data.startTime = Date.now(), this.data.barWidth = this.data.canvasHeight / 2 + 1 * (this.data.canvasHeight / 2 + this.data.textWidth), this.startDraw()
        }
      }
    },
    startDraw: function() {
      var t = this.data.canvasContext;
      if (null != t) {
        t.clearRect(0, 0, t.canvas.width, t.canvas.height);
        var a = this.data.text;
        t.font = "20px Arial";
        t.measureText(a).width;
        var e = this.data.canvasHeight,
          i = this.data.barWidth + (this.data.withArrow ? e / 4 : 0);
        t.lineWidth = e, t.lineCap = "round";
        var s = t.createLinearGradient(0, e / 2, i, e / 2);
        s.addColorStop(0, "#D3D4FF"), s.addColorStop(1, "#EBDFFF"), t.strokeStyle = s, t.beginPath(), t.moveTo(e / 2, e / 2), t.lineTo(i, e / 2), t.stroke(), t.beginPath(), t.save(), t.fillStyle = "#FFFFFF", t.shadowColor = "#00000059", t.shadowBlur = 8, t.shadowOffsetX = 0, t.shadowOffsetY = 5;
        var n = e / 2;
        t.arc(n, e / 2, e / 2 - 3, 0, 2 * Math.PI), t.fill(), t.restore(), t.save(), t.fillStyle = "#FFF000", t.beginPath(), t.rect(0, 0, i + e / 2, e), t.clip(), t.beginPath(), t.fillStyle = "#000000";
        var h = e / 2 + 10 - 3;
        t.fillText(a, 51, h), t.restore()
      }
    }
  }
});