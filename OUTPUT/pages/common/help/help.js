getApp();
Page({
  data: {
    model: "zq6640",
    title: "",
    reason: "",
    solution: []
  },
  onLoad: function(n) {
    var o = this;
    this.getOpenerEventChannel().on("error", (function(n) {
      o.setData({
        model: n.model,
        title: n.data.title,
        reason: n.data.reason,
        solution: n.data.solution
      })
    }))
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {}
});