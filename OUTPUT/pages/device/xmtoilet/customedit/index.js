Page({
  data: {
    chooseWaterPressurePopUp: null,
    name: "-",
    stpes2: [{
      title: "水花",
      content: "柔波",
      icon: "ic_step_waterspray"
    }, {
      title: "水温",
      content: "3档",
      icon: "ic_step_watertemp"
    }, {
      title: "水压",
      content: "2档",
      icon: "ic_step_waterpressure"
    }, {
      title: "时长",
      content: "30s",
      icon: "ic_step_time"
    }, {
      title: "位置",
      content: "偏前",
      icon: "ic_step_position"
    }],
    stpes: [{
      title: "水花",
      content: "宽幅片状",
      icon: "ic_step_waterspray"
    }, {
      title: "水温",
      content: "2档",
      icon: "ic_step_watertemp"
    }, {
      title: "水压",
      content: "3档",
      icon: "ic_step_waterpressure"
    }, {
      title: "时长",
      content: "60s",
      icon: "ic_step_time"
    }, {
      title: "位置",
      content: "偏前",
      icon: "ic_step_position"
    }]
  },
  onLoad: function(t) {
    var e = t.name;
    this.chooseWaterPressurePopUp = this.selectComponent("#chooseWaterPressurePopUp"), this.setData({
      name: e
    })
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  onClickStep: function() {}
});