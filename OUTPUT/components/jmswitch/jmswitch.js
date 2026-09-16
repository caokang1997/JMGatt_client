Component({
  properties: {
    enable: {
      type: Boolean,
      value: !0
    },
    isChecked: {
      type: Boolean,
      value: !0
    }
  },
  methods: {
    tapSwitch: function() {
      if (this.data.enable) {
        this.setData({
          isChecked: !this.data.isChecked
        });
        var e = this.data.isChecked;
        this.triggerEvent("onchecked", {
          data: e
        })
      } else {
        var t = this.data.isChecked;
        this.triggerEvent("onchecked", {
          data: t
        })
      }
    }
  }
});