module.exports = {
  hsv2rgb: function(a, o, c) {
    console.log("h=".concat(a, ",s=").concat(o, ",v=").concat(c));
    var e = (a / 360).toFixed(2),
      t = (o / 255).toFixed(2),
      r = (c / 255).toFixed(2),
      s = Math.floor(6 * e),
      n = 6 * e - s,
      b = r * (1 - t),
      h = r * (1 - n * t),
      l = r * (1 - (1 - n) * t),
      i = 0,
      f = 0,
      k = 0;
    switch (s % 6) {
      case 0:
        i = r, f = l, k = b;
        break;
      case 1:
        i = h, f = r, k = b;
        break;
      case 2:
        i = b, f = r, k = l;
        break;
      case 3:
        i = b, f = h, k = r;
        break;
      case 4:
        i = l, f = b, k = r;
        break;
      case 5:
        i = r, f = b, k = h
    }
    var d = Math.floor(255 * i),
      u = Math.floor(255 * f),
      v = Math.floor(255 * k);
    return "rgb(".concat(d, ",").concat(u, ",").concat(v, ")")
  }
};