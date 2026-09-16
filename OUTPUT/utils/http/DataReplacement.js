var e = require("../../@babel/runtime/helpers/createForOfIteratorHelper"),
  a = require("../../config/toilet_enum.js"),
  r = require("../../config/device_enum.js");
module.exports = {
  localToServiceItem: function(e) {
    var s = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
      l = {},
      u = a.DefaultCustomList.find((function(a) {
        return a.mode === e.mode
      }));
    l.modeName = e.title, l.modeNum = e.mode, l.remarks = e.remarks, l.userNum = e.userId, l.selected = e.checked ? 1 : 0;
    var o = [];
    l.stages = o;
    var m = {
      stageNum: 1
    };
    o[0] = m;
    var i = [];
    m.params = i;
    var t = e.type,
      p = 2 == t,
      n = a.WaterSparyValues[e.type],
      c = a.WaterSparyValues[u.type],
      d = {
        paramValue: n,
        defaultValue: c,
        paramName: "水花",
        scope: ["臀洗", "妇洗", "按摩洗", "助便洗"]
      };
    i.push(d), d = {
      paramValue: n = a.WaterPressValues[p ? e.womanWaterPressure - 1 : e.hipwashWaterPressure - 1],
      defaultValue: c = a.WaterPressValues[p ? u.womanWaterPressure - 1 : u.hipwashWaterPressure - 1],
      paramName: "水压",
      scope: a.WaterPressValues
    }, i.push(d), d = {
      paramValue: n = a.NozzlePositonValues[p ? e.womanNozzlePosition - 1 : e.hipwashNozzlePosition - 1],
      defaultValue: c = a.NozzlePositonValues[p ? u.womanNozzlePosition - 1 : u.hipwashNozzlePosition - 1],
      paramName: "喷嘴",
      scope: a.NozzlePositonValues
    }, i.push(d), d = {
      paramValue: n = a.WaterTempValues[e.waterTempLevel],
      defaultValue: c = a.WaterTempValues[u.waterTempLevel],
      paramName: "水温",
      scope: a.WaterTempValues
    }, i.push(d), d = {
      paramValue: n = "".concat(Math.floor(e.cleanTime / 60), "分钟"),
      defaultValue: c = "".concat(Math.floor(u.cleanTime / 60), "分钟"),
      paramName: "时长",
      scope: ["5分钟", "10分钟"]
    }, i.push(d);
    var v = e.move;
    null != v && (d = {
      paramValue: n = 0 == v ? "否" : "是",
      defaultValue: c = 0 == u.move ? "否" : "是",
      paramName: "移动清洗",
      scope: ["是", "否"]
    }, i.push(d));
    var h = e.wideWash;
    if (null != h && (d = {
        paramValue: n = 0 == h ? "否" : "是",
        defaultValue: c = 0 == u.wideWash ? "否" : "是",
        paramName: "宽幅强洗",
        scope: ["是", "否"]
      }, i.push(d)), null != e.wideWashLevel) {
      var V = {
        paramValue: n = a.WideWashLevelValues[e.wideWashLevel - 1],
        defaultValue: c = a.WideWashLevelValues[u.wideWashLevel],
        paramName: "宽幅幅度",
        scope: a.WideWashLevelValues
      };
      i.push(V)
    }
    var f = {
      stageNum: 2
    };
    o[1] = f, i = [], f.params = i;
    var w = a.WindTempValues;
    if (null != s) {
      var W = (0, r.getDeviceInfoByModel)(s.toLowerCase());
      if (null != W) {
        var N = W.maxWindTempLevel;
        4 === N && (w = ["常温", "低", "标准", "偏高", "高"])
      }
    }
    null != (n = w[e.airTempLevel]) && null != n && "" != n || (n = w[0]), d = {
      paramValue: n,
      defaultValue: c = w[u.airTempLevel],
      paramName: "风温",
      scope: w
    }, i.push(d), console.log("保存风速：");
    var k = !1;
    if (null != s) {
      var z = (0, r.getDeviceInfoByModel)(s.toLowerCase());
      null != z && (k = z.hasWindSpeed)
    }
    if (k) {
      var P = e.windSpeedLevel;
      null != P && null != P || (P = 1), P < 1 && (P = 1), d = {
        paramValue: n = a.WindSpeedValues[P - 1],
        defaultValue: c = a.WindSpeedValues[0],
        paramName: "风速",
        scope: a.WindSpeedValues
      }, i.push(d)
    }
    return d = {
      paramValue: n = "".concat(Math.floor(e.dryTime / 60), "分钟"),
      defaultValue: c = "".concat(Math.floor(u.dryTime / 60), "分钟"),
      paramName: "时长",
      scope: ["5分钟", "10分钟"]
    }, i.push(d), l
  },
  getCustomItem: function(a) {
    var r = {};
    switch (r.mode = a.modeNum, r.cleanModeId = a.modeNum, r.title = a.modeName, r.userId = a.userNum, r.checked = 1 == a.selected, r.remarks = a.remarks, a.modeNum) {
      case 1:
        r.icon = "ic_mode_child";
        break;
      case 2:
        r.icon = "ic_mode_woman_period";
        break;
      case 3:
        r.icon = "ic_mode_oldman";
        break;
      case 4:
        r.icon = "ic_mode_man_fast";
        break;
      case 5:
        r.icon = "ic_mode_woman";
        break;
      case 6:
        r.icon = "ic_mode_defect"
    }
    r.wideWash = null, r.move = null, r.womanWaterPressure = null, r.womanNozzlePosition = null, r.hipwashWaterPressure = null, r.hipwashNozzlePosition = null;
    var s = a.stages[0].params,
      l = s.find((function(e) {
        return "水花" == e.paramName
      })),
      u = !1,
      o = 1;
    if (null != l) switch (l.paramValue) {
      case "臀洗":
        o = 1;
        break;
      case "妇洗":
      case "轻柔洗":
        u = !0, o = 2;
        break;
      case "助便洗":
        o = 3;
        break;
      case "按摩洗":
      case "强弱按摩":
        o = 4
    }
    r.type = o;
    var m, i = e(s);
    try {
      for (i.s(); !(m = i.n()).done;) {
        var t = m.value;
        switch (t.paramName) {
          case "宽幅强洗":
          case "宽幅清洗":
            var p = t.paramValue;
            r.wideWash = "是" == p ? 1 : 0;
            break;
          case "移动清洗":
          case "移动按摩":
            var n = t.paramValue;
            r.move = "是" == n ? 1 : 0;
            break;
          case "宽幅幅度":
            var c = t.paramValue,
              d = t.scope.indexOf(c) + 1;
            d > 0 && (r.wideWashLevel = d);
            break;
          case "水温":
            var v = t.paramValue,
              h = t.scope.indexOf(v);
            h >= 0 && (r.waterTempLevel = h);
            break;
          case "水压":
            var V = t.paramValue,
              f = t.scope.indexOf(V);
            f >= 0 && (u ? r.womanWaterPressure = f + 1 : r.hipwashWaterPressure = f + 1);
            break;
          case "时长":
            var w = t.paramValue.match(/\d+/)[0];
            r.cleanTime = 60 * w;
            break;
          case "喷嘴":
            var W = t.paramValue,
              N = t.scope.indexOf(W);
            N >= 0 && (u ? r.womanNozzlePosition = N + 1 : r.hipwashNozzlePosition = N + 1)
        }
      }
    } catch (e) {
      i.e(e)
    } finally {
      i.f()
    }
    var k, z = a.stages[1].params,
      P = e(z);
    try {
      for (P.s(); !(k = P.n()).done;) {
        var L = k.value;
        switch (L.paramName) {
          case "时长":
            var b = L.paramValue.match(/\d+/)[0];
            r.dryTime = 60 * b;
            break;
          case "风温":
            var T = L.paramValue,
              _ = L.scope.indexOf(T);
            _ >= 0 && (r.airTempLevel = _);
            break;
          case "风速":
            var y = L.paramValue,
              g = L.scope.indexOf(y) + 1;
            g >= 1 && (r.windSpeedLevel = g)
        }
      }
    } catch (e) {
      P.e(e)
    } finally {
      P.f()
    }
    return r
  }
};