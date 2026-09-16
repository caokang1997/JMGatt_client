Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e, t = require("../../@babel/runtime/helpers/objectSpread2"),
  i = require("../../@babel/runtime/helpers/classCallCheck"),
  o = require("../../@babel/runtime/helpers/createClass"),
  r = require("../../config/device_enum.js"),
  n = (e = require("../debuglog.js")) && e.__esModule ? e : {
    default: e
  };
var s = require("../../utils/bluetooth/bleutil.js"),
  l = function() {
    function e() {
      var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        o = t.onStart,
        r = t.onUpdate,
        n = t.onStop,
        s = t.onFilter;
      i(this, e), this.onStart = o, this.onUpdate = r, this.onStop = n, this.onFilter = s, this._devices = [], this._started = !1, this.listen()
    }
    return o(e, [{
      key: "start",
      value: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        this._devices = [], n.default.follow("BleScan", "开始搜索"), wx.startBluetoothDevicesDiscovery(t({
          allowDuplicatesKey: !0
        }, e)), this._started = !0, this.onStart && this.onStart()
      }
    }, {
      key: "stop",
      value: function() {
        n.default.follow("BleScan", "停止搜索"), wx.stopBluetoothDevicesDiscovery(), this._started = !1, this.onStop && this.onStop()
      }
    }, {
      key: "listen",
      value: function() {
        var e = this;
        wx.onBluetoothDeviceFound((function(t) {
          var i = (t.devices || []).filter((function(t) {
            var i = s.getMac(t);
            t.mac = i;
            var o = s.isJomooDevice(t);
            if (o) {
              if (t.foundTime = Date.now(), t.typeCode = s.getDeviceTypeCode(t), t.typeCode) {
                var n = (0, r.getDeviceInfo)(t.typeCode);
                if (null != n) {
                  t.model = n.model;
                  var l = wx.getStorageSync(i);
                  t.productName = l || s.getDeviceProductName(t), e.onFilter && (o = e.onFilter(n))
                } else o = !1
              }
            } else t.typeCode = "-", t.productName = "-";
            return o
          }));
          if (i && i.length > 0) {
            i.forEach((function(t) {
              var i = e._devices.findIndex((function(e) {
                return e.deviceId === t.deviceId
              })); - 1 !== i ? e._devices[i] = t : e._devices.push(t)
            }));
            var o = Date.now();
            e._devices = e._devices.filter((function(e) {
              return o - e.foundTime <= 3e4
            })), e._devices.sort((function(e, t) {
              return t.RSSI - e.RSSI
            })), e.onUpdate && e.onUpdate(e._devices.slice())
          }
        }))
      }
    }]), e
  }();
exports.default = l;