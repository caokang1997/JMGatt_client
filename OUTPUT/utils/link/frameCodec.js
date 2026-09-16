var r = require("../../@babel/runtime/helpers/slicedToArray"),
  e = require("../../@babel/runtime/helpers/toConsumableArray"),
  a = {
    DEVICE_INFO_WRITE: 1,
    DEVICE_INFO_READ: 2,
    TRIGGER_CONFIG: 10,
    TRIGGER_QUERY: 11,
    EXEC_CONFIG: 12,
    EXEC_QUERY: 13,
    EXEC_STREAM: 14,
    ENABLE_SET: 15,
    ENABLE_QUERY: 16
  },
  n = {
    1: "写入设备信息",
    2: "读取设备信息",
    10: "场景触发事件配置",
    11: "场景触发事件查询",
    12: "场景响应事件配置",
    13: "场景响应事件查询",
    14: "场景响应动作执行码流",
    15: "场景使能开关设置",
    16: "场景使能开关查询"
  };

function t(r) {
  var e = r instanceof ArrayBuffer ? new Uint8Array(r) : Uint8Array.from(r);
  return Array.prototype.map.call(e, (function(r) {
    return ("0" + r.toString(16).toUpperCase()).slice(-2)
  })).join(" ")
}

function c(r) {
  for (var e = 0, a = 0; a < r.length; a++) e += r[a];
  return 255 & e
}

function o(r) {
  if ("string" != typeof r || !/^[0-9A-Fa-f]{12}$/.test(r)) throw new Error('MAC 格式错误，需要 12 位无冒号 hex，收到: "'.concat(r, '"'));
  return r.match(/.{1,2}/g).map((function(r) {
    return parseInt(r, 16)
  }))
}

function i(r) {
  var e = r + "";
  if (!/^[0-9A-Fa-f]{6}$/.test(e)) throw new Error('型码格式错误，需要 6 位字符（两位一组按 hex 解析），收到: "'.concat(r, '"'));
  return e.match(/.{1,2}/g).map((function(r) {
    return parseInt(r, 16)
  }))
}

function u(r) {
  var a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
    n = 4 + a.length,
    t = [250, n, r].concat(e(a));
  return t.push(c(t)), Uint8Array.from(t)
}

function s(r, e, a) {
  for (var n = "", t = e; t < e + a && t < r.length; t++) n += ("0" + r[t].toString(16).toUpperCase()).slice(-2);
  return n
}
module.exports = {
  CMD: a,
  CMD_NAMES: n,
  toHex: t,
  calcChecksum: c,
  macToBytes: o,
  barcodeToBytes: i,
  buildFrame: u,
  build0A: function(r, e, n) {
    var t = [];
    t.push(r ? 1 : 0), t.push(e.id), t.push(n.linkId);
    var c = n.trigger.triggers;
    return t.push(c.length), c.forEach((function(r) {
      t.push(r.code), t.push(r.param, 0, 0, 0)
    })), u(a.TRIGGER_CONFIG, t)
  },
  build0C: function(n, t, c) {
    var s = [];
    s.push(n ? 1 : 0), s.push(t.id), s.push(c.linkId), s.push(c.trigger.categoryCode), s.push.apply(s, e(o(c.trigger.mac))), s.push.apply(s, e(i(c.trigger.barcode)));
    var d = c.exec.execs;
    return s.push(d.length), d.forEach((function(e) {
      if (2 === e.code) {
        var a = {
          day: 0,
          hour: 1,
          min: 2,
          second: 3
        } [e.type || "min"];
        if (void 0 === a || "number" != typeof e.param || "number" != typeof e.actionId) throw new Error("frameCodec.build0C 延时项(code=0x02)需要 actionId、param(数字) 与合法时间单位 type('day'/'hour'/'min'/'second')，当前 link ".concat(c.linkId));
        var n = [0, 0, 0, 0];
        return n[a] = e.param, void s.push((15 & e.actionId) << 3, e.code, n[0], n[1], n[2], n[3])
      }
      if ("number" != typeof e.type) throw new Error("frameCodec.build0C 需要 exec.type（数字），当前 link ".concat(c.linkId, " 的 exec 缺少 type"));
      var t, o, i, u;
      if (Array.isArray(e.params)) {
        var d = r(e.params, 4),
          l = d[0];
        t = void 0 === l ? 0 : l;
        var m = d[1];
        o = void 0 === m ? 0 : m;
        var p = d[2];
        i = void 0 === p ? 0 : p;
        var f = d[3];
        u = void 0 === f ? 0 : f
      } else {
        if ("number" != typeof e.param) throw new Error("frameCodec.build0C 的 exec 需要 param(数字) 或 params(数组)，当前 link ".concat(c.linkId, " 的某 exec 两者皆无"));
        t = e.param, o = 0, i = 0, u = 0
      }
      s.push(e.type, e.code, t, o, i, u)
    })), u(a.EXEC_CONFIG, s)
  },
  build0F: function(r, e) {
    return u(a.ENABLE_SET, [r, 255, e ? 1 : 0])
  },
  build0B: function() {
    var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 255,
      e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 255;
    return u(a.TRIGGER_QUERY, [r, e])
  },
  build0D: function() {
    var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 255,
      e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 255;
    return u(a.EXEC_QUERY, [r, e])
  },
  build10: function() {
    var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 255,
      e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 255;
    return u(a.ENABLE_QUERY, [r, e, 0])
  },
  build02: function() {
    return u(a.DEVICE_INFO_READ, [])
  },
  parseFrame: function(r) {
    var e = r instanceof ArrayBuffer ? new Uint8Array(r) : r,
      o = {
        valid: !1,
        cmd: null,
        cmdName: "未知",
        summary: "",
        fields: {},
        checksumOk: !1,
        hex: t(e)
      };
    if (e.length < 4 || 250 !== e[0]) return o.summary = "非 0xFA 通讯帧（可能来自透传通道），原样记录", o;
    o.valid = !0, o.cmd = e[2], o.cmdName = n[e[2]] || "未知命令 0x".concat(e[2].toString(16).toUpperCase()), o.checksumOk = c(Array.prototype.slice.call(e, 0, e.length - 1)) === e[e.length - 1];
    var i = function(r) {
        return 1 === r ? "成功" : "失败"
      },
      u = function(r) {
        return 1 === r ? "开启" : "关闭"
      };
    switch (e[2]) {
      case a.DEVICE_INFO_READ:
        o.fields = {
          mainCategory: e[3],
          subCategory: e[4],
          thirdCategory: e[5],
          typeCode: s(e, 6, 3)
        }, o.summary = "设备信息：大类=".concat(e[3], " 二级=").concat(e[4], " 三级=").concat(e[5], " 型码=").concat(o.fields.typeCode);
        break;
      case a.TRIGGER_CONFIG:
        o.fields = {
          result: e[3],
          sceneId: e[4],
          linkId: e[5]
        }, o.summary = "触发配置".concat(i(e[3]), "：场景").concat(e[4], " 联动").concat(e[5]);
        break;
      case a.TRIGGER_QUERY:
        for (var d = e[5], l = [], m = 0; m < d; m++) {
          var p = 6 + 5 * m;
          if (p >= e.length - 1) break;
          l.push({
            code: e[p],
            params: Array.prototype.slice.call(e, p + 1, p + 5)
          })
        }
        o.fields = {
          sceneId: e[3],
          linkId: e[4],
          triggerCount: d,
          triggers: l
        };
        var f = l.map((function(r) {
          return "code=".concat(r.code, " param=[").concat(r.params.join(","), "]")
        })).join("；");
        o.summary = "触发查询：场景".concat(e[3], " 联动").concat(e[4], " 共").concat(d, "条").concat(f ? "（" + f + "）" : "");
        break;
      case a.EXEC_CONFIG:
        o.fields = {
          result: e[3],
          sceneId: e[4],
          linkId: e[5]
        }, o.summary = "响应配置".concat(i(e[3]), "：场景").concat(e[4], " 联动").concat(e[5]);
        break;
      case a.EXEC_QUERY:
        for (var E = null != e[15] ? e[15] : 0, h = [], y = 0; y < E; y++) {
          var g = 16 + 6 * y;
          if (g >= e.length - 1) break;
          h.push({
            type: e[g],
            code: e[g + 1],
            params: Array.prototype.slice.call(e, g + 2, g + 6)
          })
        }
        o.fields = {
          sceneId: e[3],
          linkId: e[4],
          triggerCategory: e[5],
          triggerMac: s(e, 6, 6),
          triggerBarcode: s(e, 12, 3),
          execCount: E,
          execs: h
        }, o.summary = "响应查询：场景".concat(e[3], " 联动").concat(e[4], " 触发品类=").concat(e[5], " ") + "触发端MAC=".concat(o.fields.triggerMac, " 型码=").concat(o.fields.triggerBarcode, " 共").concat(E, "个动作");
        break;
      case a.ENABLE_SET:
        o.fields = {
          result: e[3],
          sceneId: e[4],
          linkId: e[5],
          enable: e[6]
        }, o.summary = "使能设置".concat(i(e[3]), "：场景").concat(e[4], " 联动").concat(255 === e[5] ? "全部" : e[5], " → ").concat(u(e[6]));
        break;
      case a.ENABLE_QUERY:
        o.fields = {
          sceneId: e[3],
          linkId: e[4],
          enable: e[5]
        }, o.summary = "使能查询：场景".concat(e[3], " 联动").concat(255 === e[4] ? "全部" : e[4], " 当前=").concat(u(e[5]));
        break;
      default:
        o.summary = "收到 ".concat(o.cmdName, " 应答")
    }
    return o.checksumOk || (o.summary += "（⚠ 校验和不匹配）"), o
  }
};