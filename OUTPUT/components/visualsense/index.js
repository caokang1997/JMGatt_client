var e = require("miniprogram-computed").behavior;
Component({
  behaviors: [e],
  properties: {
    quickDistanceDesc: {
      type: String,
      value: "0.1m"
    },
    humanMarginTopPercent: {
      type: Number,
      value: 5
    },
    rangingRadio: {
      type: Number,
      value: 1
    }
  },
  data: {},
  computed: {
    humanMarginTop: function(e) {
      return 150 + 290 * e.humanMarginTopPercent
    },
    currentDistanceTop: function(e) {
      return 265 + 295 * e.humanMarginTopPercent
    }
  },
  methods: {
    onBack: function() {}
  }
});