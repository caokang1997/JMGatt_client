var e = require("../@babel/runtime/helpers/classCallCheck"),
  t = require("../@babel/runtime/helpers/createClass"),
  n = function() {
    function n() {
      e(this, n), this.events = {}
    }
    return t(n, [{
      key: "on",
      value: function(e, t) {
        this.events[e] || (this.events[e] = []), this.events[e].push(t)
      }
    }, {
      key: "emit",
      value: function(e, t) {
        var n = this.events[e];
        n && n.forEach((function(e) {
          e(t)
        }))
      }
    }, {
      key: "off",
      value: function(e, t) {
        var n = this.events[e];
        n && (this.events[e] = n.filter((function(e) {
          return e !== t
        })))
      }
    }]), n
  }();
module.exports = new n;