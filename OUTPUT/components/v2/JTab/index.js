Component({
  properties: {
    nav_type: {
      type: Number,
      value: 0
    },
    titles: {
      type: Array,
      value: ["彩光", "音乐律动", "情景"]
    }
  },
  data: {},
  lifetimes: {},
  methods: {
    changeType: function(e) {
      var t = e.currentTarget.dataset.index;
      if (this.data.nav_type === t || void 0 === t) return !1;
      this.setData({
        nav_type: t
      }), this.triggerEvent("onTabSelected", {
        index: t
      })
    }
  }
});