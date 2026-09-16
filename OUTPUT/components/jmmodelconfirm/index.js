Component({
  properties: {
    model: {
      type: String,
      value: "-"
    },
    name: {
      type: String,
      value: "-"
    }
  },
  data: {},
  methods: {
    onClickConfirm: function() {
      this.triggerEvent("onclickconfirm", {})
    },
    onClickCancel: function() {
      this.triggerEvent("onclickcancel", {})
    }
  }
});