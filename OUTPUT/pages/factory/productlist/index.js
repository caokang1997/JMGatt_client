Page({
  data: {
    items: [{
      title: "九牧轻智能马桶ZQ6640",
      SAP: "ZQ6640-SA-CJM305",
      jmZtmxm: 175968
    }, {
      title: "九牧轻智能马桶XQ6641",
      SAP: "XQ6641-SA-CJM305",
      jmZtmxm: 177621
    }, {
      title: "九牧轻智能马桶SQ6642",
      SAP: "SQ6642-SA-CJM305",
      jmZtmxm: 181217
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
  onClickChooseProduct: function(n) {
    console.log(n);
    var t = n.currentTarget.dataset.item,
      o = getCurrentPages();
    o.length > 1 && (o[o.length - 2].onChooseProduct(t), wx.navigateBack())
  }
});