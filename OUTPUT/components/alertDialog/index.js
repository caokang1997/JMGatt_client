Component({
  properties: {
    alertContent: {
      type: String,
      value: ""
    },
    confirmText: {
      type: String,
      value: "知道了"
    }
  },
  data: {},
  methods: {
    onClickConfirm: function() {
      this.triggerEvent("onclickconfirm", {})
    }
  }
});