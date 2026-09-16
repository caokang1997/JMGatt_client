Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.getDefaultLinkSceneList = void 0;
var e = [{
  id: 1,
  enable: !1,
  name: "清新健康如厕",
  imageUrl: "link/scene1/scene_bg.png",
  smallBgUrl: "link/scene1/scene_bg_small.png",
  detail: "落座换气，离座除菌，全程清爽无负担",
  links: [{
    linkId: 1,
    trigger: {
      categoryCode: 1,
      mac: "",
      barcode: "000000",
      triggers: [{
        actionId: 1,
        code: 17,
        param: 1
      }]
    },
    exec: {
      categoryCode: 2,
      mac: "",
      barcode: "000000",
      execs: [{
        actionId: 1,
        code: 4,
        param: 1
      }]
    }
  }, {
    linkId: 2,
    trigger: {
      categoryCode: 1,
      mac: "",
      barcode: "000000",
      triggers: [{
        actionId: 1,
        code: 17,
        param: 0
      }]
    },
    exec: {
      categoryCode: 2,
      mac: "",
      barcode: "000000",
      execs: [{
        actionId: 1,
        code: 4,
        param: 0
      }]
    }
  }, {
    linkId: 3,
    trigger: {
      categoryCode: 1,
      mac: "",
      barcode: "000000",
      triggers: [{
        actionId: 1,
        code: 17,
        param: 0
      }]
    },
    exec: {
      categoryCode: 2,
      mac: "",
      barcode: "000000",
      execs: [{
        actionId: 9,
        code: 9,
        param: 1
      }, {
        actionId: 2,
        code: 2,
        param: 5,
        type: "min"
      }, {
        actionId: 3,
        code: 9,
        param: 0
      }]
    }
  }]
}, {
  id: 2,
  enable: !1,
  name: "四季温感如厕",
  imageUrl: "link/scene2/scene_bg.png",
  smallBgUrl: "link/scene2/scene_bg_small.png",
  detail: "四季温感智控，如厕全程舒适守护",
  links: [{
    linkId: 1,
    trigger: {
      categoryCode: 1,
      mac: "",
      barcode: "000000",
      triggers: [{
        actionId: 1,
        code: 17,
        param: 1
      }]
    },
    exec: {
      categoryCode: 2,
      mac: "",
      barcode: "000000",
      execs: [{
        actionId: 1,
        code: 4,
        param: 1
      }]
    }
  }, {
    linkId: 2,
    trigger: {
      categoryCode: 1,
      mac: "",
      barcode: "000000",
      triggers: [{
        actionId: 1,
        code: 17,
        param: 0
      }]
    },
    exec: {
      categoryCode: 2,
      mac: "",
      barcode: "000000",
      execs: [{
        actionId: 1,
        code: 4,
        param: 0
      }]
    }
  }, {
    linkId: 3,
    trigger: {
      categoryCode: 1,
      mac: "",
      barcode: "000000",
      triggers: [{
        actionId: 1,
        code: 17,
        param: 0
      }]
    },
    exec: {
      categoryCode: 2,
      mac: "",
      barcode: "000000",
      execs: [{
        actionId: 9,
        code: 9,
        param: 1
      }, {
        actionId: 2,
        code: 2,
        param: 5,
        type: "min"
      }, {
        actionId: 3,
        code: 9,
        param: 0
      }]
    }
  }]
}, {
  id: 3,
  enable: !1,
  name: "夜间贴心如厕",
  imageUrl: "link/scene3/scene_bg.png",
  smallBgUrl: "link/scene3/scene_bg_small.png",
  detail: "夜间静音守护，柔光相伴，智能呵护每一次起夜",
  links: [{
    linkId: 1,
    trigger: {
      categoryCode: 1,
      mac: "",
      barcode: "000000",
      triggers: [{
        actionId: 1,
        code: 17,
        param: 1
      }]
    },
    exec: {
      categoryCode: 2,
      mac: "",
      barcode: "000000",
      execs: [{
        actionId: 1,
        code: 4,
        param: 1
      }]
    }
  }, {
    linkId: 2,
    trigger: {
      categoryCode: 1,
      mac: "",
      barcode: "000000",
      triggers: [{
        actionId: 1,
        code: 17,
        param: 0
      }]
    },
    exec: {
      categoryCode: 2,
      mac: "",
      barcode: "000000",
      execs: [{
        actionId: 1,
        code: 4,
        param: 0
      }]
    }
  }, {
    linkId: 3,
    trigger: {
      categoryCode: 1,
      mac: "",
      barcode: "000000",
      triggers: [{
        actionId: 1,
        code: 17,
        param: 0
      }]
    },
    exec: {
      categoryCode: 2,
      mac: "",
      barcode: "000000",
      execs: [{
        actionId: 9,
        code: 9,
        param: 1
      }, {
        actionId: 2,
        code: 2,
        param: 5,
        type: "min"
      }, {
        actionId: 3,
        code: 9,
        param: 0
      }]
    }
  }]
}, {
  id: 4,
  enable: !1,
  name: "智能淋浴模式",
  roles: [{
    categoryCode: 2,
    name: "浴霸"
  }, {
    categoryCode: 3,
    name: "淋浴器"
  }],
  imageUrl: "link/scene2/scene_bg.png",
  smallBgUrl: "link/scene2/scene_bg_small.png",
  localImageUrl: "/shower/images/link/scene4_bg.jpg",
  detail: "预排冷水，浴后除湿，淋浴更安心",
  links: [{
    linkId: 1,
    trigger: {
      categoryCode: 2,
      mac: "",
      barcode: "000000",
      triggers: [{
        actionId: 1,
        code: 11,
        param: 1
      }]
    },
    exec: {
      categoryCode: 3,
      mac: "",
      barcode: "000000",
      execs: [{
        actionId: 1,
        type: 8,
        code: 0,
        param: 1
      }]
    }
  }, {
    linkId: 2,
    trigger: {
      categoryCode: 3,
      mac: "",
      barcode: "000000",
      triggers: [{
        actionId: 1,
        code: 1,
        param: 0
      }]
    },
    exec: {
      categoryCode: 2,
      mac: "",
      barcode: "000000",
      execs: [{
        actionId: 1,
        type: 8,
        code: 6,
        param: 0
      }, {
        actionId: 2,
        type: 16,
        code: 12,
        param: 1
      }, {
        actionId: 3,
        code: 2,
        param: 30,
        type: "min"
      }, {
        actionId: 4,
        type: 32,
        code: 12,
        param: 0
      }]
    }
  }]
}];
exports.getDefaultLinkSceneList = function() {
  return JSON.parse(JSON.stringify(e))
};