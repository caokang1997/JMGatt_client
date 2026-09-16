getApp();
Page({
  data: {
    imgUrls: ["https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_front.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_side.png", "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/temp/ic_toilet_top_view.png"],
    currentIndex: 0
  },
  onLoad: function() {},
  swiperChange: function(t) {
    console.log(t), this.setData({
      currentIndex: t.detail.current
    })
  }
});