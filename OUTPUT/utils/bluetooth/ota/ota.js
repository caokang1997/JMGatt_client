function t(t) {
  for (var n, e = t.length - 2, r = [0, 40961], o = 65535, a = 0; a < e; a++) {
    n = t[a];
    for (var i = 0; i < 8; i++) o = 65535 & (o >> 1 ^ r[1 & (o ^ n)]), n >>= 1
  }
  return o
}

function n(t, n) {
  var e = 0;
  t[e++] = 255 & n, t[1] = n >> 8 & 255
}

function e(t, n) {
  var e = t.length - 2;
  t[e++] = 255 & n, t[e] = n >> 8 & 255
}

function r(t, n) {
  var e;
  return null == n ? e = new Uint8Array([255 & t, t >> 8 & 255]) : ((e = new Uint8Array(2 + n.length))[0] = 255 & t, e[1] = t >> 8 & 255, e.set(n, 2)), e
}
Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.crc16 = t, exports.fillCrc = e, exports.fillIndex = n, exports.getPacket = function(r, o, a, i) {
  var s, l, f = o.length;
  s = f > i ? r + 1 === a ? f - r * i : i : f;
  if (s === i) l = i + 4;
  else {
    var u = s % 16 == 0 ? s : 16 * (Math.floor(s / 16) + 1);
    l = u + 4, console.log("last: " + l)
  }
  var c = new Uint8Array(l);
  c.fill(255), c.set(o.slice(r * i, r * i + s), 2), n(c, r);
  var d = t(c);
  return e(c, d), c
}, exports.sendOtaCmd = r, exports.sendOtaEndCommand = function(t) {
  console.log("onNotify: 发送结束指令"), console.log("onNotify: 发送结束指令:" + t);
  var n = new Uint8Array(18);
  return n[0] = 255 & t, n[1] = t >> 8 & 255, n[2] = 255 & ~t, n[3] = ~t >> 8 & 255, r(65282, n)
}, exports.sendOtaFwVersionReqCommand = function() {
  var t = new Uint8Array(3);
  return t.set(this.otaSetting.firmwareVersion.slice(0, 2), 0), t[2] = this.otaSetting.versionCompare ? 1 : 0, r(65284, t)
}, exports.sendOtaStartCmd = function() {
  return r(65281, null)
}, exports.set = function(t, n) {
  this.data = new Uint8Array(t), this.pduLength = n;
  var e = this.data.length;
  this.total = e % n == 0 ? e / n : Math.floor(e / n + 1)
};