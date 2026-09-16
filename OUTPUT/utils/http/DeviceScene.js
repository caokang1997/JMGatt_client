var e, n = require("../tool/storageUtils"),
  t = (e = require("../../utils/debuglog.js")) && e.__esModule ? e : {
    default: e
  };

function i(e) {
  var i = n.storage.get(e + "sceneList", []);
  return t.default.follow("获取本地默认的场景列表", e, i), i
}

function o(e, t) {
  n.storage.set(e + "sceneList", t)
}
module.exports = {
  getLocalDeviceScenes: i,
  updateLocalDeviceScenes: o,
  updateLocalDeviceScenesWithScene: function(e) {
    var n = [];
    (e.links || []).forEach((function(e) {
      var t = e.trigger || {},
        i = e.exec || {},
        o = t.mac || "",
        c = i.mac || "";
      o && -1 === n.indexOf(o) && n.push(o), c && -1 === n.indexOf(c) && n.push(c)
    })), n.forEach((function(n) {
      ! function(e, n) {
        var t = i(e),
          c = t.findIndex((function(e) {
            return e.id === n.id
          })); - 1 !== c ? (t[c] = n, o(e, t)) : (t.push(n), o(e, t))
      }(n, e)
    }))
  },
  getLocalScene: function(e, n) {
    var t = i(e);
    return 2 == n || 3 == n ? t.find((function(e) {
      return 2 === e.id || 3 === e.id
    })) : t.find((function(e) {
      return e.id === n
    }))
  },
  deleteScene: function(e) {
    var n = [];
    t.default.follow("删除场景", e), (e.links || []).forEach((function(e) {
      var t = e.trigger || {},
        i = e.exec || {},
        o = t.mac || "",
        c = i.mac || "";
      o && -1 === n.indexOf(o) && n.push(o), c && -1 === n.indexOf(c) && n.push(c)
    })), n.forEach((function(n) {
      t.default.follow("删除场景", e, "涉及设备", n);
      var c = i(n),
        u = c.findIndex((function(n) {
          return n.id === e.id
        })); - 1 !== u ? (c.splice(u, 1), o(n, c), t.default.follow("删除场景", e, "涉及设备", n, "场景删除成功"), t.default.follow("删除场景", e, "涉及设备", n, "场景删除后", c)) : t.default.follow("删除场景", e, "涉及设备", n, "场景不存在")
    }))
  }
};