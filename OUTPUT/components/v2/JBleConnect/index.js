var e = require("miniprogram-computed").behavior;
Component({
  behaviors: [e],
  properties: {
    state: {
      type: Number,
      value: 1
    },
    errMsg: {
      type: String,
      value: ""
    },
    cancleText: {
      type: String,
      value: "取消"
    }
  },
  data: {},
  computed: {
    showMsg: function(e) {
      return "" != e.errMsg
    },
    title: function(e) {
      switch (e.state) {
        case 0:
          return "设备连接中";
        case 1:
          return "连接成功";
        case 2:
          return "连接失败"
      }
      return "-"
    },
    icon: function(e) {
      switch (e.state) {
        case 0:
          return "ic_connecting";
        case 1:
          return "ic_success";
        case 2:
          return "ic_failed"
      }
      return "ic_connecting"
    }
  },
  methods: {
    onClickReConnect: function() {
      this.triggerEvent("onclickreconnect", {})
    },
    onClickCancel: function() {
      this.triggerEvent("onclickcancel", {})
    }
  }
});