Component({
  properties: {
    title: {
      type: String,
      value: "出水口"
    },
    selected: {
      type: Number,
      value: 1
    },
    values: {
      type: Array,
      value: [{
        type: 1,
        title: "手持"
      }, {
        type: 2,
        title: "顶喷"
      }, {
        type: 3,
        title: "下出水"
      }]
    }
  },
  data: {},
  lifetimes: {
    ready: function() {}
  },
  methods: {
    onChooseRadio: function(e) {
      console.log("-----点击选择-----"), console.log(e);
      var t = e.currentTarget.dataset.index;
      console.log("index = ", t), this.setData({
        selected: t
      })
    },
    onClickCancel: function() {
      console.log("-- timepicker --onclickcancel"), this.triggerEvent("onclickcancel", {})
    },
    onClickConfirm: function() {
      var e = this.data.selected;
      this.triggerEvent("onclickconfirm", {
        index: e
      })
    }
  }
});