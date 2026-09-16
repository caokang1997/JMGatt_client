var t = require("../../@babel/runtime/helpers/defineProperty"),
  e = require("../../@babel/runtime/helpers/classCallCheck"),
  i = require("../../@babel/runtime/helpers/createClass"),
  s = require("./config.js"),
  n = function() {
    function n(t) {
      e(this, n), this.device = t, this.steps = s.SCENARIO, this.duration = s.SCENARIO_DURATION_MS, this.elapsed = 0, this.stepIndex = -1, this.playing = !1, this._timer = null, this._ramp = null, this.onChange = null
    }
    return i(n, [{
      key: "play",
      value: function() {
        var t = this;
        this.playing || (this.playing = !0, this._timer = setInterval((function() {
          return t._tick()
        }), 100), this._notify())
      }
    }, {
      key: "pause",
      value: function() {
        this.playing = !1, null != this._timer && (clearInterval(this._timer), this._timer = null), this._ramp = null, this._notify()
      }
    }, {
      key: "replay",
      value: function() {
        this.elapsed = 0, this.stepIndex = -1, this._ramp = null, this.device.reset(), this.play()
      }
    }, {
      key: "gotoStep",
      value: function(t) {
        if (!(t < 0 || t >= this.steps.length)) {
          this.pause();
          var e = this.steps[t];
          this.elapsed = e.at, this.stepIndex = t, this._applyStep(e, !0), this._notify()
        }
      }
    }, {
      key: "next",
      value: function() {
        this.gotoStep(Math.min(this.stepIndex + 1, this.steps.length - 1))
      }
    }, {
      key: "prev",
      value: function() {
        this.gotoStep(Math.max(this.stepIndex - 1, 0))
      }
    }, {
      key: "currentNote",
      value: function() {
        var t = this.steps[this.stepIndex];
        return t ? t.note : "未开始"
      }
    }, {
      key: "destroy",
      value: function() {
        this.pause(), this.onChange = null
      }
    }, {
      key: "_tick",
      value: function() {
        this.elapsed += 100, this.elapsed >= this.duration && (this.elapsed = 0, this.stepIndex = -1, this._ramp = null);
        for (var t = !1; this.stepIndex + 1 < this.steps.length && this.steps[this.stepIndex + 1].at <= this.elapsed;) this.stepIndex += 1, this._applyStep(this.steps[this.stepIndex], !1), t = !0;
        this._advanceRamp(), t && this._notify()
      }
    }, {
      key: "_applyStep",
      value: function(e, i) {
        if (e.set && this.device.setState(e.set), e.ramp) return i ? (this.device.setState(t({}, e.ramp.field, e.ramp.to)), void(this._ramp = null)) : void(this._ramp = {
          field: e.ramp.field,
          from: this.device.state[e.ramp.field],
          to: e.ramp.to,
          start: this.elapsed,
          duration: e.ramp.duration
        });
        this._ramp = null
      }
    }, {
      key: "_advanceRamp",
      value: function() {
        var e = this._ramp;
        if (e) {
          var i = this.elapsed - e.start;
          if (i >= e.duration) return this.device.setState(t({}, e.field, e.to)), void(this._ramp = null);
          var s = i / e.duration,
            n = Math.round(e.from + (e.to - e.from) * s);
          n !== this.device.state[e.field] && this.device.setState(t({}, e.field, n))
        }
      }
    }, {
      key: "_notify",
      value: function() {
        this.onChange && this.onChange({
          playing: this.playing,
          stepIndex: this.stepIndex,
          note: this.currentNote(),
          total: this.steps.length
        })
      }
    }]), n
  }();
module.exports = n;