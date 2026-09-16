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
    showRedPoint: {
      type: Boolean,
      value: !1
    },
    customImgIcon: {
      type: String,
      value: null
    }
  },
  data: {
    info: "111"
  },
  computed: {
    imageIcon: function(e) {
      return e.customImgIcon ? e.customImgIcon : "/image/all/" + e.icon + (e.on ? "_on" : "_off") + ".png"
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