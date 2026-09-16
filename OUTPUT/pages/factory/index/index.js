var e = require("../../../utils/bluetooth/bleutil.js");
getApp();

function t(e, t, i) {
  for (var c = 0; c < e.length; c++)
    if (e[c][t] === i) return c;
  return -1
}

function i(e) {
  return Array.prototype.map.call(new Uint8Array(e), (function(e) {
    return ("00" + e.toString(16)).slice(-2)
  })).join("")
}
Page({
  data: {
    deviceId: null,
    devices: [],
    connected: !1,
    chs: [],
    serviceComUUID: "000000F0-0000-1000-8000-00805F9B34FB",
    notifyComUUID: "0000F002-0000-1000-8000-00805F9B34FB",
    writeComUUID: "0000F001-0000-1000-8000-00805F9B34FB"
  },
  openBluetoothAdapter: function() {
    var e = this;
    wx.openBluetoothAdapter({
      success: function(t) {
        console.log("openBluetoothAdapter success", t), e.startBluetoothDevicesDiscovery()
      },
      fail: function(e) {
        10001 === e.errCode && wx.onBluetoothAdapterStateChange((function(e) {
          console.log("onBluetoothAdapterStateChange", e), e.available && this.startBluetoothDevicesDiscovery()
        }))
      }
    })
  },
  getBluetoothAdapterState: function() {
    var e = this;
    wx.getBluetoothAdapterState({
      success: function(t) {
        console.log("getBluetoothAdapterState", t), t.discovering ? e.onBluetoothDeviceFound() : t.available && e.startBluetoothDevicesDiscovery()
      }
    })
  },
  startBluetoothDevicesDiscovery: function() {
    var e = this;
    this._discoveryStarted || (this._discoveryStarted = !0, wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: !1,
      success: function(t) {
        console.log("startBluetoothDevicesDiscovery success", t), e.onBluetoothDeviceFound()
      }
    }))
  },
  stopBluetoothDevicesDiscovery: function() {
    wx.stopBluetoothDevicesDiscovery()
  },
  onBluetoothDeviceFound: function() {
    var e = this;
    wx.onBluetoothDeviceFound((function(i) {
      i.devices.forEach((function(i) {
        if (!i.name && !i.localName) return !1;
        console.log("device.name = ->JOMOO_SMART_131234<-"), console.log("device.name = ->", i.name, "<-"), console.log("device.localName = ->", i.localName, "<-"), i.name && i.localName && console.log("device.name.length = ->", i.name.length, "<- device.localName.length = ->", i.localName.length + "<-");
        var c = e.data.devices,
          a = t(c, "deviceId", i.deviceId),
          o = {}; - 1 === a ? o["devices[".concat(c.length, "]")] = i : o["devices[".concat(a, "]")] = i, e.setData(o)
      }))
    }))
  },
  createBLEConnection: function(e) {
    var t = this,
      i = e.currentTarget.dataset,
      c = i.deviceId,
      a = i.name;
    this.data.deviceId = c, wx.createBLEConnection({
      deviceId: c,
      success: function(e) {
        t.setData({
          connected: !0,
          name: a,
          deviceId: c
        }), t.startNotify(c)
      }
    }), this.stopBluetoothDevicesDiscovery()
  },
  startNotify: function(t) {
    wx.onBLECharacteristicValueChange((function(t) {
      console.log("收到数据 = ", e.ab2hex(t.value))
    })), wx.notifyBLECharacteristicValueChange({
      deviceId: t,
      serviceId: this.data.serviceComUUID,
      characteristicId: this.data.notifyComUUID,
      state: !0
    })
  },
  closeBLEConnection: function() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    }), this.setData({
      connected: !1,
      chs: [],
      canWrite: !1
    })
  },
  getBLEDeviceServices: function(e) {
    var t = this;
    wx.getBLEDeviceServices({
      deviceId: e,
      success: function(i) {
        for (var c = 0; c < i.services.length; c++)
          if (i.services[c].isPrimary) return void t.getBLEDeviceCharacteristics(e, i.services[c].uuid)
      }
    })
  },
  getBLEDeviceCharacteristics: function(e, c) {
    var a = this;
    wx.getBLEDeviceCharacteristics({
      deviceId: e,
      serviceId: c,
      success: function(t) {
        console.log("getBLEDeviceCharacteristics success", t.characteristics);
        for (var i = 0; i < t.characteristics.length; i++) {
          var o = t.characteristics[i];
          o.properties.read && wx.readBLECharacteristicValue({
            deviceId: e,
            serviceId: c,
            characteristicId: o.uuid
          }), o.properties.write && (a.setData({
            canWrite: !0
          }), a._deviceId = e, a._serviceId = c, a._characteristicId = o.uuid, a.writeBLECharacteristicValue()), (o.properties.notify || o.properties.indicate) && wx.notifyBLECharacteristicValueChange({
            deviceId: e,
            serviceId: c,
            characteristicId: o.uuid,
            state: !0
          })
        }
      },
      fail: function(e) {
        console.error("getBLEDeviceCharacteristics", e)
      }
    }), wx.onBLECharacteristicValueChange((function(e) {
      var c = t(a.data.chs, "uuid", e.characteristicId),
        o = {}; - 1 === c ? o["chs[".concat(a.data.chs.length, "]")] = {
        uuid: e.characteristicId,
        value: i(e.value)
      } : o["chs[".concat(c, "]")] = {
        uuid: e.characteristicId,
        value: i(e.value)
      }, a.setData(o)
    }))
  },
  writeBLECharacteristicValue: function() {
    var e = new ArrayBuffer(1);
    new DataView(e).setUint8(0, 255 * Math.random() | 0), wx.writeBLECharacteristicValue({
      deviceId: this._deviceId,
      serviceId: this._serviceId,
      characteristicId: this._characteristicId,
      value: e
    })
  },
  closeBluetoothAdapter: function() {
    wx.closeBluetoothAdapter(), this._discoveryStarted = !1
  },
  writeDeviceInfo: function() {
    console.log("写入设备信息");
    var e = new ArrayBuffer(10),
      t = new DataView(e);
    t.setUint8(0, 250), t.setUint8(1, e.byteLength), t.setUint8(2, 1), t.setUint8(3, 5), t.setUint8(4, 6), t.setUint8(5, 3), t.setUint8(6, 19), t.setUint8(7, 18), t.setUint8(8, 52);
    var i = this.calculateCommunicateChecksum(t);
    t.setUint8(9, i), this.writeCommunicateCommand(e)
  },
  readDeviceInfo: function() {
    console.log("读取设备信息");
    var e = new ArrayBuffer(4),
      t = new DataView(e);
    t.setUint8(0, 250), t.setUint8(1, e.byteLength), t.setUint8(2, 2);
    var i = this.calculateCommunicateChecksum(t);
    t.setUint8(3, i), this.writeCommunicateCommand(e)
  },
  writeCommunicateCommand: function(t) {
    console.log("下发指令 = ", e.ab2hex(t)), wx.writeBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: this.data.serviceComUUID,
      characteristicId: this.data.writeComUUID,
      value: t
    })
  },
  calculateCommunicateChecksum: function(e) {
    for (var t = 0, i = 0; i < e.byteLength - 1; i++) t += e.getUint8(i);
    return 255 & t
  }
});