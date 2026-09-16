Component({
  properties: {
    title: {
      type: String,
      value: "-"
    },
    content: {
      type: String,
      value: "-"
    },
    withdivider: {
      type: Boolean,
      value: !0
    },
    icon: {
      type: String,
      value: ""
    },
    withClick: {
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
    }
  },
  data: {},
  methods: {
    onClickContent: function(t) {
      this.data.isExecute ? this.data.withClick && this.triggerEvent("onclick", {}) : wx.showToast({
        icon: "none",
        title: "请在遥控器上设置"
      })
    }
  }
});