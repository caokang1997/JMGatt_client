Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.WindTempValues = exports.WindSpeedValues = exports.WideWashLevelValues = exports.WaterTempValues = exports.WaterSprays = exports.WaterSparyValues = exports.WaterPressValues = exports.RemoteSettingsList = exports.ParType = exports.NozzlePositonValues = exports.GrowingID = exports.ErrorTypes = exports.ErrorCodeMap = exports.DefaultCustomList_PeriodCare = exports.DefaultCustomList = exports.Custom = exports.CleanMode = exports.AlarmCodeMap = void 0;
exports.WaterSprays = ["臀洗", "轻柔洗", "助便洗", "强弱按摩"];
exports.DefaultCustomList = [{
  mode: 1,
  cleanModeId: 1,
  title: "童洗模式",
  icon: "ic_mode_child",
  type: 1,
  userId: 1,
  move: null,
  wideWash: 0,
  wideWashLevel: 1,
  waterTempLevel: 1,
  airTempLevel: 1,
  windSpeedLevel: null,
  womanWaterPressure: null,
  womanNozzlePosition: null,
  hipwashWaterPressure: 2,
  hipwashNozzlePosition: 5,
  cleanTime: 120,
  dryTime: 120,
  checked: !1
}, {
  mode: 2,
  cleanModeId: 2,
  title: "经期护理",
  icon: "ic_mode_woman_period",
  type: 2,
  userId: 1,
  move: 0,
  wideWash: null,
  wideWashLevel: 1,
  waterTempLevel: 4,
  airTempLevel: 3,
  windSpeedLevel: null,
  womanWaterPressure: 3,
  womanNozzlePosition: 3,
  hipwashWaterPressure: null,
  hipwashNozzlePosition: null,
  cleanTime: 300,
  dryTime: 300,
  checked: !0
}, {
  mode: 3,
  cleanModeId: 3,
  title: "老人舒洗",
  icon: "ic_mode_oldman",
  type: 1,
  userId: 1,
  move: 0,
  wideWash: 0,
  wideWashLevel: 1,
  waterTempLevel: 4,
  airTempLevel: 3,
  windSpeedLevel: null,
  womanWaterPressure: null,
  womanNozzlePosition: null,
  hipwashWaterPressure: 4,
  hipwashNozzlePosition: 3,
  cleanTime: 180,
  dryTime: 300,
  checked: !0
}, {
  mode: 4,
  cleanModeId: 4,
  title: "男士快洗",
  icon: "ic_mode_man_fast",
  type: 1,
  userId: 1,
  move: null,
  wideWash: 1,
  wideWashLevel: 1,
  waterTempLevel: 3,
  airTempLevel: 2,
  windSpeedLevel: null,
  womanWaterPressure: null,
  womanNozzlePosition: null,
  hipwashWaterPressure: 4,
  hipwashNozzlePosition: 3,
  cleanTime: 60,
  dryTime: 120,
  checked: !0
}, {
  mode: 5,
  cleanModeId: 5,
  title: "女士柔洗",
  icon: "ic_mode_woman",
  type: 2,
  userId: 1,
  move: 1,
  wideWash: null,
  wideWashLevel: 1,
  waterTempLevel: 3,
  airTempLevel: 2,
  windSpeedLevel: null,
  womanWaterPressure: 4,
  womanNozzlePosition: 3,
  hipwashWaterPressure: null,
  hipwashNozzlePosition: null,
  cleanTime: 60,
  dryTime: 120,
  checked: !0
}, {
  mode: 6,
  cleanModeId: 6,
  title: "快速助便",
  icon: "ic_mode_defect",
  type: 3,
  userId: 1,
  move: 0,
  wideWash: null,
  wideWashLevel: 3,
  waterTempLevel: 5,
  airTempLevel: 2,
  windSpeedLevel: null,
  womanWaterPressure: null,
  womanNozzlePosition: null,
  hipwashWaterPressure: 4,
  hipwashNozzlePosition: 3,
  cleanTime: 60,
  dryTime: 0,
  checked: !1
}];
exports.DefaultCustomList_PeriodCare = [{
  mode: 2,
  cleanModeId: 2,
  title: "经期护理(姨妈期)",
  icon: "ic_mode_woman_period",
  type: 2,
  userId: 1,
  move: 0,
  wideWash: null,
  wideWashLevel: 1,
  waterTempLevel: 3,
  airTempLevel: 3,
  windSpeedLevel: null,
  womanWaterPressure: 3,
  womanNozzlePosition: 3,
  hipwashWaterPressure: null,
  hipwashNozzlePosition: null,
  cleanTime: 240,
  dryTime: 120,
  checked: !0
}, {
  mode: 2,
  cleanModeId: 2,
  title: "经期护理(排卵期)",
  icon: "ic_mode_woman_period",
  type: 2,
  userId: 1,
  move: 0,
  wideWash: null,
  wideWashLevel: 1,
  waterTempLevel: 2,
  airTempLevel: 2,
  windSpeedLevel: null,
  womanWaterPressure: 3,
  womanNozzlePosition: 3,
  hipwashWaterPressure: null,
  hipwashNozzlePosition: null,
  cleanTime: 240,
  dryTime: 120,
  checked: !0
}, {
  mode: 2,
  cleanModeId: 2,
  title: "经期护理(安全期)",
  icon: "ic_mode_woman_period",
  type: 2,
  userId: 1,
  move: 0,
  wideWash: null,
  wideWashLevel: 1,
  waterTempLevel: 2,
  airTempLevel: 2,
  windSpeedLevel: null,
  womanWaterPressure: 3,
  womanNozzlePosition: 3,
  hipwashWaterPressure: null,
  hipwashNozzlePosition: null,
  cleanTime: 180,
  dryTime: 120,
  checked: !0
}];
exports.ParType = {
  NONE: 0,
  WATER_TEMP: 1,
  WIND_TEMP: 2,
  SEAT_TEMP: 3,
  WATER_PRESSURE: 4,
  NOZZLE_POSITION: 5,
  WATER_PRESSURE_WOMAN: 6,
  NOZZLE_POSITION_WOMAN: 7,
  WIDE_RANGE: 8
};
exports.Custom = {
  NONE: 0,
  CHILD: 1,
  WOMAN_PERIOD: 2,
  OLD_MAN: 3,
  FAST: 4,
  WOMAN: 5,
  DEFECT: 6
};
exports.CleanMode = {
  NONE: 0,
  HIP_WASH: 101,
  WOMAN_WASH: 102,
  DRY: 103,
  DEFECT_WASH: 104,
  AUTO_HIP_WASH: 105,
  AUTO_WOMAN_WASH: 106,
  NOZZLE_CLEAN: 107,
  REPLACE_NOZZLE: 108,
  SITZ_BATH: 109,
  RED_BLUE_LIGHT: 110,
  SOFT_MIST: 111
};
exports.ErrorTypes = {
  TRAFFIC_ABNORMAL: 1,
  OUTLET_OVERTEMP: 2,
  INLET_OVERTEMP: 3,
  INLET_OVERTIME: 13,
  OUTLET_SENSOR_FAULT: 5,
  TANK_SENSOR_FAULT: 11,
  INLET_SENSOR_FAULT: 4,
  VOLTAGE_DETECT_FAULT: 12,
  BRIGHTNESS_SENSOR_FAULT: 10,
  SEAT_OVERTEMP: 6,
  DRY_OVERTEMP: 14,
  AMBIENT_SENSOR_FAULT: 8,
  SEAT_SENSOR_FAULT: 17,
  DRY_SENSOR_FAULT: 15,
  BUBBLE_MODULE_FAULT: 18,
  FLUSH_MODULE_FAULT: 19,
  FILTER_INSUFFICIENT: 20,
  WATER_SHORTAGE: 21,
  ABNORMAL_GEARBOX: 22
};
exports.AlarmCodeMap = {
  1: {
    name: "发泡剂不足",
    alarmMsg: "发泡剂不足,前往查看"
  },
  2: {
    name: "阻垢滤芯不足",
    alarmMsg: "阻垢滤芯不足,前往查看"
  }
};
exports.ErrorCodeMap = {
  1: {
    name: "流量异常",
    reason: "流量异常",
    solution: ["1.打开进水，重新开启电源；", "2.如故障仍不能排除时，请联系当地经销商或致电服务热线。"]
  },
  2: {
    name: "出水超温",
    reason: "出水超温",
    solution: ["请联系当地经销商或致电服务热线。"]
  },
  3: {
    name: "进水超温",
    reason: "进水超温",
    solution: ["1.关闭电源，等待一段时间，然后重新开启电源使用；", "2.如故障仍不能排除时，请联系当地经销商或致电服务热线。"]
  },
  4: {
    name: "进水传感器故障",
    reason: "进水传感器故障",
    solution: ["请联系当地经销商或致电服务热线。"]
  },
  5: {
    name: "出水传感器故障",
    reason: "进水传感器故障",
    solution: ["请联系当地经销商或致电服务热线。"]
  },
  6: {
    name: "座温超温",
    reason: "座温超温",
    solution: ["请联系当地经销商或致电服务热线。"]
  },
  7: {
    name: "座圈传感器故障",
    reason: "座圈传感器故障",
    solution: ["请联系当地经销商或致电服务热线。"]
  },
  8: {
    name: "环温传感器故障",
    reason: "环温传感器故障",
    solution: ["请联系当地经销商或致电服务热线。"]
  },
  9: {
    name: "魔力泡故障",
    reason: "泡沫剂使用完",
    solution: ["1.请更换新的泡沫剂;", "2.如果故障仍不能排除时，请联系当地经销商或致电服务热线。"]
  },
  10: {
    name: "亮度传感器故障",
    reason: "亮度传感器故障",
    solution: ['1.将夜灯重新设定为"开启"状态,', "2.如果故障仍不能排除时，请联系当地经销商或致电服务热线。"]
  },
  11: {
    name: "水箱传感器故障",
    reason: "水箱传感器故障",
    solution: ["请联系当地经销商或致电服务热线。"]
  },
  12: {
    name: "电压检测故障",
    reason: "电压检测故障",
    solution: ["请联系当地经销商或致电服务热线。"]
  },
  13: {
    name: "进水超时",
    reason: "进水超时",
    solution: ["请联系当地经销商或致电服务热线。"]
  },
  14: {
    name: "暖风超温",
    reason: "暖风超温",
    solution: ["请联系当地经销商或致电服务热线。"]
  },
  15: {
    name: "暖风传感器故障",
    reason: "暖风传感器故障",
    solution: ["请联系当地经销商或致电服务热线。"]
  },
  16: {
    name: "水温传感器故障",
    reason: "水温传感器故障",
    solution: ["请联系当地经销商或致电服务热线。"]
  },
  17: {
    name: "座圈传感器故障",
    reason: "座圈传感器故障",
    solution: ["请联系当地经销商或致电服务热线。"]
  },
  18: {
    name: "魔力泡模块故障",
    reason: "魔力泡模块故障",
    solution: ["请联系当地经销商或致电服务热线。"]
  },
  19: {
    name: "冲刷模块故障",
    reason: "冲刷模块故障",
    solution: ["请联系当地经销商或致电服务热线。"]
  },
  20: {
    name: "滤芯寿命不足",
    reason: "滤芯寿命不足",
    solution: ["1.更换滤芯;", '2.更换后，同时长按遥控器"妇洗"+"大冲"8秒钟，滤芯复位，5个指示灯同时亮起。']
  },
  21: {
    name: "冲刷缺水故障",
    reason: "冲刷缺水故障",
    solution: ["1.打开进水，重新开启电源；", "2.如故障仍不能排除时，请联系当地经销商或致电服务热线。"]
  },
  22: {
    name: "齿轮箱异常",
    reason: "齿轮箱异常",
    solution: ["请联系当地经销商或致电服务热线。"]
  }
};
exports.WaterSparyValues = {
  1: "臀洗",
  2: "轻柔洗",
  3: "助便洗",
  4: "强弱按摩"
};
exports.WaterPressValues = ["最弱", "偏弱", "标准", "偏强", "最强"];
exports.NozzlePositonValues = ["最后", "偏后", "标准", "偏前", "最前"];
exports.WideWashLevelValues = ["1档", "2档", "3档", "4档", "5档"];
exports.WaterTempValues = ["常温", "最低", "偏低", "标准", "偏高", "最高"];
exports.WindTempValues = ["常温", "低", "标准", "高"];
exports.WindSpeedValues = ["1档", "2档", "3档", "4档", "5档"];
exports.GrowingID = {
  COVER: 1,
  RING: 2,
  LARGE_FLUSH: 3,
  SMALL_FLUSH: 4,
  STOP: 5,
  HIBERNATE: 6,
  HIP_WAH: 11,
  WOMAN_WASH: 12,
  AUTO_HIP_WASH: 13,
  AUTO_WOMAN_WASH: 14,
  DEFECT: 15,
  STRONG_WEAK_MASSAGE: 16,
  SITZ_BATH: 17,
  RED_BLUE_LIGHT: 18,
  WARM_WIND: 19,
  SOFT_MIST: 20,
  CUSTOM_CHILD: 30,
  CUSTOM_OLD_MAN: 31,
  CUSTOM_WOMAN_PERIOD: 32,
  CUSTOM_FAST_MAN: 33,
  CUSTOM_FAST_WOMAN: 34,
  CUSTOM_FAST_DEFECT: 35,
  BUBBLE: 50,
  NOZZLE_CLEAN: 51,
  NOZZLE_REPLACE: 52,
  SELF_CLEAN: 53,
  SURFACE_STERILIZATION: 54,
  FORCE_FLUSH: 55,
  DREDGE: 56,
  AUTO_FLUSH: 70,
  CLOSE_COVER_FLUSH: 71,
  AUTO_FLIP_COVER: 72,
  FLIP_COVER_MODE: 73,
  AUTO_SMALL_FLUSH: 74,
  SEAT_FOAMING: 75,
  PRE_WETTING: 76,
  AUTO_TEMP: 77,
  SMART_POWER_SAVING: 78,
  FILTER_STATUS_REMINDER: 79,
  FOOT_CONTROL: 80,
  NIGHT_LIGHT: 81,
  SMART_NIGHT_LIGHT: 82,
  ATMOSPHERE_LIGHT: 83,
  UV_WATERWAY_STERILIZATION: 84,
  AUTO_DEODORIZATION: 85,
  BUBBLE_TIME_GEAR: 86,
  REGULAR_FLUSH: 87,
  RESTORE_FACTORY_SETTINGS: 88,
  MICROWAVE_SETTINGS: 89,
  DEVICE_RENAME: 90,
  FILTER_RESET: 110,
  CONSUMABLE_BUY: 111,
  HOT_LINE: 120,
  WATER_TEMP: 201,
  SEAT_TEMP: 202,
  WIND_TEMP: 203,
  WATER_PRESS: 204,
  NOZZLE_POS: 205,
  WIND_SPEED: 206
};
exports.RemoteSettingsList = [{
  id: 0,
  key: "AutoFlush",
  name: "自动冲刷"
}, {
  id: 1,
  key: "CloseFlush",
  name: "关盖冲厕"
}, {
  id: 2,
  key: "SurfaceDisinfect",
  name: "离座自动杀菌"
}, {
  id: 3,
  key: "AutoSmallFlush",
  name: "自动小冲"
}, {
  id: 4,
  key: "AutoFlipCover",
  name: "自动翻盖"
}, {
  id: 5,
  key: "FlipCoverSensitive",
  name: "翻盖模式(灵敏度档位)"
}, {
  id: 6,
  key: "FlipCoverDistance",
  name: "翻盖模式(感应距离档位)"
}, {
  id: 7,
  key: "MicrowaveSettings",
  name: "微波设置"
}, {
  id: 8,
  key: "FootControl",
  name: "脚感控制"
}, {
  id: 9,
  key: "DoubleFootControl",
  name: "双重脚感控制"
}, {
  id: 10,
  key: "SeasonTemp",
  name: "四季温感"
}, {
  id: 11,
  key: "SavePower",
  name: "节电"
}, {
  id: 12,
  key: "SmartNightLight",
  name: "智能夜灯"
}, {
  id: 13,
  key: "NightLight",
  name: "夜灯"
}, {
  id: 14,
  key: "AmbientLight",
  name: "氛围灯"
}, {
  id: 15,
  key: "AmbientLightBrightness",
  name: "氛围灯(亮度档位)"
}, {
  id: 16,
  key: "UVSterilization",
  name: "水路UV杀菌"
}, {
  id: 17,
  key: "AutoDeodorization",
  name: "自动除臭"
}, {
  id: 18,
  key: "Prewetting",
  name: "预湿润"
}, {
  id: 19,
  key: "SeatFoaming",
  name: "落座发泡"
}, {
  id: 20,
  key: "OpenRingFoaming",
  name: "开圈发泡"
}, {
  id: 21,
  key: "BrushCircleBubble",
  name: "刷圈发泡(档位)"
}, {
  id: 22,
  key: "RotateBubble",
  name: "旋转发泡(档位)"
}, {
  id: 23,
  key: "FilterRemind",
  name: "滤芯提醒"
}, {
  id: 24,
  key: "RegularFlush",
  name: "定期冲刷"
}, {
  id: 25,
  key: "RestoreFactorySettings",
  name: "恢复出厂设置"
}];