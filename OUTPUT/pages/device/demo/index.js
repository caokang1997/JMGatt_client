getApp();
Page({
  data: {},
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: "一键报修"
    })
  },
  onWaterTempLevelChange: function(e) {
    console.log("---")
  }
});