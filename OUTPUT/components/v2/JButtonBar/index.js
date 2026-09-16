var o = require("miniprogram-computed").behavior;
Component({
  behaviors: [o],
  properties: {
    mode: {
      type: Number,
      value: 0
    },
    iconMode: {
      type: String,
      value: "default"
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
    iconSrc: {
      type: String,
      value: ""
    },
    photoPath: {
      type: String,
      value: "/image/all/"
    }
  },
  data: {
    info: "111"
  },
  computed: {
    imageIcon: function(o) {
      return o.photoPath + o.icon + (o.on ? "_on" : "_off") + ".png"
    },
    displayIcon: function(o) {
      return o.iconSrc && String(o.iconSrc).length > 0 ? o.iconSrc : o.photoPath + o.icon + (o.on ? "_on" : "_off") + ".png"
    },
    isSmallIconMode: function(o) {
      return "small" === o.iconMode
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