Component({
  properties: {
    values: {
      type: Array,
      value: ["最弱", "偏弱", "标准", "偏强", "最强"]
    },
    title: {
      type: String,
      value: "温度",
      observer: function(e, a) {
        if (e) {
          var t = this.data.default-this.data.min,
            i = t + this.data.min;
          this.setData({
            value: [t],
            selectValue: i,
            originalValue: i
          })
        }
      }
    },
    default: {
      type: Number,
      value: 34
    },
    min: {
      type: Number,
      value: 0
    },
    unit: {
      type: String,
      value: ""
    }
  },
  data: {
    value: [0],
    selectValue: 24,
    originalValue: 24
  },
  lifetimes: {
    ready: function() {
      if (console.log("ready"), null != this.data.default) {
        var e = this.data.values.indexOf(this.data.default-this.data.min);
        this.setData({
          value: [e],
          selectValue: e,
          originalValue: e
        })
      }
    }
  },
  methods: {
    bindChange: function(e) {
      console.log("bindChange =", e);
      var a = e.detail.value[0];
      console.log("bindChange 选中的滚轮值 =", a), this.setData({
        selectValue: a + this.data.min
      })
    },
    onClickConfirm: function() {
      var e = this.data.selectValue;
      this.setData({
        originalValue: e
      }), this.triggerEvent("onclickconfirm", {
        selectValue: e
      })
    },
    onClickCancel: function() {
      console.log("-- timepicker --onclickcancel");
      var e = this.data.originalValue;
      this.setData({
        selectValue: e,
        value: [e - this.data.min]
      }), this.triggerEvent("onclickcancel", {})
    }
  }
});