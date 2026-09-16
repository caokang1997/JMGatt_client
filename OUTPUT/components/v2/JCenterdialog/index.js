Component({
  options: {
    multipleSlots: !0
  },
  properties: {
    show: {
      type: Boolean,
      value: !1
    },
    title: {
      type: String,
      value: ""
    },
    showHeader: {
      type: Boolean,
      value: !0
    },
    showFooter: {
      type: Boolean,
      value: !0
    },
    showCancel: {
      type: Boolean,
      value: !0
    },
    cancelText: {
      type: String,
      value: "取消"
    },
    confirmText: {
      type: String,
      value: "确定"
    },
    maskClosable: {
      type: Boolean,
      value: !0
    }
  },
  methods: {
    onMaskClick: function() {
      this.properties.maskClosable && this.triggerEvent("cancel")
    },
    stopPropagation: function() {},
    onCancel: function() {
      this.triggerEvent("cancel")
    },
    onConfirm: function() {
      this.triggerEvent("confirm")
    }
  }
});