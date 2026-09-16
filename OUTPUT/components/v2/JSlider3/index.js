Component({
  properties: {
    value: {
      type: Number,
      value: 100,
      observer: function(t, e) {
        var i = this.properties.min,
          a = this.properties.max,
          s = null == t || isNaN(Number(t)) || t < i || t > a;
        this.setData({
          sliderValue: t,
          showHandle: !s
        }), s || this.updateSliderPosition()
      }
    },
    min: {
      type: Number,
      value: 0
    },
    max: {
      type: Number,
      value: 100
    },
    step: {
      type: Number,
      value: 1
    },
    disabled: {
      type: Boolean,
      value: !1
    },
    title: {
      type: String,
      value: "照明亮度",
      observer: function(t, e) {
        this.updateTitleFontClass()
      }
    },
    titles: {
      type: Array,
      value: []
    },
    unit: {
      type: String,
      value: ""
    },
    valueByTitles: {
      type: Boolean,
      value: !1
    }
  },
  data: {
    sliderValue: 100,
    sliderLeft: 0,
    sliderWidth: 0,
    containerLeft: 0,
    containerWidth: 0,
    moving: !1,
    sliderProgressWidth: 0,
    valueString: "",
    titleFontClass: "slider-title-large",
    showHandle: !0
  },
  lifetimes: {
    attached: function() {
      0 == this.data.titles.length && this.setData({
        titles: [this.data.min + this.data.unit, this.data.max + this.data.unit]
      });
      var t = this.properties.value,
        e = this.properties.min,
        i = this.properties.max,
        a = null == t || isNaN(Number(t)) || t < e || t > i;
      this.setData({
        sliderValue: t,
        showHandle: !a
      }), a || this.updateSliderPosition()
    },
    ready: function() {
      this.updateSliderPosition(), this.updateTitleFontClass()
    }
  },
  methods: {
    getChineseCharCount: function(t) {
      if (!t) return 0;
      var e = t.match(/[\u4e00-\u9fff]/g);
      return e ? e.length : 0
    },
    updateTitleFontClass: function() {
      var t = this.getChineseCharCount(this.data.title) <= 4 ? "slider-title-large" : "slider-title-small";
      this.setData({
        titleFontClass: t
      })
    },
    valueContent: function(t) {
      if (this.data.valueByTitles && this.data.titles.length > 0) {
        var e = Math.round((t - this.data.min) / (this.data.max - this.data.min) * (this.data.titles.length - 1));
        return this.data.titles[e] || ""
      }
      return t + this.data.unit
    },
    updateSliderPosition: function() {
      var t = this,
        e = this.createSelectorQuery();
      e.select(".slider-container").boundingClientRect(), e.exec((function(e) {
        if (e && e[0]) {
          var i = e[0].width,
            a = e[0].left,
            s = (t.data.sliderValue - t.properties.min) / (t.properties.max - t.properties.min),
            r = i - 24,
            n = s * r,
            o = 24 + (i - 24) * s,
            l = Math.round(t.data.sliderValue / t.properties.step) * t.properties.step,
            d = t.valueContent(l);
          t.setData({
            containerWidth: i,
            containerLeft: a,
            sliderWidth: r,
            sliderLeft: n,
            sliderProgressWidth: o,
            valueString: d
          })
        }
      }))
    },
    onSliderTouchStart: function(t) {
      this.properties.disabled || (this.setData({
        showHandle: !0
      }), this.setData({
        moving: !0
      }))
    },
    onSliderTouchMove: function(t) {
      if (!this.properties.disabled && this.data.moving) {
        t.stopPropagation && t.stopPropagation(), t.preventDefault && t.preventDefault();
        var e = (t.touches[0].pageX - this.data.containerLeft - 12) / this.data.sliderWidth;
        e = Math.max(0, Math.min(1, e));
        var i = Math.round(e * (this.properties.max - this.properties.min) + this.properties.min),
          a = Math.round(i / this.properties.step) * this.properties.step;
        e = (a - this.properties.min) / (this.properties.max - this.properties.min);
        var s = 24 + (this.data.containerWidth - 24) * e,
          r = this.valueContent(a);
        this.setData({
          sliderProgressWidth: s,
          sliderValue: a,
          sliderLeft: this.data.sliderWidth * e,
          valueString: r
        }), this.triggerEvent("changing", {
          value: a
        })
      }
    },
    onSliderTouchEnd: function(t) {
      !this.properties.disabled && this.data.moving && (t.stopPropagation && t.stopPropagation(), this.setData({
        moving: !1
      }), this.triggerEvent("onchange", {
        value: this.data.sliderValue
      }))
    },
    onSliderTap: function(t) {
      var e = this;
      if (!this.properties.disabled) {
        this.setData({
          showHandle: !0
        }), t.stopPropagation && t.stopPropagation(), t.preventDefault && t.preventDefault();
        var i = this.createSelectorQuery();
        i.select(".slider-container").boundingClientRect(), i.exec((function(i) {
          if (i && i[0]) {
            var a = i[0].left,
              s = i[0].width - 24,
              r = (t.detail.x - a - 12) / s;
            r = Math.max(0, Math.min(1, r));
            var n = Math.round(r * (e.properties.max - e.properties.min) + e.properties.min),
              o = Math.round(n / e.properties.step) * e.properties.step;
            r = (o - e.properties.min) / (e.properties.max - e.properties.min);
            var l = 24 + (e.data.containerWidth - 24) * r,
              d = e.valueContent(o);
            e.setData({
              sliderProgressWidth: l,
              sliderValue: o,
              sliderLeft: r * s,
              valueString: d
            }), e.triggerEvent("onchange", {
              value: o
            })
          }
        }))
      }
    }
  }
});