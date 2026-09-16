var e = require("../bluetooth/bleutil.js"),
  i = require("./switch.js"),
  l = null;
module.exports = {
  install: function() {
    l || (l = e.checkBlePermision, e.checkBlePermision = function() {
      return i.isMockOn() ? Promise.resolve({
        ok: !0,
        errCode: 0,
        errMsg: ""
      }) : l.apply(this, arguments)
    })
  },
  uninstall: function() {
    l && (e.checkBlePermision = l, l = null)
  },
  isInstalled: function() {
    return null !== l
  }
};