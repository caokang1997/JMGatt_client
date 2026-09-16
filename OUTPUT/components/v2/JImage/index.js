Component({
  properties: {
    mode: {
      type: String,
      value: "aspectFit"
    },
    url: {
      type: null,
      value: "",
      observer: function(t, e) {
        var o = String(t || "");
        o && "" !== o && this.setData({
          imageUrl: "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/" + o
        })
      }
    }
  },
  data: {
    imageUrl: ""
  },
  methods: {}
});