var e = require("miniprogram-computed").behavior;
Component({
  behaviors: [e],
  properties: {
    remoteId: {
      type: Number,
      value: 1
    },
    isMine: {
      type: Boolean,
      value: !0
    },
    title: {
      type: String,
      value: "-"
    },
    icon: {
      type: String,
      value: "ic_custom_woman"
    },
    selectedId: {
      type: Number,
      value: 1
    },
    customs: {
      type: Object,
      value: []
    }
  },
  data: {},
  computed: {
    selectedModeTitle: function(e) {
      for (var t = "童洗模式", o = 0; o < e.customs.length; o++) e.customs[o].mode === e.selectedId && (t = e.customs[o].title);
      return t
    },
    whoSet: function(e) {
      return e.isMine ? "我" : "其他人占用"
    }
  },
  methods: {
    onSelectCustom: function(e) {
      var t = e.currentTarget.dataset.item;
      this.triggerEvent("onSelectCustom", {
        mode: t.mode
      })
    }
  }
});