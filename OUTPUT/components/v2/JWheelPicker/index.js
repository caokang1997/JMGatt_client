Component({
  properties: {
    show: {
      type: Boolean,
      value: !1
    },
    title: {
      type: String,
      value: "选择"
    },
    min: {
      type: Number,
      value: 0
    },
    max: {
      type: Number,
      value: 10
    },
    unit: {
      type: String,
      value: ""
    },
    defaultValue: {
      type: Number,
      value: null,
      observer: function(t, e) {
        t != e && this.updateTime()
      }
    },
    step: {
      type: Number,
      value: 1
    }
  },
  data: {
    value: [0],
    items: [],
    values: []
  },
  lifetimes: {
    attached: function() {
      this.initItems(), this.updateTime()
    }
  },
  methods: {
    updateTime: function() {
      var t = this.properties.defaultValue,
        e = this.data.values;
      if (null !== t) {
        var a = e.indexOf(t);
        this.setData({
          value: [a]
        })
      }
    },
    initItems: function() {
      for (var t = this.properties, e = t.min, a = t.max, i = t.unit, n = t.step, s = [], u = [], l = e; l <= a; l += n) s.push("".concat(l).concat(i)), u.push(l);
      this.setData({
        items: s,
        values: u
      })
    },
    onCancel: function() {
      this.triggerEvent("cancel")
    },
    onConfirm: function() {
      var t = this.data.value[0],
        e = this.properties.min + t * this.data.step;
      this.triggerEvent("confirm", {
        value: e,
        text: this.data.items[t]
      })
    },
    onChange: function(t) {
      this.setData({
        value: t.detail.value
      })
    }
  }
});