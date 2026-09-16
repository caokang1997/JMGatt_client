var t = require("miniprogram-computed").behavior;
Component({
  behaviors: [t],
  properties: {
    value: {
      type: String,
      value: "25"
    },
    unit: {
      type: String,
      value: "℃"
    },
    title: {
      type: String,
      value: "-"
    },
    enable: {
      type: Boolean,
      value: !0
    }
  },
  data: {
    info: "111",
    buttonAnimation: null
  },
  computed: {
    mainColor: function(t) {
      if ("℃" == t.unit) {
        var e = parseInt(t.value);
        return e < 30 ? "#2A80F2" : e < 38 ? "#F8D108" : "#FF852D"
      }
      return "#000000"
    },
    imageIcon: function(t) {
      return "/image/all/" + t.icon + (t.on ? "_on" : "_off") + ".png"
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