var a = require("../../@babel/runtime/helpers/defineProperty"),
  t = require("miniprogram-computed").behavior;
Component({
  options: {
    multipleSlots: !0
  },
  behaviors: [t],
  properties: {
    disabled: {
      type: Boolean,
      value: !1,
      observer: function(t, e) {
        t !== this.value && this.setData(a({}, "propValue.disabled", t))
      }
    },
    max: {
      type: Number,
      value: 100,
      observer: function(t, e) {
        t !== this.value && this.setData(a({}, "propValue.max", t))
      }
    },
    min: {
      type: Number,
      value: 0,
      observer: function(t, e) {
        t !== this.value && this.setData(a({}, "propValue.min", t))
      }
    },
    step: {
      type: Number,
      value: 1,
      observer: function(t, e) {
        t !== this.value && this.setData(a({}, "propValue.step", t))
      }
    },
    value: {
      type: null,
      value: 0,
      observer: function(t, e) {
        t !== this.value && this.setData(a({}, "propValue.value", t))
      }
    }
  },
  data: {
    hasClick: !1,
    propValue: {
      disabled: null,
      max: null,
      min: null,
      step: null,
      value: null,
      hasClick: null,
      isHuawei: null
    }
  },
  computed: {},
  lifetimes: {
    attached: function() {
      this.data.propValue.disabled = this.data.disabled, this.data.propValue.max = this.data.max, this.data.propValue.min = this.data.min, this.data.propValue.step = this.data.step, this.data.propValue.value = this.data.value, this.data.propValue.hasClick = this.data.hasClick, this.data.propValue.isHuawei = !1, this.setData({
        propValue: this.data.propValue
      })
    }
  },
  methods: {
    setVal: function(a) {
      var t = this;
      this.setData({
        hasClick: !0
      }), setTimeout((function() {
        t.setData({
          hasClick: !1
        }), t.data.propValue.hasClick = t.data.hasClick, t.setData({
          propValue: t.data.propValue
        })
      }), 500), this.data.propValue.hasClick = this.data.hasClick, this.setData({
        propValue: this.data.propValue
      })
    }
  }
});