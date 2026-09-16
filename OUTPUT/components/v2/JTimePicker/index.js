var t = require("../../../@babel/runtime/helpers/slicedToArray");
Component({
  properties: {
    show: {
      type: Boolean,
      value: !0
    },
    title: {
      type: String,
      value: "选择时间"
    },
    defaultHour: {
      type: Number,
      value: 5,
      observer: function(t, e) {
        t != e && this.updateTime()
      }
    },
    defaultMinute: {
      type: Number,
      value: 10,
      observer: function(t, e) {
        t != e && this.updateTime()
      }
    },
    hourRange: {
      type: Array,
      value: [0, 23]
    },
    minuteRange: {
      type: Array,
      value: [0, 59]
    },
    minuteStep: {
      type: Number,
      value: 1
    },
    showButton: {
      type: Boolean,
      value: !0
    },
    showTitile: {
      type: Boolean,
      value: !0
    }
  },
  data: {
    value: [0, 0],
    hours: [],
    minutes: [],
    hourValues: [],
    minuteValues: []
  },
  lifetimes: {
    attached: function() {
      this.initTimeItems(), this.updateTime()
    }
  },
  methods: {
    updateTime: function() {
      var t = this.properties,
        e = t.defaultHour,
        a = t.defaultMinute,
        u = this.data.hourValues.indexOf(e),
        i = this.data.minuteValues.indexOf(a);
      this.setData({
        value: [u >= 0 ? u : 0, i >= 0 ? i : 0]
      })
    },
    initTimeItems: function() {
      for (var t = this.properties, e = t.hourRange, a = t.minuteRange, u = t.minuteStep, i = [], n = [], r = [], o = [], s = e[0]; s <= e[1]; s++) i.push("".concat(s.toString().padStart(2, "0"), "时")), r.push(s);
      for (var l = a[0]; l <= a[1]; l += u) n.push("".concat(l.toString().padStart(2, "0"), "分")), o.push(l);
      this.setData({
        hours: i,
        minutes: n,
        hourValues: r,
        minuteValues: o
      })
    },
    onCancel: function() {
      this.triggerEvent("cancel")
    },
    onConfirm: function() {
      var e = t(this.data.value, 2),
        a = e[0],
        u = e[1],
        i = this.data.hourValues[a],
        n = this.data.minuteValues[u];
      this.triggerEvent("confirm", {
        hour: i,
        minute: n,
        text: "".concat(i.toString().padStart(2, "0"), ":").concat(n.toString().padStart(2, "0"))
      })
    },
    onChange: function(t) {
      var e = t.detail.value;
      this.setData({
        value: e
      }), this.triggerEvent("onChange", {
        value: e
      })
    }
  }
});