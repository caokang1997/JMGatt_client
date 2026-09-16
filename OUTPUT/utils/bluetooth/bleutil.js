var e = require("../../config/device_enum.js"),
  r = !1,
  t = function(e) {
    console.log("[eciot]:" + JSON.stringify(e))
  },
  o = function() {
    return new Promise((function(e, r) {
      wx.getSetting({
        success: function(r) {
          t(r), r.authSetting && r.authSetting["scope.bluetooth"] ? e({
            ok: !0,
            errCode: 0,
            errMsg: ""
          }) : e({
            ok: !1,
            errCode: 30001,
            errMsg: "getSetting fail"
          })
        },
        fail: function(r) {
          t(r), e({
            ok: !1,
            errCode: r.errCode ? r.errCode : 3e4,
            errMsg: r.errMsg ? r.errMsg : "getSetting fail"
          })
        }
      })
    }))
  },
  n = function() {
    return new Promise((function(e, r) {
      wx.authorize({
        scope: "scope.bluetooth",
        success: function(r) {
          t(r), e({
            ok: !0,
            errCode: 0,
            errMsg: ""
          })
        },
        fail: function(r) {
          t(r), e({
            ok: !1,
            errCode: 3e4,
            errMsg: r.errMsg
          })
        }
      })
    }))
  };

function i(e) {
  return !(!e.name && !e.localName) && (!!e.name.startsWith("JMMO") || (!!e.name.startsWith("KeMu") || (!(!e.name || !e.name.startsWith("JOMOO")) || !(!e.localName || !e.localName.startsWith("JOMOO")))))
}

function a(e, r, t) {
  var o = new Uint8Array(e);
  if (r >= 0 && r < o.length && t > 0) {
    var n = r + t;
    if (n <= o.length) {
      for (var i = [], a = r; a < n; a++) {
        var s = o[a].toString(16).toUpperCase().padStart(2, "0");
        i.push(s)
      }
      return i.join("")
    }
    return ""
  }
  return ""
}
module.exports = {
  ab2hex: function(e) {
    return Array.prototype.map.call(new Uint8Array(e), (function(e) {
      return ("00" + e.toString(16)).slice(-2)
    })).join("")
  },
  ab2hexFromStart: function(e, r, t) {
    for (var o = new Uint8Array(e, r, t), n = "", i = Math.min(e.length, r + t), a = r; a < i; a++) {
      n += o[a].toString(16).padStart(2, "0")
    }
    return n
  },
  getHexString: a,
  getMac: function(e) {
    return i(e) ? function(e) {
      if (e.name && e.name.startsWith("JMMO")) return !0;
      if (e.name && e.name.startsWith("KeMu")) return !0;
      return !1
    }(e) ? e.deviceId.split(":").join("") : a(e.advertisData, 0, 6).toUpperCase() : e.deviceId
  },
  isJomooDevice: i,
  getDeviceTypeCode: function(e) {
    var r = e.advertisData;
    return !r || r.byteLength < 9 ? "-" : a(e.advertisData, 9, 3)
  },
  getDeviceProductName: function(r) {
    var t = r.advertisData;
    if (null == t || t.byteLength < 9) return "九牧智能马桶";
    var o = a(r.advertisData, 9, 3);
    if ("000000" === o) return "九牧智能马桶";
    var n = (0, e.getDeviceInfo)(o);
    return n ? n.showName : "九牧智能马桶-".concat(o)
  },
  getDeviceProductNameByTypeCode: function(r) {
    if ("000000" === r) return "九牧智能马桶";
    var t = (0, e.getDeviceInfo)(r);
    return t ? t.showName : "九牧智能马桶-".concat(r)
  },
  checkBlePermision: function() {
    var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    return new Promise((function(t, i) {
      r = !1;
      var a = wx.getSystemInfoSync(),
        s = a.brand;
      if (console.log("systemInfo", a), "android" === a.platform.toLowerCase() && (r = !0), !a.bluetoothEnabled) {
        var u = "请打开手机蓝牙开关";
        return r || (u = "请打开手机蓝牙开关\n2.检查手机系统设置页面微信的蓝牙权限(在IOS设置页面,选择APP,选择微信,打开蓝牙开关)"), void t({
          ok: !1,
          errCode: 30001,
          errMsg: u
        })
      }
      e && r && !a.locationEnabled ? t({
        ok: !1,
        errCode: 30002,
        errMsg: "请打开手机位置定位开关"
      }) : e && r && !a.locationAuthorized ? t("HUAWEI" == s ? {
        ok: !1,
        errCode: 30003,
        errMsg: "检查微信附近设备权限(手机设置页面->应用与服务->应用管理->微信->打开附近设备权限)"
      } : "Redmi" == s ? {
        ok: !1,
        errCode: 30003,
        errMsg: "检查并打开微信位置信息权限(手机设置页面->应用设置->应用管理->微信->位置信息->选择使用时允许)"
      } : {
        ok: !1,
        errCode: 30003,
        errMsg: "检查并打开微信位置信息权限(手机设置页面->应用->应用管理->微信->位置信息->选择使用时允许)"
      }) : o().then((function(e) {
        e.ok ? wx.openBluetoothAdapter({
          mode: "central",
          success: function(e) {
            t({
              ok: !0,
              errCode: 0,
              errMsg: ""
            })
          },
          fail: function(e) {
            console.log(e), 3 == e.errno ? "HUAWEI" == s ? t({
              ok: !1,
              errCode: 30005,
              errMsg: "检查微信附近设备权限(手机设置页面->应用与服务->应用管理->微信->打开附近设备权限)"
            }) : "Redmi" == s || "xiaomi" == s.toLowerCase() ? t({
              ok: !1,
              errCode: 30005,
              errMsg: "检查并打开微信附近设备权限(手机设置页面->应用设置->应用管理->微信->权限管理->打开附近设备权限)"
            }) : t("OPPO" == s ? {
              ok: !1,
              errCode: 30005,
              errMsg: "检查并打开微信附近设备权限(手机设置页面->应用->应用管理->微信->权限管理->打开附近的设备权限)"
            } : {
              ok: !1,
              errCode: 30005,
              errMsg: "检查并打开手机设置中微信附近设备权限"
            }) : t({
              ok: !1,
              errCode: 30006,
              errMsg: "检查手机系统设置页面微信的蓝牙权限"
            })
          }
        }) : n().then((function(e) {
          e.ok ? t({
            ok: !0,
            errCode: 0,
            errMsg: ""
          }) : t({
            ok: !1,
            errCode: 30004,
            errMsg: "请打开小程序蓝牙开关：点击小程序右上角三个点(或五角星)后，点击“设置”，设置成使用小程序时允许使用蓝牙"
          })
        }))
      }))
    }))
  },
  byteToString: function(e) {
    if ("string" == typeof e) return e;
    for (var r = "", t = e, o = 0; o < t.length; o++) {
      var n = t[o].toString(2),
        i = n.match(/^1+?(?=0)/);
      if (i && 8 == n.length) {
        for (var a = i[0].length, s = t[o].toString(2).slice(7 - a), u = 1; u < a; u++) s += t[u + o].toString(2).slice(2);
        r += String.fromCharCode(parseInt(s, 2)), o += a - 1
      } else r += String.fromCharCode(t[o])
    }
    return r
  },
  authorize: n,
  getDeviceModelByJmZtmxm: function(r) {
    var t = (0, e.getDeviceInfo)(r);
    return t ? t.model.toUpperCase() : ""
  },
  decodeStr: function(e) {
    for (var r = 0, t = "", o = "", n = e.toUpperCase(); r < n.length;) "FD01" === (t = n.substr(r, 4)) ? (o += "FC", r += 4) : "FD02" === t ? (o += "FD", r += 4) : (o += n.substr(r, 2), r += 2);
    return console.log("转义结果：" + o.toLowerCase()), o
  },
  hexStringToByteArray: function(e) {
    if (e.length % 2 != 0) throw new Error("Invalid hex string length");
    for (var r = new Uint8Array(e.length / 2), t = 0; t < e.length; t += 2) {
      var o = parseInt(e.substr(t, 2), 16);
      r[t / 2] = o
    }
    return r
  },
  int8ToBuffer: function(e) {
    var r = new ArrayBuffer(1);
    return new Int8Array(r)[0] = e, r
  },
  encodeStr: function(e) {
    var r = 2,
      t = "",
      o = "",
      n = e.toUpperCase();
    for (console.log("原始指令：" + n.toLowerCase()), o = n.substr(0, 2); r < n.length - 2;) o += "FC" == (t = n.substr(r, 2)) ? "FD01" : "FD" === t ? "FD02" : t, r += 2;
    return o += n.substr(n.length - 2, 2), console.log("转义指令：" + o.toLowerCase()), o
  },
  utf8ArrayToAsc2String: function(e) {
    for (var r = "", t = 0; t < e.length;) {
      var o = e[t++];
      if (o < 128) r += String.fromCharCode(o);
      else if (o >= 192 && o < 224) {
        var n = e[t++];
        r += String.fromCharCode((31 & o) << 6 | 63 & n)
      } else if (o >= 224 && o < 240) {
        var i = e[t++],
          a = e[t++];
        r += String.fromCharCode((15 & o) << 12 | (63 & i) << 6 | 63 & a)
      }
    }
    return r
  }
};