var e = require("../../@babel/runtime/helpers/slicedToArray"),
  t = require("../../@babel/runtime/helpers/defineProperty"),
  n = function(e, t) {
    if (!t && e && e.__esModule) return e;
    if (null === e || "object" != typeof e && "function" != typeof e) return {
      default: e
    };
    var n = f(t);
    if (n && n.has(e)) return n.get(e);
    var i = {},
      a = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var r in e)
      if ("default" !== r && Object.prototype.hasOwnProperty.call(e, r)) {
        var c = a ? Object.getOwnPropertyDescriptor(e, r) : null;
        c && (c.get || c.set) ? Object.defineProperty(i, r, c) : i[r] = e[r]
      } i.default = e, n && n.set(e, i);
    return i
  }(require("./LinkController.js")),
  i = l(require("./LinkScanner.js")),
  a = require("../../config/scene_enum.js"),
  r = require("../../config/device_enum.js"),
  c = l(require("../debuglog.js")),
  o = require("../http/DeviceSceneRoute.js"),
  s = require("../http/DeviceScene.js");

function l(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}

function f(e) {
  if ("function" != typeof WeakMap) return null;
  var t = new WeakMap,
    n = new WeakMap;
  return (f = function(e) {
    return e ? n : t
  })(e)
}
var u = require("../eventBus.js"),
  d = require("./frameCodec.js"),
  h = require("../mock/switch.js"),
  p = {
    self: {
      timer: "_selfScanTimer",
      remain: "selfScanRemain",
      stop: "onStopScanSelf"
    },
    peer: {
      timer: "_peerScanTimer",
      remain: "peerScanRemain",
      stop: "onStopScanPeer"
    }
  };
module.exports = Behavior({
  data: {
    mockMode: n.MOCK_MODE,
    sceneId: null,
    sceneName: "",
    sceneDetail: "",
    sceneImageUrl: "",
    sceneLocalImageUrl: "",
    selfName: "",
    peerName: "",
    selfScanning: !1,
    selfScanRemain: 0,
    selfDevices: [],
    selfState: 0,
    selfMac: "",
    selfShowName: "",
    peerScanning: !1,
    peerScanRemain: 0,
    peerProbed: !1,
    peerDevices: [],
    peerState: 0,
    linkedMac: "",
    linkedShowName: "",
    linkedModel: "",
    binding: !1,
    sceneEnabled: !1
  },
  methods: {
    initLinkPage: function(e) {
      var t = this,
        n = e.sceneId,
        i = e.selfCategory,
        r = e.selfMac,
        c = e.selfJmZtmxm;
      this._destroyed = !1, this._bindTimers = [], this.selfDevice = null, this.peerDevice = null, this.selfScanner = null, this.peerScanner = null;
      var o = (0, a.getDefaultLinkSceneList)().find((function(e) {
        return e.id === n
      }));
      if (!o || !Array.isArray(o.roles) || o.roles.length < 2) this._toast("场景配置缺失或缺 roles（scene_enum 场景".concat(n, "）"));
      else {
        var s = o.roles.find((function(e) {
            return e.categoryCode === i
          })),
          l = o.roles.find((function(e) {
            return e.categoryCode !== i
          }));
        s && l ? (this._profile = {
          sceneId: n,
          self: s,
          peer: l
        }, this.setData({
          sceneId: n,
          sceneName: o.name,
          sceneDetail: o.detail,
          sceneImageUrl: o.imageUrl || "",
          sceneLocalImageUrl: o.localImageUrl || "",
          selfName: s.name,
          peerName: l.name
        }), this._onBleEvent = function(e) {
          null != e && !1 === e.connect && e.mac && (e.mac === t.data.selfMac && 2 === t.data.selfState ? (t.setData({
            selfState: 0
          }), t._toast("本机".concat(t._profile.self.name, "连接已断开"))) : e.mac === t.data.linkedMac && 2 === t.data.peerState && t.setData({
            peerState: 0
          }))
        }, u.on("event", this._onBleEvent), r && this._restoreBindState(r, c), r ? this._autoConnectSelf(r, c) : this.onScanSelf()) : this._toast("场景".concat(n, " 的 roles 与本机品类(").concat(i, ")不匹配"))
      }
    },
    unloadLinkPage: function() {
      this._destroyed = !0, wx.hideLoading(), this._clearBindTimers(), this._selfConnectTimer && clearTimeout(this._selfConnectTimer), this._peerConnectTimer && clearTimeout(this._peerConnectTimer), this._peerReconnectTimer && clearTimeout(this._peerReconnectTimer), this._onBleEvent && u.off("event", this._onBleEvent), this._clearScanCountdown("self"), this._clearScanCountdown("peer"), this.selfScanner && this.selfScanner.destroy(), this.peerScanner && this.peerScanner.destroy(), this.peerDevice && this.peerDevice.stopConnnect()
    },
    _clearBindTimers: function() {
      (this._bindTimers || []).forEach((function(e) {
        return clearTimeout(e)
      })), this._bindTimers = []
    },
    _startScanCountdown: function(e) {
      var n = this,
        i = p[e],
        a = i.timer,
        r = i.remain,
        c = i.stop;
      clearInterval(this[a]), this[a] = setInterval((function() {
        var e = (n.data[r] || 0) - 1;
        e > 0 ? n.setData(t({}, r, e)) : n[c]()
      }), 1e3)
    },
    _clearScanCountdown: function(e) {
      var t = p[e].timer;
      clearInterval(this[t]), this[t] = null
    },
    onScanSelf: function() {
      var e = this;
      this._profile && !this.data.selfScanning && (this.setData({
        selfScanning: !0,
        selfDevices: [],
        selfScanRemain: 20
      }), this.selfScanner = this.selfScanner || new i.default({
        targetCategoryId: this._profile.self.categoryCode,
        sceneId: this._profile.sceneId,
        onUpdate: function(t) {
          return e.setData({
            selfDevices: t
          })
        },
        onError: function(t) {
          e.onStopScanSelf(), e._toast("扫描失败：".concat(t))
        }
      }), this.selfScanner.start(), this._startScanCountdown("self"))
    },
    onStopScanSelf: function() {
      this.selfScanner && this.selfScanner.stop(), this._clearScanCountdown("self"), this.setData({
        selfScanning: !1,
        selfScanRemain: 0
      })
    },
    onConnectSelf: function(e) {
      var t = this;
      if (this._profile) {
        var i = e.currentTarget.dataset.item;
        this.onStopScanSelf(), this.setData({
          selfState: 1
        });
        var a = n.default.getInstance(i.mac);
        a.role = this._profile.self.name, a.jmZtmxm = i.typeCode + "", this.selfDevice = a;
        var r = !1,
          c = function(e) {
            r || (r = !0, clearTimeout(t._selfConnectTimer), e())
          };
        this._selfConnectTimer = setTimeout((function() {
          return c((function() {
            t.setData({
              selfState: 0
            }), t._toast("本机".concat(t._profile.self.name, "连接超时，请重试"))
          }))
        }), 1e4), a.startConnect((function(e, n) {
          return c((function() {
            e ? (t.setData({
              selfState: 2,
              selfMac: i.mac,
              selfShowName: i.productName
            }), t._restoreBindState(i.mac, i.typeCode), t._scanPeerIfUnbound()) : (t.setData({
              selfState: 0
            }), t._toast("本机".concat(t._profile.self.name, "连接失败：").concat(n || "未知原因")))
          }))
        }))
      }
    },
    _autoConnectSelf: function(e, t) {
      var i = this;
      if (this._profile && e) {
        var a = (0, r.getDeviceInfo)(t) || {};
        this.setData({
          selfState: 1
        });
        var c = n.default.getInstance(e);
        c.role = this._profile.self.name, c.jmZtmxm = (t || "") + "", this.selfDevice = c;
        var o = !1,
          s = function(e) {
            o || (o = !0, clearTimeout(i._selfConnectTimer), e())
          };
        this._selfConnectTimer = setTimeout((function() {
          return s((function() {
            i.setData({
              selfState: 0
            }), i.onScanSelf()
          }))
        }), 1e4), c.startConnect((function(t) {
          return s((function() {
            t ? (i.setData({
              selfState: 2,
              selfMac: e,
              selfShowName: a.showName || i._profile.self.name
            }), i._scanPeerIfUnbound()) : (i.setData({
              selfState: 0
            }), i.onScanSelf())
          }))
        }))
      } else this.onScanSelf()
    },
    _restoreBindState: function(e, t) {
      var n = this;
      if (this._profile && e) {
        var i = this._applyRestoredScene((0, s.getLocalDeviceScenes)(e));
        c.default.follow("本地恢复绑定态", e, i ? "命中" : "未命中"), this._shouldSkipCloud("绑定状态恢复") || (0, o.getDeviceScenes)({
          barcode: this._normBarcode(t),
          mac: e
        }).then((function(t) {
          if (!n._destroyed && t && 200 == t.code && t.data && 1 == t.data.rtn && Array.isArray(t.data.scenes)) {
            var i = t.data.scenes.map((function(e) {
              return e && "string" == typeof e.id ? Object.assign({}, e, {
                id: Number(e.id)
              }) : e
            }));
            (0, s.updateLocalDeviceScenes)(e, i);
            var a = n._applyRestoredScene(i);
            c.default.follow("云端恢复绑定态", e, a ? "命中" : "未命中"), !a && n.data.linkedMac && (c.default.follow("云端已无该绑定，撤销本地回显", n.data.linkedMac), n._clearBindState(), n._scanPeerIfUnbound())
          }
        })).catch((function(e) {
          return c.default.follow("云端恢复绑定态失败，保留本地结论", e)
        }))
      }
    },
    _normBarcode: function(e) {
      var t = null == e ? "" : e + "";
      return "undefined" === t || "null" === t ? "" : t
    },
    _clearBindState: function() {
      this.peerDevice && this.peerDevice.stopConnnect(), this.peerDevice = null, this._peerReconnectTimer && clearTimeout(this._peerReconnectTimer), this.setData({
        linkedMac: "",
        linkedShowName: "",
        linkedModel: "",
        peerState: 0,
        sceneEnabled: !1
      })
    },
    _applyRestoredScene: function(e) {
      var t = this;
      if (this._destroyed || this.data.binding) return !1;
      if (!Array.isArray(e)) return !1;
      var n = e.find((function(e) {
        return e.id == t._profile.sceneId
      }));
      if (!n) return !1;
      var i = this._sideOfCategory(n, this._profile.peer.categoryCode);
      if (!i || !i.mac) return !1;
      if (this._normMac(i.mac) === this._normMac(this.data.selfMac)) return !1;
      if (this._normMac(this.data.linkedMac) === this._normMac(i.mac)) return this.data.sceneEnabled !== !!n.enable && this.setData({
        sceneEnabled: !!n.enable
      }), !0;
      var a = (0, r.getDeviceInfo)(i.barcode) || {};
      return this.setData({
        linkedMac: i.mac,
        linkedShowName: a.showName || this._profile.peer.name,
        linkedModel: a.model || "",
        sceneEnabled: !!n.enable
      }), this.data.peerScanning && this.onStopScanPeer(), this._reconnectPeer(i.mac, i.barcode), !0
    },
    _reconnectPeer: function(e, t) {
      var i = this;
      if (this._profile && e && !this._destroyed && !this.data.binding) {
        var a = n.default.getInstance(e);
        this._peerReconnectTimer && clearTimeout(this._peerReconnectTimer), this.peerDevice && this.peerDevice !== a && this.peerDevice.stopConnnect(), a.role = this._profile.peer.name, a.jmZtmxm = (t || "") + "", this.peerDevice = a, this.setData({
          peerState: 1
        });
        var r = !1,
          o = function(e) {
            r || (r = !0, clearTimeout(i._peerReconnectTimer), e())
          };
        this._peerReconnectTimer = setTimeout((function() {
          return o((function() {
            i.peerDevice === a && (a.stopConnnect(), i.setData({
              peerState: 0
            }), c.default.follow("已绑定对端重连超时，按离线展示", e))
          }))
        }), 15e3), a.startConnect((function(t) {
          return o((function() {
            i._destroyed || i.peerDevice !== a || (i.setData({
              peerState: t ? 2 : 0
            }), c.default.follow("已绑定对端重连" + (t ? "成功" : "失败"), e))
          }))
        }))
      }
    },
    _scanPeerIfUnbound: function() {
      this.data.linkedMac ? c.default.follow("已有绑定关系，跳过对端搜索", this.data.linkedMac) : this.onScanPeer()
    },
    onScanPeer: function() {
      var e = this;
      this._profile && !this.data.peerScanning && (this.setData({
        peerScanning: !0,
        peerProbed: !0,
        peerDevices: [],
        peerScanRemain: 20
      }), this.peerScanner = this.peerScanner || new i.default({
        targetCategoryId: this._profile.peer.categoryCode,
        sceneId: this._profile.sceneId,
        onUpdate: function(t) {
          return e.setData({
            peerDevices: t
          })
        },
        onError: function(t) {
          e.onStopScanPeer(), e._toast("扫描失败：".concat(t))
        }
      }), this.peerScanner.start(), this._startScanCountdown("peer"))
    },
    onStopScanPeer: function() {
      this.peerScanner && this.peerScanner.stop(), this._clearScanCountdown("peer"), this.setData({
        peerScanning: !1,
        peerScanRemain: 0
      })
    },
    onRescanPeer: function() {
      this.onScanPeer()
    },
    onPeerDeviceClick: function(e) {
      var t = this;
      if (this._profile) {
        var n = e.detail.checked,
          i = e.currentTarget.dataset.item;
        n && !this.data.binding && (2 === this.data.selfState ? (this.onStopScanPeer(), this.setData({
          binding: !0,
          peerState: 1
        }), wx.showLoading({
          mask: !0,
          title: "绑定中..."
        }), this._checkPeerOccupied(i).then((function(e) {
          if (e) return wx.hideLoading(), t.setData({
            binding: !1,
            peerState: 0
          }), t._toast("该".concat(t._profile.peer.name, "已与其他产品联动，请先解绑")), void t.onScanPeer();
          t._startBindPeer(i)
        }))) : this._toast("请先连接本机".concat(this._profile.self.name)))
      }
    },
    _shouldSkipCloud: function(e) {
      return !!this.data.mockMode && (!h.isCloudPassthroughOn() && (c.default.follow("已跳过云端".concat(e, "(mock)，如需透传请开启 cloud 开关(?cloud=1 或 mock 面板)")), !0))
    },
    _normMac: function(e) {
      return (e || "").toUpperCase().replace(/:/g, "")
    },
    _sideOfCategory: function(e, t) {
      if (!e || !Array.isArray(e.links)) return null;
      var n = null;
      return e.links.forEach((function(e) {
        [e.trigger, e.exec].forEach((function(e) {
          !n && e && e.categoryCode == t && e.mac && (n = {
            mac: e.mac,
            barcode: (e.barcode || "") + ""
          })
        }))
      })), n
    },
    _checkPeerOccupied: function(e) {
      var t = this;
      return this._shouldSkipCloud("对端占用校验") ? Promise.resolve(!1) : (0, o.getDeviceScenes)({
        barcode: e.typeCode + "",
        mac: e.mac
      }).then((function(e) {
        if (!(e && 200 == e.code && e.data && 1 == e.data.rtn && Array.isArray(e.data.scenes))) return !1;
        var n = e.data.scenes.find((function(e) {
          return e.id == t._profile.sceneId
        }));
        if (!n) return !1;
        var i = t._sideOfCategory(n, t._profile.self.categoryCode);
        return i ? t._normMac(i.mac) !== t._normMac(t.data.selfMac) || (c.default.follow("对端已绑定本机，放行重新绑定", i.mac), !1) : !!n.enable
      })).catch((function() {
        return !1
      }))
    },
    _startBindPeer: function(e) {
      var t = this;
      this._peerReconnectTimer && clearTimeout(this._peerReconnectTimer);
      var i = n.default.getInstance(e.mac);
      i.role = this._profile.peer.name, i.jmZtmxm = e.typeCode + "", this.peerDevice = i;
      var a = !1,
        r = function(e) {
          a || (a = !0, clearTimeout(t._peerConnectTimer), e())
        };
      this._peerConnectTimer = setTimeout((function() {
        return r((function() {
          wx.hideLoading(), i.stopConnnect(), t.setData({
            binding: !1,
            peerState: 0
          }), t._toast("绑定超时，请重新绑定"), t.onScanPeer()
        }))
      }), 15e3), i.startConnect((function(n, i) {
        return r((function() {
          if (!n) return wx.hideLoading(), t.setData({
            binding: !1,
            peerState: 0
          }), t._toast("绑定失败，请重新绑定".concat(i ? "（" + i + "）" : "")), void t.onScanPeer();
          t.setData({
            peerState: 2
          });
          var a = setTimeout((function() {
            t._configScene(!0, e, (function(n) {
              wx.hideLoading(), t.setData({
                binding: !1,
                linkedMac: e.mac,
                linkedShowName: e.productName,
                linkedModel: e.model,
                sceneEnabled: !0
              }), t._toast("联动配置成功"), n.enable = !0, t._syncSceneToCloud(n, e)
            }))
          }), 2e3);
          t._bindTimers.push(a)
        }))
      }))
    },
    _configScene: function(e, t, n) {
      var i = this,
        a = this._currentScene(t),
        r = function(e, t) {
          i._isDeviceOnline(e) && e.writeCommunicateCommand(t.buffer)
        },
        c = [];
      a.links.forEach((function(t) {
        c.push((function() {
          r(i._deviceForCategory(t.exec.categoryCode), d.build0C(e, a, t))
        })), c.push((function() {
          r(i._deviceForCategory(t.trigger.categoryCode), d.build0A(e, a, t))
        }))
      })), c.push((function() {
        i._isDeviceOnline(i.selfDevice) && i.selfDevice.sendEnableScene(a.id, e), i._isDeviceOnline(i.peerDevice) && i.peerDevice.sendEnableScene(a.id, e)
      })), n && c.push((function() {
        return n(a)
      })), this._clearBindTimers(), this._bindTimers = c.map((function(e, t) {
        return setTimeout(e, 600 * t)
      }))
    },
    _currentScene: function(n) {
      var i, a = this._currentEnds(n),
        r = e(a, 2),
        c = r[0],
        o = r[1],
        s = (t(i = {}, this._profile.self.categoryCode, c), t(i, this._profile.peer.categoryCode, o), i);
      return this._buildScene(s)
    },
    _currentEnds: function(e) {
      var t = e ? e.mac : this.data.linkedMac;
      return [{
        mac: this.data.selfMac,
        barcode: this.selfDevice ? this.selfDevice.jmZtmxm + "" : "000000"
      }, {
        mac: t,
        barcode: this.peerDevice ? this.peerDevice.jmZtmxm + "" : "000000"
      }]
    },
    _buildScene: function(e) {
      var t = this,
        n = (0, a.getDefaultLinkSceneList)().find((function(e) {
          return e.id === t._profile.sceneId
        }));
      return n.links.forEach((function(t) {
        [t.trigger, t.exec].forEach((function(t) {
          var n = e[t.categoryCode];
          n && (t.mac = n.mac, t.barcode = n.barcode)
        }))
      })), n
    },
    _isDeviceOnline: function(e) {
      return !!e && (e === this.selfDevice ? 2 === this.data.selfState : e === this.peerDevice && 2 === this.data.peerState)
    },
    _deviceForCategory: function(e) {
      return e === this._profile.self.categoryCode ? this.selfDevice : this.peerDevice
    },
    onToggleScene: function(e) {
      if (this._profile) {
        var t = e.detail.value,
          n = this._isDeviceOnline(this.selfDevice),
          i = this._isDeviceOnline(this.peerDevice);
        if (!n || !i) return this.setData({
          sceneEnabled: !t
        }), void this._toast(n ? "".concat(this._profile.peer.name, "未连接，请先连接") : "本机".concat(this._profile.self.name, "未连接，请先连接"));
        this.setData({
          sceneEnabled: t
        }), this.selfDevice.sendEnableScene(this._profile.sceneId, t), this.peerDevice.sendEnableScene(this._profile.sceneId, t), this._toast(t ? "场景已开启" : "场景已关闭");
        var a = this._currentScene();
        a.enable = t, this._syncSceneToCloud(a)
      }
    },
    onToggleSceneDisable: function() {
      this._profile && (this.data.linkedMac ? 1 === this.data.peerState ? this._toast("正在连接".concat(this._profile.peer.name, "，请稍候")) : 2 !== this.data.peerState ? this._toast("联动的产品已离线无法使用") : 2 !== this.data.selfState && this._toast("本机".concat(this._profile.self.name, "未连接，请先连接")) : this._toast("请先绑定1台联动的".concat(this._profile.peer.name)))
    },
    onOpenUnbindDialog: function() {
      this._profile && 2 === this.data.selfState ? this.selectComponent("#confirm-unbind-dialog").show() : this._toast("请等待本机".concat(this._profile ? this._profile.self.name : "设备", "连接完成"))
    },
    onCancelUnbind: function() {
      this.selectComponent("#confirm-unbind-dialog").hide()
    },
    onConfirmUnbind: function() {
      var e = this;
      this.selectComponent("#confirm-unbind-dialog").hide(), wx.showLoading({
        mask: !0,
        title: "设备解绑中..."
      }), this._configScene(!1, null, (function(t) {
        wx.hideLoading(), e._removeSceneFromCloud(t), e.peerDevice && e.peerDevice.stopConnnect(), e.peerDevice = null, e._peerReconnectTimer && clearTimeout(e._peerReconnectTimer), e.setData({
          linkedMac: "",
          linkedShowName: "",
          linkedModel: "",
          peerState: 0,
          sceneEnabled: !1
        }), e._toast("解绑成功"), e.onScanPeer()
      }))
    },
    _syncSceneToCloud: function(e, t) {
      (0, s.updateLocalDeviceScenesWithScene)(e), this._postEndsSerially(this._currentEnds(t))
    },
    _removeSceneFromCloud: function(e, t) {
      (0, s.deleteScene)(e), this._postEndsSerially(this._currentEnds(t))
    },
    _mergeWithCloudScenes: function(e) {
      var t = this._profile.sceneId,
        n = (0, s.getLocalDeviceScenes)(e.mac) || [],
        i = n.find((function(e) {
          return e.id == t
        }));
      return (0, o.getDeviceScenes)({
        barcode: e.barcode,
        mac: e.mac
      }).then((function(t) {
        return t && 200 == t.code && t.data && 1 == t.data.rtn && Array.isArray(t.data.scenes) ? t.data.scenes : (c.default.follow("云端无该端场景记录，按本地列表上报", e.mac), null)
      })).catch((function() {
        return c.default.follow("云端场景拉取失败，退回本地列表上报(可能覆盖对端其他场景)", e.mac), null
      })).then((function(a) {
        if (!a) return n;
        if (!i) return a.filter((function(e) {
          return e.id != t
        }));
        var r = a.some((function(e) {
            return e.id == t
          })),
          o = a.map((function(e) {
            return e.id == t ? i : e
          }));
        return r || o.push(i), c.default.follow("云端场景合并完成", e.mac, "共" + o.length + "个场景"), o
      }))
    },
    _postEndsSerially: function(e) {
      var t = this;
      this._shouldSkipCloud("场景上报") || e && e.length && e.reduce((function(e, n) {
        return e.then((function() {
          return n.mac ? t._mergeWithCloudScenes(n).then((function(e) {
            return (0, o.updateDeviceScene)({
              mac: n.mac,
              barcode: n.barcode,
              scenes: e
            })
          })).then((function(e) {
            e && 200 == e.code && c.default.follow("场景云端同步成功", n.mac)
          })) : Promise.resolve()
        }))
      }), Promise.resolve()).catch((function(e) {
        return c.default.follow("场景云端同步失败(不阻塞BLE，底层已提示一次)", e)
      }))
    },
    preventTouchMove: function() {},
    onBuy: function() {
      wx.navigateToMiniProgram({
        appId: "wxe904259626fd02bc",
        fail: function() {
          console.log("-- 跳转商城失败 --")
        }
      })
    },
    _toast: function(e) {
      wx.showToast({
        title: e,
        icon: "none",
        duration: 2500
      })
    }
  }
});