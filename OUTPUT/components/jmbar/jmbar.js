Component({
  properties: {
    title: {
      type: String,
      value: "-"
    },
    icon: {
      type: String,
      value: "ic_flush_large"
    }
  },
  data: {},
  methods: {
    onClickButton: function() {
      this.triggerEvent("onclick", {})
    }
  }
});