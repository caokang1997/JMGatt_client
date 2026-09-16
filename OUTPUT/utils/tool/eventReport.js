Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.eventReport = exports.default = exports.EventType = void 0;
var e = require("../../@babel/runtime/helpers/objectSpread2"),
  _ = require("../../@babel/runtime/helpers/typeof"),
  t = require("../../@babel/runtime/helpers/classCallCheck"),
  n = require("../../@babel/runtime/helpers/createClass");
exports.EventType = {
  PAGE_VIEW: "page_view",
  BACK_SCAN: "back_scan",
  STATUS_BAR: "status_bar",
  ERROR_BAR: "error_bar",
  SETTING: "setting",
  CONTACT_SERVICE: "contact_service",
  LINK_SCENE_TAP: "link_scene_tap",
  BUBBLE_BAR: "bubble_bar",
  FILTER_BAR: "filter_bar",
  COVER: "cover",
  RING: "ring",
  FLUSH_LARGE: "flush_large",
  FLUSH_SMALL: "flush_small",
  FORCE_FLUSH: "force_flush",
  UNBLOCK: "unblock",
  HIP_WASH: "hip_wash",
  WOMAN_WASH: "woman_wash",
  DEFECT_WASH: "defect_wash",
  MASSAGE_WASH: "massage_wash",
  SITZ_BATH_WASH: "sitz_bath_wash",
  SOFT_MIST_WASH: "soft_mist_wash",
  AUTO_HIP_WASH: "auto_hip_wash",
  AUTO_WOMAN_WASH: "auto_woman_wash",
  DRY: "dry",
  RED_BLUE_LIGHT: "red_blue_light",
  BUBBLE: "bubble",
  SELF_CLEAN: "self_clean",
  QUICK_CLEAN: "quick_clean",
  NOZZLE_CLEAN: "nozzle_clean",
  REPLACE_NOZZLE: "replace_nozzle",
  NOZZLE_DRY: "nozzle_dry",
  LIFT_CLEAN: "lift_clean",
  ADD_LIQUID_BOX: "add_liquid_box",
  HIBERNATE: "hibernate",
  SINGLE_BTN: "single_btn",
  VOICE_ASSISTANT: "voice_assistant",
  AI_ASSISTANT: "ai_assistant",
  SKIP_CLEAN: "skip_clean",
  PAUSE: "pause",
  SAVE_CUSTOM_MODE: "save_custom_mode",
  CUSTOM_SETTING: "custom_setting",
  CUSTOM_MODE: "custom_mode",
  CHOOSE_WATER_SPRAY: "choose_water_spray",
  WATER_TEMP: "water_temp",
  WIND_TEMP: "wind_temp",
  WIND_SPEED: "wind_speed",
  SEAT_TEMP: "seat_temp",
  SETTING_DEVICE_INFO: "setting_device_info",
  SETTING_AI_VOICE_DEVICE: "setting_ai_voice_device",
  SETTING_RED_BLUE_LIGHT_MODE: "setting_red_blue_light_mode",
  SETTING_RED_LIGHT_DURATION: "setting_red_light_duration",
  SETTING_BLUE_LIGHT_DURATION: "setting_blue_light_duration",
  SETTING_ATMOSPHERE_LIGHT_MODE: "setting_atmosphere_light_mode",
  SETTING_PET_WASH: "setting_pet_wash",
  SETTING_AUTO_LID_LIFT: "setting_auto_lid_lift",
  SETTING_FLIP_COVER_SENSITIVITY: "setting_flip_cover_sensitivity",
  SETTING_FLIP_COVER_SENSE_DISTANCE: "setting_flip_cover_sense_distance",
  SETTING_VISUAL_SENSE_DISTANCE: "setting_visual_sense_distance",
  SETTING_MICROWAVE_SETTINGS: "setting_microwave_settings",
  SETTING_AUTO_FLUSH: "setting_auto_flush",
  SETTING_LID_CLOSED_FLUSH: "setting_lid_closed_flush",
  SETTING_LID_CLOSED_FLUSH_CLOSE: "setting_lid_closed_flush_close",
  SETTING_FLUSH_MODE: "setting_flush_mode",
  SETTING_AUTO_SMALL_FLUSH: "setting_auto_small_flush",
  SETTING_FOOT_SENSOR: "setting_foot_sensor",
  SETTING_SEASONAL_TEMP: "setting_seasonal_temp",
  SETTING_AUTO_DEODORIZATION: "setting_auto_deodorization",
  SETTING_OPEN_RING_FOAMING: "setting_open_ring_foaming",
  SETTING_SEAT_FOAMING: "setting_seat_foaming",
  SETTING_PRE_WETTING: "setting_pre_wetting",
  SETTING_FILTER_REMINDER: "setting_filter_reminder",
  SETTING_UV_STERILIZATION: "setting_uv_sterilization",
  SETTING_REGULAR_SELF_CLEAN: "setting_regular_self_clean",
  SETTING_FOAM_TIME_ON_FLUSH_RING: "setting_foam_time_on_flush_ring",
  SETTING_FOAM_TIME_ON_ROTATE: "setting_foam_time_on_rotate",
  SETTING_SMART_POWER_SAVE: "setting_smart_power_save",
  SETTING_SEAT_TOO_LONG: "setting_seat_too_long",
  SETTING_AUTO_NOZZLE_DRY: "setting_auto_nozzle_dry",
  SETTING_AMBIENT_LIGHT: "setting_ambient_light",
  SETTING_ATMOSPHERE_LIGHT_BRIGHTNESS: "setting_atmosphere_light_brightness",
  SETTING_NIGHT_LIGHT: "setting_night_light",
  SETTING_SENSOR_NIGHT_LIGHT: "setting_sensor_night_light",
  SETTING_NIGHT_LIGHT_BRIGHTNESS: "setting_night_light_brightness",
  SETTING_AI_VOICE: "setting_ai_voice",
  SETTING_REGULAR_FLUSH: "setting_regular_flush",
  SETTING_RESTORE_FACTORY: "setting_restore_factory",
  SETTING_SYNC_REMOTE_DATA: "setting_sync_remote_data",
  SETTING_UPLOAD_REMOTE_DATA: "setting_upload_remote_data"
};
var i = new(function() {
  function i() {
    t(this, i), this._debug = this._isDevTools(), this._enabled = !0
  }
  return n(i, [{
    key: "_isDevTools",
    value: function() {
      try {
        return "devtools" === (wx.getDeviceInfo ? wx.getDeviceInfo() : {
          platform: "unknown"
        }).platform
      } catch (e) {
        return !1
      }
    }
  }, {
    key: "setEnabled",
    value: function(e) {
      this._enabled = !!e
    }
  }, {
    key: "setDebug",
    value: function(e) {
      this._debug = !!e
    }
  }, {
    key: "_isValidKey",
    value: function(e) {
      return "string" == typeof e && e.trim().length > 0
    }
  }, {
    key: "_sanitizeData",
    value: function(e) {
      if (!e || "object" !== _(e) || Array.isArray(e)) return {};
      var t = {};
      return Object.keys(e).forEach((function(n) {
        var i = e[n];
        if (null != i) {
          var s;
          switch (_(i)) {
            case "string":
            case "number":
            case "boolean":
              s = String(i);
              break;
            default:
              try {
                s = JSON.stringify(i)
              } catch (e) {
                return
              }
          }
          s.length > 1024 && (s = s.substring(0, 1024)), t[n] = s
        }
      })), t
    }
  }, {
    key: "report",
    value: function(e) {
      var _ = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      if (!this._enabled) return console.log("[EventReport] 已关闭上报，跳过：", e), !1;
      if (!this._isValidKey(e)) return console.warn("[EventReport] 事件 key 非法：", e), !1;
      var t = this._sanitizeData(_);
      if (this._debug) return console.log("[EventReport][debug] key =", e, "data =", t), !0;
      if ("function" != typeof wx.reportEvent) return console.warn("[EventReport] 当前基础库不支持 wx.reportEvent"), !1;
      try {
        return console.log("[EventReport] 上报成功：", e, t), wx.reportEvent(e, t), !0
      } catch (_) {
        _ = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(_);
        return console.error("[EventReport] 上报失败：", e, _), !1
      }
    }
  }, {
    key: "reportAction",
    value: function(e) {
      var _ = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        t = Object.assign({
          ts: Date.now()
        }, _ || {});
      return this.report(e, t)
    }
  }, {
    key: "reportBatch",
    value: function(e) {
      var _ = this;
      Array.isArray(e) && 0 !== e.length && e.forEach((function(e) {
        e && _._isValidKey(e.key) && _.report(e.key, e.data || {})
      }))
    }
  }, {
    key: "reportPageView",
    value: function(_) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      this.report("page_view", e({
        page_path: _
      }, t))
    }
  }, {
    key: "reportButtonClick",
    value: function(_) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      this.report("button_click", e({
        button_name: _
      }, t))
    }
  }, {
    key: "reportDeviceConnect",
    value: function(_, t) {
      var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
      this.report("device_connect", e({
        device_id: _,
        status: t
      }, n))
    }
  }]), i
}());
exports.eventReport = i;
var s = i;
exports.default = s;