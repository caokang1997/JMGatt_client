var e = require("miniprogram-computed").behavior;
Component({
  behaviors: [e],
  properties: {
    src: {
      type: String,
      value: "-"
    },
    on: {
      type: Boolean,
      value: !1
    },
    title: {
      type: String,
      value: "-"
    }
  },
  computed: {
    iconBtn: function(e) {
      return e.on ? "/image/ic_mode_pause.png" : "/image/ic_mode_play.png"
    }
  },
  data: {},
  methods: {
    onClickBtn: function() {
      var e = !this.data.on;
      this.setData({
        on: e
      })
    }
  }
});