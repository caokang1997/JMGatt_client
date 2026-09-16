Component({
  properties: {
    title: {
      type: String,
      value: "-"
    },
    name: {
      type: String,
      value: "-"
    },
    hasConfirm: {
      type: Boolean,
      value: !0
    },
    hasCancel: {
      type: Boolean,
      value: !0
    },
    confirmText: {
      type: String,
      value: "确定"
    },
    cancleText: {
      type: String,
      value: "取消"
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