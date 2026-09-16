Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var t = require("../@babel/runtime/helpers/classCallCheck"),
  e = require("../@babel/runtime/helpers/createClass"),
  a = (require("../config/toilet_enum"), require("../utils/http/Route")),
  n = (require("../utils/http/DataReplacement"), require("./log.js"), function() {
    function n() {
      t(this, n), this.CLICK_DATA_KEY = "CLICK_DATA_KEY", this.MAX_NUM = 150, this.mac = "000000000000", this.model = "z40", this.clickData = null, this.deviceInfo = {}
    }
    return e(n, [{
      key: "setDeviceInfo",
      value: function(t) {
        this.deviceInfo = t
      }
    }, {
      key: "loadClickData",
      value: function() {
        return wx.getStorageSync(this.CLICK_DATA_KEY)
      }
    }, {
      key: "saveNewClickData",
      value: function(t) {
        if (this.deviceInfo.hasGrowingData) {
          for (var e = this.getTimeStamp(), a = "", n = 0; n < (arguments.length <= 1 ? 0 : arguments.length - 1); n++) {
            var o = n + 1 < 1 || arguments.length <= n + 1 ? void 0 : arguments[n + 1];
            a += n == (arguments.length <= 1 ? 0 : arguments.length - 1) - 1 ? o : o + ":"
          }
          var i = t + "&@" + a + "&@" + e;
          console.log("itemData = " + i);
          try {
            var r = wx.getStorageSync(this.CLICK_DATA_KEY);
            r ? (console.log("同步读取的数据:", r), r.length < this.MAX_NUM ? (r.push(i), this.saveClickData(r)) : console.log("数据超过" + this.MAX_NUM + "条，不保存")) : ((r = []).push(i), this.saveClickData(r))
          } catch (t) {
            console.error("同步读取失败", t)
          }
        }
      }
    }, {
      key: "saveNewClickArrayData",
      value: function(t, e) {
        if (this.deviceInfo.hasGrowingData) {
          for (var a = this.getTimeStamp(), n = "", o = 0; o < e.length; o++) {
            var i = e[o];
            o == e.length - 1 ? n += i : n += i + ":"
          }
          var r = t + "&@" + n + "&@" + a;
          console.log(">>>>> itemData = " + r);
          try {
            var l = wx.getStorageSync(this.CLICK_DATA_KEY);
            l ? (console.log("同步读取的数据:", l), l.length < this.MAX_NUM ? (l.push(r), this.saveClickData(l)) : console.log("数据超过" + this.MAX_NUM + "条，不保存")) : ((l = []).push(r), this.saveClickData(l))
          } catch (t) {
            console.error("同步读取失败", t)
          }
        }
      }
    }, {
      key: "saveClickData",
      value: function(t) {
        wx.setStorageSync(this.CLICK_DATA_KEY, t)
      }
    }, {
      key: "clearClickData",
      value: function() {
        wx.setStorageSync(this.CLICK_DATA_KEY, null)
      }
    }, {
      key: "getTimeStamp",
      value: function() {
        return Math.floor(Date.now() / 1e3)
      }
    }, {
      key: "getFormattedTime",
      value: function() {
        var t = new Date,
          e = t.getFullYear(),
          a = String(t.getMonth() + 1).padStart(2, "0"),
          n = String(t.getDate()).padStart(2, "0"),
          o = String(t.getHours()).padStart(2, "0"),
          i = String(t.getMinutes()).padStart(2, "0"),
          r = String(t.getSeconds()).padStart(2, "0");
        return "".concat(e).concat(a).concat(n).concat(o).concat(i).concat(r)
      }
    }, {
      key: "uploadGrowingData",
      value: function(t) {
        t && (0, a.uploadGrowingData)({
          mac: t.mac,
          barCode: t.barCode,
          userId: t.userId,
          longitude: t.longitude,
          latitude: t.latitude,
          operValues: t.operValues
        }).then((function(t) {
          200 == t.code ? console.log("===== GrowingData同步成功 =====") : console.log("===== GrowingData同步失败1 =====")
        })).catch((function(t) {
          console.log("===== GrowingData同步失败2 =====")
        }))
      }
    }], [{
      key: "getInstance",
      value: function() {
        return this._singleton || (this._singleton = new n), this._singleton
      }
    }]), n
  }());
exports.default = n;