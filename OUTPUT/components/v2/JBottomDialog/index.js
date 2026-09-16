Component({
  options: {
    multipleSlots: !0
  },
  properties: {
    clickOutHide: {
      type: Boolean,
      value: !1
    },
    showDialog: {
      type: Boolean,
      value: !1
    }
  },
  data: {},
  methods: {
    OnClickMask: function() {
      this.properties.clickOutHide && (this.hide(), this.triggerEvent("onClickHide", {}))
    },
    isShow: function() {
      return this.data.showDialog
    },
    show: function() {
      this.setData({
        showDialog: !0
      })
    },
    hide: function() {
      this.data.showDialog && this.setData({
        showDialog: !1
      })
    },
    toggleDialog: function() {
      this.setData({
        showDialog: !this.data.showDialog
      })
    }
  }
});