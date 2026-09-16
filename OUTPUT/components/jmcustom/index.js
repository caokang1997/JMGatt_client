Component({
  properties: {
    checked: {
      type: Boolean,
      value: !1
    },
    title: {
      type: String,
      value: "-"
    },
    icon: {
      type: String,
      value: "ic_custom_woman"
    },
    withdivider: {
      type: Boolean,
      value: !0
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
    onClickItem: function(e) {
      this.triggerEvent("onclickitem", {
        check: e.detail
      })
    },
    onSwitchChange: function(e) {
      this.triggerEvent("onclick", {
        check: e.detail
      })
    }
  }
});