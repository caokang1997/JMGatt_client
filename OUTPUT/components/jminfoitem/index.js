var t = require("miniprogram-computed").behavior;
Component({
  behaviors: [t],
  properties: {
    title: {
      type: String,
      value: "-"
    },
    unit: {
      type: String,
      value: ""
    },
    value: {
      type: String,
      value: "-"
    },
    icon: {
      type: String,
      value: "ic_flush_large"
    },
    on: {
      type: Boolean,
      value: !1
    },
    enable: {
      type: Boolean,
      value: !0
    }
  },
  data: {
    info: "111"
  },
  computed: {
    unitVisible: function(t) {
      return null != t.unit && t.unit.length > 0
    }
  },
  methods: {
    onClickButton: function() {
      console.log("click Button");
      var t = !this.data.on;
      this.triggerEvent("onclick", {
        action: t
      })
    }
  }
});