Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.byteUtils = void 0;
var e = require("../../@babel/runtime/helpers/classCallCheck"),
  t = require("../../@babel/runtime/helpers/createClass"),
  a = new(function() {
    function a() {
      e(this, a)
    }
    return t(a, [{
      key: "setBit",
      value: function(e, t, a) {
        return t = this._validateBitIndex(t), 1 === (a = this._validateBitValue(a)) ? e | 1 << t : e & ~(1 << t)
      }
    }, {
      key: "setBits",
      value: function(e, t, a, r) {
        var i = this._validateBitRange(t, a),
          n = i.start,
          u = (i.end, i.bitCount),
          s = i.maxValue;
        return this._validateRangeValue(r, s), e & ~((1 << u) - 1 << n & 255) | (r & s) << n
      }
    }, {
      key: "getBit",
      value: function(e, t) {
        return e >> (t = this._validateBitIndex(t)) & 1
      }
    }, {
      key: "getBits",
      value: function(e, t, a) {
        var r = this._validateBitRange(t, a),
          i = r.start;
        r.end;
        return e >> i & (1 << r.bitCount) - 1
      }
    }, {
      key: "_validateBitIndex",
      value: function(e) {
        var t = parseInt(e);
        if (isNaN(t) || t < 0 || t > 7) throw new Error("位索引必须是0-7的整数");
        return t
      }
    }, {
      key: "_validateBitValue",
      value: function(e) {
        var t = parseInt(e);
        if (isNaN(t) || 0 !== t && 1 !== t) throw new Error("位值必须是0或1");
        return t
      }
    }, {
      key: "_validateBitRange",
      value: function(e, t) {
        var a = parseInt(e),
          r = parseInt(t);
        if (isNaN(a) || isNaN(r) || a < 0 || r > 7 || a > r) throw new Error("位范围无效，必须是0-7的整数且start<=end");
        return {
          start: a,
          end: r,
          bitCount: r - a + 1,
          maxValue: (1 << r - a + 1) - 1
        }
      }
    }, {
      key: "_validateRangeValue",
      value: function(e, t) {
        var a = parseInt(e);
        if (isNaN(a) || a < 0 || a > t) throw new Error("值超出范围（0-".concat(t, "）"))
      }
    }]), a
  }());
exports.byteUtils = a;