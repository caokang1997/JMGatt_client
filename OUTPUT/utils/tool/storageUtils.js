Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.storage = void 0;
var e = require("../../@babel/runtime/helpers/classCallCheck"),
  r = require("../../@babel/runtime/helpers/createClass"),
  t = new(function() {
    function t() {
      e(this, t)
    }
    return r(t, [{
      key: "set",
      value: function(e, r) {
        var t = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        return this.saveJSONStorage(e, r, t)
      }
    }, {
      key: "saveJSONStorage",
      value: function(e, r) {
        var t = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        if ("string" != typeof e || "" === e.trim()) throw new Error("存储键名(key)必须为非空字符串");
        var n = JSON.stringify(r);
        if (t) return new Promise((function(r, t) {
          wx.setStorage({
            key: e,
            data: n,
            success: function() {
              console.log('数据 "'.concat(e, '" 保存成功')), r(!0)
            },
            fail: function(r) {
              console.error('数据 "'.concat(e, '" 保存失败:'), r), t(r)
            }
          })
        }));
        try {
          return wx.setStorageSync(e, n), console.log('数据 "'.concat(e, '" 同步保存成功')), !0
        } catch (r) {
          return console.error('数据 "'.concat(e, '" 同步保存失败:'), r), !1
        }
      }
    }, {
      key: "get",
      value: function(e) {
        var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
          t = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        if (t) return new Promise((function(t, n) {
          wx.getStorage({
            key: e,
            success: function(e) {
              try {
                var n = JSON.parse(e.data);
                t(n)
              } catch (e) {
                t(r)
              }
            },
            fail: function() {
              return t(r)
            }
          })
        }));
        try {
          var n = wx.getStorageSync(e);
          return n ? JSON.parse(n) : r
        } catch (e) {
          return r
        }
      }
    }, {
      key: "remove",
      value: function(e) {
        var r = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        if (r) return new Promise((function(r) {
          wx.removeStorage({
            key: e,
            success: function() {
              return r(!0)
            },
            fail: function() {
              return r(!1)
            }
          })
        }));
        try {
          return wx.removeStorageSync(e), !0
        } catch (e) {
          return !1
        }
      }
    }, {
      key: "clear",
      value: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        if (e) return new Promise((function(e) {
          wx.clearStorage({
            success: function() {
              return e(!0)
            },
            fail: function() {
              return e(!1)
            }
          })
        }));
        try {
          return wx.clearStorageSync(), !0
        } catch (e) {
          return !1
        }
      }
    }]), t
  }());
exports.storage = t;