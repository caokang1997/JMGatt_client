for (var e = require("../../@babel/runtime/helpers/createForOfIteratorHelper"), t = require("miniprogram-computed").behavior, n = [], r = [], a = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], i = 0; i < 24; i++) i < 10 ? n.push("0".concat(i)) : n.push("".concat(i));
for (var o = 0; o < 60; o++) o < 10 ? r.push("0".concat(o)) : r.push("".concat(o));
Component({
  behaviors: [t],
  properties: {
    default: {
      type: String,
      value: "08:01"
    },
    weeks: {
      type: String,
      value: "1,2,3,4"
    }
  },
  data: {
    value: [3, 8],
    mins: r,
    hours: n,
    time: "00:00"
  },
  computed: {
    weekStrings: function(t) {
      if (0 == t.weeks.length) return "";
      var n = t.weeks.split(",").map((function(e) {
        return parseInt(e)
      }));
      if (0 == n.length) return "";
      if (1 == n.length) return a[n[0]];
      n.sort((function(e, t) {
        return e - t
      }));
      for (var r = !0, i = 1; i < n.length; i++)
        if (n[i] !== n[i - 1] + 1) {
          r = !1;
          break
        } if (r) return a[n[0]] + "至" + a[n[n.length - 1]];
      var o, c = "",
        l = e(n);
      try {
        for (l.s(); !(o = l.n()).done;) {
          var s = o.value;
          c += a[s] + ","
        }
      } catch (e) {
        l.e(e)
      } finally {
        l.f()
      }
      return c.replace(/^,|,$/g, "")
    }
  },
  lifetimes: {
    ready: function() {
      if (null != this.data.default) {
        var e = this.data.default.split(":");
        console.log("values = ", e);
        var t = parseInt(e[0]),
          n = parseInt(e[1]);
        this.setData({
          value: [t, n],
          time: this.data.default
        })
      }
    }
  },
  methods: {
    bindChange: function(e) {
      var t = e.detail.value;
      console.log(t);
      var n = this.data.hours[t[0]],
        r = this.data.mins[t[1]],
        a = "".concat(n, ":").concat(r);
      this.setData({
        time: a
      })
    },
    onClickConfirm: function() {
      var e = this.data.time;
      this.triggerEvent("onclickconfirm", {
        time: e
      })
    },
    onClickCancel: function() {
      console.log("-- timepicker --onclickcancel"), this.triggerEvent("onclickcancel", {})
    },
    onClickRepeat: function() {
      this.triggerEvent("onclickrepeat", {})
    }
  }
});