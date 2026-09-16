Component({
  properties: {
    content: {
      type: String,
      value: "-"
    },
    confirmText: {
      type: String,
      value: "确认"
    }
  },
  data: {},
  methods: {
    onClickReConnect: function() {
      this.triggerEvent("onclickreconnect", {})
    },
    onClickCancel: function() {
      this.triggerEvent("onclickcancel", {})
    }
  }
});