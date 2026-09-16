Page({
  data: {
    categorys: [{
      title: "智能马桶",
      id: 1
    }]
  },
  onLoad: function(n) {},
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  onClickChooseCategory: function(n) {
    var o = n.currentTarget.dataset.item,
      t = getCurrentPages();
    t.length > 1 && (t[t.length - 2].onChooseCategory(o), wx.navigateBack())
  }
});