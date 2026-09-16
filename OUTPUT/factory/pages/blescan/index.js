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
      console.log("蓝牙搜索回调");
      var n = (new Date).getTime(),
        i = t.devices.filter((function(o) {
          var t = e.getMac(o);
          o.mac = t;
          var i = e.isJomooDevice(o) && o.RSSI > -55;
          return i ? (o.foundTime = n, o.typeCode = e.getDeviceTypeCode(o), o.typeCode && (o.model = e.getDeviceModelByJmZtmxm(o.typeCode).toLowerCase()), o.productName = e.getDeviceProductName(o)) : (o.typeCode = "-", o.productName = "-"), i
        }));
      null != i && i.length > 0 && (i.forEach((function(e) {
        var t = o.data.devices.findIndex((function(o) {
          return o.deviceId === e.deviceId
        })); - 1 !== t ? o.data.devices[t] = e : o.data.devices.push(e)
      })), o.data.devices.forEach((function(e) {
        if (n - e.foundTime > 5e3 || e.RSSI < -55) {
          console.log("删除元素");
          var t = o.data.devices.indexOf(e);
          o.data.devices.splice(t, 1)
        }
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
              interval: 500,
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
    console.log("停止蓝牙搜索"), wx.stopBluetoothDevicesDiscovery()
  },
  onDeviceClick: function(e) {
    var o = e.currentTarget.dataset.item;
    console.log("device = ", o);
    var t = getCurrentPages();
    t.length > 1 && (t[t.length - 2].onChooseNewDevice(o), wx.navigateBack(), this.stopScan())
  },
  onShow: function() {
    console.log("--- 扫描页面启动搜索 ---"), this.checkToStartScan()
  },
  onHide: function() {
    console.log("--- 扫描页面停止搜索 ---"), this.stopScan()
  },
  onClickBack: function(e) {
    this.stopScan()
  },
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {}
});