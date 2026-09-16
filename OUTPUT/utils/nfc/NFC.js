require("../../@babel/runtime/helpers/Arrayincludes");
var e = require("../../@babel/runtime/helpers/toConsumableArray"),
  r = require("../../@babel/runtime/helpers/classCallCheck"),
  n = require("../../@babel/runtime/helpers/createClass"),
  t = function() {
    function t() {
      r(this, t), this.readCallBack = null, this.writeDiscoverHandler = null, this.readDiscoverHandler = null, this.NFCTab = null, this.byteToString = function(e) {
        if ("string" == typeof e) return e;
        for (var r = "", n = e, t = 0; t < n.length; t++) {
          var i = n[t].toString(2),
            o = i.match(/^1+?(?=0)/);
          if (o && 8 == i.length) {
            for (var a = o[0].length, s = n[t].toString(2).slice(7 - a), c = 1; c < a; c++) s += n[c + t].toString(2).slice(2);
            r += String.fromCharCode(parseInt(s, 2)), t += a - 1
          } else r += String.fromCharCode(n[t])
        }
        return r
      }, this.nfc = wx.getNFCAdapter()
    }
    return n(t, [{
      key: "ab2hex",
      value: function(e) {
        return Array.prototype.map.call(new Uint8Array(e), (function(e) {
          return ("00" + e.toString(16)).slice(-2)
        })).join("")
      }
    }, {
      key: "str2ab",
      value: function(r, n) {
        for (var t = encodeURIComponent(r), i = [], o = 0; o < t.length; o++) {
          var a = t.charAt(o);
          if ("%" === a) {
            var s = t.slice(o + 1, o + 3),
              c = parseInt(s, 16);
            i.push(c), o += 2
          } else i.push(a.charCodeAt(0))
        }
        return n && i.unshift.apply(i, e(n)), new Uint8Array(i).buffer
      }
    }, {
      key: "formatNullCharacter",
      value: function(e) {
        return e ? JSON.parse(this.removeNullCharacter(JSON.stringify(e))) : ""
      }
    }, {
      key: "removeNullCharacter",
      value: function(e) {
        return e.replace(/\\u([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])/g, "")
      }
    }, {
      key: "startDiscovery",
      value: function() {
        var e = this;
        return new Promise((function(r, n) {
          e.nfc.startDiscovery({
            data: "",
            success: function(e) {
              r(e)
            },
            fail: function(e) {
              n(e)
            }
          })
        }))
      }
    }, {
      key: "stopDiscovery",
      value: function() {
        this.nfc.stopDiscovery()
      }
    }, {
      key: "startRead",
      value: function(e) {
        var r = this;
        this.readCallBack = e, this.readDiscoverHandler = function(e) {
          if (r.nfc.offDiscovered(r.readDiscoverHandler), e.messages) {
            var n, t = r;
            e.messages[0].records.forEach((function(e) {
              var r = {
                payload: t.formatNullCharacter(t.byteToString(new Uint8Array(e.payload))),
                id: t.byteToString(new Uint8Array(e.id)),
                type: t.byteToString(new Uint8Array(e.type))
              };
              console.log("nfcInfo", r), r && "mini-ios" === r.id && (console.log("nfcInfo.payload", r.payload), n = r)
            })), r.readCallBack && r.readCallBack(n)
          } else console.log("开始读取NFC --- 1-1"), r.readCallBack && r.readCallBack(null)
        }, this.nfc.onDiscovered(this.readDiscoverHandler)
      }
    }, {
      key: "stopRead",
      value: function() {
        this.readCallBack = null, this.readDiscoverHandler && this.nfc.offDiscovered(this.readDiscoverHandler)
      }
    }, {
      key: "initNFCNdef",
      value: function() {
        var e = this.nfc.getNdef();
        return new Promise((function(r, n) {
          e.connect({
            success: function() {
              r(e)
            },
            fail: function(e) {
              n()
            }
          })
        }))
      }
    }, {
      key: "writeScheme",
      value: function(e, r) {
        return new Promise((function(n, t) {
          e.writeNdefMessage({
            records: r,
            success: function() {
              e.close(), n(!0)
            },
            fail: function(r) {
              e.close(), n(!1)
            }
          })
        }))
      }
    }, {
      key: "startWrite",
      value: function(e, r) {
        var n = this;
        this.writeDiscoverHandler = function(t) {
          n.nfc.offDiscovered(n.writeDiscoverHandler), n.initNFCNdef().then((function(r) {
            console.log(r);
            var t = [{
              id: n.str2ab("mini-ios"),
              tnf: 1,
              type: n.str2ab("U"),
              payload: n.str2ab(e, [0])
            }, {
              id: n.str2ab("mini-android"),
              tnf: 4,
              type: n.str2ab("android.com:pkg"),
              payload: n.str2ab("com.tencent.mm")
            }];
            return n.NFCTab = r, n.writeScheme(r, t)
          })).then((function(e) {
            n.NFCTab = null, console.log("写入NFC结果：" + e), r(e)
          })).catch((function(e) {
            n.NFCTab = null, console.error("发生错误：", e), r(!1)
          }))
        }, this.nfc.onDiscovered(this.writeDiscoverHandler)
      }
    }, {
      key: "stopWrite",
      value: function() {
        this.writeDiscoverHandler && this.nfc.offDiscovered(this.writeDiscoverHandler), this.NFCTab && this.NFCTab.close()
      }
    }, {
      key: "readNFCRecords",
      value: function(e) {
        var r = this;
        this.readDiscoverHandler = function(n) {
          if (r.nfc.offDiscovered(r.readDiscoverHandler), n.messages) {
            var t = n.messages[0].records;
            e(t)
          } else console.log("读取NFC: messages为空"), e(null)
        }, this.nfc.onDiscovered(this.readDiscoverHandler)
      }
    }, {
      key: "writeRecordToRemoteControl",
      value: function(e, r, n) {
        var t = this;
        this.stopRead(), this.writeDiscoverHandler = function(i) {
          t.nfc.offDiscovered(t.writeDiscoverHandler), t.initNFCNdef().then((function(n) {
            console.log(n);
            var i = [{
                id: t.str2ab("mini-ios"),
                tnf: 1,
                type: t.str2ab("U"),
                payload: t.str2ab("weixin://dl/business/?t=NF9dtPiP0hr", [0])
              }, {
                id: t.str2ab("mini-android"),
                tnf: 4,
                type: t.str2ab("android.com:pkg"),
                payload: t.str2ab("com.tencent.mm")
              }],
              o = {
                type: t.str2ab("application/json"),
                payload: r,
                tnf: 2,
                id: t.str2ab(e)
              },
              a = [].concat(i, [o]);
            return console.log("插入后的记录:", a), t.NFCTab = n, t.writeScheme(n, a)
          })).then((function(e) {
            t.NFCTab = null, n(!0, "")
          })).catch((function(e) {
            t.NFCTab = null, console.error("发生错误：", e), n(!1, "1")
          }))
        }, this.nfc.onDiscovered(this.writeDiscoverHandler)
      }
    }, {
      key: "readRecordFromRemoteControl",
      value: function(e, r) {
        var n = this;
        this.readNFCRecords((function(t) {
          if (n.stopRead(), t) {
            var i = t || [];
            console.log("原始记录:", i);
            var o = [e],
              a = i.filter((function(e) {
                var r = n.byteToString(new Uint8Array(e.id));
                return o.includes(r)
              }));
            if (console.log("筛选后保留的记录:", a), a && a.length > 0) {
              var s = a[0];
              console.log("id = ", n.byteToString(new Uint8Array(s.id))), console.log("payload = ", n.ab2hex(s.payload)), r && r(!0, s)
            } else r && r(!1, "2")
          } else r && r(!1, "1")
        }))
      }
    }]), t
  }();
module.exports = t;