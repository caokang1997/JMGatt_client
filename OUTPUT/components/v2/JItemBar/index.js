var e = require("miniprogram-computed").behavior;
Component({
  behaviors: [e],
  properties: {
    mode: {
      type: Number,
      value: 0
    },
    showContent: {
      type: Boolean,
      value: !0
    },
    title: {
      type: String,
      value: "-"
    },
    icon: {
      type: String,
      value: "jd176s/ic_nightlight"
    },
    on: {
      type: Boolean,
      value: !1
    },
    enable: {
      type: Boolean,
      value: !0
    },
    colorOff: {
      type: String,
      value: "#EAEAFB"
    },
    colorOn: {
      type: String,
      value: "#724FFD"
    },
    content: {
      type: String,
      value: ""
    },
    baseSrcPath: {
      type: String,
      value: "/image/all/"
    }
  },
  data: {
    info: "111"
  },
  computed: {
    imageIcon: function(e) {
      return e.baseSrcPath + e.icon + (e.on ? "_on" : "_off") + ".png"
    }
  },
  methods: {
    onClickButton: function() {
      console.log("click Button Bar");
      this.data.on;
      this.triggerEvent("onclick", {
        mode: this.data.mode
      })
    }
  }
});