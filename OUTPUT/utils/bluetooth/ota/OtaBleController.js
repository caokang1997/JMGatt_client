Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e = require("../../../@babel/runtime/helpers/classCallCheck"),
  t = require("../../../@babel/runtime/helpers/createClass"),
  i = require("../../../@babel/runtime/helpers/get"),
  r = require("../../../@babel/runtime/helpers/getPrototypeOf"),
  s = require("../../../@babel/runtime/helpers/inherits"),
  a = require("../../../@babel/runtime/helpers/createSuper"),
  n = require("../ota/ota.js"),
  l = (u(require("../BLEController.js")), u(require("../../../utils/debuglog.js"))),
  o = u(require("../BleModuleController.js"));

function u(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}
require("../bleutil.js");
var h = function(o) {
  s(h, o);
  var u = a(h);

  function h() {
    var t;
    e(this, h);
    for (var i = arguments.length, r = new Array(i), s = 0; s < i; s++) r[s] = arguments[s];
    return (t = u.call.apply(u, [this].concat(r))).otaUUID = "00010203-0405-0607-0809-0a0b0c0d2b12", t.versionServiceUUID = "0000180A-0000-1000-8000-00805F9B34FB", t.versionUUID = "00002A26-0000-1000-8000-00805F9B34FB", t.otaServiceUUID = "00010203-0405-0607-0809-0A0B0C0D1912", t.otaWriteUUID = "00010203-0405-0607-0809-0A0B0C0D2B12", t.otaNotifyUUID = "00010203-0405-0607-0809-0A0B0C0D2B12", t.bleUpdateInterrupted = !1, t.total = 99999, t.current = 0, t.isOnBleOTA = !1, t.otaStage = 0, t.protocolVertion = null, t.currVersion = null, t.originVersion = null, t.bleMcuType = "00", t.bleSupplierType = "00", t
  }
  return t(h, [{
    key: "initDevice",
    value: function() {
      this.protocolVertion = null, this.currVersion = null, this.total = 99999, this.current = 0, this.isOnBleOTA = !1, this.otaStage = 0, this.bleUpdateInterrupted = !1
    }
  }, {
    key: "onMsgValueChange",
    value: function(e) {
      i(r(h.prototype), "onMsgValueChange", this).call(this, e);
      var t = e.value,
        s = new Uint8Array(t);
      if (e.characteristicId.toLocaleUpperCase() === this.otaUUID.toLocaleUpperCase()) {
        if (6 == s[0] && 255 == s[1]) {
          if (s.length < 3) return;
          0 == s[2] ? this.otaStage = 2 : this.otaStage = 3, this.total = 9999, this.current = 0
        }
      } else if (e.characteristicId === this.versionUUID) {
        l.default.follow("======================== 固件版本通知 ========================"), console.log("固件版本通知");
        for (var a = "", n = 0; n < s.length; n++) s[n] >= 32 && s[n] <= 126 && (a += String.fromCharCode(s[n]));
        console.log("固件版本:", a), this.originVersion = a, "1.0.4" == a && (a = "SV1.0.4,PV1.8.1a"), "1.0.0" == a && (a = "4,0,SV0.0.1,PV02.09.02");
        var o = a.match(/SV([^,]+)/),
          u = a.match(/PV(.+)/),
          c = a.split(",");
        c.length >= 3 && c[2].startsWith("SV") ? (1 == c[1].length && (c[1] = "0" + c[1]), 1 == c[0].length && (c[0] = "0" + c[0]), this.bleMcuType = c[1], this.bleSupplierType = c[0]) : (this.bleMcuType = "00", this.bleSupplierType = "00"), this.currVersion = o ? o[1] : null, this.protocolVertion = u ? u[1] : null
      }
    }
  }, {
    key: "getBLEVersionInfo",
    value: function() {
      l.default.follow("======================== 获取蓝牙模组版本信息 ========================"), wx.readBLECharacteristicValue({
        deviceId: this.deviceId,
        serviceId: this.versionServiceUUID,
        characteristicId: this.versionUUID,
        success: function(e) {
          l.default.debug("下发成功 success", e.errMsg)
        },
        fail: function(e) {
          l.default.debug("下发失败 - failed(1)", e.errMsg)
        }
      })
    }
  }, {
    key: "stopOTA",
    value: function(e) {
      this.isOnBleOTA = !1, this.otaTask && clearInterval(this.otaTask)
    }
  }, {
    key: "startOTA",
    value: function(e) {
      var t = this;
      console.log("启动OTA"), this.otaStage = 1, this.isOnBleOTA = !0, this.current = 0, this.bleUpdateInterrupted = !1, this.otaTask && clearInterval(this.otaTask), setTimeout((function() {
        t.isOnBleOTA && t.sendOTAQuery()
      }), 100), setTimeout((function() {
        t.isOnBleOTA && t.sendOTAStart()
      }), 200);
      var i = e;
      setTimeout((function() {
        t.isOnBleOTA && t.sendOTAFile(i)
      }), 500)
    }
  }, {
    key: "sendOTAFile",
    value: function(e) {
      var t = this;
      this.otaData = e, this.pduLength = 16;
      var i = this.otaData.length,
        r = this.pduLength;
      this.total = i % r == 0 ? i / r : Math.floor(i / r + 1), this.index = 0, l.default.debug("开始发送"), this.isOnBleOTA = !0, this.otaTask = setInterval((function() {
        t.isOnBleOTA && t.sendNextPackage()
      }), 10)
    }
  }, {
    key: "sendNextPackage",
    value: function() {
      if (this.index % 40 == 0 && (this.current = this.index, this.msgValueChangeCallBack()), this.index == this.total) {
        this.current = this.index, l.default.debug("发送完成"), this.msgValueChangeCallBack(), this.isOnBleOTA = !1;
        var e = (0, n.sendOtaEndCommand)(this.total - 1);
        return this.writeOTACommand(e.buffer), void clearInterval(this.otaTask)
      }
      var t = (0, n.getPacket)(this.index, this.otaData, this.total, this.pduLength);
      this.writeOTACommand(t.buffer), this.index = this.index + 1
    }
  }, {
    key: "sendOTAQuery",
    value: function() {
      var e = new ArrayBuffer(2),
        t = new DataView(e);
      t.setUint8(0, 0), t.setUint8(1, 255), this.writeOTACommand(e)
    }
  }, {
    key: "sendOTAStart",
    value: function() {
      var e = new ArrayBuffer(2),
        t = new DataView(e);
      t.setUint8(0, 1), t.setUint8(1, 255), this.writeOTACommand(e)
    }
  }, {
    key: "writeOTACommand",
    value: function(e) {
      var t = this;
      wx.writeBLECharacteristicValue({
        deviceId: this.deviceId,
        serviceId: this.otaServiceUUID,
        characteristicId: this.otaWriteUUID,
        value: e,
        writeType: "writeNoResponse",
        success: function(e) {},
        fail: function(e) {
          l.default.debug("下发失败- failed", e.errMsg), t.isOnBleOTA && (clearInterval(this.otaTask), this.isOnBleOTA = !1)
        }
      })
    }
  }, {
    key: "onConnectResult",
    value: function(e, t) {
      console.log("------------------ 蓝牙连接回调 ------------------"), i(r(h.prototype), "onConnectResult", this).call(this, e, t), !e && this.isOnBleOTA && (clearInterval(this.otaTask), this.isOnBleOTA = !1, this.total = 100, this.current = 0, this.isOnBleOTA = !1, this.otaStage = 0)
    }
  }]), h
}(o.default);
exports.default = h;