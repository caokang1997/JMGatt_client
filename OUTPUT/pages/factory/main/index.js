var e = require("../../../@babel/runtime/helpers/slicedToArray"),
  t = require("../../../@babel/runtime/helpers/createForOfIteratorHelper"),
  o = require("../../../config/device_enum.js"),
  n = a(require("../../../utils/bluetooth/toilet/TechramicToiletController.js")),
  c = a(require("../../../utils/bluetooth/toilet/TechramicToiletController2.js")),
  i = require("../../../utils/http/Route");

function a(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}
var s = require("../../../utils/bluetooth/bleutil"),
  r = require("../../../utils/nfc/NFC"),
  l = require("miniprogram-computed").behavior,
  m = require("../../../utils/log.js"),
  h = getApp();
Page({
  behaviors: [l],
  nfcTool: null,
  Device: null,
  bleConnectPopUp: null,
  modelPopUp: null,
  data: {
    bleProtocol: 0,
    nfcWriteValid: !0,
    btnAction: "",
    model: "-",
    env_version: "trial",
    scheme: "",
    infoState: 1,
    isDeviceConnected: !1,
    connectState: 0,
    nfcMac: "",
    nfcJmZtmxm: "",
    category: {
      title: "",
      id: 0
    },
    product: {
      model: "",
      jmZtmxm: 0,
      title: "",
      id: 0,
      showName: ""
    },
    ble: {
      name: "",
      jmZtmxm: "",
      mac: ""
    },
    categoryId: 1
  },
  computed: {
    showNextStep: function(e) {
      if (console.log("showNextStep"), 0 == e.product.jmZtmxm) return !1;
      if ("" == e.ble.jmZtmxm) return !1;
      if (!(e.product.jmZtmxm + "" == e.ble.jmZtmxm)) return e.btnAction = "updateJmZtmxm", !0;
      var t = e.nfcMac == e.ble.mac,
        o = e.nfcJmZtmxm == e.ble.jmZtmxm;
      return "*" === e.nfcMac ? (e.btnAction = "readNFC", !0) : t && o ? e.nfcMac == e.ble.mac && e.nfcJmZtmxm == e.ble.jmZtmxm ? (e.btnAction = "finish", !0) : (console.log("不用显示按钮"), !1) : (console.log("writeNFC"), e.btnAction = "writeNFC", !0)
    },
    btnTitle: function(e) {
      switch (e.btnAction) {
        case "updateJmZtmxm":
          return "下一步(更新设备型码)";
        case "readNFC":
          return "下一步(读取NFC标签)";
        case "writeNFC":
          return "下一步(写入NFC标签)";
        case "finish":
          return "完成";
        default:
          return "下一步"
      }
    },
    showBleView: function(e) {
      return e.product.jmZtmxm > 0
    },
    showNFCView: function(e) {
      return 0 != e.product.jmZtmxm && ("" != e.ble.jmZtmxm && e.product.jmZtmxm + "" == e.ble.jmZtmxm)
    }
  },
  onLoad: function(e) {
    this.modelPopUp = this.selectComponent("#model-dialog"), console.log(e), "android" != wx.getSystemInfoSync().platform.toLowerCase() && this.setData({
      nfcWriteValid: !1
    });
    var t = decodeURIComponent(e.q);
    if (t && "undefined" != t) {
      var i = this.getUrlPar(t, "jmztmxm"),
        a = (0, o.getDeviceInfo)(i);
      null != a && this.setData({
        bleProtocol: a.bleProtocol,
        category: {
          title: a.title,
          id: a.model
        },
        product: {
          model: a.model,
          jmZtmxm: a.jmZtmxm,
          title: a.title,
          showName: a.showName,
          page: a.page
        }
      }), this.modelPopUp.show()
    }
    var s = wx.getAccountInfoSync().miniProgram.envVersion;
    switch (this.data.env_version = s, this.bleConnectPopUp = this.selectComponent("#dialog"), console.log("==== this.data.bleProtocol ====", this.data.bleProtocol), this.data.bleProtocol) {
      case 0:
        this.Device = h.getToiletController();
        break;
      case 1:
        this.Device = n.default.getInstance();
        break;
      case 2:
        this.Device = c.default.getInstance();
        break;
      default:
        this.Device = h.getToiletController()
    }
    this.nfcTool = new r, this.nfcTool.startDiscovery().catch((function(e) {
      if (e) switch (e.errCode) {
        case 13e3:
          console.error("手机不支持NFC", e);
          break;
        case 13001:
          console.error("系统NFC开关未打开", e);
          break;
        default:
          console.error("开启NFC失败", e)
      }
    }))
  },
  getUrlPar: function(e, t) {
    var o = new RegExp("[^?&]?" + encodeURI(t) + "=[^&]+"),
      n = e.match(o);
    return null != n ? decodeURI(n[0].substring(n[0].search("=") + 1)) : ""
  },
  startNextAction: function() {
    switch (this.data.btnAction) {
      case "updateJmZtmxm":
        this.writeDeviceModel();
        break;
      case "readNFC":
        this.startReadNFC();
        break;
      case "writeNFC":
        this.startWriteNFC();
        break;
      case "finish":
        this.setData({
          ble: {
            mac: "",
            jmZtmxm: ""
          },
          nfcJmZtmxm: "",
          nfcMac: "",
          connectState: 0
        }), this.Device.stopConnnect()
    }
  },
  onClickOpenNightLight: function() {
    this.Device.setLightSensor(!0)
  },
  onClickCloseNightLight: function() {
    this.Device.setLightSensor(!1)
  },
  readDeviceModel: function() {
    this.showLoadingToast("设备型号读取中"), this.Device.readDeviceInfo()
  },
  getQueryValue: function(o, n) {
    var c, i = o.split("&"),
      a = t(i);
    try {
      for (a.s(); !(c = a.n()).done;) {
        var s = c.value.split("="),
          r = e(s, 2),
          l = r[0],
          m = r[1];
        if (l === n) return m
      }
    } catch (e) {
      a.e(e)
    } finally {
      a.f()
    }
    return "-"
  },
  readSchemeInfo: function(e) {
    console.log("解析scheme信息 -- 1"), wx.showLoading({
      mask: !0,
      title: "NFC信息解析中"
    });
    var t = this;
    this.readNFCScheme(e).then((function(e) {
      if (200 == e.data.code) {
        var o = e.data.data;
        if (0 == o.errcode)
          if (console.log(o), o.scheme_info) {
            var n = t.data.ble.mac,
              c = t.data.ble.jmZtmxm;
            t.setData({
              nfcMac: n,
              nfcJmZtmxm: c
            }), wx.showToast({
              mask: !0,
              title: "NFC读取成功",
              icon: "success"
            })
          } else wx.showToast({
            mask: !0,
            title: "获取NFCScheme失败,无信息",
            icon: "error"
          });
        else wx.showToast({
          mask: !0,
          title: "获取NFCScheme失败,错误码:" + o.errcode,
          icon: "error"
        })
      } else {
        var i = e.data.code;
        wx.showToast({
          mask: !0,
          title: "获取NFCScheme失败,错误码:" + i,
          icon: "error"
        })
      }
    })).catch((function(e) {
      console.error(e), wx.showToast({
        mask: !0,
        title: "获取NFCScheme失败",
        icon: "success"
      })
    }))
  },
  readSchemeInfo2: function(e) {
    console.log("解析scheme信息 -- 1"), wx.showLoading({
      mask: !0,
      title: "NFC信息解析中"
    });
    var t = this;
    this.readNFCScheme(e).then((function(e) {
      if (200 == e.data.code) {
        var o = e.data.data;
        if (0 == o.errcode)
          if (o.scheme_info && o.scheme_info.query) {
            var n = o.scheme_info.query,
              c = t.getQueryValue(n, "mac"),
              i = t.getQueryValue(n, "jmZtmxm");
            t.setData({
              nfcMac: c,
              nfcJmZtmxm: i
            }), wx.showToast({
              mask: !0,
              title: "NFC读取成功",
              icon: "success"
            })
          } else wx.showToast({
            mask: !0,
            title: "获取NFCScheme失败,无信息",
            icon: "error"
          });
        else wx.showToast({
          mask: !0,
          title: "获取NFCScheme失败,错误码:" + o.errcode,
          icon: "error"
        })
      } else {
        var a = e.data.code;
        wx.showToast({
          mask: !0,
          title: "获取NFCScheme失败,错误码:" + a,
          icon: "error"
        })
      }
    })).catch((function(e) {
      console.error(e), wx.showToast({
        mask: !0,
        title: "获取NFCScheme失败",
        icon: "success"
      })
    }))
  },
  onHide: function() {
    this.Device.stopConnnect(), wx.hideLoading(), this.stopReadNFC(), this.stopWriteNFC()
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
    return new Promise((function(e, t) {
      e("weixin://dl/business/?t=NF9dtPiP0hr")
    }))
  },
  getNFCScheme2: function() {
    var e = this,
      t = this.data.ble.mac,
      o = this.data.ble.jmZtmxm;
    return null == t || "" == t ? (m.error("mac地址为空"), void this.showErrorToast("MAC地址异常,请重新选择MAC地址")) : null == o || "" == o ? (m.error("条码型码为空"), void this.showErrorToast("条码型码异常,请重新选择MAC地址")) : new Promise((function(n, c) {
      wx.request({
        url: "https://myiot.jomoo.com.cn/appbackimport/nfcMge/createSchema",
        data: {
          appId: "wxb91f4d489c21f3a9",
          model_id: "Ha5GPK3wFZQ_Mg0sV7SlWQ",
          sn: "".concat(e.data.env_version).concat(t).concat(o),
          jump_wxa: {
            path: e.data.product.page,
            query: "mac=".concat(t, "&jmZtmxm=").concat(o, "&from=nfc"),
            env_version: e.data.env_version
          }
        },
        method: "POST",
        success: function(e) {
          if (console.log(e), 200 == e.data.code)
            if (0 != e.data.data.errcode)
              if (9800010 == e.data.data.errcode && e.data.data.errmsg) {
                var t = e.data.data.errmsg.match(/schema:\s*(.*)\s+rid:/);
                if (t) {
                  var o = t[1];
                  n(o)
                } else c(e)
              } else c(e);
          else {
            var i = e.data.data.openlink;
            n(i)
          } else c(e)
        },
        fail: function(e) {
          console.log("-- getNFCScheme --4"), console.log(e), c(e)
        }
      })
    }))
  },
  showErrorToast: function(e) {
    wx.showToast({
      title: e,
      icon: "error",
      duration: 2e3
    })
  },
  showNormalToast: function(e) {
    wx.showToast({
      mask: !0,
      title: e,
      icon: "none",
      duration: 2e3
    })
  },
  showLoadingToast: function(e) {
    wx.showToast({
      mask: !0,
      title: e,
      icon: "loading",
      duration: 2e3
    })
  },
  onClickChooseDevice: function() {
    wx.navigateTo({
      url: "/pages/factory/blescan/index"
    })
  },
  onChooseNewDevice: function(e) {
    console.log(e);
    var t = e.mac.replace(/:/g, ""),
      o = e.localName;
    this.data.nfcMac = "", this.data.nfcJmZtmxm = "", this.data.ble.name = o, this.data.ble.mac = t, this.setData({
      ble: this.data.ble
    }), this.Device.mac = t, this.connectBleDevice()
  },
  connectBleDevice: function() {
    var e = this;
    this.bleConnectPopUp.show(), this.setData({
      connectState: 0
    }), this.Device.startConnect((function(t, o) {
      "" != e.data.ble.mac && (t ? (console.log("------ 首页链接成功 -----"), e.onBleConnected()) : (e.bleConnectPopUp.isShow() || e.bleConnectPopUp.show(), e.onBleDisConnected(o)))
    }), (function(t) {
      e.onMsgValueChange(t)
    }))
  },
  onClickConfirmModel: function() {
    if (this.data.product && this.data.product.jmZtmxm) {
      var e = (0, o.getDeviceInfo)(this.data.product.jmZtmxm + "");
      this.setData({
        categoryId: e.categoryId
      })
    }
    this.modelPopUp.hide()
  },
  onClickCancelModel: function() {
    this.modelPopUp.hide(), wx.exitMiniProgram()
  },
  onClickReconnect: function() {
    console.log("--点击重新连接--"), this.connectBleDevice()
  },
  onClickCancelConnect: function() {
    this.bleConnectPopUp.hide(), wx.navigateBack()
  },
  onBleConnected: function() {
    var e = this;
    this.isDeviceConnected = !0, this.setData({
      connectState: 1
    });
    var t = setTimeout((function() {
      e.bleConnectPopUp.hide(), e.showLoadingToast("设备型号读取中"), e.queryDeviceModel(), clearInterval(t)
    }), 1e3)
  },
  onBleDisConnected: function(e) {
    this.bleConnectPopUp.isShow() || this.bleConnectPopUp.show(), console.log("---- 连接失败了 ----"), this.setData({
      connectState: 2
    })
  },
  queryDeviceModel: function() {
    this.Device.readDeviceInfo()
  },
  writeDeviceModel: function() {
    console.log("烧录蓝牙设备型号");
    var e = this.data.product.jmZtmxm;
    console.log("烧录蓝牙设备型号 jmZtmxm = ", e), this.Device.writeDeviceInfo(e + ""), (0, i.updateDeviceInfoBurning)({
      barcode: e + "",
      mac: this.data.ble.mac
    }).then((function(e) {
      e && 200 == e.code && console.log("烧录信息1: ", e)
    })).catch((function(e) {
      console.log("烧录信息2: ", e)
    }))
  },
  onMsgValueChange: function(e) {
    console.log("蓝牙消息更新", this.Device.model), console.log("接收蓝牙消息", e);
    var t = s.ab2hex(e);
    console.log("msg =", t), console.log("msg == fa05010101", "fa05010101" == t), "fa05010101" == t && (this.showLoadingToast("设备型号读取中"), this.queryDeviceModel()), t.startsWith("fa0a0205") && wx.hideToast(), this.setData({
      ble: {
        mac: this.data.ble.mac,
        jmZtmxm: this.Device.model
      }
    })
  },
  startReadNFC: function() {
    this.stopWriteNFC(), console.log("开始读取NFC"), wx.showLoading({
      mask: !0,
      title: "将NFC卡片靠近手机"
    });
    var e = this;
    this.nfcTool.startRead((function(t) {
      if (console.log("res =", t), !t) return wx.showToast({
        duration: 3e3,
        mask: !0,
        title: "NFC标签读取失败,请重新写入",
        icon: "error"
      }), void e.setData({
        btnAction: "writeNFC",
        nfcJmZtmxm: "",
        nfcMac: ""
      });
      var o = t.payload;
      o && e.readSchemeInfo(o)
    }))
  },
  startWriteNFC: function() {
    this.stopReadNFC(), wx.showLoading({
      mask: !0,
      title: "NFC标签码生成中"
    });
    var e = this;
    this.getNFCScheme().then((function(t) {
      console.log(t), wx.showLoading({
        mask: !0,
        title: "将NFC卡片靠近手机"
      }), e.nfcTool.startWrite(t, (function(t) {
        console.log("写入回调 ", t), t ? (wx.showToast({
          mask: !0,
          title: "NFC标签写入完成",
          icon: "success"
        }), e.setData({
          btnAction: "readNFC",
          nfcJmZtmxm: "*",
          nfcMac: "*"
        })) : wx.showToast({
          mask: !0,
          title: "NFC标签写入失败",
          icon: "error"
        })
      }))
    })).catch((function(e) {
      console.error(e), wx.showToast({
        mask: !0,
        title: "NFC标签码生成失败",
        icon: "error"
      })
    }))
  },
  stopReadNFC: function() {
    this.nfcTool.stopRead()
  },
  stopWriteNFC: function() {
    this.nfcTool.stopWrite()
  },
  onClickChooseCategory: function() {
    wx.navigateTo({
      url: "/pages/factory/category/index"
    })
  },
  onChooseCategory: function(e) {
    console.log("选择种类", e), this.setData({
      category: {
        title: e.title,
        id: e.id
      }
    })
  },
  onClickChooseProduct: function() {
    wx.navigateTo({
      url: "/pages/factory/productlist/index"
    })
  },
  onChooseProduct: function(e) {
    this.setData({
      product: {
        jmZtmxm: e.jmZtmxm,
        title: e.title
      }
    })
  }
});