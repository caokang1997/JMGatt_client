var t = getApp();
Page({
  data: {
    customs: [{
      title: "老人模式",
      icon: "ic_custom_oldman",
      on: !1
    }, {
      title: "妇洗模式",
      icon: "ic_custom_woman",
      on: !1
    }, {
      title: "经期模式",
      icon: "ic_custom_woman_period",
      on: !1
    }, {
      title: "童洗模式",
      icon: "ic_custom_child",
      on: !1
    }, {
      title: "助便模式",
      icon: "ic_custom_strong",
      on: !1
    }, {
      title: "男士快洗模式",
      icon: "ic_custom_woman_period",
      on: !1
    }]
  },
  onLoad: function(o) {
    this.Toilet = t.getXiaoMuToiletController();
    var e = this.Toilet.selectedCustomModes;
    console.log("selectedCustomModes = ", e);
    for (var n = 0; n < e.length; ++n) {
      var i = e[n];
      this.data.customs[i].on = !0
    }
    var c = this.data.customs;
    this.setData({
      customs: c
    })
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  onClickEdit: function(t) {
    var o = t.currentTarget.dataset.item;
    wx.navigateTo({
      url: "/pages/device/xmtoilet/customedit/index?name=" + o.title
    })
  },
  onClickItem: function(t) {
    t.currentTarget.dataset.item;
    var o = t.currentTarget.dataset.index,
      e = t.detail.check;
    console.log("index = ", o), console.log("check = ", e);
    for (var n = [], i = 0; i < this.data.customs.length; ++i) {
      var c = this.data.customs[i];
      o == i && (c.on = e.data), c.on && n.push(i)
    }
    console.log(n), this.Toilet.selectedCustomModes = n
  }
});