Component({
  options: {
    multipleSlots: !0
  },
  properties: {
    zIndexMaskValue: {
      type: Number,
      value: 1e5
    },
    clickOutHide: {
      type: Boolean,
      value: !1
    },
    showDialog: {
      type: Boolean,
      value: !1
    },
    autoClose: {
      type: Boolean,
      value: !1,
      observer: function(t) {
        t && this.hide()
      }
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