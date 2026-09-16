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
      type: null,
      value: "",
      observer: function(t, e) {
        var i = String(t || "");
        i && "" !== i && this.setData({
          titleString: i
        })
      }
    },
    icon: {
      type: String,
      value: ""
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
      type: null,
      value: "",
      observer: function(t, e) {
        var i = String(t || "");
        i && "" !== i && this.setData({
          detailString: i
        })
      }
    },
    hasTip: {
      type: Boolean,
      value: !1
    }
  },
  data: {
    detailString: "",
    titleString: "",
    item: {
      id: 1,
      color: "darkorange",
      isOn: !1
    }
  },
  methods: {
    onClickItem: function(t) {
      this.data.isExecute ? this.triggerEvent("onclickitem", {
        value: t.detail
      }) : wx.showToast({
        icon: "none",
        title: "请在遥控器上设置"
      })
    },
    onClickTitleTip: function(t) {
      this.triggerEvent("ontitletip", {
        value: t.detail
      })
    },
    onClickState: function(t) {
      wx.showToast({
        icon: "none",
        title: "请在遥控器上设置"
      })
    },
    onSwitchChange: function(t) {
      this.data.enable ? (console.log(t), console.log(t.detail.data), this.triggerEvent("onSwitch", {
        value: t.detail.data
      })) : this.triggerEvent("onSwitchDisable", {
        value: t.detail.data
      })
    }
  }
});