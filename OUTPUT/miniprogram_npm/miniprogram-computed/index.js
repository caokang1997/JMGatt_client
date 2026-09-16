var t = require("../../@babel/runtime/helpers/typeof"),
  e = function(t, e) {
    return function() {
      return e || t((e = {
        exports: {}
      }).exports, e), e.exports
    }
  },
  r = e((function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
      }),
      function(t, e) {
        for (var r in e) Object.defineProperty(t, r, {
          enumerable: !0,
          get: e[r]
        })
      }(e, {
        parseMultiDataPaths: function() {
          return u
        },
        getDataOnPath: function() {
          return c
        }
      });
    var r = /^\s/,
      n = function(t, e) {
        throw Error('Parsing data path "' + t + '" failed at char "' + t[e] + '" (index ' + e + ")")
      },
      o = function(t, e) {
        for (var r = e.index; e.index < e.length;) {
          var o = t[e.index];
          if (!/^[0-9]/.test(o)) break;
          e.index++
        }
        return r === e.index && n(t, e.index), parseInt(t.slice(r, e.index), 10)
      },
      a = function(t, e) {
        var r = e.index,
          o = t[r];
        if (/^[_a-zA-Z$]/.test(o))
          for (e.index++; e.index < e.length;) {
            var a = t[e.index];
            if (!/^[_a-zA-Z0-9$]/.test(a)) break;
            e.index++
          } else n(t, e.index);
        return t.slice(r, e.index)
      },
      i = function(t, e) {
        for (var r = [a(t, e)], i = {
            deepCmp: !1
          }; e.index < e.length;) {
          var u = t[e.index];
          if ("[" === u) e.index++, r.push("" + o(t, e)), "]" !== t[e.index] && n(t, e.index), e.index++;
          else {
            if ("." !== u) break;
            if (e.index++, "*" === t[e.index]) {
              if (e.index++, "*" === t[e.index]) {
                e.index++, i.deepCmp = !0;
                break
              }
              n(t, e.index)
            }
            r.push(a(t, e))
          }
        }
        return {
          path: r,
          options: i
        }
      },
      u = function(t) {
        var e = {
            length: t.length,
            index: 0
          },
          o = function(t, e) {
            for (; r.test(t[e.index]);) e.index++;
            for (var o = [i(t, e)], a = !1; e.index < e.length;) {
              var u = t[e.index];
              r.test(u) ? e.index++ : "," === u ? (a = !0, e.index++) : a ? (a = !1, o.push(i(t, e))) : n(t, e.index)
            }
            return o
          }(t, e);
        return function(t, e) {
          e.index < e.length && n(t, e.index)
        }(t, e), o
      },
      c = function(e, r) {
        var n = e;
        return r.forEach((function(e) {
          n = "object" != t(n) || null === n ? void 0 : n[e]
        })), n
      }
  })),
  n = e((function(e, r) {
    r.exports = function() {
      var e, r = null;

      function n(e) {
        return !!e && ("object" == t(e) || "function" == typeof e)
      }

      function o(t) {
        if (null !== t && !n(t)) throw new TypeError("Object prototype may only be an Object or null: " + t)
      }
      var a = Object,
        i = Boolean(a.create) || !({
            __proto__: null
          }
          instanceof a),
        u = a.create || (i ? function(t) {
          return o(t), {
            __proto__: t
          }
        } : function(t) {
          if (o(t), null === t) throw new SyntaxError("Native Object.create is required to create objects with null prototype");
          var e = function() {};
          return e.prototype = t, new e
        }),
        c = function() {
          return null
        },
        f = a.getPrototypeOf || ([].__proto__ === Array.prototype ? function(t) {
          var e = t.__proto__;
          return n(e) ? e : null
        } : c);
      return (e = function(t, p) {
        if (void 0 === (this && this instanceof e ? this.constructor : void 0)) throw new TypeError("Constructor Proxy requires 'new'");
        if (!n(t) || !n(p)) throw new TypeError("Cannot create proxy with a non-object as target or handler");
        var s = function() {};
        r = function() {
          t = null, s = function(t) {
            throw new TypeError("Cannot perform '".concat(t, "' on a proxy that has been revoked"))
          }
        }, setTimeout((function() {
          r = null
        }), 0);
        var l = p;
        for (var d in p = {
            get: null,
            set: null,
            apply: null,
            construct: null
          }, l) {
          if (!(d in p)) throw new TypeError("Proxy polyfill does not support trap '".concat(d, "'"));
          p[d] = l[d]
        }
        "function" == typeof l && (p.apply = l.apply.bind(l));
        var h, v = f(t),
          b = !1,
          y = !1;
        "function" == typeof t ? (h = function() {
          var e = this && this.constructor === h,
            r = Array.prototype.slice.call(arguments);
          if (s(e ? "construct" : "apply"), e && p.construct) return p.construct.call(this, t, r);
          if (!e && p.apply) return p.apply(t, this, r);
          if (e) {
            r.unshift(t);
            var n = t.bind.apply(t, r);
            return new n
          }
          return t.apply(this, r)
        }, b = !0) : t instanceof Array ? (h = [], y = !0) : h = i || null !== v ? u(v) : {};
        var _ = p.get ? function(t) {
            return s("get"), p.get(this, t, h)
          } : function(t) {
            return s("get"), this[t]
          },
          m = p.set ? function(t, e) {
            s("set");
            p.set(this, t, e, h)
          } : function(t, e) {
            s("set"), this[t] = e
          },
          g = a.getOwnPropertyNames(t),
          x = {};
        g.forEach((function(e) {
          if (!b && !y || !(e in h)) {
            var r = a.getOwnPropertyDescriptor(t, e),
              n = {
                enumerable: Boolean(r.enumerable),
                get: _.bind(t, e),
                set: m.bind(t, e)
              };
            a.defineProperty(h, e, n), x[e] = !0
          }
        }));
        var w = !0;
        if (b || y) {
          var P = a.setPrototypeOf || ([].__proto__ === Array.prototype ? function(t, e) {
            return o(e), t.__proto__ = e, t
          } : c);
          v && P(h, v) || (w = !1)
        }
        if (p.get || !w)
          for (var O in t) x[O] || a.defineProperty(h, O, {
            get: _.bind(t, O)
          });
        return a.seal(t), a.seal(h), h
      }).revocable = function(t, n) {
        return {
          proxy: new e(t, n),
          revoke: r
        }
      }, e
    }
  })),
  o = e((function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
      }),
      function(t, e) {
        for (var r in e) Object.defineProperty(t, r, {
          enumerable: !0,
          get: e[r]
        })
      }(e, {
        create: function() {
          return a
        },
        unwrap: function() {
          return i
        }
      });
    var r, o = (0, (r = n(), r && r.__esModule ? r : {
      default: r
    }).default)();

    function a(e, r) {
      return function e(r, n, a) {
        if ("object" != t(r) || null === r) return r;
        var i = {
          get: function(t, r) {
            if ("__rawObject__" === r) return t;
            var o = a.concat(r),
              i = t[r];
            return n.push({
              path: o,
              value: i
            }), e(i, n, o)
          }
        };
        try {
          return new Proxy(r, i)
        } catch (t) {
          return new o(r, i)
        }
      }(e, r, [])
    }

    function i(e) {
      if (null !== e && "object" == t(e) && "object" != t(e.__rawObject__)) {
        if (Array.isArray(e)) return e.map((function(t) {
          return i(t)
        }));
        var r = {};
        return Object.keys(e).forEach((function(t) {
          r[t] = i(e[t])
        })), r
      }
      return "object" != t(e) || null === e || "object" != t(e.__rawObject__) ? e : e.__rawObject__
    }
  })),
  a = e((function(e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), Object.defineProperty(e, "behavior", {
      enumerable: !0,
      get: function() {
        return b
      }
    });
    var n, a = f(require("rfdc")),
      i = f(require("fast-deep-equal")),
      u = s(r()),
      c = s(o());

    function f(t) {
      return t && t.__esModule ? t : {
        default: t
      }
    }

    function p(t) {
      if ("function" != typeof WeakMap) return null;
      var e = new WeakMap,
        r = new WeakMap;
      return (p = function(t) {
        return t ? r : e
      })(t)
    }

    function s(e, r) {
      if (!r && e && e.__esModule) return e;
      if (null === e || "object" != t(e) && "function" != typeof e) return {
        default: e
      };
      var n = p(r);
      if (n && n.has(e)) return n.get(e);
      var o = {},
        a = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var i in e)
        if ("default" !== i && Object.prototype.hasOwnProperty.call(e, i)) {
          var u = a ? Object.getOwnPropertyDescriptor(e, i) : null;
          u && (u.get || u.set) ? Object.defineProperty(o, i, u) : o[i] = e[i]
        } return o.default = e, n && n.set(e, o), o
    }
    var l, d = (0, a.default)({
      proto: !0
    });
    (l = n || (n = {}))[l.CREATED = 0] = "CREATED", l[l.ATTACHED = 1] = "ATTACHED";
    var h = 0;

    function v(t, e) {
      return t === e || t != t && e != e
    }
    var b = Behavior({
      lifetimes: {
        attached: function() {
          this.setData({
            _computedWatchInit: 1
          })
        },
        created: function() {
          this.setData({
            _computedWatchInit: 0
          })
        }
      },
      definitionFilter: function(e) {
        var r, n = e.computed,
          o = e.watch,
          a = [],
          f = h++;
        a.push({
          fields: "_computedWatchInit",
          observer: function() {
            var t = this,
              e = this.data._computedWatchInit;
            if (0 === e) {
              var r = {
                computedUpdaters: [],
                computedRelatedPathValues: {},
                watchCurVal: {},
                _triggerFromComputedAttached: {}
              };
              this._computedWatchInfo || (this._computedWatchInfo = {}), this._computedWatchInfo[f] = r, o && Object.keys(o).forEach((function(e) {
                var n = u.parseMultiDataPaths(e).map((function(e) {
                  var r = e.path,
                    n = e.options,
                    o = u.getDataOnPath(t.data, r);
                  return n.deepCmp ? d(o) : o
                }));
                r.watchCurVal[e] = n
              }))
            } else if (1 === e) {
              var a = this._computedWatchInfo[f];
              n && Object.keys(n).forEach((function(e) {
                var r, o = n[e],
                  i = [],
                  f = o(c.create(t.data, i)),
                  p = i.map((function(e) {
                    var r = e.path;
                    return {
                      path: r,
                      value: u.getDataOnPath(t.data, r)
                    }
                  }));
                t.setData(((r = {})[e] = c.unwrap(f), r)), a._triggerFromComputedAttached[e] = !0, a.computedRelatedPathValues[e] = p;
                a.computedUpdaters.push((function() {
                  for (var r, n = a.computedRelatedPathValues[e], i = !1, f = 0; f < n.length; f++) {
                    var p = n[f],
                      s = p.path;
                    if (!v(p.value, u.getDataOnPath(t.data, s))) {
                      i = !0;
                      break
                    }
                  }
                  if (!i) return !1;
                  var l = [],
                    d = o(c.create(t.data, l));
                  t.setData(((r = {})[e] = c.unwrap(d), r));
                  var h = l.map((function(e) {
                    var r = e.path;
                    return {
                      path: r,
                      value: u.getDataOnPath(t.data, r)
                    }
                  }));
                  return a.computedRelatedPathValues[e] = h, !0
                }))
              }))
            }
          }
        }), n && a.push({
          fields: "**",
          observer: function() {
            var t, e = this;
            if (this._computedWatchInfo) {
              var r = this._computedWatchInfo[f];
              if (r)
                do {
                  t = r.computedUpdaters.some((function(t) {
                    return t.call(e)
                  }))
                } while (t)
            }
          }
        }), o && Object.keys(o).forEach((function(t) {
          var e = u.parseMultiDataPaths(t);
          a.push({
            fields: t,
            observer: function() {
              var r = this;
              if (this._computedWatchInfo) {
                var n = this._computedWatchInfo[f];
                if (n) {
                  if (Object.keys(n._triggerFromComputedAttached).length) {
                    var a = {};
                    for (var c in e.forEach((function(t) {
                        return a[t.path[0]] = !0
                      })), n._triggerFromComputedAttached)
                      if (n._triggerFromComputedAttached.hasOwnProperty(c) && a[c] && n._triggerFromComputedAttached[c]) return void(n._triggerFromComputedAttached[c] = !1)
                  }
                  var p = n.watchCurVal[t],
                    s = e.map((function(t) {
                      var e = t.path,
                        n = t.options;
                      return {
                        val: u.getDataOnPath(r.data, e),
                        options: n
                      }
                    })),
                    l = s.map((function(t) {
                      var e = t.val;
                      return t.options.deepCmp ? d(e) : e
                    }));
                  n.watchCurVal[t] = l;
                  for (var h = !1, b = 0; b < l.length; b++)
                    if (e[b].options.deepCmp ? !(0, i.default)(p[b], l[b]) : !v(p[b], l[b])) {
                      h = !0;
                      break
                    } h && o[t].apply(this, s.map((function(t) {
                    return t.val
                  })))
                }
              }
            }
          })
        })), "object" != t(e.observers) && (e.observers = {}), Array.isArray(e.observers) ? (r = e.observers).push.apply(r, a) : a.forEach((function(t) {
          var r = e.observers[t.fields];
          e.observers[t.fields] = r ? function() {
            t.observer.call(this), r.call(this)
          } : t.observer
        }))
      }
    })
  }));
Object.defineProperty(exports, "__esModule", {
    value: !0
  }),
  function(t, e) {
    for (var r in e) Object.defineProperty(t, r, {
      enumerable: !0,
      get: e[r]
    })
  }(exports, {
    DataTracerMode: function() {
      return i
    },
    behavior: function() {
      return c.behavior
    },
    ComponentWithComputed: function() {
      return f
    },
    BehaviorWithComputed: function() {
      return p
    },
    getCurrentDataTracerMode: function() {
      return l
    },
    setCurrentDataTracerMode: function() {
      return d
    }
  });
var i, u, c = a();

function f(t) {
  return Array.isArray(t.behaviors) || (t.behaviors = []), t.behaviors.unshift(c.behavior), Component(t)
}

function p(t) {
  return Array.isArray(t.behaviors) || (t.behaviors = []), t.behaviors.unshift(c.behavior), Behavior(t)
}(u = i || (i = {}))[u.Auto = 0] = "Auto", u[u.Proxy = 1] = "Proxy", u[u.DefineProperty = 2] = "DefineProperty";
var s = 0,
  l = function() {
    return s
  },
  d = function(t) {
    s = t
  };