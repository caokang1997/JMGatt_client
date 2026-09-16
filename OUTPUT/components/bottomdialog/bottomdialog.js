Component({
  properties: {},
  data: {
    showModalStatus: !1
  },
  methods: {
    isShow: function() {
      return this.data.showModalStatus
    },
    show: function() {
      this.showModal()
    },
    hide: function() {
      var t = wx.createAnimation({
        duration: 10,
        timingFunction: "linear",
        delay: 0
      });
      t.translateY(10).step(), this.setData({
        animationData: t.export()
      }), setTimeout(function() {
        t.translateY(0).step(), this.setData({
          animationData: t.export(),
          showModalStatus: !1
        })
      }.bind(this), 10)
    },
    showModal: function() {
      var t = wx.createAnimation({
        duration: 50,
        timingFunction: "linear",
        delay: 0
      });
      t.translateY(50).step(), this.setData({
        animationData: t.export(),
        showModalStatus: !0
      }), setTimeout(function() {
        t.translateY(0).step(), this.setData({
          animationData: t.export()
        })
      }.bind(this), 50)
    },
    hideModal: function(t) {}
  },
  lifetimes: {
    ready: function() {}
  }
});