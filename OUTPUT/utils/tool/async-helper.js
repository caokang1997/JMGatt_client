var e = require("../../@babel/runtime/helpers/regeneratorRuntime"),
  r = require("../../@babel/runtime/helpers/asyncToGenerator");
module.exports = {
  waitUntil: function(n) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1e4,
      a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 100,
      u = null,
      i = !1,
      o = null,
      c = new Promise((function(c, l) {
        o = l;
        var s = Date.now(),
          p = function() {
            var o = r(e().mark((function r() {
              var o, v, w;
              return e().wrap((function(e) {
                for (;;) switch (e.prev = e.next) {
                  case 0:
                    if (!i) {
                      e.next = 2;
                      break
                    }
                    return e.abrupt("return");
                  case 2:
                    return e.prev = 2, o = Date.now() - s, v = Math.max(0, t - o), e.next = 7, n(v);
                  case 7:
                    if (!(w = e.sent)) {
                      e.next = 11;
                      break
                    }
                    return c(w), e.abrupt("return");
                  case 11:
                    e.next = 16;
                    break;
                  case 13:
                    e.prev = 13, e.t0 = e.catch(2), console.warn("waitUntil: conditionFn threw error", e.t0);
                  case 16:
                    if (!(Date.now() - s >= t)) {
                      e.next = 19;
                      break
                    }
                    return l(new Error("WaitUntil: Timeout")), e.abrupt("return");
                  case 19:
                    u = setTimeout(p, a);
                  case 20:
                  case "end":
                    return e.stop()
                }
              }), r, null, [
                [2, 13]
              ])
            })));
            return function() {
              return o.apply(this, arguments)
            }
          }();
        p()
      }));
    return c.cancel = function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "WaitUntil: Cancelled";
      i || (i = !0, u && (clearTimeout(u), u = null), o && o(new Error(e)))
    }, c
  }
};