Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.removeNullCharacter = exports.isEmpty = exports.generateUUID = exports.formatNullCharacter = exports.byteToString = void 0, exports.str2ab = function(t, e) {
  for (var n = encodeURIComponent(t), o = [], a = 0; a < n.length; a++) {
    var x = n.charAt(a);
    if ("%" === x) {
      var i = n.slice(a + 1, a + 3),
        s = parseInt(i, 16);
      o.push(s), a += 2
    } else o.push(x.charCodeAt(0))
  }
  e && o.unshift.apply(o, r(e));
  return new Uint8Array(o).buffer
}, exports.throttle = exports.stringToArrayBuffer = void 0;
var r = require("../@babel/runtime/helpers/toConsumableArray");
exports.byteToString = function(r) {
  if ("string" == typeof r) return r;
  for (var t = "", e = r, n = 0; n < e.length; n++) {
    var o = e[n].toString(2),
      a = o.match(/^1+?(?=0)/);
    if (a && 8 == o.length) {
      for (var x = a[0].length, i = e[n].toString(2).slice(7 - x), s = 1; s < x; s++) i += e[s + n].toString(2).slice(2);
      t += String.fromCharCode(parseInt(i, 2)), n += x - 1
    } else t += String.fromCharCode(e[n])
  }
  return t
};
exports.isEmpty = function(r) {
  return "" === r || null == r || (r.constructor === Array && 0 === r.length || r.constructor === Object && 0 === Object.keys(r).length)
};
exports.generateUUID = function() {
  var r = (new Date).getTime();
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (function(t) {
    var e = (r + 16 * Math.random()) % 16 | 0;
    return r = Math.floor(r / 16), ("x" == t ? e : 3 & e | 8).toString(16)
  }))
};
exports.stringToArrayBuffer = function(r) {
  for (var t = "", e = 0; e < r.length; e++) "" === t ? t = r.charCodeAt(e).toString(16) : t += "," + r.charCodeAt(e).toString(16);
  return new Uint8Array(t.match(/[\da-f]{2}/gi).map((function(r) {
    return parseInt(r, 16)
  }))).buffer
};
var t = function(r) {
  return r.replace(/\\u([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])/g, "")
};
exports.removeNullCharacter = t;
exports.formatNullCharacter = function(r) {
  return r ? JSON.parse(t(JSON.stringify(r))) : ""
};
exports.throttle = function(r, t) {
  var e = 0;
  return t = t || 1e3,
    function() {
      var n = this,
        o = arguments,
        a = +new Date;
      a - e >= t && (e = a, r.apply(n, o))
    }
};