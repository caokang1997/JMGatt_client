Component({
  properties: {
    isRoundRect: {
      type: Boolean,
      value: !1
    },
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
    },
    enable: {
      type: Boolean,
      value: !0
    },
    isExecute: {
      type: Boolean,
      value: !0
    },
    detail: {
      type: String,
      value: ""
    },
    showStateChange: {
      type: Boolean,
      value: !1
    },
    hasTip: {
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
    onClickTitleTip: function(e) {
      this.triggerEvent("onClickTitleTip", {})
    },
    onClickMain: function(e) {
      this.data.enable || this.triggerEvent("onClickMain", {
        value: e.detail
      })
    },
    onClickItem: function(e) {
      this.data.isExecute ? this.triggerEvent("onclickitem", {
        value: e.detail
      }) : wx.showToast({
        icon: "none",
        title: "请在遥控器上设置"
      })
    },
    onClickState: function(e) {
      wx.showToast({
        icon: "none",
        title: "请在遥控器上设置"
      })
    },
    onSwitchChange: function(e) {
      this.data.enable ? (console.log(e), console.log(e.detail.data), this.triggerEvent("onSwitch", {
        value: e.detail.data
      })) : this.triggerEvent("onSwitchDisable", {
        value: e.detail.data
      })
    }
  }
});