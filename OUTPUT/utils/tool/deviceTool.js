Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.deviceTool = void 0;
var e = require("../../@babel/runtime/helpers/classCallCheck"),
  t = require("../../@babel/runtime/helpers/createClass"),
  l = u(require("../../utils/bluetooth/toilet/ToiletController")),
  r = u(require("../../utils/bluetooth/toilet/TechramicToiletController")),
  o = u(require("../../utils/bluetooth/toilet/TechramicToiletController2"));

function u(e) {
  return e && e.__esModule ? e : {
    default: e
  }
}
var i = new(function() {
  function u() {
    e(this, u)
  }
  return t(u, [{
    key: "getToilet",
    value: function(e) {
      var t = null;
      switch (e.bleProtocol) {
        case 0:
          t = l.default.getInstance();
          break;
        case 1:
          t = r.default.getInstance();
          break;
        case 2:
          t = o.default.getInstance();
          break;
        default:
          t = l.default.getInstance()
      }
      return t.setDeviceInfo(e), t
    }
  }]), u
}());
exports.deviceTool = i;