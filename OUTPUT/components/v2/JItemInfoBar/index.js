var t = require("miniprogram-computed").behavior;
Component({
  options: {
    multipleSlots: !0
  },
  behaviors: [t],
  properties: {
    title: {
      type: String,
      value: "-"
    },
    content: {
      type: String,
      value: "-"
    },
    info: {
      type: String,
      value: ""
    },
    withdivider: {
      type: Boolean,
      value: !0
    },
    icon: {
      type: String,
      value: ""
    },
    withClick: {
      type: Boolean,
      value: !0
    }
  },
  data: {},
  computed: {
    hasInfo: function(t) {
      return null != t.info && t.info.length > 0
    }
  },
  methods: {
    onClickContent: function(t) {
      this.data.withClick && this.triggerEvent("onclick", {})
    }
  }
});