require("../../@babel/runtime/helpers/Arrayincludes");
var e = require("miniprogram-computed").behavior;
Component({
  behaviors: [e],
  properties: {
    isAuto: {
      type: Boolean,
      value: !1
    },
    isDryMode: {
      type: Boolean,
      value: !1
    },
    canDryWhenRedBlueLight: {
      type: Boolean,
      value: !1
    },
    isRedBlueLight: {
      type: Boolean,
      value: !1
    },
    title: {
      type: String,
      value: "童洗中"
    },
    content: {
      type: null,
      value: "02:59",
      observer: function(e) {
        "number" == typeof e && this.setData({
          showIcon: !1
        }), "string" == typeof e && (e.includes("image") ? this.setData({
          icon: e,
          showIcon: !0
        }) : this.setData({
          icon: "",
          showIcon: !1
        }))
      }
    }
  },
  data: {
    icon: "",
    showIcon: !1,
    animationClass: "auto-rotate"
  },
  computed: {
    getTitle: function(e) {
      return "/image/bright/ic_state_dry.png" == e.content ? "暖风中" : e.isAuto && e.isDryMode && "number" == typeof e.content ? "暖风剩余时间" : e.isAuto ? e.title.replace("暖风", "水洗") : e.title
    }
  },
  lifetimes: {
    ready: function() {}
  },
  methods: {}
});