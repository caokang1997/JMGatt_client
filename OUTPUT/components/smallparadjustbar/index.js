var e = require("miniprogram-computed").behavior;
Component({
  behaviors: [e],
  properties: {
    title: {
      type: String,
      value: "进水温度"
    },
    content: {
      type: String,
      value: "进水温度"
    },
    unit: {
      type: String,
      value: "℃"
    },
    temp: {
      type: Number,
      value: 25
    },
    step: {
      type: Number,
      value: 1
    },
    max: {
      type: Number,
      value: 40
    },
    min: {
      type: Number,
      value: 25
    },
    showBig: {
      type: Boolean,
      value: !0
    }
  },
  computed: {
    reduceBtnValid: function(e) {
      return e.temp > e.min
    },
    addBtnValid: function(e) {
      return e.temp < e.max
    }
  },
  data: {},
  methods: {
    onReduce: function() {
      if (console.log("onReduce"), this.data.temp > this.data.min) {
        var e = this.data.temp - this.data.step;
        this.setData({
          temp: e
        }), console.log("onReduce" + e), this.triggerEvent("onNewTemp", {
          value: e
        })
      } else this.triggerEvent("onClickMin", {})
    },
    onAdd: function() {
      if (console.log("onAdd"), this.data.temp < this.data.max) {
        var e = this.data.temp + this.data.step;
        this.setData({
          temp: e
        }), console.log("onAdd" + e), this.triggerEvent("onNewTemp", {
          value: e
        })
      } else this.triggerEvent("onClickMax", {})
    }
  }
});