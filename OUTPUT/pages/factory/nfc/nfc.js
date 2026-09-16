var e = require("../../../@babel/runtime/helpers/slicedToArray"),
  t = require("../../../@babel/runtime/helpers/regeneratorRuntime"),
  o = require("../../../@babel/runtime/helpers/asyncToGenerator"),
  n = require("../../../config/device_enum.js"),
  a = require("../../../utils/bleutil"),
  r = require("../../../utils/bluetooth/bleutil");
getApp();
Page({
  NFCAdapter: null,
  data: {
    model: "-",
    env_version: "trial",
    mac: "000000000001",
    jmZtmxm: "175968",
    scheme: "",
    infoState: 1,
    isDeviceConnected: !1,
    connectState: 1,
    nfcMac: "-",
    name: ""
  },
  onLoad: function(e) {
    var t = wx.getAccountInfoSync().miniProgram.envVersion;
    this.data.env_version = t, console.log("ENV_VERSION = ", t)
  },
  onShow: function() {
    this.NFCAdapter = wx.getNFCAdapter(), this.NFClistener()
  },
  NFClistener: function() {
    var e = this;
    console.log("NFClistener"), this.NFCAdapter.startDiscovery({
      success: function() {
        console.log("开启NFC适配器成功"), e.setData({
          title: "开启NFC适配器成功!"
        })
      },
      fail: function(t) {
        switch (t.errCode) {
          case 13e3:
            wx.showToast({
              title: "手机不支持NFC",
              icon: "error"
            });
            break;
          case 13001:
            wx.showToast({
              title: "请先打开NFC开关",
              icon: "error"
            });
            break;
          default:
            wx.showToast({
              title: "开启NFC失败！",
              icon: "error"
            })
        }
        console.log("开启NFC适配器失败！", t), e.setData({
          title: "开启适配器失败!",
          infoState: 0
        })
      }
    })
  },
  writeDeviceModel: function() {
    this.showLoadingToast("设备型号写入中"), this.Toilet.writeDeviceInfo(this.data.jmZtmxm)
  },
  readDeviceModel: function() {
    this.showLoadingToast("设备型号读取中"), this.Toilet.readDeviceInfo()
  },
  readDeviceNFC: function() {
    var e = this;
    return o(t().mark((function o() {
      return t().wrap((function(t) {
        for (;;) switch (t.prev = t.next) {
          case 0:
            e.setData({
              nfcMac: "",
              model: "",
              name: ""
            }), wx.showToast({
              title: "靠近NFC标签",
              icon: "loading",
              duration: 1e5
            }), e.NFCAdapter.onDiscovered(e.readDiscoverHandler);
          case 3:
          case "end":
            return t.stop()
        }
      }), o)
    })))()
  },
  writeDeviceNFC: function() {
    this.onGetNfCScheme()
  },
  onGetNfCScheme: (0, a.throttle)((function(e) {
    var t = this;
    console.log("---- onGetNfCScheme ----1"), wx.showToast({
      title: "获取NFC",
      icon: "loading",
      duration: 1e5
    });
    var o = this;
    this.getNFCScheme().then((function(e) {
      console.log(e), o.setData({
        scheme: e
      }), wx.showToast({
        title: "靠近NFC标签",
        icon: "loading",
        duration: 1e5
      }), o.NFCAdapter.onDiscovered(t.writeDiscoverHandler)
    })).catch((function(e) {
      console.error(e), wx.showToast({
        title: "获取NFCScheme失败",
        icon: "success"
      })
    }))
  })),
  formatNullCharacter: function(e) {
    return e ? JSON.parse(this.removeNullCharacter(JSON.stringify(e))) : ""
  },
  removeNullCharacter: function(e) {
    return e.replace(/\\u([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])/g, "")
  },
  readDiscoverHandler: function(e) {
    var n = this;
    return o(t().mark((function o() {
      var a;
      return t().wrap((function(t) {
        for (;;) switch (t.prev = t.next) {
          case 0:
            console.log("==================== START ===================="), console.log("onDiscovered callback=>", e), e.messages ? (a = n, e.messages[0].records.forEach((function(e) {
              var t = {
                payload: a.formatNullCharacter(r.byteToString(new Uint8Array(e.payload))),
                id: r.byteToString(new Uint8Array(e.id)),
                type: r.byteToString(new Uint8Array(e.type))
              };
              console.log("nfcInfo", t), t && "mini-ios" === t.id && a.readSchemInfo(t.payload), n.setData({
                nfcInfo: t
              })
            }))) : n.setData({
              nfcInfo: {}
            }), n.NFCAdapter.offDiscovered(n.readDiscoverHandler), wx.showToast({
              title: "NFC数据读取成功",
              icon: "success"
            });
          case 5:
          case "end":
            return t.stop()
        }
      }), o)
    })))()
  },
  parseQueryString: function(t) {
    var o = {};
    return t.replace(/^\?/, "").split("&").forEach((function(t) {
      if (t) {
        var n = t.split("="),
          a = e(n, 2),
          r = a[0],
          i = a[1];
        o[decodeURIComponent(r)] = decodeURIComponent(i || "")
      }
    })), o
  },
  readSchemInfo: function(e) {
    wx.showToast({
      title: "获取NFC",
      icon: "loading",
      duration: 1e5
    });
    var t = this;
    this.readNFCScheme(e).then((function(e) {
      if (console.log("res", e), 200 == e.data.code) {
        var o = e.data.data;
        if (0 == o.errcode) {
          if (!o.scheme_info || !o.scheme_info.query) return console.log("---- 5 ----"), void wx.showToast({
            title: "获取NFCScheme失败,无信息",
            icon: "error"
          });
          var a = o.scheme_info.query,
            r = t.parseQueryString(a),
            i = (0, n.getDeviceInfo)(r.jmZtmxm);
          t.setData({
            nfcMac: r.mac,
            model: i.model,
            name: i.showName
          })
        } else wx.showToast({
          title: "获取NFCScheme失败,错误码:" + o.errcode,
          icon: "error"
        })
      } else {
        var c = e.data.code;
        wx.showToast({
          title: "获取NFCScheme失败,错误码:" + c,
          icon: "error"
        })
      }
    })).catch((function(e) {
      console.error(e), wx.showToast({
        title: "获取NFCScheme失败",
        icon: "success"
      })
    }))
  },
  writeDiscoverHandler: function() {
    var e = this;
    return o(t().mark((function o() {
      var n, r;
      return t().wrap((function(t) {
        for (;;) switch (t.prev = t.next) {
          case 0:
            return wx.showToast({
              title: "识别NFC标签",
              icon: "loading",
              duration: 1e6
            }), t.next = 3, e.initTab();
          case 3:
            if (n = t.sent) {
              t.next = 6;
              break
            }
            return t.abrupt("return");
          case 6:
            r = [{
              id: (0, a.str2ab)("mini-ios"),
              tnf: 1,
              type: (0, a.str2ab)("U"),
              payload: (0, a.str2ab)(e.data.scheme, [0])
            }, {
              id: (0, a.str2ab)("mini-android"),
              tnf: 4,
              type: (0, a.str2ab)("android.com:pkg"),
              payload: (0, a.str2ab)("com.tencent.mm")
            }], n.writeNdefMessage({
              records: r,
              success: function() {
                wx.showToast({
                  title: "数据写入成功",
                  icon: "success"
                })
              },
              fail: function() {
                wx.showToast({
                  title: "数据写入失败",
                  icon: "error"
                })
              },
              complete: function(t) {
                console.log("数据写入: res", t), e.closeConnect(n)
              }
            });
          case 8:
          case "end":
            return t.stop()
        }
      }), o)
    })))()
  },
  initTab: function() {
    var e = this,
      t = this.NFCAdapter.getNdef();
    return new Promise((function(o, n) {
      t.connect({
        success: function() {
          e.setData({
            title: "连接设备成功",
            infoState: 1
          }), o(t)
        },
        fail: function(t) {
          console.log("error", t), wx.showToast({
            title: "连接设备失败",
            icon: "error"
          }), e.setData({
            title: "连接设备失败",
            infoState: 0
          }), e.NFCAdapter.offDiscovered(e.writeDiscoverHandler), n()
        }
      })
    }))
  },
  closeConnect: function(e) {
    var t = this;
    e.close({
      complete: function(e) {
        console.log("清除标签连接：res", e), t.NFCAdapter.offDiscovered(t.writeDiscoverHandler)
      }
    })
  },
  closeNFC: function() {
    this.NFCAdapter && (this.NFCAdapter.offDiscovered(this.writeDiscoverHandler), this.NFCAdapter.stopDiscovery(), this.NFCAdapter = null)
  },
  onHide: function() {
    this.closeNFC()
  },
  onUnload: function() {
    this.closeNFC()
  },
  readNFCScheme: function(e) {
    return console.log("读取Scheme信息 --- 1"), new Promise((function(t, o) {
      wx.request({
        url: "https://myiot.jomoo.com.cn/appbackimport/nfcMge/getSchemaCfg",
        data: {
          appId: "wxb91f4d489c21f3a9",
          scheme: e
        },
        method: "POST",
        success: function(e) {
          console.log("读取Scheme信息 --- 2"), console.log(e), t(e)
        },
        fail: function(e) {
          console.log("读取Scheme信息 --- 3"), console.log(e), o(e)
        }
      })
    }))
  },
  getNFCScheme: function() {
    var e = this,
      t = this;
    return new Promise((function(o, n) {
      wx.request({
        url: "https://myiot.jomoo.com.cn/appbackimport/nfcMge/createSchema",
        data: {
          appId: "wxb91f4d489c21f3a9",
          model_id: "Ha5GPK3wFZQ_Mg0sV7SlWQ",
          sn: "Toilet".concat(t.data.env_version).concat(t.data.mac),
          jump_wxa: {
            path: "/pages/device/toilet/index/index",
            query: "mac=".concat(t.data.mac, "&jmZtmxm=").concat(e.data.jmZtmxm, "&from=nfc"),
            env_version: t.data.env_version
          }
        },
        method: "POST",
        success: function(e) {
          if (console.log(e), 200 == e.data.code)
            if (0 != e.data.data.errcode)
              if (9800010 == e.data.data.errcode && e.data.data.errmsg) {
                var t = e.data.data.errmsg.match(/schema:\s*(.*)\s+rid:/);
                if (t) {
                  var a = t[1];
                  o(a)
                } else n(e)
              } else n(e);
          else {
            var r = e.data.data.openlink;
            o(r)
          } else n(e)
        },
        fail: function(e) {
          console.log("-- getNFCScheme --4"), console.log(e), n(e)
        }
      })
    }))
  },
  showNormalToast: function(e) {
    wx.showToast({
      title: e,
      icon: "none",
      duration: 2e3
    })
  },
  showLoadingToast: function(e) {
    wx.showToast({
      title: e,
      icon: "loading",
      duration: 2e3
    })
  }
});