var t = require("miniprogram-computed").behavior;
Component({
  behaviors: [t],
  properties: {
    showEnableSwitch: {
      type: Boolean,
      value: !0
    },
    checked: {
      type: Boolean,
      value: !1
    },
    title: {
      type: String,
      value: "选择时间"
    },
    startHour: {
      type: Number,
      value: 1,
      observer: function(t, e) {
        t != e && this.updateTime()
      }
    },
    startMinute: {
      type: Number,
      value: 2,
      observer: function(t, e) {
        t != e && this.updateTime()
      }
    },
    endHour: {
      type: Number,
      value: 3,
      observer: function(t, e) {
        t != e && this.updateTime()
      }
    },
    endMinute: {
      type: Number,
      value: 4,
      observer: function(t, e) {
        t != e && this.updateTime()
      }
    }
  },
  data: {
    showStartTime: !0,
    startValue: [0, 0],
    endValue: [0, 0]
  },
  lifetimes: {
    attached: function() {
      this.updateTime()
    }
  },
  computed: {
    timeString: function(t) {
      if (!t.checked) return "";
      var e = String(t.startValue[0]).padStart(2, "0"),
        a = String(t.startValue[1]).padStart(2, "0"),
        i = String(t.endValue[0]).padStart(2, "0"),
        n = String(t.endValue[1]).padStart(2, "0");
      return "".concat(e, ":").concat(a, " 至 ").concat(i, ":").concat(n)
    }
  },
  methods: {
    updateTime: function() {
      var t = this.properties,
        e = t.startHour,
        a = t.startMinute,
        i = t.endHour,
        n = t.endMinute;
      this.setData({
        startValue: [e, a],
        endValue: [i, n]
      })
    },
    onSwitchChange: function(t) {
      var e = t.detail.data;
      this.setData({
        checked: e
      }), this.triggerEvent("onclick", {
        check: t.detail.data
      })
    },
    onClickStartTime: function(t) {
      this.setData({
        startHour: this.data.startValue[0],
        startMinute: this.data.startValue[1]
      }), this.setData({
        showStartTime: !0
      })
    },
    onClickEndTime: function(t) {
      this.setData({
        endHour: this.data.endValue[0],
        endMinute: this.data.endValue[1]
      }), this.setData({
        showStartTime: !1
      })
    },
    onStartTimeChange: function(t) {
      console.log(t.detail.value), this.setData({
        startValue: t.detail.value
      })
    },
    onEndTimeChange: function(t) {
      console.log(t.detail.value), this.setData({
        endValue: t.detail.value
      })
    },
    onCancel: function() {
      this.triggerEvent("cancel")
    },
    onConfirm: function() {
      var t = this.data.startValue[0],
        e = this.data.startValue[1],
        a = this.data.endValue[0],
        i = this.data.endValue[1],
        n = this.data.checked;
      this.triggerEvent("confirm", {
        checked: n,
        startHour: t,
        startMinute: e,
        endHour: a,
        endMinute: i
      })
    }
  }
});