Component({
  properties: {
    type: {
      type: String,
      value: "light"
    },
    nav_type: {
      type: Number,
      value: 0
    }
  },
  data: {
    navList: ["彩光", "音乐律动", "情景"]
  },
  lifetimes: {
    attached: function() {
      "home" == this.data.type ? this.setData({
        navList: ["场景", "设备"]
      }) : "bathroom" == this.data.type ? this.setData({
        navList: ["校时", "闹钟"]
      }) : this.setData({
        navList: ["彩光", "音乐律动", "情景"]
      })
    }
  },
  methods: {
    changeType: function(t) {
      var e = t.currentTarget.dataset.index;
      if (this.data.nav_type === e || void 0 === e) return !1;
      this.setData({
        nav_type: e
      }), this.triggerEvent("onTabSelected", {
        index: e
      })
    }
  }
});