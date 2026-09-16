var r = {
  getCrc8: function(r) {
    for (var n = r instanceof ArrayBuffer ? new Uint8Array(r) : r, t = 0, e = 0; e < n.length; e++) t += n[e];
    return 255 & t
  },
  getCrc16: function(r) {
    for (var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, t = r instanceof ArrayBuffer ? new Uint8Array(r) : r, e = 32773, f = n, o = 0; o < t.length; o++) {
      f ^= t[o] << 8;
      for (var a = 0; a < 8; a++) f = 32768 & f ? 65535 & (f << 1 ^ e) : f << 1 & 65535
    }
    return f
  },
  getCrc16_1: function(r) {
    for (var n = 65535, t = 0; t < r.length; t++) {
      n ^= r[t] << 8;
      for (var e = 0; e < 8; e++) n = 32768 & n ? 65535 & (n << 1 ^ 4129) : n << 1 & 65535
    }
    return n
  }
};
module.exports = r;