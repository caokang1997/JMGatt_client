Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e = require("../../../@babel/runtime/helpers/toConsumableArray"),
  t = require("../../../@babel/runtime/helpers/classCallCheck"),
  i = require("../../../@babel/runtime/helpers/createClass"),
  l = require("../../../@babel/runtime/helpers/get"),
  s = require("../../../@babel/runtime/helpers/getPrototypeOf"),
  o = require("../../../@babel/runtime/helpers/inherits"),
  a = require("../../../@babel/runtime/helpers/createSuper"),
  n = (u(require("../BLEController.js")), u(require("../../../utils/debuglog.js"))),
  r = (require("../../log.js"), u(require("./OtaBleController.js")));

function u(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}
var h = require("../bleutil.js"),
  c = require("../../crc.js"),
  f = 32,
  d = function(r) {
    o(d, r);
    var u = a(d);

    function d() {
      var e;
      t(this, d);
      for (var i = arguments.length, l = new Array(i), s = 0; s < i; s++) l[s] = arguments[s];
      return (e = u.call.apply(u, [this].concat(l))).tempCount = 0, e.deviceInfo = null, e.toiletUUID = "", e.otaCallBack = null, e.otaConfirmCallBack = null, e.hasCheckForOTA = !1, e.otaFileBytes = null, e.appVersion = "", e.mcuType = "", e.mainVersion = "", e.mcuFirmwareError = !1, e.mcuOTAFailedMsg = null, e._aprom = -1, e._a2Count = 0, e.fileIndex = 0, e.fileType = 1, e.progress = 0, e.total = 0, e.current = 0, e.isOnOTA = !1, e.clickStartOTA = !1, e.otaPackageTimer = null, e.retryCount = 0, e.otaVersionTimer = null, e.retryVersionCount = 0, e.otaA1CheckTimer = null, e.retryA1VersionCount = 0, e
    }
    return i(d, [{
      key: "setDeviceInfo",
      value: function(e) {
        this.deviceInfo = e
      }
    }, {
      key: "setOtaCallback",
      value: function(e) {
        this.otaCallBack = e
      }
    }, {
      key: "setOtaConfirmCallback",
      value: function(e) {
        this.otaConfirmCallBack = e
      }
    }, {
      key: "initDevice",
      value: function() {
        l(s(d.prototype), "initDevice", this).call(this), this.mcuFirmwareError = !1, this.total = 0, this.current = 0, this.isOnOTA = !1, this.appVersion = "", this.mainVersion = "", this.mcuType = "", this.toiletUUID = "", this.activeState = 1, this.mcuOTAFailedMsg = null
      }
    }, {
      key: "startConnect",
      value: function(e, t) {
        this.isDeviceReady = !1, this.serviceUUID = "0000FFE0-0000-1000-8000-00805F9B34FB", this.notifyUUID = "0000FFE1-0000-1000-8000-00805F9B34FB", this.writeUUID = "0000FFE1-0000-1000-8000-00805F9B34FB", l(s(d.prototype), "startConnect", this).call(this, e, t)
      }
    }, {
      key: "onDeviceReady",
      value: function(e) {
        n.default.log("============= 设备已就绪 ============="), l(s(d.prototype), "onDeviceReady", this).call(this, e)
      }
    }, {
      key: "onMsgValueChange",
      value: function(e) {
        l(s(d.prototype), "onMsgValueChange", this).call(this, e);
        var t = e.value;
        n.default.debug("============= 消息监听通知 OTA =============\n", h.ab2hex(t));
        var i = new Uint8Array(t);
        if (!(i.length < 7 || 252 != i[0] || 252 != i[i.length - 1])) {
          var o = h.ab2hex(t).toUpperCase(),
            a = h.decodeStr(o);
          i = h.hexStringToByteArray(a);
          var r = 5,
            u = this.getBitAtPosition(i[2], 7),
            c = this.getBitAtPosition(i[2], 6),
            f = this.getBitAtPosition(i[2], 5);
          1 == u ? (r = 9, console.log("指令用户ID字节数：4")) : 1 == c ? (r = 6, console.log("指令用户ID字节数：1")) : (r = 5, console.log("主命令位置：5"), console.log("指令用户ID字节数：0"));
          if (1 == f && (i[r + 1], i[r + 2], r, r += 2, console.log("指令有子命令字节数：2")), null != this.deviceInfo && 0 !== Object.keys(this.deviceInfo).length && (!this.deviceInfo.enableOTA || this.deviceInfo.onlyBleOTA)) return console.log("this.deviceInfo1 = " + (null != this.deviceInfo)), console.log("this.deviceInfo2:" + (0 !== Object.keys(this.deviceInfo).length)), console.log("this.deviceInfo3:" + (!this.deviceInfo.enableOTA || this.deviceInfo.onlyBleOTA)), void console.log("============= 不支持OTA =============");
          this._dealWithValue(i, r)
        }
      }
    }, {
      key: "_dealWithValue",
      value: function(e, t) {
        if (e[3] == d.TOILET_ADDRESS && e[4] == d.OTA_ADDRESS) {
          if (console.log("============= 处理接收到的OTA数据 ============="), 1 == e[t]) {
            this.stopVersionTimer(), this.retryVersionCount = 0;
            var i = e[t + 1];
            console.log("组件类别(1-主板 2-模组 3-翻盖板) = ", i);
            var l = e[t + 2];
            console.log("硬件版本长度：" + l);
            var s = null;
            if (l > 0) {
              var o = e.slice(t + 3, t + 3 + l);
              o ? (s = h.utf8ArrayToAsc2String(o), console.log("硬件版本：" + s)) : console.log("硬件版本 = null")
            }
            var a = e[t + 3 + l];
            console.log("固件版本长度：" + a);
            var r = null;
            if (a > 0) {
              var u = e.slice(t + 3 + l + 1, t + 3 + l + 1 + a);
              u ? (r = h.utf8ArrayToAsc2String(u), console.log("固件版本：" + r)) : console.log("固件版本 = null")
            }
            null == r && (n.default.follow("固件异常：版本信息错误"), this.mcuFirmwareError = !0);
            var c = t + 3 + l + a + 1;
            this.mcuType = e[c], this.mainVersion = s, this.appVersion = null != r ? r : "--", n.default.follow("设备硬件版本号：".concat(this.mainVersion)), n.default.follow("设备MCU类型：".concat(this.mcuType)), n.default.follow("设备固件版本号：".concat(this.appVersion))
          } else if (11 == e[t]) {
            this.stopA1QueryTimer(), this.retryA1VersionCount = 0;
            var f = e[t + 1];
            if (0 == f) n.default.follow("OTA升级可执行，提示短按侧按键二次确认"), this.isOnOTA && this.otaConfirmCallBack && this.otaConfirmCallBack(!0);
            else if (1 == f) {
              if (n.default.follow("OTA请求：成功-开始传输数据"), !this.isOnOTA) return;
              this.progress = 0, this.fileIndex = 0, this.retryCount = 0, this.requestWriteAPROM(0)
            } else 2 == f ? (n.default.follow("OTA请求：失败-Flash擦除失败"), this.mcuOTAFailedMsg = "Flash擦除失败", this.otaCallBack && this.otaCallBack(!1)) : 3 == f ? (n.default.follow("OTA请求：失败-设备地址码出错"), this.mcuOTAFailedMsg = "设备地址码错误", this.otaCallBack && this.otaCallBack(!1)) : 4 == f ? (n.default.follow("OTA请求：失败-文件类型出错"), this.mcuOTAFailedMsg = "文件类型错误", this.otaCallBack && this.otaCallBack(!1)) : 5 == f ? (n.default.follow("OTA请求：失败-设备当前版本号不是待替换的版本号"), this.mcuOTAFailedMsg = "替换版本不匹配", this.otaCallBack && this.otaCallBack(!1)) : 6 == f ? (n.default.follow("OTA请求：失败-设备当前版本号与升级版本号相同"), this.mcuOTAFailedMsg = "升级版本不匹配", this.otaCallBack && this.otaCallBack(!1)) : 7 == f ? (n.default.follow("OTA请求：失败-MCU类型出错"), this.mcuOTAFailedMsg = "MCU类型错误", this.otaCallBack && this.otaCallBack(!1)) : 8 == f && (n.default.follow("OTA请求：失败-设备忙"), this.mcuOTAFailedMsg = "设备忙", this.otaCallBack && this.otaCallBack(!1))
          } else if (12 == e[t]) {
            var A = e[t + 5];
            if (0 == A) this.mcuFirmwareError = !1, n.default.follow("OTA升级：传输全部完成"), this.resetOTAInfo(), this.otaCallBack && this.otaCallBack(!0);
            else if (1 == A) {
              if (!this.isOnOTA) return;
              this.retryCount = 0, this.stopOtaPackageTimer();
              var T = e[t + 3],
                g = (255 & e[t + 4]) << 8 | 255 & T;
              this.requestWriteAPROM(g)
            } else 2 == A ? n.default.follow("OTA升级：设备忙碌，本次请求失败") : 3 == A ? n.default.follow("OTA升级：传输的数据串出错，本次请求驳回") : 4 == A ? (n.default.follow("OTA升级：出现未知异常错误"), this.mcuOTAFailedMsg = "未知异常", this.isOnOTA = !1, this.resetOTAInfo(), this.otaCallBack && this.otaCallBack(!1)) : 5 == A ? (n.default.follow("OTA升级：文件长度不一致"), this.isOnOTA = !1, this.mcuOTAFailedMsg = "文件长度不一致", this.resetOTAInfo(), this.otaCallBack && this.otaCallBack(!1)) : 6 == A && (n.default.follow("OTA升级：文件校验不一致"), this.isOnOTA = !1, this.mcuOTAFailedMsg = "文件校验不一致", this.resetOTAInfo(), this.otaCallBack && this.otaCallBack(!1))
          } else if (20 == e[t]) {
            var y = e[t + 1];
            if (this.retryA1VersionCount = 0, 0 == y ? (n.default.follow("APROM状态：APROM无内容，需请求更新APROM"), this.isOnOTA ? this.onAPROMUpdate() : (n.default.follow("<----- 固件异常 3-----\x3e"), this.mcuFirmwareError = !0, this.appVersion = "--")) : 1 == y ? (n.default.follow("APROM状态：APROM校验错误，需请求更新APROM"), n.default.follow("<----- 固件异常 4-----\x3e"), this.mcuFirmwareError = !0, this.appVersion = "--") : 2 == y ? this.isOnOTA && (n.default.follow("APROM状态：APROM校验正确，等待马桶自动启动"), this.isOnOTA = !1, this.resetOTAInfo(), this.otaCallBack && this.otaCallBack(!0)) : 85 == y && (n.default.follow("APROM状态：BOOTLOADER校验错误，无法更新"), this.isOnOTA = !1, this.otaCallBack && this.otaCallBack(!1)), t + 2 < e.length) {
              var v = e[t + 2];
              0 == v ? (n.default.follow("14H指令：未激活"), this.activeState = 0) : 1 == v ? (n.default.follow("14H指令：已永久激活"), this.activeState = 1) : 2 == v ? (n.default.follow("14H指令：已临时激活"), this.activeState = 2) : 3 == v ? (n.default.follow("14H指令：永久激活待二次确认状态"), this.activeState = 3) : 254 == v && n.default.follow("14H指令：未获取激活状态")
            }
          }
        } else e[3], d.BLE_ADDRESS
      }
    }, {
      key: "requestWriteAPROM",
      value: function(t) {
        var i = this.progress;
        this.fileIndex = t;
        var l = Math.ceil(this.otaFileBytes.length / f);
        if (this.progress = Math.floor(100 * (this.fileIndex + 1) / l), this.current = this.fileIndex + 1, this.total = l, null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(null), this.progress % 5 == 0 && i != this.progress && n.default.follow("更新进度 ".concat(this.progress)), this.fileIndex >= l) this.requestWriteFinishAPROM(l);
        else {
          var s = this.fileIndex * f,
            o = s + f;
          o > this.otaFileBytes.length && (o = this.otaFileBytes.length);
          var a = this.otaFileBytes.slice(s, o),
            r = [],
            u = this.fileType,
            h = this.fileIndex + 1 & 255,
            c = this.fileIndex + 1 >> 8 & 255,
            d = 255 & f,
            A = f >> 8 & 255;
          a.length < f && (d = 255 & a.length, A = a.length >> 8 & 255), r.push(u), r.push(1), r.push(h), r.push(c), r.push(d), r.push(A), r.push.apply(r, e(a)), this._sendCommand.apply(this, [12].concat(r)), this.startOtaPackageTimer()
        }
      }
    }, {
      key: "startOtaPackageTimer",
      value: function() {
        var e = this;
        this.stopOtaPackageTimer(), this.otaPackageTimer = setTimeout((function() {
          e.retryCount < 5 ? (e.retryCount = e.retryCount + 1, n.default.follow("重试 " + e.retryCount), e.requestWriteAPROM(e.fileIndex)) : (n.default.follow("重新仍不成功，退出ota"), e.isOnOTA = !1, e.otaCallBack && e.otaCallBack(!1))
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
        var e = this;
        this.stopVersionTimer(), this.otaVersionTimer = setTimeout((function() {
          e.retryVersionCount < 2 ? (e.retryVersionCount = e.retryVersionCount + 1, e._sendCommand(1, 1), e.startVersionTimer()) : (e.retryVersionCount = 0, e.stopVersionTimer())
        }), 2e3)
      }
    }, {
      key: "stopVersionTimer",
      value: function() {
        this.otaVersionTimer && (clearTimeout(this.otaVersionTimer), this.otaVersionTimer = null)
      }
    }, {
      key: "requestWriteFinishAPROM",
      value: function(e) {
        n.default.follow("发送完成: 总包数 = ", e);
        var t = [],
          i = this.fileType,
          l = e + 1 & 255,
          s = e + 1 >> 8 & 255;
        t.push(i), t.push(2), t.push(l), t.push(s), t.push(0), t.push(0), this._sendCommand.apply(this, [12].concat(t))
      }
    }, {
      key: "_intToBytes",
      value: function(e) {
        return [e >> 8 & 255, 255 & e]
      }
    }, {
      key: "_intTo4BytesLE",
      value: function(e) {
        return [255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255]
      }
    }, {
      key: "onAPROMUpdate",
      value: function() {
        this.requestUpdateAPROM()
      }
    }, {
      key: "requestUpdateAPROM",
      value: function() {
        this.send0BH()
      }
    }, {
      key: "requestConnect",
      value: function() {}
    }, {
      key: "requestCleanAPROM",
      value: function() {}
    }, {
      key: "queryToiletMCUVersionWithA1A0",
      value: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        (this.clickStartOTA || e) && (this.clickStartOTA = !1, this.startA1QueryTimer())
      }
    }, {
      key: "startA1QueryTimer",
      value: function() {
        var e = this,
          t = this;
        this.stopA1QueryTimer(), this.otaA1CheckTimer = setTimeout((function() {
          t.retryA1VersionCount < 3 && (t.retryA1VersionCount = t.retryA1VersionCount + 1, e._sendCommand(1, 1), setTimeout((function() {
            t._sendCommand(20, 0)
          }), 500))
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
        n.default.follow("查询马桶固件版本-数智版"), this.retryVersionCount = 0, this._sendCommand(1, 1), this.startVersionTimer()
      }
    }, {
      key: "queryToiletActiveStatus",
      value: function() {
        n.default.follow("查询马桶激活状态"), this._sendCommand(17, 2)
      }
    }, {
      key: "startCover",
      value: function() {}
    }, {
      key: "stopMcuOTA",
      value: function() {}
    }, {
      key: "resetOTAInfo",
      value: function() {
        this.isOnOTA = !1, this.total = 100, this.current = 0, this.progress = 0, this.stopOtaPackageTimer()
      }
    }, {
      key: "startMcuOTA",
      value: function(e) {
        n.default.follow("开始OTA升级"), this.otaFileBytes = e, this.isOnOTA = !0, this.clickStartOTA = !0, this.tempCount = 0, this._a2Count = 0, this.fileIndex = 0, this.progress = 0, this.current = 0, this.total = 100, null != this.msgValueChangeCallBack && this.msgValueChangeCallBack(null), this.requestUpdateAPROM()
      }
    }, {
      key: "queryUUID",
      value: function() {
        n.default.debug("查询UUID"), this._sendCommand(34, 0)
      }
    }, {
      key: "trialProduct",
      value: function() {
        n.default.debug("临时激活"), this.trialProductWithTime(0)
      }
    }, {
      key: "trialProductWithTime",
      value: function(e) {
        this._sendCommand(36, 23, 34, e)
      }
    }, {
      key: "activateProduct",
      value: function() {
        n.default.debug("激活产品");
        for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
        this._sendCommand.apply(this, [35, 0].concat(t))
      }
    }, {
      key: "unActivateProduct",
      value: function() {
        n.default.debug("取消激活"), this._sendCommand(37)
      }
    }, {
      key: "dealWithB0",
      value: function(e) {}
    }, {
      key: "dealWithB1",
      value: function(e) {}
    }, {
      key: "dealWithB2",
      value: function(e) {}
    }, {
      key: "send0BH",
      value: function() {
        var t = 8;
        null != this.mcuType && this.mcuType.length > 0 && (t = this.mcuType);
        var i = 2,
          l = 1,
          s = 1,
          o = 1;
        this.appVersion.length > 0 && (s = this.appVersion.length, o = this.appVersion);
        var a = 1,
          n = 2;
        if (this.appVersion.length > 0) {
          a = "R.0.11.17".length, n = "R.0.11.17"
        }
        var r = this.otaFileBytes,
          u = c.getCrc16_1(r),
          h = u >> 8 & 255,
          f = 255 & u,
          d = this.otaFileBytes.length;
        console.log("mcuType = " + t), console.log("fileType = " + i), console.log("替代版本数量：", l), console.log("替代版本名称长度：", s), console.log("替代版本名称：", o), console.log("新版本名称长度：", a), console.log("新版本名称：", n), console.log("CRC16校验码:", u.toString(16)), console.log("CRC16校验码L:", f.toString(16)), console.log("CRC16校验码H:", h.toString(16)), console.log("文件长度：", d), this._sendCommand.apply(this, [11, t, i, l, s].concat(e(this._stringToAsc2Bytes(o)), [a], e(this._stringToAsc2Bytes(n)), [f, h], e(this._intTo4BytesLE(d))))
      }
    }, {
      key: "_sendCommand",
      value: function(e) {
        for (var t = 6, i = arguments.length, l = new Array(i > 1 ? i - 1 : 0), s = 1; s < i; s++) l[s - 1] = arguments[s];
        var o = 1 + l.length,
          a = new ArrayBuffer(t + o + 1),
          n = new DataView(a);
        n.setUint8(t, e), l.forEach((function(e, i) {
          n.setUint8(t + i + 1, e)
        }));
        var r = this.updateDefaultValue(n);
        this.writeCommand(r.buffer)
      }
    }, {
      key: "updateDefaultValue",
      value: function(e) {
        e.setUint8(0, 252), e.setUint8(1, 0), e.setUint8(2, 64), e.setUint8(3, d.OTA_ADDRESS), e.setUint8(4, d.TOILET_ADDRESS), e.setUint8(5, this.userId);
        var t = e.byteLength - 1;
        e.setUint8(t, 252);
        var i = this.calculateLightChecksum(e);
        e.setUint8(1, i);
        var l = h.ab2hex(e.buffer).toUpperCase(),
          s = h.encodeStr(l),
          o = h.hexStringToByteArray(s);
        return new DataView(o.buffer, o.byteOffset, o.byteLength)
      }
    }, {
      key: "_stringToAsc2Bytes",
      value: function(e) {
        if (!e || "string" != typeof e) return [];
        for (var t = [], i = 0; i < e.length; i++) t.push(255 & e.charCodeAt(i));
        return t
      }
    }, {
      key: "calculateLightChecksum",
      value: function(e) {
        for (var t = 0, i = 2; i < e.byteLength - 1; i++) t += e.getUint8(i);
        return 255 & t
      }
    }, {
      key: "writeCommand",
      value: function(e) {
        n.default.follow("下发指令 = ", h.ab2hex(e));
        var t = this;
        wx.writeBLECharacteristicValue({
          deviceId: this.deviceId,
          serviceId: this.serviceUUID,
          characteristicId: this.writeUUID,
          writeType: "writeNoResponse",
          value: e,
          success: function(e) {
            n.default.debug("下发成功- success", e.errMsg)
          },
          fail: function(e) {
            n.default.debug("下发失败- failed(2)", e.errMsg), n.default.debug("下发指令  deviceId = ", t.deviceId), n.default.debug("下发指令 serviceId = ", t.serviceUUID), n.default.debug("下发指令 characteristicId = ", t.writeUUID)
          }
        })
      }
    }, {
      key: "getBitAtPosition",
      value: function(e, t) {
        return e >> t & 1
      }
    }], [{
      key: "getInstance",
      value: function() {
        return this._singleton || (this._singleton = new d), this._singleton
      }
    }]), d
  }(r.default);
d.OTA_ADDRESS = 159, d.BLE_ADDRESS = 146, d.TOILET_ADDRESS = 33, d.BROAD_ADDRESS = 255, d.PHONE_ADDRESS = 1, d.FLIP_COVER_ADDRESS = 34;
var A = d;
exports.default = A;