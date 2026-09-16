var e = require("./config.js");

function n() {
  var e = "",
    n = "mock-openid-777776";
  try {
    e = wx.getStorageSync("token") || "", n = wx.getStorageSync("openId") || "mock-openid-777776"
  } catch (e) {}
  return {
    token: e,
    openId: n
  }
}
var o = null,
  t = null,
  c = null;

function r() {
  return c || (c = e.MOCK_SCENES.map((function(e) {
    return Object.assign({}, e)
  }))), c
}

function s(e, n) {
  var o = r(),
    t = o.find((function(n) {
      return n.id === e
    }));
  t ? t.enable = !!n : o.push({
    id: e,
    enable: !!n
  })
}
module.exports = {
  install: function() {
    t || (o = require("../http/JomooCloudRequest.js"), t = o.request, o.request = function(e, o, c) {
      return "/customized/pub/authlogin" === e ? (console.log("[MOCK] 云端自动登录（未实际请求，不伪造 token）"), Promise.resolve({
        code: 200,
        data: n()
      })) : "/sceneForWechat/getSceneInfo" === e ? (console.log("[MOCK] 查询场景联动态（未实际请求）", o), Promise.resolve({
        code: 200,
        data: {
          rtn: 1,
          scenes: r().map((function(e) {
            return Object.assign({}, e)
          }))
        }
      })) : "/sceneForWechat/saveSceneInfo" === e ? (console.log("[MOCK] 保存场景联动态（未实际请求）", o), (o && o.scenes || []).forEach((function(e) {
        e && null != e.id && s(e.id, e.enable)
      })), Promise.resolve({
        code: 200,
        data: {}
      })) : t.call(this, e, o, c)
    })
  },
  uninstall: function() {
    t && (o.request = t, t = null)
  },
  setSceneEnable: s,
  currentScenes: r
};