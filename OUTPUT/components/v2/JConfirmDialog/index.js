Component({
  options: {
    multipleSlots: !0
  },
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
    hasBack: {
      type: Boolean,
      value: !1
    },
    confirmText: {
      type: String,
      value: "确定"
    },
    cancleText: {
      type: String,
      value: "取消"
    },
    backgroundColor: {
      type: String,
      value: "#FFFFFF"
    }
  },
  data: {},
  methods: {
    onClickConfirm: function() {
      this.triggerEvent("onclickconfirm", {})
    },
    onClickCancel: function() {
      this.triggerEvent("onclickcancel", {})
    },
    onClickBack: function() {
      this.triggerEvent("onclickback", {})
    }
  }
});