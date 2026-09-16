var t = require("../../@babel/runtime/helpers/classCallCheck"),
  e = require("../../@babel/runtime/helpers/createClass"),
  r = require("./frameForge.js"),
  a = require("./config.js");

function s() {
  return {
    preDischarge: 0,
    shower: !1,
    downWaterState: !1,
    handShowerState: !1,
    topSprayState: !1,
    temp: 0,
    batteryState: 0,
    preDischargeError: !1,
    lackHotWaterError: !1,
    waterTempHighEror: !1
  }
}
var i = function() {
  function s() {
    t(this, s), this.state = {
      preDischarge: 0,
      shower: !1,
      downWaterState: !1,
      handShowerState: !1,
      topSprayState: !1,
      temp: 0,
      batteryState: 0,
      preDischargeError: !1,
      lackHotWaterError: !1,
      waterTempHighEror: !1
    }, this._timer = null, this._onFrame = null, this.lastFrame = null
  }
  return e(s, [{
    key: "setState",
    value: function(t) {
      t && (Object.assign(this.state, t), this.report())
    }
  }, {
    key: "getState",
    value: function() {
      return Object.assign({}, this.state)
    }
  }, {
    key: "reset",
    value: function() {
      this.state = {
        preDischarge: 0,
        shower: !1,
        downWaterState: !1,
        handShowerState: !1,
        topSprayState: !1,
        temp: 0,
        batteryState: 0,
        preDischargeError: !1,
        lackHotWaterError: !1,
        waterTempHighEror: !1
      }, this.report()
    }
  }, {
    key: "report",
    value: function() {
      var t = r.buildStatusFrame(this.state);
      return this.lastFrame = t, this._onFrame && this._onFrame(t), t
    }
  }, {
    key: "start",
    value: function(t) {
      var e = this;
      this._onFrame = t, this.stop(), this.report(), this._timer = setInterval((function() {
        return e.report()
      }), a.REPORT_INTERVAL_MS)
    }
  }, {
    key: "stop",
    value: function() {
      null != this._timer && (clearInterval(this._timer), this._timer = null)
    }
  }, {
    key: "handleCommand",
    value: function(t) {
      var e = t instanceof ArrayBuffer ? new Uint8Array(t) : t;
      if (!e || e.length < 7) return !1;
      var r = e[5],
        a = e[6];
      if (63 === r) return this.setState({
        preDischarge: 1 === a ? 1 : 0
      }), !0;
      if (50 === r) {
        var s = 0 === a;
        return this.setState(s ? {} : {
          preDischarge: 0,
          shower: !1,
          topSprayState: !1,
          handShowerState: !1,
          downWaterState: !1
        }), !0
      }
      return !1
    }
  }]), s
}();
module.exports = i, module.exports.defaultState = s;