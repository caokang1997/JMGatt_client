Component({
  properties: {
    show: {
      type: Boolean,
      value: !1
    },
    errorMsg: {
      type: String,
      value: ""
    }
  },
  methods: {
    onClickError: function() {
      this.triggerEvent("onClickError")
    }
  }
});