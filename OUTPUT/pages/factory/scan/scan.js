var e = require("../../../utils/bluetooth/bleutil.js"),
  o = require("miniprogram-computed").behavior;
Page({
  behaviors: [o],
  data: {
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
        var t = e.getMac(o);
        o.mac = t;
        var n = e.isJomooDevice(o);
        return n ? (o.typeCode = e.getDeviceTypeCode(o), o.productName = e.getDeviceProductName(o), o.typeCode && (o.model = e.getDeviceModelByJmZtmxm(o.typeCode).toLowerCase())) : (o.typeCode = "-", o.productName = "-"), n
      }));
      null != n && n.length > 0 && (n.forEach((function(e) {
        var t = o.data.devices.findIndex((function(o) {
          return o.deviceId === e.deviceId
        })); - 1 !== t ? o.data.devices[t] = e : o.data.devices.push(e)
      })), o.data.devices.sort((function(e, o) {
        return o.RSSI - e.RSSI
      })), o.setData({
        devices: o.data.devices
      }))
    }))
  },
  checkToReStartScan: function() {
    var e = this;
    this.dialogPopUp.hide(), setTimeout((function() {
      e.checkToStartScan()
    }), 100)
  },
  checkToStartScan: function() {
    var o = this;
    e.checkBlePermision(!0).then((function(e) {
      console.log(e), e.ok ? o.startScan() : (o.setData({
        dialogContent: e.errMsg
      }), o.dialogPopUp.show())
    }))
  },
  startScan: function() {
    console.log("启动蓝牙搜索 --1"), this.startListenScanResult(), wx.openBluetoothAdapter({
      mode: "central",
      success: function(o) {
        console.log("onShow - 启动蓝牙搜索"), wx.getBluetoothDevices({
          success: function(o) {
            console.log("-- 已连接的蓝牙设备 --"), console.log(o), o.devices.forEach((function(o) {
              if (e.isJomooDevice(o)) {
                var t = o.deviceId;
                wx.closeBLEConnection({
                  deviceId: t,
                  success: function(e) {
                    console.log(e)
                  }
                })
              }
            })), console.log("-- startBluetoothDevicesDiscovery --"), wx.startBluetoothDevicesDiscovery({
              allowDuplicatesKey: !0,
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
    wx.stopBluetoothDevicesDiscovery()
  },
  onDeviceClick: function(e) {
    var o = e.currentTarget.dataset.mac;
    console.log("mac = ", o);
    var t = this;
    wx.navigateTo({
      url: "/pages/factory/nfc/nfc?mac=" + o,
      success: function(e) {
        console.log("跳转成功，清空搜索"), t.setData({
          devices: []
        })
      }
    })
  },
  onShow: function() {
    console.log("--- 扫描页面启动搜索 ---"), this.checkToStartScan()
  },
  onHide: function() {
    console.log("--- 扫描页面停止搜索 ---"), this.stopScan()
  },
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {}
});