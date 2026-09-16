Component({
  properties: {},
  data: {},
  methods: {
    onClickReConnect: function() {
      this.triggerEvent("onclickreconnect", {})
    },
    onClickCancel: function() {
      this.triggerEvent("onclickcancel", {})
    }
  }
});