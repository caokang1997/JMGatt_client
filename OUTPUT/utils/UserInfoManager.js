Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e = require("../@babel/runtime/helpers/objectSpread2"),
  t = require("../@babel/runtime/helpers/classCallCheck"),
  o = require("../@babel/runtime/helpers/createClass"),
  s = require("../config/toilet_enum.js"),
  i = require("../utils/http/Route"),
  r = require("../utils/http/DataReplacement"),
  n = require("./http/PeriodRequest"),
  u = (require("./log.js"), function() {
    function u() {
      t(this, u), this.mac = "000000000000", this.model = "z40", this.deviceInfo = null, this.modeNum = 0, this.isAiPeriodCare = !1
    }
    return o(u, [{
      key: "setMacModel",
      value: function(e, t) {
        this.mac = e, this.model = t.toUpperCase(), this.getLocalCustomList()
      }
    }, {
      key: "setDeviceInfo",
      value: function(e) {
        this.deviceInfo = e
      }
    }, {
      key: "getLocalCustomList",
      value: function() {
        var e = u.USER_CUSTOM_LIST_STORAGE_KEY + "-" + this.mac + "-" + this.model;
        console.log("============= KEY ============", e);
        var t = wx.getStorageSync(e);
        if ("" === t || void 0 === t) this.userCustomList = JSON.parse(JSON.stringify(s.DefaultCustomList));
        else {
          var o = JSON.parse(t);
          this.userCustomList = o
        }
      }
    }, {
      key: "getCustomList",
      value: function() {
        return this.userCustomList
      }
    }, {
      key: "getLastConnectUrl",
      value: function() {
        var e = u.LAST_CONNECTED_URL;
        return wx.getStorageSync(e)
      }
    }, {
      key: "setConnectUrl",
      value: function(e) {
        var t = u.LAST_CONNECTED_URL;
        wx.setStorageSync(t, e)
      }
    }, {
      key: "getCustomByModeId",
      value: function(e) {
        var t = null;
        return this.userCustomList && (t = this.userCustomList.find((function(t) {
          return t.mode === e
        }))), t ? JSON.parse(JSON.stringify(t)) : null
      }
    }, {
      key: "getDefaultCustomByModeId",
      value: function(e) {
        var t = null;
        return (t = this.deviceInfo && this.deviceInfo.hasMenstrualPeriodAssistant && 2 === e && this.isAiPeriodCare && this.modeNum > 0 ? s.DefaultCustomList_PeriodCare[this.modeNum - 1] : s.DefaultCustomList.find((function(t) {
          return t.mode === e
        }))) ? JSON.parse(JSON.stringify(t)) : null
      }
    }, {
      key: "setConfig",
      value: function(e) {
        var t = u.USER_CUSTOM_LIST_STORAGE_KEY + "-" + this.mac + "-" + this.model;
        console.log("setConfig ============= KEY ============", t), wx.setStorageSync(t, JSON.stringify(e))
      }
    }, {
      key: "saveCustom",
      value: function(t) {
        console.log("---- 保存指定的数据 ---- 1"), console.log(t);
        var o = t.mode,
          s = this.userCustomList.map((function(s) {
            return s.mode === o ? e(e({}, s), t) : s
          }));
        return console.log("---- 保存指定的数据 ---- 2"), console.log(s), this.userCustomList = s, this.setConfig(this.userCustomList), this.saveParams2JomooCloud(t)
      }
    }, {
      key: "isConsumeAlarmEnable",
      value: function() {
        try {
          var e = u.CONSUME_ALARM_KEY + "-" + this.mac + "-" + this.model,
            t = wx.getStorageSync(e);
          return null == t || 1 == t
        } catch (e) {
          return !0
        }
      }
    }, {
      key: "setConsumeAlarmEnable",
      value: function(e) {
        var t = u.CONSUME_ALARM_KEY + "-" + this.mac + "-" + this.model;
        wx.setStorageSync(t, e ? 1 : 0)
      }
    }, {
      key: "isShowerAutoPreChargeEnable",
      value: function() {
        try {
          var e = u.AUTO_SHOWER_PRE_CHARGE + "-" + this.mac + "-" + this.model,
            t = wx.getStorageSync(e);
          return null != t && 1 == t
        } catch (e) {
          return !1
        }
      }
    }, {
      key: "setAutoPreChargeEnable",
      value: function(e) {
        var t = u.AUTO_SHOWER_PRE_CHARGE + "-" + this.mac + "-" + this.model;
        wx.setStorageSync(t, e ? 1 : 0)
      }
    }, {
      key: "syncCustomList",
      value: function(e) {
        var t = this;
        this.mac = e, console.log("===== 同步自定义列表(1) =====");
        var o = this;
        return (0, i.getCustonmListMode)({
          productKey: this.model,
          deviceId: e
        }).then((function(e) {
          if (200 == e.code) {
            if (console.log("===== 同步成功(2) ====="), t.deviceInfo && t.deviceInfo.hasMenstrualPeriodAssistant) {
              var s = "";
              return n.fetchPeriodUserInfo({
                uid: wx.getStorageSync("openId"),
                device_id: t.mac,
                toilet_model: t.deviceInfo.jmZtmxm
              }).then((function(e) {
                return t.modeNum = e.mode_num, t.isAiPeriodCare = e.is_ai_period_care, e.is_ai_period_care && 0 !== e.mode_num ? (1 == e.mode_num ? s = "(姨妈期)" : 2 == e.mode_num ? s = "(排卵期)" : 3 == e.mode_num && (s = "(安全期)"), n.fetchCustomWashParams(t.deviceInfo.jmZtmxm, wx.getStorageSync("openId"), t.mac, e.mode_num)) : Promise.reject("is_ai_period_care 为 false 或周期未记录")
              })).then((function(t) {
                return t && 0 !== t.length ? o._applyServerModes(e.data, (function(e) {
                  var o = (e.modeName || "").replace(/[（(][^）)]*[）)]/g, "");
                  return 2 === e.modeNum && (e.stages = t, o += s), e.modeName = o, e
                })) : Promise.reject("经期水洗参数为空")
              })).catch((function(t) {
                return console.log("===== 经期参数同步回退 =====", t), o._applyServerModes(e.data, (function(e) {
                  return e.modeName && (e.modeName = e.modeName.replace(/[（(][^）)]*[）)]/g, "")), e
                }))
              }))
            }
            return o._applyServerModes(e.data)
          }
          return t.getLocalCustomList(), o.userCustomList
        })).catch((function(e) {
          return t.getLocalCustomList(), o.userCustomList
        }))
      }
    }, {
      key: "_applyServerModes",
      value: function(t, o) {
        var s = this;
        return this.userCustomList = [], t.forEach((function(t) {
          o && (t = o(e({}, t)));
          var i = (0, r.getCustomItem)(t);
          i.title && (i.title = i.title.replace("助便畅洗", "快速助便")), s.userCustomList.push(i)
        })), this.setConfig(this.userCustomList), console.log("===== 同步到本地 ====="), console.log(this.userCustomList), this.userCustomList
      }
    }, {
      key: "saveParams2JomooCloud",
      value: function(e) {
        var t = this,
          o = (0, r.localToServiceItem)(e, this.model),
          s = wx.getStorageSync("openId"),
          i = this.mac;
        if (this.deviceInfo && this.deviceInfo.hasMenstrualPeriodAssistant && 2 === e.cleanModeId) {
          var u = "";
          return n.fetchPeriodUserInfo({
            uid: s,
            device_id: this.mac,
            toilet_model: this.deviceInfo.jmZtmxm
          }).then((function(e) {
            if (t.modeNum = e.mode_num, t.isAiPeriodCare = e.is_ai_period_care, !e.is_ai_period_care || 0 === e.mode_num) return Promise.reject("is_ai_period_care 为 false");
            1 == e.mode_num ? u = "(姨妈期)" : 2 == e.mode_num ? u = "(排卵期)" : 3 == e.mode_num && (u = "(安全期)");
            var r = (o.modeName || "").replace(/[（(][^）)]*[）)]/g, "") + u;
            return n.saveCustomWashParams({
              productKey: t.deviceInfo.jmZtmxm,
              openId: s,
              deviceId: i,
              modeNum: t.modeNum,
              stages: o.stages,
              selected: o.selected,
              modeName: r
            })
          })).then((function() {
            return t._saveParams2Cloud(o, s, i, (o.modeName || "").replace(/[（(][^）)]*[）)]/g, ""))
          })).catch((function(e) {
            return console.log("===== 经期参数保存回退 =====", e), t._saveParams2Cloud(o, s, i, (o.modeName || "").replace(/[（(][^）)]*[）)]/g, ""))
          }))
        }
        return this._saveParams2Cloud(o, s, i, o.modeName)
      }
    }, {
      key: "_saveParams2Cloud",
      value: function(e, t, o, s) {
        var r = {
          modeNum: e.modeNum,
          openId: t,
          deviceId: o,
          productKey: this.model,
          stages: e.stages,
          selected: e.selected,
          modeName: s
        };
        return console.log("同步数据 = ", r), (0, i.saveParams)(r).then((function(e) {
          console.log("同步数据回来 = ", e), e.code
        }))
      }
    }], [{
      key: "getInstance",
      value: function() {
        return this._singleton || (this._singleton = new u), this._singleton
      }
    }]), u
  }());
exports.default = u, u.AUTO_SHOWER_PRE_CHARGE = "AUTO_SHOWER_PRE_CHARGE", u.USER_CUSTOM_LIST_STORAGE_KEY = "UserInfoCustomList", u.CONSUME_ALARM_KEY = "ConsumeAlarmKey", u.LAST_CONNECTED_URL = "LAST_CONNECTED_URL";