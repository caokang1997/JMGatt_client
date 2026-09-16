Component({
  properties: {
    marginVertical: {
      type: Number,
      value: 0
    },
    marginHorizontal: {
      type: Number,
      value: 0
    }
  },
  data: {
    lineStyle: ""
  },
  observers: {
    "marginVertical, marginHorizontal": function(t, a) {
      this.setData({
        lineStyle: this._buildStyle(t, a)
      })
    }
  },
  lifetimes: {
    attached: function() {
      var t = this.data.marginVertical,
        a = this.data.marginHorizontal;
      this.setData({
        lineStyle: this._buildStyle(t, a)
      })
    }
  },
  methods: {
    _buildStyle: function(t, a) {
      var i = a || 0;
      return "margin: ".concat(t || 0, "rpx ").concat(i, "rpx; width: calc(100% - ").concat(2 * i, "rpx);")
    }
  }
});