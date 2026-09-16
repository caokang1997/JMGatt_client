Component({
  properties: {
    title: {
      type: String,
      value: "离线语音"
    },
    wakeFreeOnExample: {
      type: String,
      value: "例：“打开照明”"
    },
    wakeFreeOffExample: {
      type: String,
      value: "“你好小牧/小牧小牧，打开照明”"
    },
    orders: {
      type: Array,
      value: ["打开照明", "打开夜灯", "打开恒暖", "打开净化风", "关闭照明", "关闭夜灯", "关闭恒暖", "关闭净化风", "打开换气", "关闭换气", "打开干燥", "关闭干燥"]
    }
  },
  data: {},
  methods: {
    show: function() {
      this.selectComponent("#settings-dialog").show()
    },
    hide: function() {
      this.selectComponent("#settings-dialog").hide()
    },
    onClose: function() {
      this.triggerEvent("close")
    }
  }
});