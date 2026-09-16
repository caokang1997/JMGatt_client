var e = require("../../@babel/runtime/helpers/regeneratorRuntime"),
  n = require("../../@babel/runtime/helpers/typeof"),
  t = require("../../@babel/runtime/helpers/asyncToGenerator"),
  i = D(require("../debuglog.js")),
  a = require("../../config/scene_enum.js"),
  c = D(require("../tool/bleScan.js")),
  o = D(require("../bluetooth/BleModuleController.js")),
  l = D(require("../bluetooth/bathheater/BathHeaterBleController.js")),
  r = D(require("../bluetooth/toilet/ToiletController.js")),
  s = D(require("../bluetooth/toilet/TechramicToiletController.js")),
  d = D(require("../bluetooth/toilet/TechramicToiletController2.js")),
  u = require("../http/DeviceScene.js"),
  h = require("../http/DeviceSceneRoute.js"),
  v = require("../../config/device_enum.js"),
  f = require("../../utils/http/DeviceScene.js");

function D(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}
var g = require("../util.js").ensureNetwork,
  k = require("../../utils/eventBus"),
  S = require("miniprogram-computed").behavior;
module.exports = Behavior({
  behaviors: [S],
  data: {
    scene: null,
    linkedDevice: null,
    linkedDeviceConnectState: 0,
    hasStartScan: !1,
    sceneModeChecked: !1,
    devices: [],
    scanRemainSeconds: 0,
    linkedDeviceInfo: {},
    linkDeviceCategoryId: 1,
    name: "",
    isUnboundScene: !1,
    isDetected: !1,
    replaceBindTip: "",
    _needUnBindSceneList: [],
    _currentClickedDeviceInfo: null
  },
  computed: {
    bindErrorInfo: function(e) {
      return 1 == e.currentDeviceInfo.categoryId ? "该浴霸已与其他马桶绑定场景，无法绑定联动，请先前往该浴霸的联动页面解绑。" : "该马桶已与其他浴霸绑定场景，无法绑定联动，请先前往该马桶的联动页面解绑。"
    },
    hasRelevantDevice: function(e) {
      return 0 == e.devices.length && null == e.linkedDevice
    },
    sceneSwitchEnable: function(e) {
      return !!e.linkedDevice && 1 == e.linkedDeviceConnectState
    },
    scanDeviceTitle: function(e) {
      return e.hasStartScan ? "正在搜索设备(" + (e.scanRemainSeconds || 0) + "s)" : e.hasBindDevice ? "已绑定设备" : e.devices.length > 0 ? "已搜索到" + e.devices.length + "台关联设备" : "未找到关联设备"
    },
    scanDeviceString: function(e) {
      return e.hasStartScan ? "停止搜索" : "重新搜索"
    },
    linkedDeviceState: function(e) {
      switch (e.linkedDeviceConnectState) {
        case 0:
          return "连接失败,点击重新连接";
        case 1:
          return "已绑定";
        case 2:
          return "连接中...";
        default:
          return ""
      }
    },
    linkedDeviceRightActionType: function(e) {
      return "button"
    },
    hasBindDevice: function(e) {
      return e.linkedDevice
    },
    linkSceneDetail: function(e) {
      return e.sceneModeChecked ? "场景已生效" : null != e.linkedDevice ? "场景未开启" : 0 == e.devices.length ? "暂无关联产品,无法联动" : e.devices.length > 0 ? "请选择1台联动的产品,开启场景功能" : void 0
    },
    toiletDevice: function(e) {
      var n = null;
      return null != e.linkedDeviceInfo && null != e.linkedDevice && 1 == e.linkedDeviceInfo.categoryId ? n = e.linkedDeviceInfo : null != e.currentDeviceInfo && null != e.currentDevice && 1 == e.currentDeviceInfo.categoryId && (n = e.currentDeviceInfo), null == n ? {
        url: "link/icon/link_toilet_no.png",
        name: "马桶"
      } : {
        url: "link/icon/link_toilet.png",
        name: "马桶"
      }
    },
    bathHeaterDevice: function(e) {
      var n = null;
      return null != e.linkedDeviceInfo && null != e.linkedDevice && 2 == e.linkedDeviceInfo.categoryId ? n = e.linkedDeviceInfo : null != e.currentDeviceInfo && null != e.currentDevice && 2 == e.currentDeviceInfo.categoryId && (n = e.currentDeviceInfo), null == n ? {
        url: "link/icon/link_bathheather_no.png",
        name: "浴霸"
      } : {
        url: "link/icon/link_bathheather.png",
        name: "浴霸"
      }
    }
  },
  lifetimes: {
    created: function() {
      i.default.follow("===== 联动生命周期 ===== created()")
    },
    attached: function() {
      i.default.follow("===== 联动生命周期 ===== attached()"), k.on("event", this.customEventHandler), this.setData({
        isDetected: !1
      })
    },
    detached: function() {
      this.setData({
        isDetected: !0
      }), i.default.follow("===== 联动生命周期 ===== detached()"), this.bleScan && this.bleScan.stop(), this.stopScanCountdown(), this.data.linkedDevice && (this.data.linkedDevice.stopConnnect(), this.data.linkedDevice.connectCallBack = null, this.data.linkedDevice = null), k.off("event", this.customEventHandler)
    }
  },
  pageLifetimes: {
    show: function() {
      var e = this;
      if (i.default.follow("===== 联动页面生命周期 ===== show()"), this.data.currentDevice) {
        var n = this.data.currentDevice.getDeviceName();
        if (this.setData({
            name: n
          }), !this.data.currentDevice.isConnected) return this.bleScan && this.bleScan.stop(), this.stopScanCountdown(), this.data.linkedDevice && this.data.linkedDevice.stopConnnect(), k.off("event", this.customEventHandler), void wx.navigateBack();
        this.onMsgValueChange(null), this.data.currentDevice.setMsgValueChangeCallBack((function(n) {
          e.onMsgValueChange(n)
        }))
      }
    },
    hide: function() {
      console.log("联动页面隐藏"), this.data.linkedDevice && this.data.linkedDevice.stopConnnect()
    }
  },
  methods: {
    customEventHandler: function(e) {
      null != e.connect && 0 == e.connect && (console.log("收到蓝牙断开事件", e), null != this.data.currentDevice && this.data.currentDevice.mac == e.mac && wx.navigateBack())
    },
    onMsgValueChange: function(e) {
      console.log("主设备回调:", e)
    },
    onLinkedDeviceMsgValueChange: function(e) {
      console.log("联动设备回调:", e)
    },
    onLinkDeviceConnectCallback: function() {},
    onBuy: function() {
      wx.navigateToMiniProgram({
        appId: "wxe904259626fd02bc",
        success: function(e) {
          console.log("-- 跳转成功 --"), wx.navigateBack()
        },
        fail: function(e) {
          console.log("-- 跳转失败 --")
        }
      })
    },
    initLinkDeviceInfo: function() {
      var e = 1 == this.data.currentDeviceInfo.categoryId ? 2 : 1;
      console.log("关联设备的信息：categoryId = " + e);
      var n = this.data.scene;
      this.setData({
        linkDeviceCategoryId: e,
        sceneModeChecked: n.enable
      });
      var t = this.getDeviceInfoByCategoryIdFromScene(n, e);
      if (console.log("当前页面设备信息：", t), t) return this.setData({
        linkedDeviceInfo: t
      }), void this.autoBindLinkedDevice(t.mac, !1);
      this.startScanDevice()
    },
    getDeviceInfoByCategoryIdFromScene: function(e, n) {
      var t = null,
        i = "000000",
        a = "",
        c = e.links.find((function(e) {
          return e.trigger.categoryCode == n
        }));
      if (c) i = c.trigger.barcode, a = c.trigger.mac;
      else {
        var o = e.links.find((function(e) {
          return e.exec.categoryCode == n
        }));
        o && (i = o.exec.barcode, a = o.exec.mac)
      }
      return "000000" != i && "" != a && ((t = (0, v.getDeviceInfo)(i)).productName = t.showName, t.mac = a, this.updateSceneMac(e, a, i, n)), t
    },
    initScene: function(e) {
      var n = this.getScene(e);
      this.setData({
        scene: n
      })
    },
    getScene: function(e) {
      var n = (0, u.getLocalScene)(this.data.currentDevice.mac, e) || null;
      return i.default.follow(n), null == n && (i.default.follow("本地没有默认场景"), n = (0, a.getDefaultLinkSceneList)().find((function(n) {
        return n.id === e
      })) || null, this.updateSceneMac(n, this.data.currentDevice.mac, this.data.currentDeviceInfo.jmZtmxm, this.data.currentDeviceInfo.categoryId), i.default.follow("本地没有默认场景 更新场景", n)), n && (n.imageUrl = "link/scene" + n.id + "/scene_bg.png"), n
    },
    initBleScan: function() {
      var e = this,
        n = 1 == this.data.currentDeviceInfo.categoryId ? 2 : 1;
      this.bleScan = new c.default({
        onStart: function() {
          i.default.follow("onStart"), e.setData({
            hasStartScan: !0
          })
        },
        onUpdate: function(n) {
          var t = e.data.linkedDevice && e.data.linkedDevice.mac,
            i = n.filter((function(e) {
              return e.mac !== t
            })).filter((function(e, n, t) {
              return t.findIndex((function(n) {
                return n.mac === e.mac
              })) === n
            }));
          e.setData({
            devices: i
          })
        },
        onStop: function() {
          i.default.follow("onStop"), e.setData({
            hasStartScan: !1
          }), e.stopScanCountdown()
        },
        onFilter: function(t) {
          var i = e.data.scene.id;
          return console.log("sceneId = " + i + "; findId = " + t.linkSceneList), t.categoryId == n && null != t.linkSceneList && t.linkSceneList.includes(i)
        }
      }), this.bleScan.listen()
    },
    openReplaceBindDialog: function() {
      var e = this.data._needUnBindSceneList;
      this.setData({
        replaceBindTip: '需要先解绑"'.concat(e.map((function(e) {
          return e.name
        })).join("、"), '"场景才能绑定此场景，确定要绑定吗？')
      }), this.selectComponent("#replace-bind-dialog").show()
    },
    closeReplaceBindDialog: function() {
      this.setData({
        linkedDeviceInfo: null
      }), this.selectComponent("#replace-bind-dialog").hide()
    },
    confirmReplaceBind: function() {
      var i = this;
      return t(e().mark((function t() {
        var a, c, o, l, r, s, d, u;
        return e().wrap((function(t) {
          for (;;) switch (t.prev = t.next) {
            case 0:
              i.closeReplaceBindDialog(), a = i.data, c = a._needUnBindSceneList, o = a._currentClickedDeviceInfo, l = a.currentDevice, r = a.currentDeviceInfo, s = e().mark((function n() {
                var t, a, o, s, u;
                return e().wrap((function(e) {
                  for (;;) switch (e.prev = e.next) {
                    case 0:
                      return t = c[d], null != (a = JSON.parse(JSON.stringify(t))) && (2 != a.id && 3 != a.id || (a.id = 1)), o = 1 == r.categoryId ? 2 : 1, s = i.getDeviceInfoByCategoryIdFromScene(JSON.parse(JSON.stringify(t)), o), u = i.getLinkedDevice(s, o, s.mac), console.log("解绑的scene：", t, s), wx.showLoading({
                        mask: !0,
                        title: "设备连接中..."
                      }), e.next = 10, new Promise((function(e) {
                        u.startConnect((function(n) {
                          n && (u.configScene(a, !1), u.enableScene(a, !1)), e(n)
                        }))
                      }));
                    case 10:
                      if (e.sent) {
                        e.next = 15;
                        break
                      }
                      return wx.hideLoading(), i.showNormalToast('"'.concat(t.name, '"场景设备连接失败, 请点击重试')), e.abrupt("return", {
                        v: void 0
                      });
                    case 15:
                      return e.next = 17, new Promise((function(e) {
                        setTimeout((function() {
                          e()
                        }), 3300)
                      }));
                    case 17:
                      return wx.hideLoading(), wx.showLoading({
                        mask: !0,
                        title: "设备解绑中..."
                      }), l.configScene(a, !1), t.enable = !1, l.enableScene(a, !1), (0, f.updateLocalDeviceScenesWithScene)(t), (0, f.deleteScene)(t), e.next = 26, i.updateSceneToServer();
                    case 26:
                      return wx.showLoading({
                        mask: !0,
                        title: "设备解绑中..."
                      }), e.next = 29, new Promise((function(e) {
                        setTimeout((function() {
                          e()
                        }), 3300)
                      }));
                    case 29:
                      wx.hideLoading(), u.stopConnnect();
                    case 31:
                    case "end":
                      return e.stop()
                  }
                }), n)
              })), d = 0;
            case 4:
              if (!(d < c.length)) {
                t.next = 12;
                break
              }
              return t.delegateYield(s(), "t0", 6);
            case 6:
              if (u = t.t0, "object" !== n(u)) {
                t.next = 9;
                break
              }
              return t.abrupt("return", u.v);
            case 9:
              d++, t.next = 4;
              break;
            case 12:
              i.bindDevice(o);
            case 13:
            case "end":
              return t.stop()
          }
        }), t)
      })))()
    },
    onClicklinkedDevice: function() {
      0 == this.data.linkedDeviceConnectState && this.autoBindLinkedDevice(this.data.linkedDevice.mac, !1)
    },
    startScanDevice: function() {
      this.setData({
        devices: []
      }), this.bleScan && this.bleScan.start(), this.setData({
        hasStartScan: !0
      }), this.startScanCountdown(20)
    },
    onClickOpenUnBindDeviceDialog: function() {
      this.selectComponent("#confirm-unbind-dialog").show()
    },
    onClickCancelUnbind: function() {
      this.selectComponent("#confirm-unbind-dialog").hide()
    },
    onClickUnBindDevice: function() {
      var e = this;
      g().then((function(n) {
        n && (e.selectComponent("#confirm-unbind-dialog").hide(), wx.showLoading({
          mask: !0,
          title: "设备解绑中..."
        }), e.setData({
          isUnboundScene: !0
        }), e.unbindLinkedDeviceEvent(e.data.linkedDevice))
      }))
    },
    onRescan: function() {
      this.startScanDevice()
    },
    startScanCountdown: function(e) {
      var n = this,
        t = "number" == typeof e ? e : 20;
      this.scanTimerId && (clearInterval(this.scanTimerId), this.scanTimerId = null), this.setData({
        scanRemainSeconds: t
      }), this.scanTimerId = setInterval((function() {
        var e = (n.data.scanRemainSeconds || 0) - 1;
        if (e <= 0) return i.default.follow("startScanCountdown", "== 停止搜索倒计时 == "), n.setData({
          scanRemainSeconds: 0
        }), n.onStopScan(), clearInterval(n.scanTimerId), void(n.scanTimerId = null);
        n.setData({
          scanRemainSeconds: e
        })
      }), 1e3)
    },
    stopScanCountdown: function() {
      this.scanTimerId && (clearInterval(this.scanTimerId), this.scanTimerId = null), this.setData({
        scanRemainSeconds: 0
      })
    },
    onStopScan: function() {
      this.setData({
        hasStartScan: !1
      }), this.bleScan && this.bleScan.stop(), this.stopScanCountdown()
    },
    updateSceneMac: function(e, n, t, i) {
      e.links.forEach((function(e) {
        e.trigger.categoryCode == i && (e.trigger.mac = n, e.trigger.barcode = t + ""), e.exec.categoryCode == i && (e.exec.mac = n, e.exec.barcode = t + "")
      }))
    },
    onDeviceClick: function(e) {
      var n = this,
        t = e.detail.checked,
        a = e.currentTarget.dataset.item;
      t ? g().then((function(e) {
        if (e) {
          n.setData({
            isUnboundScene: !1
          }), n.onStopScan();
          var t = (0, v.getDeviceInfo)(a.typeCode);
          t.enable = !0, t.mac = a.mac, t.typeCode = a.typeCode, t.productName = a.productName, t.model = a.model, t.updateTime = Date.now(), n.data._currentClickedDeviceInfo = t;
          var c = n.data.scene.id,
            o = n,
            l = n.data,
            r = l.currentDeviceInfo,
            s = l.currentDevice;
          wx.showLoading({
            title: "绑定中..."
          }), n.getRelatedDeviceBindState(t.mac, t.typeCode, c).then((function(e) {
            if (i.default.follow("返回结果 = ", e), e) return o.setData({
              linkedDeviceInfo: {}
            }), void o.showBindErrorDialog();
            n.data._needUnBindSceneList = n.getNeedUnBindSceneList(1 == r.categoryId ? s.mac : t.mac), n.data._needUnBindSceneList.length ? 2 == n.data.currentDeviceInfo.categoryId ? (n.setData({
              linkedDeviceInfo: null
            }), n.showBindErrorDialog()) : n.openReplaceBindDialog() : n.bindDevice(t)
          })).catch((function(e) {
            o.setData({
              linkedDeviceInfo: {}
            }), o.showNormalToast("联动绑定失败"), i.default.follow("错误", e)
          }))
        }
      })) : this.setData({
        linkedDevice: null
      })
    },
    bindDevice: function(e) {
      var n = this,
        t = 1 == this.data.currentDeviceInfo.categoryId ? 2 : 1;
      this.setData({
        linkedDeviceInfo: e,
        linkDeviceCategoryId: t
      }), this.updateSceneMac(this.data.scene, e.mac, e.typeCode, t), setTimeout((function() {
        n.autoBindLinkedDevice(e.mac, !0)
      }), 400)
    },
    getNeedUnBindSceneList: function(e) {
      var n = [],
        t = this.data.scene.id,
        i = null;
      return 1 == t ? (i = (0, u.getLocalScene)(e, 2) || null, this.isSceneValid(i) && n.push(i)) : 2 != t && 3 != t || (i = (0, u.getLocalScene)(e, 1) || null, this.isSceneValid(i) && n.push(i)), n
    },
    isSceneValid: function(e) {
      if (!e) return !1;
      var n = !0;
      return (e.links || []).forEach((function(e) {
        var t = (null == e ? void 0 : e.trigger) || {},
          i = (null == e ? void 0 : e.exec) || {};
        t.barcode && "000000" !== t.barcode && t.mac || (n = !1), i.barcode && "000000" !== i.barcode && i.mac || (n = !1)
      })), n
    },
    onClickBindErrorDevice: function(e) {
      this.selectComponent("#confirm-bind-error-dialog").hide()
    },
    showBindErrorDialog: function() {
      this.selectComponent("#confirm-bind-error-dialog").show()
    },
    getRelatedDeviceBindState: function(e, n, t) {
      return i.default.follow("获取待绑定设备的绑定状态", {
        mac: e,
        barcode: n,
        sceneID: t
      }), new Promise((function(a, c) {
        (0, h.getDeviceScenes)({
          barcode: n,
          mac: e
        }).then((function(e) {
          if (i.default.follow(e), 200 == e.code) {
            var n = e.data;
            if (n && 1 == n.rtn && n.scenes) {
              var o = (n.scenes || []).some((function(e) {
                return e.id == t
              }));
              a(!!o)
            } else a(!1)
          } else c(new Error("请求失败"))
        })).catch((function(e) {
          i.default.follow("错误", e), c(e)
        }))
      }))
    },
    onToggleLinkDisable: function(e) {
      var n = "";
      this.data.linkedDevice ? 1 != this.data.linkedDeviceConnectState && (n = "联动的产品已离线无法使用") : n = "请先选择1台联动的产品", this.showNormalToast(n)
    },
    onToggleLink: function(e) {
      var n = e.detail.value;
      this.onLinkSwitch(n)
    },
    onLinkSwitch: function(e) {
      this.setData({
        isUnboundScene: !1
      }), this.updateScene(e)
    },
    updateScene: function(e) {
      i.default.follow("更新联动状态"), this.setData({
        sceneModeChecked: e
      });
      var n = JSON.parse(JSON.stringify(this.data.scene));
      null != n && (2 != n.id && 3 != n.id || (n.id = 1, console.log("修改下发的场景id: " + n.id))), this.data.scene.enable = e, this.data.linkedDevice && this.data.linkedDevice.enableScene(n, e), this.data.currentDevice && this.data.currentDevice.enableScene(n, e), (0, f.updateLocalDeviceScenesWithScene)(this.data.scene), this.data.isUnboundScene || this.updateSceneToServer()
    },
    updateSceneToServer: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        n = e || {},
        t = n.mac,
        a = n.jmZtmxm,
        c = this.data || {},
        o = c.currentDeviceInfo,
        l = c.currentDevice;
      t || a || (t = l.mac, a = o.jmZtmxm);
      var r = this,
        s = (0, f.getLocalDeviceScenes)(t);
      return i.default.follow("更新联动状态到服务器", {
        mac: t,
        barcode: a,
        scenes: s
      }), (0, h.updateDeviceScene)({
        mac: t,
        barcode: a,
        scenes: s
      }).then((function(e) {
        200 == e.code && i.default.follow("更新场景到服务器成功"), r.setData({
          isUnboundScene: !1
        })
      })).catch((function(e) {
        i.default.follow("错误", e)
      }))
    },
    unbindCurrentDeviceEvent: function(e) {
      if (i.default.follow("解绑当前设备联动事件"), !e.isConnected) return this.showNormalToast("联动配置失败"), void wx.navigateBack();
      var n = JSON.parse(JSON.stringify(this.data.scene));
      null != n && (2 != n.id && 3 != n.id || (n.id = 1, console.log("修改下发的场景id: " + n.id))), e.configScene(n, !1), this.updateScene(!1), (0, f.deleteScene)(this.data.scene), this.updateSceneToServer(), this.showNormalToast("解绑成功"), this.data.linkedDevice && (this.data.linkedDevice.stopConnnect(), this.data.linkedDevice.connectCallBack = null), this.setData({
        linkedDeviceInfo: {},
        linkedDevice: null
      }), this.startScanDevice(), this.setData({
        isUnboundScene: !1
      })
    },
    bindCurrentDeviceEvent: function(e) {
      if (i.default.follow("绑定当前设备联动事件1"), !e.isConnected) return this.showNormalToast("联动配置失败"), void wx.navigateBack();
      var n = JSON.parse(JSON.stringify(this.data.scene));
      null != n && (2 != n.id && 3 != n.id || (n.id = 1, console.log("修改下发的场景id: " + n.id))), e.configScene(n, !0), this.updateScene(!0), this.showNormalToast("联动配置成功")
    },
    bindLinkedDeviceEvent: function(e) {
      wx.showLoading({
        mask: !0,
        title: "联动配置中..."
      });
      var n = JSON.parse(JSON.stringify(this.data.scene));
      null != n && (2 != n.id && 3 != n.id || (n.id = 1, console.log("修改下发的场景id: " + n.id))), e.configScene(n, !0)
    },
    unbindLinkedDeviceEvent: function(e) {
      wx.showLoading({
        mask: !0,
        title: "解绑中..."
      });
      var n = JSON.parse(JSON.stringify(this.data.scene));
      null != n && (2 != n.id && 3 != n.id || (n.id = 1, console.log("修改下发的场景id: " + n.id))), e.configScene(n, !1)
    },
    onBindLinkedDeviceEventBack: function(e, n) {
      this.data.isDetected || (e ? n ? this.bindCurrentDeviceEvent(this.data.currentDevice) : this.unbindCurrentDeviceEvent(this.data.currentDevice) : (this.setData({
        sceneModeChecked: !1
      }), this.showNormalToast("联动绑定失败")))
    },
    autoBindLinkedDevice: function(e, n) {
      var t = this;
      i.default.follow("自动连接设备"), n && wx.showLoading({
        mask: !0,
        title: "绑定中..."
      }), this.setData({
        linkedDeviceConnectState: 2
      });
      var a = this;
      null != this.data.linkedDevice && this.data.linkedDevice.setTriggerBindCallBack(null);
      var c = this.getLinkedDevice(this.data.linkedDeviceInfo, this.data.linkDeviceCategoryId, e);
      this.setData({
        linkedDevice: c
      }), this.data.linkedDevice.setTriggerBindCallBack(this.onBindLinkedDeviceEventBack), this.data.linkedDevice.setReadyCallBack((function() {
        i.default.follow("联动设备连接成功"), t.data.isDetected || (a.setData({
          linkedDeviceConnectState: 1
        }), a.onLinkDeviceConnectCallback(), a.onLinkedDeviceMsgValueChange(null), a.data.linkedDevice.setMsgValueChangeCallBack((function(e) {
          a.onLinkedDeviceMsgValueChange(e)
        })), n && a.bindLinkedDeviceEvent(a.data.linkedDevice))
      })), console.log("联动设备开始连接蓝牙2 >>>>>>>>>>>>>"), this.data.linkedDevice.startConnect((function(e, c) {
        i.default.follow("联动设备连接结果2 = ", e), t.data.isDetected || e || (a.setData({
          linkedDeviceConnectState: 0
        }), a.showNormalToast("绑定失败,请重新绑定"), n && (a.data.linkedDevice && (a.data.linkedDevice.connectCallBack = null), a.setData({
          linkedDeviceInfo: {},
          linkedDevice: null
        }), a.startScanDevice()))
      }), (function(e) {}))
    },
    getLinkedDevice: function(e, n, t) {
      var i = null;
      switch (n) {
        case 1:
          (i = 0 === e.bleProtocol ? r.default.getInstance() : 1 === e.bleProtocol ? s.default.getInstance() : 2 === e.bleProtocol ? d.default.getInstance() : r.default.getInstance()).mac = t;
          break;
        case 2:
          (i = l.default.getInstance(t)).mac = t;
          break;
        default:
          i = o.default.getInstance(t)
      }
      return i.jmZtmxm = e.jmZtmxm + "", i.showName = i.getDeviceName(), console.log("联动设备名称：" + i.showName), i
    },
    showNormalToast: function(e) {
      wx.showToast({
        title: e,
        icon: "none",
        duration: 3e3
      })
    }
  }
});