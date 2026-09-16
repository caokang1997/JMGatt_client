Component({
  properties: {
    deviceInfo: {
      type: Object,
      value: {}
    },
    hasNotNeedWakeUpOrders: {
      type: Boolean,
      value: !0
    },
    hasNeedWakeUpOrders: {
      type: Boolean,
      value: !0
    },
    notNeedWakeUpOrders: {
      type: Array,
      value: [{
        name: "我要开盖/打开上盖"
      }, {
        name: "我要开圈/打开座圈"
      }, {
        name: "我要关盖/关闭上盖"
      }, {
        name: "我要关圈/关闭座圈"
      }, {
        name: "我要大冲/打开大冲"
      }, {
        name: "我要小冲/打开小冲"
      }, {
        name: "打开智力泡",
        key: "hasBubble"
      }]
    },
    needWakeUpOrders: {
      type: Array,
      value: [{
        name: "座圈常温"
      }, {
        name: "座圈中温"
      }, {
        name: "座圈高温"
      }, {
        name: "打开自动冲刷"
      }, {
        name: "关闭自动冲刷"
      }, {
        name: "打开关盖冲厕"
      }, {
        name: "关闭关盖冲厕"
      }, {
        name: "打开脚感控制"
      }, {
        name: "关闭脚感控制"
      }, {
        name: "打开落座发泡",
        key: "hasBubble"
      }, {
        name: "关闭落座发泡",
        key: "hasBubble"
      }, {
        name: "打开智能夜灯"
      }, {
        name: "关闭智能夜灯"
      }, {
        name: "打开自清洁",
        key: "hasSelfClean"
      }, {
        name: "关闭自清洁",
        key: "hasSelfClean"
      }, {
        name: "打开预湿润"
      }, {
        name: "关闭预湿润"
      }, {
        name: "小牧关机"
      }, {
        name: "打开语音识别"
      }, {
        name: "关闭语音识别"
      }]
    }
  },
  data: {
    notNeedWakeUpOrders: [{
      name: "我要开盖/打开上盖"
    }, {
      name: "我要开圈/打开座圈"
    }, {
      name: "我要关盖/关闭上盖"
    }, {
      name: "我要关圈/关闭座圈"
    }, {
      name: "我要大冲/打开大冲"
    }, {
      name: "我要小冲/打开小冲"
    }, {
      name: "打开智力泡",
      key: "hasBubble"
    }],
    needWakeUpOrders: [{
      name: "座圈常温"
    }, {
      name: "座圈中温"
    }, {
      name: "座圈高温"
    }, {
      name: "打开自动冲刷"
    }, {
      name: "关闭自动冲刷"
    }, {
      name: "打开关盖冲厕"
    }, {
      name: "关闭关盖冲厕"
    }, {
      name: "打开脚感控制"
    }, {
      name: "关闭脚感控制"
    }, {
      name: "打开落座发泡",
      key: "hasBubble"
    }, {
      name: "关闭落座发泡",
      key: "hasBubble"
    }, {
      name: "打开智能夜灯"
    }, {
      name: "关闭智能夜灯"
    }, {
      name: "打开自清洁",
      key: "hasSelfClean"
    }, {
      name: "关闭自清洁",
      key: "hasSelfClean"
    }, {
      name: "打开预湿润"
    }, {
      name: "关闭预湿润"
    }, {
      name: "小牧关机"
    }, {
      name: "打开语音识别"
    }, {
      name: "关闭语音识别"
    }]
  },
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