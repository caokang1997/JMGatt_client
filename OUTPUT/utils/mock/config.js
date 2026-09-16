module.exports = {
  FORCE_MOCK: null,
  STORAGE_KEY_MOCK_ON: "JM_MOCK_ON",
  DEFAULT_SHOWER: {
    mac: "AABBCCDD7776",
    jmZtmxm: "777776",
    deviceId: "mock-shower-fc-deviceId",
    name: "九牧智能淋浴器(模拟)"
  },
  REPORT_INTERVAL_MS: 1e3,
  CONNECT_DELAY_MS: 300,
  SCENARIO: [{
    at: 500,
    note: "已连接 · 待机",
    set: {
      preDischarge: 0,
      shower: !1,
      temp: 25
    }
  }, {
    at: 2e3,
    note: "冷水预排 · 顶喷出水",
    set: {
      preDischarge: 1,
      topSprayState: !0,
      downWaterState: !1,
      handShowerState: !1
    },
    ramp: {
      field: "temp",
      to: 38,
      duration: 4e3
    }
  }, {
    at: 6e3,
    note: "淋浴中 · 下出水（预排按钮此时置灰）",
    set: {
      preDischarge: 0,
      shower: !0,
      topSprayState: !1,
      downWaterState: !0
    }
  }, {
    at: 9e3,
    note: "告警条 · 水温过高",
    set: {
      temp: 46,
      waterTempHighEror: !0
    }
  }, {
    at: 12e3,
    note: "告警条 · 电池欠压",
    set: {
      waterTempHighEror: !1,
      batteryState: 2
    }
  }, {
    at: 15e3,
    note: "故障条 · 低压故障（故障压制告警）",
    set: {
      batteryState: 1
    }
  }, {
    at: 18e3,
    note: "复位 · 回到待机",
    set: {
      preDischarge: 0,
      shower: !1,
      temp: 25,
      batteryState: 0,
      topSprayState: !1,
      downWaterState: !1,
      handShowerState: !1,
      waterTempHighEror: !1,
      lackHotWaterError: !1,
      preDischargeError: !1
    }
  }],
  SCENARIO_DURATION_MS: 2e4,
  MOCK_SCENES: [{
    id: 4,
    enable: !0
  }]
};