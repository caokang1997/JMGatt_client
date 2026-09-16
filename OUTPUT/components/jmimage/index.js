Component({
  properties: {
    url: {
      type: String,
      value: "-",
      observer: function(t, e) {
        t && this.setData({
          imageUrl: "https://muyun.jomoo.cn/jomoo/organic/muyun/wechat/nfctoilet/" + t
        })
      }
    }
  },
  data: {
    imageUrl: ""
  },
  methods: {}
});