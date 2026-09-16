Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.default = void 0;
var e = {
  levels: {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FOLLOW: 4
  },
  currentLevel: 0,
  enabled: !0,
  init: function() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    "boolean" == typeof e.enabled && (this.enabled = e.enabled), e.level && void 0 !== this.levels[e.level] && (this.currentLevel = this.levels[e.level])
  },
  getTimeString: function() {
    var e = new Date;
    return "".concat(e.getHours(), ":").concat(e.getMinutes(), ":").concat(e.getSeconds(), ".").concat(e.getMilliseconds())
  },
  log: function(e) {
    var t;
    if (this.enabled && !(this.levels[e] < this.currentLevel)) {
      for (var n = this.getTimeString(), o = "[".concat(e, "][").concat(n, "]"), l = arguments.length, r = new Array(l > 1 ? l - 1 : 0), a = 1; a < l; a++) r[a - 1] = arguments[a];
      (t = console).log.apply(t, [o].concat(r))
    }
  },
  debug: function() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    this.log.apply(this, ["DEBUG"].concat(t))
  },
  info: function() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    this.log.apply(this, ["INFO"].concat(t))
  },
  warn: function() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    this.log.apply(this, ["WARN"].concat(t))
  },
  error: function() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    this.log.apply(this, ["ERROR"].concat(t))
  },
  follow: function() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    this.log.apply(this, ["FOLLOW"].concat(t))
  }
};
exports.default = e;