var e = (wx.getAccountInfoSync() || {}).miniProgram,
  o = void 0 === e ? {} : e,
  t = "develop" === o.envVersion || "trial" === o.envVersion ? "https://ailabs.jomoo.com/ai/period" : "https://myiot.jomoo.com.cn/ai/period",
  n = null;
module.exports = {
  request: function(e) {
    var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      r = arguments.length > 2 ? arguments[2] : void 0,
      a = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
    return new Promise((function(i, d) {
      wx.request({
        url: t + e,
        data: o,
        method: r,
        header: {
          Authorization: "Bearer " + wx.getStorageSync("token")
        },
        success: function(t) {
          if (200 === t.statusCode && 0 === t.data.code) i(t.data), wx.hideLoading();
          else if (2 !== t.data.code || a) {
            var u = "服务器繁忙，请稍后再试";
            t.Msg && (u = t.Msg), t.data.message && (u = t.data.message), wx.showToast({
              icon: "error",
              title: u
            }), d(u)
          } else n = null, wx.removeStorageSync("token"), wx.removeStorageSync("openId"), wx.login().then((function(e) {
            var o = wx.getAccountInfoSync().miniProgram.appId;
            return new Promise((function(t, n) {
              wx.request({
                url: "https://myiot.jomoo.com.cn/appbackends/customized/pub/authlogin",
                data: {
                  appid: o,
                  code: e.code
                },
                method: "POST",
                success: function(e) {
                  t(e.data)
                },
                fail: function(e) {
                  n(e)
                }
              })
            }))
          })).then((function(t) {
            if (200 == t.code) return n = t.data.token, wx.setStorageSync("token", n), wx.setStorageSync("openId", t.data.openId), o.openId = t.data.openId, module.exports.request(e, o, r, !0);
            throw new Error("重新登录失败")
          })).then(i).catch((function(e) {
            console.error("自动重登失败:", e), wx.showToast({
              icon: "error",
              title: "登录失败请重试"
            }), d(e)
          }))
        },
        fail: function(e) {
          wx.showToast({
            icon: "error",
            title: "网络异常访问失败"
          }), d(new Error("网络异常访问失败"))
        }
      })
    }))
  },
  requestAfterAutoLogin: function(e) {
    var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      t = arguments.length > 2 ? arguments[2] : void 0;
    if (null == n) return wx.login().then((function(e) {
      var o = e.code,
        t = wx.getAccountInfoSync().miniProgram.appId;
      return module.exports.request("/customized/pub/authlogin", {
        appid: t,
        code: o
      }, "POST")
    })).then((function(r) {
      if (200 == r.code) {
        var a = r.data.openId;
        return n = r.data.token, wx.setStorageSync("token", n), wx.setStorageSync("openId", a), o.openId = a, module.exports.request(e, o, t)
      }
      throw new Error("请求失败")
    }));
    var r = wx.getStorageSync("openId");
    return o.openId = r, module.exports.request(e, o, t)
  },
  requestRaw: function(e) {
    var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      n = arguments.length > 2 ? arguments[2] : void 0;
    return new Promise((function(r, a) {
      wx.request({
        url: t + e,
        data: o,
        method: n,
        header: {
          Authorization: "Bearer " + wx.getStorageSync("token")
        },
        success: function(e) {
          r(e.data), wx.hideLoading()
        },
        fail: function(e) {
          wx.showToast({
            icon: "error",
            title: "接口无响应"
          }), a(new Error("接口无响应"))
        }
      })
    }))
  },
  fetchPeriodUserInfo: function(e) {
    var o = e.uid,
      t = e.device_id,
      n = e.toilet_model,
      r = e.jmZtmxm,
      a = e.model,
      i = e.mac,
      d = e.openId,
      u = e.token;
    return this.request("/user/info", {
      uid: o,
      device_id: t,
      toilet_model: n,
      jmZtmxm: r,
      model: a,
      mac: i,
      openId: d,
      token: u
    }, "POST")
  },
  fetchCustomWashParams: function(e, o, t) {
    var n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 2;
    return e && o && t ? this.request("/mode_param/query", {
      productKey: e,
      openId: o,
      deviceId: t
    }, "POST").then((function(e) {
      var o, t, r = n > 0 ? n - 1 : 2;
      return (null == e || null === (o = e.data) || void 0 === o || null === (t = o[r]) || void 0 === t ? void 0 : t.stages) || []
    })).catch((function() {
      return []
    })) : Promise.resolve(null)
  },
  saveCustomWashParams: function(e) {
    var o = e.productKey,
      t = e.openId,
      n = e.deviceId,
      r = e.modeNum,
      a = e.selected,
      i = e.stages,
      d = e.modeName,
      u = void 0 === d ? "" : d;
    return o && t && n && void 0 !== r && void 0 !== a && i ? this.request("/mode_param/save", {
      productKey: o,
      openId: t,
      deviceId: n,
      modeNum: r,
      modeName: u,
      selected: a,
      stages: i
    }, "POST") : Promise.resolve(null)
  }
};