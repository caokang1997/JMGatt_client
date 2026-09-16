Component({
  properties: {
    content: {
      type: String,
      value: "-"
    },
    title: {
      type: String,
      value: "设备名称"
    },
    placeholder: {
      type: String,
      value: "请输入设备名称"
    },
    maxLength: {
      type: Number,
      value: 16
    }
  },
  data: {},
  methods: {
    bindKeyInput: function(t) {
      var e = t.detail.value;
      e = (e = e.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi, "")).replace(/\s/g, ""), t.detail.value = e, this.setData({
        content: t.detail.value
      })
    },
    onClickConfirm: function() {
      var t = this.data.content;
      0 != t.length ? this.triggerEvent("onclickconfirm", {
        content: t
      }) : wx.showToast({
        title: "设备名称不能为空",
        icon: "error",
        duration: 2e3
      })
    },
    onClickCancel: function() {
      this.triggerEvent("onclickcancel", {})
    }
  }
});