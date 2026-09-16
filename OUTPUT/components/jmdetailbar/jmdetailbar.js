Component({
  properties: {
    content: {
      type: String,
      value: ""
    },
    title: {
      type: String,
      value: "-"
    },
    icon: {
      type: String,
      value: "ic_flush_large"
    },
    witharrow: {
      type: Boolean,
      value: !0
    },
    withdivider: {
      type: Boolean,
      value: !0
    },
    showRedPoint: {
      type: Boolean,
      value: !1
    }
  },
  data: {
    item: {
      id: 1,
      color: "darkorange",
      isOn: !1
    }
  },
  methods: {
    onClickBar: function() {
      this.triggerEvent("onclick", {})
    }
  }
});