Component({
  properties: {
    imageUrl: {
      type: String,
      value: ""
    },
    imageMode: {
      type: String,
      value: "widthFix"
    },
    title: {
      type: String,
      value: ""
    },
    tagText: {
      type: String,
      value: ""
    },
    detailText: {
      type: String,
      value: ""
    },
    buttonText: {
      type: String,
      value: ""
    },
    buttonType: {
      type: String,
      value: "primary"
    },
    rightType: {
      type: String,
      value: "button"
    },
    checked: {
      type: Boolean,
      value: !1
    },
    radioText: {
      type: String,
      value: ""
    }
  },
  data: {},
  methods: {
    onClickButton: function() {
      this.triggerEvent("onClickButton")
    },
    onRadioToggle: function() {
      var t = !this.data.checked;
      this.setData({
        checked: t
      }), this.triggerEvent("onRadioToggle", {
        checked: t
      })
    }
  }
});