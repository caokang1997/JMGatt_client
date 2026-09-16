var superPropBase = require("./superPropBase");

function _get() {
  return "undefined" != typeof Reflect && Reflect.get ? module.exports = _get = Reflect.get.bind() : module.exports = _get = function(e, t, r) {
    var o = superPropBase(e, t);
    if (o) {
      var p = Object.getOwnPropertyDescriptor(o, t);
      return p.get ? p.get.call(arguments.length < 3 ? e : r) : p.value
    }
  }, _get.apply(this, arguments)
}
module.exports = _get;