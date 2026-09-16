var t = require("../../utils/util").formatTime;
Component({
  properties: {},
  data: {
    watermarkImg: "",
    isShow: !1
  },
  lifetimes: {
    attached: function() {
      var e = "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='320'><text x='20' y='80' font-size='18' fill='#000' fill-opacity='0.08' transform='rotate(-25 0 0)'>体验版小程序</text><text x='20' y='105' font-size='18' fill='#000' fill-opacity='0.08' transform='rotate(-25 0 0)'>".concat(t(new Date), "</text></svg>"),
        o = encodeURIComponent(e),
        i = '"data:image/svg+xml;utf8,'.concat(o, '"'),
        a = (wx.getAccountInfoSync() || {}).miniProgram,
        n = void 0 === a ? {} : a;
      console.log("当前环境：", n.envVersion), this.setData({
        watermarkImg: i,
        isShow: "trial" === n.envVersion
      })
    }
  },
  methods: {}
});