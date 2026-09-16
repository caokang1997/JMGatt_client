var e = require("miniprogram-computed").behavior;
Component({
  behaviors: [e],
  properties: {
    title: {
      type: String,
      value: ""
    },
    content: {
      type: String,
      value: ""
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
    },
    enable: {
      type: Boolean,
      value: !0
    }
  },
  data: {},
  computed: {
    hasInfo: function(e) {
      return null != e.info && e.info.length > 0
    }
  },
  methods: {
    onClickContent: function(e) {
      this.data.enable && this.data.withClick && this.triggerEvent("onclick", {})
    }
  }
});