var t = require("miniprogram-computed").behavior;
Component({
  behaviors: [t],
  properties: {
    flexDirection: {
      type: String,
      value: "column"
    },
    mode: {
      type: Number,
      value: 0
    },
    colorOff: {
      type: String,
      value: "#EAEAFB"
    },
    colorOn: {
      type: String,
      value: "#724FFD"
    },
    anim: {
      type: Boolean,
      value: !0
    },
    title: {
      type: String,
      value: "-"
    },
    icon: {
      type: String,
      value: "ic_cover"
    },
    on: {
      type: Boolean,
      value: !1
    },
    enable: {
      type: Boolean,
      value: !0
    },
    photoPath: {
      type: String,
      value: "/image/all/"
    }
  },
  data: {
    info: "111",
    buttonAnimation: null
  },
  computed: {
    imageIcon: function(t) {
      return t.photoPath + t.icon + (t.on ? "_on" : "_off") + ".png"
    }
  },
  methods: {
    onClickButton: function() {
      var t = this;
      if (this.data.enable) {
        if (this.data.anim) {
          var e = wx.createAnimation({
            duration: 200,
            timingFunction: "ease"
          });
          e.scale(1.2).step(), this.setData({
            buttonAnimation: e.export()
          }), setTimeout((function() {
            e.scale(1).step(), t.setData({
              buttonAnimation: e.export()
            })
          }), 200)
        }
        this.triggerEvent("onclick", {
          mode: this.data.mode,
          on: !this.properties.on
        })
      } else this.triggerEvent("onclick", {
        mode: this.data.mode
      })
    }
  }
});