var e = require("../../../@babel/runtime/helpers/defineProperty"),
  t = require("../index.js"),
  r = require("../frameForge.js"),
  a = [{
    key: "shower",
    label: "淋浴中"
  }, {
    key: "topSprayState",
    label: "顶喷"
  }, {
    key: "handShowerState",
    label: "手持花洒"
  }, {
    key: "downWaterState",
    label: "下出水"
  }, {
    key: "waterTempHighEror",
    label: "水温过高"
  }, {
    key: "lackHotWaterError",
    label: "缺热水"
  }, {
    key: "preDischargeError",
    label: "预排异常"
  }];

function n(e) {
  return a.map((function(t) {
    return {
      key: t.key,
      label: t.label,
      value: !!e[t.key]
    }
  }))
}
var i = [{
  name: "待机",
  state: {
    preDischarge: 0,
    shower: !1,
    temp: 25,
    batteryState: 0,
    topSprayState: !1,
    handShowerState: !1,
    downWaterState: !1,
    waterTempHighEror: !1,
    lackHotWaterError: !1,
    preDischargeError: !1
  }
}, {
  name: "预排·顶喷",
  state: {
    preDischarge: 1,
    shower: !1,
    topSprayState: !0,
    handShowerState: !1,
    downWaterState: !1,
    temp: 32
  }
}, {
  name: "预排·手持",
  state: {
    preDischarge: 1,
    shower: !1,
    topSprayState: !1,
    handShowerState: !0,
    downWaterState: !1,
    temp: 34
  }
}, {
  name: "淋浴·下出水",
  state: {
    preDischarge: 0,
    shower: !0,
    topSprayState: !1,
    handShowerState: !1,
    downWaterState: !0,
    temp: 40
  }
}, {
  name: "告警·水温过高",
  state: {
    temp: 48,
    waterTempHighEror: !0,
    batteryState: 0
  }
}, {
  name: "告警·缺热水",
  state: {
    lackHotWaterError: !0,
    waterTempHighEror: !1,
    batteryState: 0
  }
}, {
  name: "告警·预排异常",
  state: {
    preDischargeError: !0,
    lackHotWaterError: !1,
    waterTempHighEror: !1,
    batteryState: 0
  }
}, {
  name: "告警·电池欠压",
  state: {
    batteryState: 2,
    waterTempHighEror: !1,
    lackHotWaterError: !1,
    preDischargeError: !1
  }
}, {
  name: "故障·低压",
  state: {
    batteryState: 1
  }
}];
Component({
  options: {
    addGlobalClass: !0
  },
  data: {
    visible: !1,
    expanded: !1,
    ballTop: 0,
    ballLeft: 0,
    isLinkPage: !1,
    reason: "",
    state: {},
    boolFields: [],
    presets: [],
    playing: !1,
    stepNote: "未开始",
    stepIndex: -1,
    stepTotal: 0,
    frameHex: "",
    sceneEnabled: !0
  },
  lifetimes: {
    attached: function() {
      if (t.isMockOn()) {
        var e = wx.getSystemInfoSync() || {},
          r = Number(e.windowWidth) > 0 ? e.windowWidth : 375,
          a = Number(e.windowHeight) > 0 ? e.windowHeight : 667;
        this._win = {
          w: r,
          h: a
        };
        var n, o = getCurrentPages(),
          s = (o.length && o[o.length - 1].route || "").indexOf("/link/") >= 0;
        console.log("[MOCK] 调试面板已挂载，右下角悬浮球可展开｜依据：" + t.reason()), this.setData({
          visible: !0,
          isLinkPage: s,
          reason: t.reason(),
          ballTop: a - 160,
          ballLeft: r - 76,
          stepTotal: t.config.SCENARIO.length,
          presets: i,
          sceneEnabled: (n = t.httpMock.currentScenes().find((function(e) {
            return 4 === e.id
          })), !(!n || !n.enable))
        }), s || this._startRefresh()
      }
    },
    detached: function() {
      this._stopRefresh(), this._clearReproTimer()
    }
  },
  methods: {
    _startRefresh: function() {
      var e = this;
      this._stopRefresh(), this._refresh(), this._timer = setInterval((function() {
        return e._refresh()
      }), 500)
    },
    _stopRefresh: function() {
      null != this._timer && (clearInterval(this._timer), this._timer = null)
    },
    _refresh: function() {
      if (this.data.expanded) {
        var e = t.getVirtualDevice(),
          a = t.getScenario(),
          i = e.getState();
        this.setData({
          state: i,
          boolFields: n(i),
          frameHex: e.lastFrame ? r.toHex(e.lastFrame) : "",
          playing: !!a && a.playing,
          stepNote: a ? a.currentNote() : "未开始",
          stepIndex: a ? a.stepIndex : -1
        })
      }
    },
    onBallTouchStart: function(e) {
      var t = e.touches[0];
      this._dragFrom = {
        x: t.clientX,
        y: t.clientY,
        top: this.data.ballTop,
        left: this.data.ballLeft,
        moved: !1
      }
    },
    onBallTouchMove: function(e) {
      if (this._dragFrom) {
        var t = e.touches[0],
          r = t.clientX - this._dragFrom.x,
          a = t.clientY - this._dragFrom.y;
        (Math.abs(r) > 4 || Math.abs(a) > 4) && (this._dragFrom.moved = !0);
        var n = this._win || {
            w: 375,
            h: 667
          },
          i = function(e, t) {
            return Math.min(Math.max(e, 0), Math.max(0, t))
          };
        this.setData({
          ballTop: i(this._dragFrom.top + a, n.h - 48),
          ballLeft: i(this._dragFrom.left + r, n.w - 48)
        })
      }
    },
    onBallTap: function() {
      this._dragFrom && this._dragFrom.moved ? this._dragFrom = null : (this._dragFrom = null, this.setData({
        expanded: !0,
        boolFields: n(t.getVirtualDevice().getState())
      }), this._refresh())
    },
    onClose: function() {
      this.setData({
        expanded: !1
      })
    },
    preventTouchMove: function() {},
    stopTap: function() {},
    onTogglePlay: function() {
      var e = t.getScenario();
      e && (e.playing ? e.pause() : e.play(), this._refresh())
    },
    onPrevStep: function() {
      var e = t.getScenario();
      e && e.prev(), this._refresh()
    },
    onNextStep: function() {
      var e = t.getScenario();
      e && e.next(), this._refresh()
    },
    onReplay: function() {
      var e = t.getScenario();
      e && e.replay(), this._refresh()
    },
    _takeOver: function() {
      var e = t.getScenario();
      e && e.playing && e.pause(), this._clearReproTimer()
    },
    onToggleBool: function(r) {
      var a = r.currentTarget.dataset.key;
      this._takeOver();
      var n = t.getVirtualDevice();
      n.setState(e({}, a, !n.state[a])), this._refresh()
    },
    onTempChanging: function(e) {
      this._takeOver(), this.setData({
        "state.temp": e.detail.value
      })
    },
    onTempChange: function(e) {
      this._takeOver(), t.getVirtualDevice().setState({
        temp: e.detail.value
      }), this._refresh()
    },
    onPreDischargeTap: function(e) {
      this._takeOver(), t.getVirtualDevice().setState({
        preDischarge: Number(e.currentTarget.dataset.value)
      }), this._refresh()
    },
    onBatteryTap: function(e) {
      this._takeOver(), t.getVirtualDevice().setState({
        batteryState: Number(e.currentTarget.dataset.value)
      }), this._refresh()
    },
    onPresetTap: function(e) {
      this._takeOver();
      var r = i[Number(e.currentTarget.dataset.index)];
      r && t.getVirtualDevice().setState(r.state), this._refresh()
    },
    onResetDevice: function() {
      this._takeOver(), t.getVirtualDevice().reset(), this._refresh()
    },
    _clearReproTimer: function() {
      null != this._reproTimer && (clearTimeout(this._reproTimer), this._reproTimer = null)
    },
    onReproSlowStart: function() {
      var e = this;
      this._takeOver(), t.getVirtualDevice().setState({
        preDischarge: 0
      }), this._refresh(), wx.showToast({
        icon: "none",
        title: "剧本已暂停，请在 6 秒内点击冷水预排"
      }), this._reproTimer = setTimeout((function() {
        e._reproTimer = null, t.getVirtualDevice().setState({
          preDischarge: 1
        }), e._refresh()
      }), 6e3)
    },
    onReproEnum2: function() {
      this._takeOver(), t.getVirtualDevice().setState({
        preDischarge: 2
      }), this._refresh(), wx.showToast({
        icon: "none",
        title: "已钉在回报 2，请点击冷水预排"
      })
    },
    onToggleSceneLink: function() {
      var e = !this.data.sceneEnabled;
      t.httpMock.setSceneEnable(4, e), this.setData({
        sceneEnabled: e
      }), wx.showToast({
        icon: "none",
        title: e ? "已联动，退回重进生效" : "未联动，退回重进生效"
      })
    },
    _currentPage: function() {
      var e = getCurrentPages();
      return e.length ? e[e.length - 1] : null
    },
    onLinkOffline: function() {
      var e = this._currentPage();
      if (e) {
        var r = e.data.linkedMac || e.data.selfMac;
        r ? (t.linkBridge.emitOffline(r), wx.showToast({
          icon: "none",
          title: "已触发掉线"
        })) : wx.showToast({
          icon: "none",
          title: "尚未连接任何设备"
        })
      }
    },
    onLinkBound: function() {
      var e = this._currentPage();
      if (e) {
        var r = e._profile && e._profile.peer && e._profile.peer.categoryCode,
          a = r ? t.linkBridge.deviceForCategory(r) : null;
        a ? (e.peerDevice = t.linkBridge.attachPeerController(a.mac), e.setData({
          selfState: 2,
          peerState: 2,
          binding: !1,
          linkedMac: a.mac,
          linkedShowName: a.productName,
          linkedModel: a.model,
          sceneEnabled: !0,
          peerScanning: !1,
          peerDevices: []
        }), wx.showToast({
          icon: "none",
          title: "已跳到已绑定态"
        })) : wx.showToast({
          icon: "none",
          title: "页面场景未就绪"
        })
      }
    },
    onLinkUnbind: function() {
      var e = this._currentPage();
      e && (e.peerDevice && (e.peerDevice.stopConnnect(), e.peerDevice = null), e.setData({
        linkedMac: "",
        linkedShowName: "",
        linkedModel: "",
        sceneEnabled: !1,
        peerState: 0,
        binding: !1
      }), wx.showToast({
        icon: "none",
        title: "已清空绑定"
      }))
    },
    onResetSwitch: function() {
      t.clearPanelOverride(), wx.showModal({
        title: "已恢复默认开关",
        content: "重新编译后按环境判定：开发者工具开启、真机关闭。",
        showCancel: !1
      })
    },
    onDisableMock: function() {
      this._clearReproTimer(), t.shutdown(), t.setPanelOverride(!1), wx.showModal({
        title: "已关闭模拟数据",
        content: "重新编译后生效。再次开启请点开发者工具的清缓存或改 FORCE_MOCK。",
        showCancel: !1
      }), this.setData({
        expanded: !1,
        visible: !1
      }), this._stopRefresh()
    }
  }
});