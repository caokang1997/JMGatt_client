Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.closeBLEConnection = function(e) {
  var t = e.deviceId;
  return new Promise((function(e, r) {
    return wx.closeBLEConnection({
      deviceId: t,
      success: e,
      fail: r
    })
  }))
}, exports.closeBlueToothAdapter = function() {
  return new Promise((function(e, t) {
    return wx.closeBluetoothAdapter({
      success: e,
      fail: t
    })
  }))
}, exports.createBLEConnection = function(e) {
  var t = e.deviceId,
    r = e.timeout;
  return new Promise((function(e, n) {
    return wx.createBLEConnection({
      deviceId: t,
      timeout: r,
      success: e,
      fail: function(t) {
        -1 == t.errCode ? e({
          errCode: 0,
          errMsg: "createBLEConnection:ok",
          errno: 0
        }) : n(t)
      }
    })
  }))
}, exports.getBLEDeviceCharacteristics = a, exports.getBLEDeviceServices = s, exports.getBlueToothAdapterState = function() {
  return new Promise((function(e, t) {
    return wx.getBluetoothAdapterState({
      success: e,
      fail: t
    })
  }))
}, exports.getBlueToothDevices = function() {
  return new Promise((function(e, t) {
    return wx.getBluetoothDevices({
      success: e,
      fail: t
    })
  }))
}, exports.getConnectedBlueToothDevices = function(e) {
  var t = e.services;
  return new Promise((function(e, r) {
    return wx.getConnectedBluetoothDevices({
      services: t,
      success: e,
      fail: r
    })
  }))
}, exports.getStorageSync = function(e) {
  return wx.getStorageSync(e)
}, exports.notifyBLE = function(e) {
  return d.apply(this, arguments)
}, exports.notifyBLECharacteristicValueChange = u, exports.onBLECharacteristicValueChange = function(e) {
  wx.onBLECharacteristicValueChange(e)
}, exports.onBLEConnectionStateChange = function(e) {
  wx.onBLEConnectionStateChange(e)
}, exports.onBluetoothAdapterStateChange = function(e) {
  wx.onBluetoothAdapterStateChange(e)
}, exports.onBluetoothDeviceFound = function(e) {
  wx.onBluetoothDeviceFound(e)
}, exports.openBlueToothAdapter = function() {
  var e = !1;
  try {
    var t = wx.getSystemInfoSync().model;
    e = -1 !== t.indexOf("iPhone 6") || -1 !== t.indexOf("iPhone 7")
  } catch (e) {
    console.error("wx.getSystemInfoSync() error", e)
  }
  return (exports.openBlueToothAdapter = function() {
    return new Promise((function(t, r) {
      e ? setTimeout((function() {
        wx.openBluetoothAdapter({
          success: t,
          fail: r
        })
      }), 150) : wx.openBluetoothAdapter({
        success: t,
        fail: r
      })
    }))
  })()
}, exports.prepareBleService = function(e) {
  return i.apply(this, arguments)
}, exports.readBLECharacteristicValue = o, exports.removeStorageSync = function(e) {
  return wx.removeStorageSync(e)
}, exports.setStorageSync = function(e, t) {
  wx.setStorageSync(e, t)
}, exports.startBlueToothDevicesDiscovery = function(e) {
  var t = arguments;
  e.services, e.allowDuplicatesKey, e.interval;
  return new Promise((function(e, n) {
    return wx.startBluetoothDevicesDiscovery(r(r({}, t[0]), {}, {
      success: e,
      fail: n
    }))
  }))
}, exports.startBluetoothDeviceFound = function(e) {
  var t = e.mac,
    r = e.timeout;
  return console.log("搜索指定设备", new Date),
    function(e, t) {
      var r;
      console.log("withTimeout timeout= ", t);
      var n = new Promise((function(e, n) {
        r = setTimeout((function() {
          console.log("超时了", new Date), n(new Error("Promise timed out"))
        }), t)
      }));
      return Promise.race([e, n]).then((function(e) {
        return clearTimeout(r), e
      }))
    }(new Promise((function(e, r) {
      wx.onBluetoothDeviceFound((function(r) {
        var n = r.devices.filter((function(e) {
          return c.getMac(e) === t
        }));
        console.log("搜索指定设备 -- 1"), null != n && n.length > 0 && (console.log("搜索指定设备 -- 找到设备", new Date), e(n[0].deviceId))
      }))
    })), r)
}, exports.stopBlueToothDevicesDiscovery = function() {
  return new Promise((function(e, t) {
    return wx.stopBluetoothDevicesDiscovery({
      success: e,
      fail: t
    })
  }))
}, exports.writeBLECharacteristicValue = function(e) {
  var t = arguments;
  e.deviceId, e.serviceId, e.characteristicId, e.value;
  return new Promise((function(e, n) {
    return wx.writeBLECharacteristicValue(r(r({}, t[0]), {}, {
      success: e,
      fail: n
    }))
  }))
};
var e = require("../../../@babel/runtime/helpers/regeneratorRuntime"),
  t = require("../../../@babel/runtime/helpers/createForOfIteratorHelper"),
  r = require("../../../@babel/runtime/helpers/objectSpread2"),
  n = require("../../../@babel/runtime/helpers/asyncToGenerator"),
  c = require("../../../utils/bluetooth/bleutil.js");

function i() {
  return (i = n(e().mark((function r(n) {
    var c, i, o, d, v, f, l, h, p, x, I, w, g, B, m, C;
    return e().wrap((function(e) {
      for (;;) switch (e.prev = e.next) {
        case 0:
          return e.next = 2, s({
            deviceId: n
          });
        case 2:
          c = e.sent, i = c.services, o = t(i), e.prev = 5, o.s();
        case 7:
          if ((d = o.n()).done) {
            e.next = 45;
            break
          }
          if (v = d.value, f = v.isPrimary, l = v.uuid, !f) {
            e.next = 43;
            break
          }
          return e.next = 12, a({
            deviceId: n,
            serviceId: l
          });
        case 12:
          h = e.sent, p = h.characteristics, x = h.serviceId, I = t(p), e.prev = 16, I.s();
        case 18:
          if ((w = I.n()).done) {
            e.next = 35;
            break
          }
          if (g = w.value, B = g.properties, m = g.uuid, !B.notify) {
            e.next = 33;
            break
          }
          if (!(m.startsWith("0000FFE1") || m.startsWith("00010203") || m.startsWith("0000F002"))) {
            e.next = 33;
            break
          }
          return !0, C = m, e.prev = 24, e.next = 27, u({
            deviceId: n,
            serviceId: x,
            characteristicId: C,
            state: !0
          });
        case 27:
          e.next = 33;
          break;
        case 29:
          e.prev = 29, e.t0 = e.catch(24), console.log("uuid = ", m), console.error("notifyBLECharacteristicValueChange Error", e.t0);
        case 33:
          e.next = 18;
          break;
        case 35:
          e.next = 40;
          break;
        case 37:
          e.prev = 37, e.t1 = e.catch(16), I.e(e.t1);
        case 40:
          return e.prev = 40, I.f(), e.finish(40);
        case 43:
          e.next = 7;
          break;
        case 45:
          e.next = 50;
          break;
        case 47:
          e.prev = 47, e.t2 = e.catch(5), o.e(e.t2);
        case 50:
          return e.prev = 50, o.f(), e.finish(50);
        case 53:
        case "end":
          return e.stop()
      }
    }), r, null, [
      [5, 47, 50, 53],
      [16, 37, 40, 43],
      [24, 29]
    ])
  })))).apply(this, arguments)
}

function o(e) {
  var t = e.deviceId,
    r = e.serviceId,
    n = e.characteristicId;
  return new Promise((function(e, c) {
    return wx.readBLECharacteristicValue({
      serviceId: r,
      deviceId: t,
      characteristicId: n,
      success: e,
      fail: c
    })
  }))
}

function s(e) {
  var t = e.deviceId;
  return new Promise((function(e, r) {
    return wx.getBLEDeviceServices({
      deviceId: t,
      success: function(t) {
        var r = t.services;
        console.log("device services:", r), e({
          services: r
        })
      },
      fail: r
    })
  }))
}

function a(e) {
  var t = e.deviceId,
    r = e.serviceId;
  return new Promise((function(e, n) {
    return wx.getBLEDeviceCharacteristics({
      deviceId: t,
      serviceId: r,
      success: function(t) {
        var n = t.characteristics;
        console.log("device getBLEDeviceCharacteristics:", n), e({
          characteristics: n,
          serviceId: r
        })
      },
      fail: n
    })
  }))
}

function u(e) {
  var t = e.deviceId,
    r = e.serviceId,
    n = e.characteristicId,
    c = e.state;
  return new Promise((function(e, i) {
    return wx.notifyBLECharacteristicValueChange({
      deviceId: t,
      serviceId: r,
      characteristicId: n,
      state: c,
      success: e,
      fail: i
    })
  }))
}

function d() {
  return (d = n(e().mark((function t(r) {
    var n, c, i, s, a, d, f, l, h, p;
    return e().wrap((function(e) {
      for (;;) switch (e.prev = e.next) {
        case 0:
          return n = r.deviceId, c = r.targetServiceUUID, i = r.targetCharacteristics, e.next = 3, v({
            deviceId: n,
            targetServiceUUID: c
          });
        case 3:
          if (s = e.sent, a = s.characteristics, d = s.serviceId, f = i.writeCharacteristicId, l = i.notifyCharacteristicId, h = i.readCharacteristicId, p = "", !a.find((function(e) {
              return e.uuid === l
            }))) {
            e.next = 13;
            break
          }
          return e.next = 12, u({
            deviceId: n,
            serviceId: d,
            characteristicId: l,
            state: !0
          });
        case 12:
          console.warn("已注册notify事件 characteristicId:", l);
        case 13:
          if (!a.find((function(e) {
              return e.uuid === h
            }))) {
            e.next = 18;
            break
          }
          return e.next = 17, o({
            deviceId: n,
            serviceId: d,
            characteristicId: h
          });
        case 17:
          console.warn("本次读特征值是 characteristicId:", h);
        case 18:
          return a.find((function(e) {
            return e.uuid === f
          })) && (p = f, console.warn("本次写特征值是 characteristicId:", f)), e.abrupt("return", {
            serviceId: d,
            characteristicId: p
          });
        case 21:
        case "end":
          return e.stop()
      }
    }), t)
  })))).apply(this, arguments)
}

function v(e) {
  return f.apply(this, arguments)
}

function f() {
  return (f = n(e().mark((function r(n) {
    var c, i, o, u, d, v, f, l, h;
    return e().wrap((function(e) {
      for (;;) switch (e.prev = e.next) {
        case 0:
          return c = n.deviceId, i = n.targetServiceUUID, e.next = 3, s({
            deviceId: c
          });
        case 3:
          o = e.sent, u = o.services, d = t(u), e.prev = 6, d.s();
        case 8:
          if ((v = d.n()).done) {
            e.next = 17;
            break
          }
          if (f = v.value, l = f.isPrimary, h = f.uuid, !l || h.toUpperCase() !== i) {
            e.next = 15;
            break
          }
          return console.log("即将建立通信的服务uuid:", h), e.next = 14, a({
            deviceId: c,
            serviceId: h
          });
        case 14:
          return e.abrupt("return", e.sent);
        case 15:
          e.next = 8;
          break;
        case 17:
          e.next = 22;
          break;
        case 19:
          e.prev = 19, e.t0 = e.catch(6), d.e(e.t0);
        case 22:
          return e.prev = 22, d.f(), e.finish(22);
        case 25:
        case "end":
          return e.stop()
      }
    }), r, null, [
      [6, 19, 22, 25]
    ])
  })))).apply(this, arguments)
}