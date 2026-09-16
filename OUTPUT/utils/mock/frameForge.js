function r(r) {
  var e = Math.round(Number(r) || 0);
  return e < 0 ? 0 : e > 255 ? 255 : e
}
var e = require("../link/frameCodec.js").toHex;
module.exports = {
  FRAME_LENGTH: 28,
  CMD_STATUS_REPORT: 48,
  buildStatusFrame: function(e) {
    var t = e || {},
      a = new Uint8Array(28);
    return a[0] = 252, a[5] = 48, a[27] = 252, a[6] = 3 & r(t.preDischarge) | (t.shower ? 4 : 0), a[7] = (t.topSprayState ? 1 : 0) | (t.handShowerState ? 2 : 0) | (t.downWaterState ? 4 : 0), a[11] = r(t.temp < 0 ? 0 : t.temp), a[12] = (t.waterTempHighEror ? 1 : 0) | (t.lackHotWaterError ? 2 : 0) | (t.preDischargeError ? 4 : 0) | (3 & r(t.batteryState)) << 3, a[1] = function(r) {
      for (var e = 0, t = 2; t < r.length - 1; t++) e += r[t];
      return 255 & e
    }(a), a.buffer
  },
  parseExtended: function(r) {
    var e = r instanceof ArrayBuffer ? new Uint8Array(r) : r;
    if (!e || e.length <= 12 || 48 !== e[5]) return null;
    var t = e[6],
      a = e[7],
      n = e[12];
    return {
      shower: 1 == (t >> 2 & 1),
      topSprayState: 1 == (a >> 0 & 1),
      handShowerState: 1 == (a >> 1 & 1),
      downWaterState: 1 == (a >> 2 & 1),
      waterTempHighEror: 1 == (n >> 0 & 1),
      lackHotWaterError: 1 == (n >> 1 & 1),
      preDischargeError: 1 == (n >> 2 & 1),
      batteryState: n >> 3 & 3
    }
  },
  toHex: e
};