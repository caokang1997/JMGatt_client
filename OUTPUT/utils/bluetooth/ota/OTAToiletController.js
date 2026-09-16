Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.ab2hex = function(t) {
  return Array.prototype.map.call(new Uint8Array(t), (function(t) {
    return ("00" + t.toString(16)).slice(-2)
  })).join("")
}, exports.default = void 0;
var t = require("../../../@babel/runtime/helpers/toConsumableArray"),
  e = require("../../../@babel/runtime/helpers/classCallCheck"),
  i = require("../../../@babel/runtime/helpers/createClass"),
  a = require("../../../@babel/runtime/helpers/get"),
  r = require("../../../@babel/runtime/helpers/getPrototypeOf"),
  s = require("../../../@babel/runtime/helpers/inherits"),
  o = require("../../../@babel/runtime/helpers/createSuper"),
  l = (u(require("../BLEController.js")), u(require("../../../utils/debuglog.js"))),
  n = (require("../../log.js"), u(require("./OtaBleController.js")));

function u(t) {
  return t && t.__esModule ? t : {
    default: t
  }
}
var h = require("../bleutil.js");
var c = 42,
  f = function(n) {
    s(f, n);
    var u = o(f);

    function f() {
      var t;
      e(this, f);
      for (var i = arguments.length, a = new Array(i), r = 0; r < i; r++) a[r] = arguments[r];
      return (t = u.call.apply(u, [this].concat(a))).tempCount = 0, t.hardwareVersion = "", t.mcuSoftwareVersion = "", t.mcuSoftwareNumVersion = "", t.toiletUUID = "", t.otaCallBack = null, t.otaConfirmCallBack = null, t.hasCheckForOTA = !1, t.otaFileBytes = null, t.appVersion = "", t.mcuType = "", t.mainVersion = "", t.mcuFirmwareError = !1, t._aprom = -1, t._a2Count = 0, t.fileIndex = 0, t.progress = 0, t.total = 0, t.current = 0, t.isOnOTA = !1, t.clickStartOTA = !1, t.otaPackageTimer = null, t.retryCount = 0, t.otaVersionTimer = null, t.retryVersionCount = 0, t.otaA1CheckTimer = null, t.retryA1VersionCount = 0, t
    }
    return i(f, [{
      key: "setOtaCallback",
      value: function(t) {
        this.otaCallBack = t
      }
    }, {
      key: "setOtaConfirmCallback",
      value: function(t) {
        this.otaConfirmCallBack = t
      }
    }, {
      key: "initDevice",
      value: function() {
        a(r(f.prototype), "initDevice", this).call(this), this.mcuFirmwareError = !1, this.total = 0, this.current = 0, this.isOnOTA = !1, this.appVersion = "", this.mainVersion = "", this.mcuType = "", this.toiletUUID = "", this.activeState = 1
      }
    }, {
      key: "startConnect",
      value: function(t, e) {
        this.isDeviceReady = !1, this.serviceUUID = "0000FFE0-0000-1000-8000-00805F9B34FB", this.notifyUUID = "0000FFE1-0000-1000-8000-00805F9B34FB", this.writeUUID = "0000FFE1-0000-1000-8000-00805F9B34FB", a(r(f.prototype), "startConnect", this).call(this, t, e)
      }
    }, {
      key: "onDeviceReady",
      value: function(t) {
        l.default.log("============= 设备已就绪 ============="), a(r(f.prototype), "onDeviceReady", this).call(this, t)
      }
    }, {
      key: "onMsgValueChange",
      value: function(t) {
        a(r(f.prototype), "onMsgValueChange", this).call(this, t);
        var e = t.value;
        l.default.debug("============= 消息监听通知 =============\n", h.ab2hex(e));
        var i = new Uint8Array(e);
        i.length < 7 || 243 != i[0] || 244 != i[1] || this._dealWithValue(i)
      }
    }, {
      key: "_dealWithValue",
      value: function(t) {
        var e = this;
        if (t[3] == f.TOILET_ADDRESS) switch (t[5]) {
          case 237:
            switch (this.stopA1QueryTimer(), this.retryA1VersionCount = 0, this._aprom = t[6], this._aprom) {
              case 0:
                l.default.follow("=== ED APROM无内容，需请求更新APROM ==="), this.isOnOTA ? this.onAPROMUpdate() : (l.default.follow("<----- 固件异常 3-----\x3e"), this.mcuFirmwareError = !0, this.appVersion = "--");
                break;
              case 1:
                l.default.follow("=== ED APROM校验错误，需请求更新APROM ==="), l.default.follow("<----- 固件异常 4-----\x3e"), this.mcuFirmwareError = !0, this.appVersion = "--";
                break;
              case 2:
                l.default.follow("=== ED APROM校验正确，超时后自动跳转APROM运行 ==="), this.isOnOTA && (0 == this.progress ? this.onAPROMUpdate() : (l.default.follow("=== OTA包上传完成，等待马桶自动启动 ==="), this.isOnOTA = !1, this.resetOTAInfo(), this.otaCallBack && this.otaCallBack(!0)));
                break;
              case 85:
                l.default.follow("=== ED BOOTLOADER校验错误，无法更新 ==="), this.isOnOTA = !1, this.otaCallBack && this.otaCallBack(!1)
            }
            var i = t[7];
            0 == i ? (this.activeState = 0, l.default.follow("== ED设备未激活 ==")) : 1 == i ? (this.activeState = 1, l.default.follow("== ED设备已激活 ==")) : 2 == i ? (this.activeState = 2, l.default.follow("== ED设备临时激活 ==")) : 3 == i ? (this.activeState = 3, l.default.follow("== 永久激活待确认状态 ==")) : 254 == i && (this.activeState = 1, l.default.follow("== boot中 =="));
            break;
          case 160:
            var a = t[6];
            if (0 === a) {
              this.stopVersionTimer(), this.retryVersionCount = 0, this.mainVersion = t[7].toString().padStart(2, "0");
              var r = t[8];
              this.mcuType = r.toString().padStart(2, "0"), l.default.log("view[10]", t[10]), l.default.log("字符 = ", String.fromCharCode(t[10]));
              var s = String.fromCharCode(t[10]),
                o = String.fromCharCode(t[11]),
                n = "".concat(s).concat(o),
                u = "".concat(String.fromCharCode(t[12])).concat(String.fromCharCode(t[13])),
                h = "".concat(String.fromCharCode(t[14])).concat(String.fromCharCode(t[15]));
              0 == t[12] && 0 == t[13] && 0 == t[14] && 0 == t[15] && (h = "--", l.default.follow("<----- 固件异常 1-----\x3e"), this.mcuFirmwareError = !0);
              var c = t[16];
              this.upgradeType = c, this.appVersion = "".concat(n).concat(u, ".").concat(h), this.mcuFirmwareError && (l.default.follow("<----- 固件异常 2-----\x3e"), this.appVersion = "--"), l.default.follow("设备硬件主版本号：".concat(this.mainVersion)), l.default.follow("设备MCU类型：".concat(this.mcuType)), l.default.follow("设备app区版本信息：".concat(this.appVersion)), l.default.follow("设备升级信息：".concat(c))
            }
            break;
          case 161:
            this.stopA1QueryTimer(), this.retryA1VersionCount = 0;
            var d = t[6];
            0 == d ? (l.default.follow("OTA升级无法执行"), this.otaCallBack && this.otaCallBack(!1)) : 1 == d && (l.default.follow("OTA升级可执行，提示短按侧按键二次确认"), this.isOnOTA && this.otaConfirmCallBack && this.otaConfirmCallBack(!0));
            break;
          case 162:
            if (!this.isOnOTA) return;
            this.otaConfirmCallBack && this.otaConfirmCallBack(!1), this._a2Count++, this._a2Count < 3 ? this.requestConnect() : 3 == this._a2Count && this.requestCleanAPROM();
            break;
          case 163:
            if (!this.isOnOTA) return;
            this.progress = 0, this.fileIndex = 0, this.retryCount = 0, this.requestWriteAPROM(0);
            break;
          case 164:
            if (!this.isOnOTA) return;
            var m = t[6] << 8 | t[7],
              C = t[8];
            if (2 === C) {
              this.retryCount = 0, this.stopOtaPackageTimer();
              var v = m + 1;
              this.requestWriteAPROM(v)
            } else 1 === C && l.default.follow("收到写入".concat(m, "失败"));
            break;
          case 165:
            var y = t[6];
            1 == y ? (l.default.follow("数据包不一致"), this.isOnOTA = !1, this.resetOTAInfo(), this.otaCallBack && this.otaCallBack(!1)) : 2 == y && (this.mcuFirmwareError = !1, l.default.follow("数据包一致"), setTimeout((function() {
              l.default.follow("下发升级完成"), e._sendCommand(168)
            }), 5e3));
            break;
          case 176:
            this.dealWithB0(t);
            break;
          case 177:
            this.dealWithB1(t);
            break;
          case 178:
            this.dealWithB2(t)
        } else t[3], f.BLE_ADDRESS
      }
    }, {
      key: "requestWriteAPROM",
      value: function(e) {
        var i = this.progress;
        this.fileIndex = e;
        var a = Math.ceil(this.otaFileBytes.length / c);
        if (this.progress = Math.floor(100 * (this.fileIndex + 1) / a), this.current = this.fileIndex + 1, this.total = a, null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(null), this.progress % 5 == 0 && i != this.progress && l.default.follow("更新进度 ".concat(this.progress)), this.fileIndex >= a) this.requestWriteFinishAPROM(a);
        else {
          var r = this.fileIndex * c,
            s = r + c;
          s > this.otaFileBytes.length && (s = this.otaFileBytes.length);
          var o = this.otaFileBytes.slice(r, s);
          if (o.length < c) {
            var n = new Array(c - o.length).fill(255),
              u = new Uint8Array(c);
            u.set(o), u.set(n, o.length), o = u
          }
          var h = [];
          h.push(this.fileIndex >> 8 & 255), h.push(255 & this.fileIndex), h.push.apply(h, t(o)), this._sendCommand.apply(this, [164].concat(h)), this.startOtaPackageTimer()
        }
      }
    }, {
      key: "startOtaPackageTimer",
      value: function() {
        var t = this;
        this.stopOtaPackageTimer(), this.otaPackageTimer = setTimeout((function() {
          t.retryCount < 5 ? (t.retryCount = t.retryCount + 1, l.default.follow("重试 " + t.retryCount), t.requestWriteAPROM(t.fileIndex)) : (l.default.follow("重新仍不成功，退出ota"), t.isOnOTA = !1, t.otaCallBack && t.otaCallBack(!1))
        }), 3e3)
      }
    }, {
      key: "stopOtaPackageTimer",
      value: function() {
        this.otaPackageTimer && clearTimeout(this.otaPackageTimer)
      }
    }, {
      key: "startVersionTimer",
      value: function() {
        var t = this;
        this.stopVersionTimer(), this.otaVersionTimer = setTimeout((function() {
          t.retryVersionCount < 3 && (t.retryVersionCount = t.retryVersionCount + 1, t._sendCommand(160, 0), t.startVersionTimer())
        }), 2e3)
      }
    }, {
      key: "stopVersionTimer",
      value: function() {
        this.otaVersionTimer && clearTimeout(this.otaVersionTimer)
      }
    }, {
      key: "requestWriteFinishAPROM",
      value: function(t) {
        l.default.follow("下发A5总包数 = ", t);
        var e = [];
        e.push(t >> 8 & 255), e.push(255 & t), this._sendCommand.apply(this, [165].concat(e))
      }
    }, {
      key: "_intToBytes",
      value: function(t) {
        return [t >> 8 & 255, 255 & t]
      }
    }, {
      key: "onAPROMUpdate",
      value: function() {
        0 != this._aprom && 1 != this._aprom && 2 != this._aprom && 85 != this._aprom || (l.default.follow("=== 启动握手协议 ==="), this.requestConnect())
      }
    }, {
      key: "requestUpdateAPROM",
      value: function() {
        l.default.follow("=== 更新APROM(A1H) ==="), this._sendCommand(161)
      }
    }, {
      key: "requestConnect",
      value: function() {
        l.default.follow("=== 建立连接(A2H) ==="), this._sendCommand(162, 0)
      }
    }, {
      key: "requestCleanAPROM",
      value: function() {
        l.default.follow("=== 擦除(A3H) ==="), this._sendCommand(163, 0)
      }
    }, {
      key: "queryToiletMCUVersionWithA1A0",
      value: function() {
        var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        (this.clickStartOTA || t) && (this.clickStartOTA = !1, this.startA1QueryTimer())
      }
    }, {
      key: "startA1QueryTimer",
      value: function() {
        var t = this;
        this.stopA1QueryTimer(), this.otaA1CheckTimer = setTimeout((function() {
          t.retryA1VersionCount < 3 && (t.retryA1VersionCount = t.retryA1VersionCount + 1, t._sendCommand(161, 0), setTimeout((function() {
            t._sendCommand(166)
          }), 500), setTimeout((function() {
            t._sendCommand(160, 0)
          }), 1e3), setTimeout((function() {
            t.queryToiletActiveStatus()
          }), 1500))
        }), 2e3)
      }
    }, {
      key: "stopA1QueryTimer",
      value: function() {
        this.otaA1CheckTimer && clearTimeout(this.otaA1CheckTimer)
      }
    }, {
      key: "queryToiletMCUVersion",
      value: function() {
        l.default.follow("查询马桶固件版本"), this.retryVersionCount = 0, this._sendCommand(160, 0), this.startVersionTimer()
      }
    }, {
      key: "queryToiletActiveStatus",
      value: function() {
        l.default.follow("查询马桶激活状态"), this._sendCommand(160, 2)
      }
    }, {
      key: "startCover",
      value: function() {
        this._sendCommand(31, 94, 35)
      }
    }, {
      key: "stopMcuOTA",
      value: function() {
        this.resetOTAInfo(), this._sendCommand(166)
      }
    }, {
      key: "resetOTAInfo",
      value: function() {
        this.isOnOTA = !1, this.total = 100, this.current = 0, this.progress = 0, this.stopOtaPackageTimer()
      }
    }, {
      key: "startMcuOTA",
      value: function(t) {
        l.default.follow("开始OTA升级"), this.otaFileBytes = t, this.isOnOTA = !0, this.clickStartOTA = !0, this.tempCount = 0, this._a2Count = 0, this.fileIndex = 0, this.progress = 0, this.current = 0, this.total = 100, null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(null), this.requestUpdateAPROM()
      }
    }, {
      key: "_sendCommand",
      value: function(t) {
        for (var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), a = 1; a < e; a++) i[a - 1] = arguments[a];
        var r = 8 + i.length,
          s = new ArrayBuffer(r),
          o = new DataView(s);
        o.setUint8(0, 243), o.setUint8(1, 244), o.setUint8(2, s.byteLength - 4), o.setUint8(3, f.OTA_ADDRESS), o.setUint8(4, f.TOILET_ADDRESS), o.setUint8(5, t), i.forEach((function(t, e) {
          o.setUint8(6 + e, t)
        }));
        var n = 6 + i.length,
          u = this.calculateChecksum(o);
        o.setUint8(n, u), o.setUint8(n + 1, 252), this.writeCommand(s, t, o), 164 != t && l.default.follow("下发指令 = ", h.ab2hex(s))
      }
    }, {
      key: "writeCommand",
      value: function(t, e, i) {
        l.default.follow("下发指令 = ", h.ab2hex(t));
        var a = this;
        wx.writeBLECharacteristicValue({
          deviceId: this.deviceId,
          serviceId: this.serviceUUID,
          characteristicId: this.writeUUID,
          writeType: "writeNoResponse",
          value: t,
          success: function(t) {
            l.default.debug("下发成功- success", t.errMsg)
          },
          fail: function(t) {
            l.default.debug("下发失败- failed(2)", t.errMsg), l.default.debug("下发指令  deviceId = ", a.deviceId), l.default.debug("下发指令 serviceId = ", a.serviceUUID), l.default.debug("下发指令 characteristicId = ", a.writeUUID)
          }
        })
      }
    }, {
      key: "queryUUID",
      value: function() {
        l.default.debug("查询UUID"), this._sendCommand(178)
      }
    }, {
      key: "trialProduct",
      value: function() {
        l.default.debug("临时激活"), this.trialProductWithTime(0)
      }
    }, {
      key: "trialProductWithTime",
      value: function(t) {
        l.default.debug("临时激活"), this._sendCommand(177, 23, 34, t)
      }
    }, {
      key: "activateProduct",
      value: function() {
        l.default.debug("激活产品");
        for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++) e[i] = arguments[i];
        this._sendCommand.apply(this, [176, 0].concat(e))
      }
    }, {
      key: "unActivateProduct",
      value: function() {
        l.default.debug("取消激活"), this._sendCommand(179)
      }
    }, {
      key: "dealWithB0",
      value: function(t) {
        l.default.follow("--- B0 ---");
        t[6];
        var e = t[t.length - 1 - 1 - 1];
        l.default.follow("result = ", e), 165 == e ? (l.default.follow("激活成功"), this.activeState = 1) : 90 == e ? l.default.follow("激活失败") : l.default.follow("激活失败##")
      }
    }, {
      key: "dealWithB1",
      value: function(t) {
        l.default.follow("--- B1 ---");
        t[6], t[7];
        var e = t[8];
        1 == t[9] && (0 == e ? (l.default.follow("--- B1 --- 临时激活"), this.activeState = 2) : (l.default.follow("--- B1 --- 永久激活前的临时激活"), this.activeState = 3))
      }
    }, {
      key: "dealWithB2",
      value: function(t) {
        l.default.follow("--- B2 ---"), this.toiletUUID = h.ab2hex(t.slice(6, 22)), l.default.follow("====== B2 UUID ======", this.toiletUUID)
      }
    }], [{
      key: "getInstance",
      value: function() {
        return this._singleton || (this._singleton = new f, this._singleton.updateNotifyCharacteristics(this.notifyCharacteristics = [{
          serviceId: "0000FFE0",
          characteristicId: "0000FFE1"
        }])), this._singleton
      }
    }]), f
  }(n.default);
f.OTA_ADDRESS = 159, f.BLE_ADDRESS = 146, f.TOILET_ADDRESS = 33, f.BROAD_ADDRESS = 0, f.FLIP_COVER_ADDRESS = 34;
var d = f;
exports.default = d;