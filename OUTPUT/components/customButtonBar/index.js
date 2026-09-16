var e = require("miniprogram-computed").behavior;
Component({
  behaviors: [e],
  properties: {
    isExpandVisible: {
      type: Boolean,
      value: !1
    },
    isCustomEnable: {
      type: Boolean,
      value: !0
    },
    isStartCleanActionEnable: {
      type: Boolean,
      value: !0
    },
    customList: {
      type: Array,
      value: []
    },
    customMode: {
      type: Number,
      value: 0
    },
    isShowPeriodBadge: {
      type: Boolean,
      value: !1
    },
    periodBadgeText: {
      type: String,
      value: ""
    }
  },
  data: {
    expand: !0
  },
  computed: {
    customListStyle: function(e) {
      switch (e.customList.length) {
        case 4:
          return "div-private-custom-4";
        case 6:
        case 5:
        case 3:
          return "div-private-custom-3";
        case 2:
          return "div-private-custom-2";
        case 1:
          return "div-private-custom-1"
      }
    }
  },
  methods: {
    onClickCustomMode: function(e) {
      var t = e.detail.mode;
      this.triggerEvent("onClickCustomMode", {
        mode: t
      })
    },
    onClickCustomMore: function(e) {
      this.triggerEvent("onClickCustomMore", {})
    },
    onClickExpand: function(e) {
      this.setData({
        expand: !this.data.expand
      })
    }
  }
});