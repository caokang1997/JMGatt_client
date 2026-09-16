Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e = require("../../@babel/runtime/helpers/classCallCheck"),
  t = require("../../@babel/runtime/helpers/createClass"),
  i = require("../../config/device_enum.js"),
  r = require("./LinkController.js"),
  o = require("../bluetooth/bleutil.js"),
  s = function() {
    function s() {
      var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        i = t.targetCategoryId,
        r = t.sceneId,
        o = t.onUpdate,
        n = t.onError;
      e(this, s), this.targetCategoryId = i, this.sceneId = r, this.onUpdate = o, this.onError = n, this._devices = [], this._started = !1, this._listener = this._onDeviceFound.bind(this)
    }
    return t(s, [{
      key: "start",
      value: function() {
        var e = this;
        if (this._devices = [], r.MOCK_MODE) {
          this._started = !0;
          var t = [r.MOCK_SHOWER_DEVICE, r.MOCK_BATH_HEATER_DEVICE].find((function(t) {
            return t.categoryId === e.targetCategoryId
          }));
          if (!t) return;
          setTimeout((function() {
            e._started && (e._devices = [Object.assign({}, t)], e.onUpdate && e.onUpdate(e._devices.slice()))
          }), 800)
        } else o.checkBlePermision(!0).then((function(t) {
          t.ok ? (e._started = !0, wx.onBluetoothDeviceFound(e._listener), wx.startBluetoothDevicesDiscovery({
            allowDuplicatesKey: !0,
            fail: function(t) {
              e.onError && e.onError(t.errMsg || "启动蓝牙扫描失败")
            }
          })) : e.onError && e.onError(t.errMsg)
        }))
      }
    }, {
      key: "stop",
      value: function() {
        this._started && (this._started = !1, r.MOCK_MODE || (wx.stopBluetoothDevicesDiscovery(), wx.offBluetoothDeviceFound(this._listener)))
      }
    }, {
      key: "destroy",
      value: function() {
        this.stop()
      }
    }, {
      key: "_onDeviceFound",
      value: function(e) {
        var t = this,
          r = [];
        if ((e.devices || []).forEach((function(e) {
            if (o.isJomooDevice(e)) {
              var s = o.getDeviceTypeCode(e),
                n = (0, i.getDeviceInfo)(s);
              null != n && n.categoryId === t.targetCategoryId && Array.isArray(n.linkSceneList) && n.linkSceneList.includes(t.sceneId) && r.push({
                deviceId: e.deviceId,
                mac: o.getMac(e),
                typeCode: s,
                model: n.model,
                categoryId: n.categoryId,
                productName: n.showName,
                RSSI: e.RSSI,
                foundTime: Date.now()
              })
            }
          })), 0 !== r.length) {
          r.forEach((function(e) {
            var i = t._devices.findIndex((function(t) {
              return t.deviceId === e.deviceId
            })); - 1 !== i ? t._devices[i] = e : t._devices.push(e)
          }));
          var s = Date.now();
          this._devices = this._devices.filter((function(e) {
            return s - e.foundTime <= 3e4
          })), this._devices.sort((function(e, t) {
            return t.RSSI - e.RSSI
          })), this.onUpdate && this.onUpdate(this._devices.slice())
        }
      }
    }]), s
  }();
exports.default = s;