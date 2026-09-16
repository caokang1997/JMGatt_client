Component({
  properties: {
    imgUrls: Array
  },
  data: {
    currentIndex: 0
  },
  methods: {
    swiperChange: function(e) {
      console.log(e), this.setData({
        currentIndex: e.detail.current
      })
    }
  }
});