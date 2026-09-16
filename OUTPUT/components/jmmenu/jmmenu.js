var n = require("miniprogram-computed").behavior;
Component({
  behaviors: [n],
  properties: {
    on: {
      type: Boolean,
      default: !0
    }
  },
  computed: {
    iconBtn: function(n) {
      return n.on ? "/image/ic_menu_btn_on.png" : "/image/ic_menu_btn_off.png"
    }
  },
  data: {},
  methods: {
    onTabButton: function() {
      var n = !this.data.on;
      console.log("点击菜单按钮 - ", n), this.triggerEvent("onPowerBtnClick", {
        on: n
      })
    }
  }
});