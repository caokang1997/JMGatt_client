var e, o = (e = require("../../utils/debuglog.js")) && e.__esModule ? e : {
  default: e
};
var t = "https://myiot.jomoo.com.cn/appbackends",
  n = "https://myiot.jomoo.com.cn",
  r = null;
require("../log.js");

function a(e) {
  if (!e) return o.default.error("token为空"), !0;
  try {
    var t = e.split(".");
    if (3 !== t.length) return !0;
    var n = t[1],
      r = (n = n.replace(/-/g, "+").replace(/_/g, "/")).length % 4;
    r && (n += new Array(5 - r).join("="));
    var a = wx.base64ToArrayBuffer(n),
      l = function(e) {
        var o, t, n, r, a, l;
        for (o = "", n = e.length, t = 0; t < n;) switch ((r = e[t++]) >> 4) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            o += String.fromCharCode(r);
            break;
          case 12:
          case 13:
            a = e[t++], o += String.fromCharCode((31 & r) << 6 | 63 & a);
            break;
          case 14:
            a = e[t++], l = e[t++], o += String.fromCharCode((15 & r) << 12 | (63 & a) << 6 | (63 & l) << 0)
        }
        return o
      }(new Uint8Array(a)),
      c = JSON.parse(l);
    if (c && c.exp) {
      var s = Math.floor(Date.now() / 1e3),
        u = s >= c.exp - 3600;
      return o.default.debug("token过期时间 = ", new Date(1e3 * c.exp)), o.default.debug("token过期时间(1) = ", new Date(1e3 * (c.exp - 3600))), o.default.debug("当前时间 = ", new Date(1e3 * s)), o.default.debug("token是否过期 = ", u), u
    }
    return o.default.error("token解析错误"), !0
  } catch (e) {
    return o.default.error("token解析错误", e), !0
  }
}
module.exports = {
  request: function(e) {
    var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      n = arguments.length > 2 ? arguments[2] : void 0;
    return console.log("发送请求"), console.log(o), new Promise((function(a, l) {
      wx.request({
        url: t + e,
        data: o,
        method: n,
        header: {
          Authorization: "Bearer " + wx.getStorageSync("token")
        },
        success: function(e) {
          console.log("==== 请求返回 ===="), console.log(e), 200 === e.statusCode && 200 === e.data.code ? (console.log("==== 请求成功 ===="), a(e.data), wx.hideLoading()) : (console.log("==== 请求失败1 ==== token = " + r), 600 == e.data.code && (r = ""), l(e.data.message))
        },
        fail: function(e) {
          console.log("==== 请求失败2 ==== token = " + r), console.log(e), wx.showToast({
            icon: "error",
            title: "网络异常"
          }), l(new Error("网络异常"))
        }
      })
    }))
  },
  requestAfterAutoLogin: function(e) {
    var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      t = arguments.length > 2 ? arguments[2] : void 0;
    if (a(r)) return console.log("=================== token为空或过期 ===================", new Date), wx.login().then((function(e) {
      var o = e.code;
      console.log("=== 获取数据 ===", new Date);
      var t = wx.getAccountInfoSync().miniProgram.appId;
      return module.exports.request("/customized/pub/authlogin", {
        appid: t,
        code: o
      }, "POST")
    })).then((function(n) {
      if (console.log("=== 服务器授权 ===", n), 200 == n.code) {
        var a = n.data.openId;
        return r = n.data.token, wx.setStorageSync("token", r), wx.setStorageSync("openId", a), o.openId = a, module.exports.request(e, o, t)
      }
      throw new Error("请求失败")
    }));
    console.log("=================== token不为空 == token = " + r);
    var n = wx.getStorageSync("openId");
    return o.openId = n, module.exports.request(e, o, t)
  },
  requestRawAfterAutoLogin: function(e) {
    var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      t = arguments.length > 2 ? arguments[2] : void 0;
    if (null == r && (r = wx.getStorageSync("token")), a(r)) return console.log("=================== token为空或过期 ===================", new Date), wx.login().then((function(e) {
      var o = e.code;
      console.log("=== 获取数据 ===", new Date);
      var t = wx.getAccountInfoSync().miniProgram.appId;
      return module.exports.request("/customized/pub/authlogin", {
        appid: t,
        code: o
      }, "POST")
    })).then((function(n) {
      if (console.log("=== 服务器授权 ===", n), console.log("token = ", r), 200 == n.code) {
        var a = n.data.openId;
        return r = n.data.token, wx.setStorageSync("token", r), wx.setStorageSync("openId", a), o.openId = a, module.exports.requestRaw(e, o, t)
      }
      throw new Error("请求失败")
    }));
    console.log("=================== token不为空 == token = " + r);
    var n = wx.getStorageSync("openId");
    return o.openId = n, module.exports.requestRaw(e, o, t)
  },
  requestRaw: function(e) {
    var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      n = arguments.length > 2 ? arguments[2] : void 0;
    return console.log("==== 发送请求 ====", t + e), console.log("==== 发送请求 ====", o), new Promise((function(r, a) {
      wx.request({
        url: t + e,
        data: o,
        method: n,
        header: {
          Authorization: "Bearer " + wx.getStorageSync("token")
        },
        success: function(e) {
          console.log("==== 请求成功 ===="), console.log(e), r(e.data), wx.hideLoading()
        },
        fail: function(e) {
          console.log("==== 请求失败 ==== 2"), wx.showToast({
            icon: "error",
            title: "接口无响应"
          }), a(new Error("接口无响应"))
        }
      })
    }))
  },
  request1: function(e) {
    var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      t = arguments.length > 2 ? arguments[2] : void 0;
    return console.log("发送请求"), console.log(o), new Promise((function(a, l) {
      wx.request({
        url: n + e,
        data: o,
        method: t,
        header: {
          Authorization: "Bearer " + wx.getStorageSync("token")
        },
        success: function(e) {
          console.log("==== 请求返回 ===="), console.log(e), 200 === e.statusCode && 200 === e.data.code ? (console.log("==== 请求成功 ===="), a(e.data), wx.hideLoading()) : (console.log("==== 请求失败1 ==== token = " + r), l(e.data.message))
        },
        fail: function(e) {
          console.log("==== 请求失败2 ==== token = " + r), console.log(e), wx.showToast({
            icon: "error",
            title: "网络异常"
          }), l(new Error("网络异常"))
        }
      })
    }))
  }
};