Component({
  properties: {
    powerOn: {
      type: Boolean,
      value: !0
    },
    showStopText: {
      type: Boolean,
      value: !1
    }
  },
  data: {
    menuButtonHeight: 0
  },
  lifetimes: {
    created: function() {
      var t = wx.getMenuButtonBoundingClientRect(),
        e = (t.top, t.height);
      this.setData({
        menuButtonHeight: e
      })
    }
  },
  methods: {
    onClickPause: function(t) {
      var e = !this.data.powerOn;
      this.setData({
        powerOn: e
      }), this.triggerEvent("onClickPower", {
        on: this.data.powerOn
      })
    }
  }
});