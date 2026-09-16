var e = require("../../config/device_enum.js"),
  o = n(require("../../utils/UserInfoManager.js")),
  t = n(require("../../utils/debuglog.js"));

function n(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}
var c = require("../../utils/bluetooth/bleutil.js"),
  i = require("miniprogram-computed").behavior,
  a = o.default.getInstance();
Page({
  behaviors: [i],
  autoConnect: !1,
  data: {
    lastUpdateUiTime: 0,
    dialogPopUp: null,
    dialogContent: "-",
    devices: [],
    windowHeight: 0,
    pixelRatio: 0,
    scrollviewTop: 0,
    scrollviewHeight: 0,
    safeAreaHeight: 0,
    navigationBarAndStatusBarHeight: wx.getStorageSync("statusBarHeight") + wx.getStorageSync("navigationBarHeight")
  },
  computed: {
    isDeviceFound: function(e) {
      return e.devices.length > 0
    }
  },
  onLoad: function(e) {
    var o = this;
    this.dialogPopUp = this.selectComponent("#dialog");
    var t = this;
    wx.getSystemInfo({
      success: function(e) {
        t.setData({
          windowHeight: e.windowHeight,
          safeAreaHeight: e.safeArea.height
        }), o.updateUi()
      }
    })
  },
  updateUi: function() {
    var e = 750 / wx.getSystemInfoSync().windowWidth,
      o = this.data.windowHeight - this.data.navigationBarAndStatusBarHeight - 240 / e;
    this.setData({
      scrollviewTop: 0,
      scrollviewHeight: o
    })
  },
  onReady: function() {
    console.log("onReady - 启动蓝牙搜索 - ")
  },
  startListenScanResult: function() {
    var o = this;
    wx.onBluetoothDeviceFound((function(t) {
      var n = t.devices.filter((function(o) {
        var t = c.getMac(o);
        o.mac = t;
        var n = c.isJomooDevice(o);
        if (n) {
          if (o.foundTime = (new Date).getTime(), o.typeCode = c.getDeviceTypeCode(o), o.typeCode) o.model = c.getDeviceModelByJmZtmxm(o.typeCode).toLowerCase(), null == (0, e.getDeviceInfo)(o.typeCode) && (n = !1);
          else n = !1;
          var i = wx.getStorageSync(t);
          o.productName = i || c.getDeviceProductName(o)
        } else o.typeCode = "-", o.productName = "-";
        return n
      }));
      null != n && n.length > 0 && n.forEach((function(e) {
        var t = o.data.devices.findIndex((function(o) {
          return o.deviceId === e.deviceId
        })); - 1 !== t ? o.data.devices[t] = e : o.data.devices.push(e)
      }));
      var i = (new Date).getTime();
      o.data.devices.forEach((function(e) {
        if (i - e.foundTime > 1e4) {
          console.log("删除元素");
          var t = o.data.devices.indexOf(e);
          o.data.devices.splice(t, 1)
        }
      })), o.data.devices.sort((function(e, o) {
        return o.RSSI - e.RSSI
      })), o.setData({
        devices: o.data.devices
      })
    }))
  },
  checkToReStartScan: function() {
    var e = this;
    this.dialogPopUp.hide(), setTimeout((function() {
      e.checkToStartScan()
    }), 100)
  },
  checkToStartScan: function() {
    var e = this;
    c.checkBlePermision(!0).then((function(o) {
      console.log(o), o.ok ? e.startScan() : (e.setData({
        dialogContent: o.errMsg
      }), e.dialogPopUp.show())
    }))
  },
  startScan: function() {
    console.log("启动蓝牙搜索 --1"), this.startListenScanResult(), wx.openBluetoothAdapter({
      mode: "central",
      success: function(e) {
        console.log("onShow - 启动蓝牙搜索"), wx.getBluetoothDevices({
          success: function(e) {
            console.log("-- 已连接的蓝牙设备 --"), console.log(e), e.devices.forEach((function(e) {
              if (c.isJomooDevice(e)) {
                var o = e.deviceId;
                wx.closeBLEConnection({
                  deviceId: o,
                  success: function(e) {
                    console.log(e)
                  }
                })
              }
            })), t.default.follow("Scan", "开始搜索"), wx.startBluetoothDevicesDiscovery({
              allowDuplicatesKey: !0,
              interval: 2e3,
              fail: function(e) {
                console.log("-- 启动蓝牙搜索失败 --获取失败"), console.log(e)
              }
            })
          },
          fail: function(e) {
            console.log("-- 已连接的蓝牙设备 --获取失败"), console.log(e)
          }
        })
      },
      fail: function(e) {
        console.log("-- openBluetoothAdapter --获取失败"), console.log(e)
      }
    })
  },
  stopScan: function() {
    t.default.follow("Scan", "停止搜索"), wx.stopBluetoothDevicesDiscovery()
  },
  onDeviceClick: function(o) {
    var t = o.currentTarget.dataset.mac,
      n = o.currentTarget.dataset.rssi,
      c = o.currentTarget.dataset.jmztmxm;
    if (console.log(o.currentTarget.dataset), n <= -75) wx.showToast({
      title: "信号较弱，请靠近设备后,再使用",
      icon: "error",
      duration: 2e3
    });
    else {
      var i = this,
        s = (0, e.getDeviceInfo)(c);
      if (console.log("jmZtmxm =", c), null != s) {
        console.log("找到设备"), this.stopScan();
        var l = "".concat(s.page, "?mac=").concat(t, "&jmZtmxm=").concat(c, "&fromScan=true");
        a.setConnectUrl(l), console.log("找到设备 page =", l), wx.redirectTo({
          url: l,
          success: function(e) {
            console.log("跳转成功，清空搜索")
          }
        })
      } else console.log("没有找到设备"), this.stopScan(), wx.redirectTo({
        url: "/pages/device/toilet/index/index?mac=".concat(t, "&jmZtmxm=").concat(c, "&fromScan=true"),
        success: function(e) {
          console.log("跳转成功，清空搜索"), i.setData({
            devices: []
          })
        }
      })
    }
  },
  onShow: function() {
    console.log("--- 扫描页面启动搜索1 ---");
    var e = a.getLastConnectUrl();
    console.log("--- 扫描页面启动搜索2 ---" + e), null != e && "" !== e ? (this.autoConnect = !0, wx.redirectTo({
      url: e,
      success: function(e) {
        console.log("跳转成功，清空搜索")
      }
    })) : (console.log("--- 开始啦 ---"), this.checkToStartScan())
  },
  onHide: function() {
    console.log("--- 扫描页面停止搜索 ---"), this.autoConnect || this.stopScan()
  },
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {}
});