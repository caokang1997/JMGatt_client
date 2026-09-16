for (var e = [], t = 24; t < 50; t++) e.push(t);
Component({
  properties: {
    title: {
      type: String,
      value: "温度"
    },
    min: {
      type: Number,
      value: 20
    },
    max: {
      type: Number,
      value: 50
    },
    default: {
      type: Number,
      value: 34
    }
  },
  data: {
    values: e,
    value: [0],
    unit: "℃",
    selectValue: 24
  },
  lifetimes: {
    ready: function() {
      if (console.log("ready"), console.log(e), null != this.data.default) {
        var t = this.data.values.indexOf(this.data.default);
        console.log("default", this.data.default), console.log("index", t), this.setData({
          value: [t],
          selectValue: this.data.default
        })
      }
    }
  },
  methods: {
    bindChange: function(e) {
      var t = e.detail.value,
        a = this.data.values[t];
      this.setData({
        selectValue: a
      })
    },
    onClickConfirm: function() {
      var e = this.data.selectValue;
      this.triggerEvent("onclickconfirm", {
        selectValue: e
      })
    },
    onClickCancel: function() {
      console.log("-- timepicker --onclickcancel"), this.triggerEvent("onclickcancel", {})
    }
  }
});