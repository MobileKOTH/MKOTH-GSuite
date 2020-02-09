// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"l8Od":[function(require,module,exports) {
var global = arguments[3];
if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    'use strict';

    if (search instanceof RegExp) {
      throw TypeError('first argument must not be a RegExp');
    }

    if (start === undefined) {
      start = 0;
    }

    return this.indexOf(search, start) !== -1;
  };
} // Production steps of ECMA-262, Edition 6, 22.1.2.1


if (!Array.from) {
  Array.from = function () {
    var toStr = Object.prototype.toString;

    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };

    var toInteger = function (value) {
      var number = Number(value);

      if (isNaN(number)) {
        return 0;
      }

      if (number === 0 || !isFinite(number)) {
        return number;
      }

      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };

    var maxSafeInteger = Math.pow(2, 53) - 1;

    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    }; // The length property of the from method is 1.


    return function from(arrayLike
    /*, mapFn, thisArg */
    ) {
      // 1. Let C be the this value.
      var C = this; // 2. Let items be ToObject(arrayLike).

      var items = Object(arrayLike); // 3. ReturnIfAbrupt(items).

      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      } // 4. If mapfn is undefined, then let mapping be false.


      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;

      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        } // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.


        if (arguments.length > 2) {
          T = arguments[2];
        }
      } // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).


      var len = toLength(items.length); // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method 
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).

      var A = isCallable(C) ? Object(new C(len)) : new Array(len); // 16. Let k be 0.

      var k = 0; // 17. Repeat, while k < len… (also steps a - h)

      var kValue;

      while (k < len) {
        kValue = items[k];

        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }

        k += 1;
      } // 18. Let putStatus be Put(A, "length", len, true).


      A.length = len; // 20. Return A.

      return A;
    };
  }();
} // https://tc39.github.io/ecma262/#sec-array.prototype.find


if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function (predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw TypeError('"this" is null or not defined');
      }

      var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

      var len = o.length >>> 0; // 3. If IsCallable(predicate) is false, throw a TypeError exception.

      if (typeof predicate !== 'function') {
        throw TypeError('predicate must be a function');
      } // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.


      var thisArg = arguments[1]; // 5. Let k be 0.

      var k = 0; // 6. Repeat, while k < len

      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];

        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        } // e. Increase k by 1.


        k++;
      } // 7. Return undefined.


      return undefined;
    },
    configurable: true,
    writable: true
  });
}

if (![].entries) {
  Array.prototype.values = function () {
    var k,
        a = [],
        nextIndex = 0,
        ary = this;
    k = ary.length;

    while (k > 0) a[--k] = [k, ary[k]];

    a.next = function () {
      return nextIndex < ary.length ? {
        value: [nextIndex++, ary[nextIndex]],
        done: false
      } : {
        done: true
      };
    };

    return a;
  };
}

if (![].keys) {
  Array.prototype.keys = function () {
    var k,
        a = [],
        nextIndex = 0,
        ary = this;
    k = ary.length;

    while (k > 0) a[--k] = k;

    a.next = function () {
      return nextIndex < ary.length ? {
        value: nextIndex++,
        done: false
      } : {
        done: true
      };
    };

    return a;
  };
}

if (![].values) {
  Array.prototype.values = function () {
    var k,
        a = [],
        nextIndex = 0,
        ary = this;
    k = ary.length;

    while (k > 0) a[--k] = ary[k];

    a.next = function () {
      return nextIndex < ary.length ? {
        value: ary[nextIndex++],
        done: false
      } : {
        done: true
      };
    };

    return a;
  };
}

if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function (searchElement, fromIndex) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

      var len = o.length >>> 0; // 3. If len is 0, return false.

      if (len === 0) {
        return false;
      } // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)


      var n = fromIndex | 0; // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.

      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
      } // 7. Repeat, while k < len


      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        // c. Increase k by 1.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }

        k++;
      } // 8. Return false


      return false;
    }
  });
}
/* Disable minification (remove `.min` from URL path) for more info */


(function (undefined) {
  function ArrayCreate(r) {
    if (1 / r == -Infinity && (r = 0), r > Math.pow(2, 32) - 1) throw new RangeError("Invalid array length");
    var n = [];
    return n.length = r, n;
  }

  function Call(t, l) {
    var n = arguments.length > 2 ? arguments[2] : [];
    if (!1 === IsCallable(t)) throw new TypeError(Object.prototype.toString.call(t) + "is not a function.");
    return t.apply(l, n);
  }

  function CreateDataProperty(e, r, t) {
    var a = {
      value: t,
      writable: !0,
      enumerable: !0,
      configurable: !0
    };

    try {
      return Object.defineProperty(e, r, a), !0;
    } catch (n) {
      return !1;
    }
  }

  function CreateDataPropertyOrThrow(t, r, o) {
    var e = CreateDataProperty(t, r, o);
    if (!e) throw new TypeError("Cannot assign value `" + Object.prototype.toString.call(o) + "` to property `" + Object.prototype.toString.call(r) + "` on object `" + Object.prototype.toString.call(t) + "`");
    return e;
  }

  function CreateMethodProperty(e, r, t) {
    var a = {
      value: t,
      writable: !0,
      enumerable: !1,
      configurable: !0
    };
    Object.defineProperty(e, r, a);
  }

  function Get(n, t) {
    return n[t];
  }

  function HasProperty(n, r) {
    return r in n;
  }

  function IsArray(r) {
    return "[object Array]" === Object.prototype.toString.call(r);
  }

  function IsCallable(n) {
    return "function" == typeof n;
  }

  function ToInteger(n) {
    var i = Number(n);
    return isNaN(i) ? 0 : 1 / i === Infinity || 1 / i == -Infinity || i === Infinity || i === -Infinity ? i : (i < 0 ? -1 : 1) * Math.floor(Math.abs(i));
  }

  function ToLength(n) {
    var t = ToInteger(n);
    return t <= 0 ? 0 : Math.min(t, Math.pow(2, 53) - 1);
  }

  function ToObject(e) {
    if (null === e || e === undefined) throw TypeError();
    return Object(e);
  }

  function GetV(t, e) {
    return ToObject(t)[e];
  }

  function GetMethod(e, n) {
    var r = GetV(e, n);
    if (null === r || r === undefined) return undefined;
    if (!1 === IsCallable(r)) throw new TypeError("Method not callable: " + n);
    return r;
  }

  function Type(e) {
    switch (typeof e) {
      case "undefined":
        return "undefined";

      case "boolean":
        return "boolean";

      case "number":
        return "number";

      case "string":
        return "string";

      case "symbol":
        return "symbol";

      default:
        return null === e ? "null" : "Symbol" in this && e instanceof this.Symbol ? "symbol" : "object";
    }
  }

  function EnumerableOwnProperties(e, r) {
    for (var t = Object.keys(e), n = [], s = t.length, a = 0; a < s; a++) {
      var i = t[a];

      if ("string" === Type(i)) {
        var u = Object.getOwnPropertyDescriptor(e, i);
        if (u && u.enumerable) if ("key" === r) n.push(i);else {
          var p = Get(e, i);
          if ("value" === r) n.push(p);else {
            var f = [i, p];
            n.push(f);
          }
        }
      }
    }

    return n;
  }

  function GetPrototypeFromConstructor(t, o) {
    var r = Get(t, "prototype");
    return "object" !== Type(r) && (r = o), r;
  }

  function OrdinaryCreateFromConstructor(r, e) {
    var t = arguments[2] || {},
        o = GetPrototypeFromConstructor(r, e),
        a = Object.create(o);

    for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && Object.defineProperty(a, n, {
      configurable: !0,
      enumerable: !1,
      writable: !0,
      value: t[n]
    });

    return a;
  }

  function IsConstructor(t) {
    return "object" === Type(t) && "function" == typeof t && !!t.prototype;
  }

  function Construct(r) {
    var t = arguments.length > 2 ? arguments[2] : r,
        o = arguments.length > 1 ? arguments[1] : [];
    if (!IsConstructor(r)) throw new TypeError("F must be a constructor.");
    if (!IsConstructor(t)) throw new TypeError("newTarget must be a constructor.");
    if (t === r) return new (Function.prototype.bind.apply(r, [null].concat(o)))();
    var n = OrdinaryCreateFromConstructor(t, Object.prototype);
    return Call(r, n, o);
  }

  function ArraySpeciesCreate(r, e) {
    if (1 / e == -Infinity && (e = 0), !1 === IsArray(r)) return ArrayCreate(e);
    var t = Get(r, "constructor");
    if ("object" === Type(t) && null === (t = "Symbol" in this && "species" in this.Symbol ? Get(t, this.Symbol.species) : undefined) && (t = undefined), t === undefined) return ArrayCreate(e);
    if (!IsConstructor(t)) throw new TypeError("C must be a constructor");
    return Construct(t, [e]);
  }

  function OrdinaryToPrimitive(r, t) {
    if ("string" === t) var e = ["toString", "valueOf"];else e = ["valueOf", "toString"];

    for (var i = 0; i < e.length; ++i) {
      var n = e[i],
          a = Get(r, n);

      if (IsCallable(a)) {
        var o = Call(a, r);
        if ("object" !== Type(o)) return o;
      }
    }

    throw new TypeError("Cannot convert to primitive.");
  }

  function ToPrimitive(e) {
    var t = arguments.length > 1 ? arguments[1] : undefined;

    if ("object" === Type(e)) {
      if (arguments.length < 2) var i = "default";else t === String ? i = "string" : t === Number && (i = "number");
      var r = "function" == typeof this.Symbol && "symbol" == typeof this.Symbol.toPrimitive ? GetMethod(e, this.Symbol.toPrimitive) : undefined;

      if (r !== undefined) {
        var n = Call(r, e, [i]);
        if ("object" !== Type(n)) return n;
        throw new TypeError("Cannot convert exotic object to primitive.");
      }

      return "default" === i && (i = "number"), OrdinaryToPrimitive(e, i);
    }

    return e;
  }

  function ToString(t) {
    switch (Type(t)) {
      case "symbol":
        throw new TypeError("Cannot convert a Symbol value to a string");

      case "object":
        return ToString(ToPrimitive(t, "string"));

      default:
        return String(t);
    }
  }

  CreateMethodProperty(Object, "assign", function e(r, t) {
    var n = ToObject(r);
    if (1 === arguments.length) return n;
    var a,
        o,
        c,
        l,
        p = Array.prototype.slice.call(arguments, 1);

    for (a = 0; a < p.length; a++) {
      var b = p[a];

      for (b === undefined || null === b ? c = [] : (l = ToObject(b), c = Object.keys(l)), o = 0; o < c.length; o++) {
        var i,
            u = c[o];

        try {
          var y = Object.getOwnPropertyDescriptor(l, u);
          i = y !== undefined && !0 === y.enumerable;
        } catch (O) {
          i = Object.prototype.propertyIsEnumerable.call(l, u);
        }

        if (i) {
          var f = Get(l, u);
          n[u] = f;
        }
      }
    }

    return n;
  });
  !function () {
    var e = {}.toString,
        t = "".split;
    CreateMethodProperty(Object, "entries", function r(n) {
      var c = ToObject(n),
          c = "[object String]" == e.call(n) ? t.call(n, "") : Object(n);
      return EnumerableOwnProperties(c, "key+value");
    });
  }();
  !function () {
    var t = {}.toString,
        e = "".split;
    CreateMethodProperty(Object, "values", function r(n) {
      var c = "[object String]" == t.call(n) ? e.call(n, "") : ToObject(n);
      return Object.keys(c).map(function (t) {
        return c[t];
      });
    });
  }();
}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
},{}],"Uhbr":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
}); // App Script is unable to raise a HTTP error code, any errors will return a error page (default or a preset below) with code 200.

var Helpers =
/** @class */
function () {
  function Helpers() {}

  Helpers.returnEmpty = function (request) {
    return ContentService.createTextOutput("error: executed with no returns \n" + JSON.stringify(request, undefined, 2)).setMimeType(ContentService.MimeType.TEXT);
  };

  Helpers.returnError = function (error, request) {
    return ContentService.createTextOutput("error: " + error.name + "\n" + error.message + "\n" + error.stack + "\n" + JSON.stringify(request, undefined, 2)).setMimeType(ContentService.MimeType.TEXT);
  };

  Helpers.returnJSON = function (data) {
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
  };

  Helpers.returnUnauthorised = function () {
    return ContentService.createTextOutput("Unauthorised").setMimeType(ContentService.MimeType.TEXT);
  };

  return Helpers;
}();

exports.Helpers = Helpers;
},{}],"kt80":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("./helpers");

var Handler =
/** @class */
function () {
  function Handler(routingRoot) {
    this.routingRoot = routingRoot;
  }

  Handler.prototype.handleGet = function (request) {
    return this.handle(request, function (router) {
      return router.get;
    });
  };

  Handler.prototype.handlePost = function (request) {
    return this.handle(request, function (router) {
      return router.post;
    });
  };

  Handler.prototype.handle = function (request, selector) {
    var router = this.traversePath(request.pathInfo || "");

    if (router) {
      var selected = selector(router);

      if (selected) {
        try {
          return selected(request);
        } catch (error) {
          return helpers_1.Helpers.returnError(error, request);
        }
      }
    }

    return helpers_1.Helpers.returnEmpty(request);
  };

  Handler.prototype.traversePath = function (path) {
    if (path === "") {
      return this.routingRoot;
    }

    var paths = path.split("/");
    var controllers = this.routingRoot;
    var routers = controllers;

    var _loop_1 = function () {
      var current = paths.shift();
      routers = routers[Object.getOwnPropertyNames(routers).filter(function (x) {
        return x.toLowerCase() === current.toLowerCase();
      })[0]];

      if (!routers) {
        return "break";
      }
    };

    while (paths.length > 0) {
      var state_1 = _loop_1();

      if (state_1 === "break") break;
    }

    return routers;
  };

  return Handler;
}();

exports.Handler = Handler;
},{"./helpers":"Uhbr"}],"uWSP":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"imHk":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./handler"));

__export(require("./helpers"));

__export(require("./types"));
},{"./handler":"kt80","./helpers":"Uhbr","./types":"uWSP"}],"XoxW":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var app_script_router_1 = require("../../lib/app-script-router");

exports.RoutingRoot = {
  get: function (request) {
    var _a, _b, _c;

    var subHandler = exports.RootQuery[Object.keys(request.parameter).find(function (x) {
      return exports.RootQuery[x];
    })];
    return _c = (_b = (_a = subHandler) === null || _a === void 0 ? void 0 : _a.get) === null || _b === void 0 ? void 0 : _b.call(subHandler, request), _c !== null && _c !== void 0 ? _c : app_script_router_1.Helpers.returnEmpty(request);
  },
  post: function (request) {
    var _a, _b, _c;

    var subHandler = exports.RootQuery[Object.keys(request.parameter).find(function (x) {
      return exports.RootQuery[x];
    })];
    return _c = (_b = (_a = subHandler) === null || _a === void 0 ? void 0 : _a.post) === null || _b === void 0 ? void 0 : _b.call(subHandler, request), _c !== null && _c !== void 0 ? _c : app_script_router_1.Helpers.returnEmpty(request);
  }
};
/**
 * Plain query strings at root level will be used more often rather than the path routing above due to
 * authentication and CORS limitation(lack of OPTIONS method for preflight) of AppsScript for public access.
 * Issue Reference: https://issuetracker.google.com/issues/133299026
 */

exports.RootQuery = {};
},{"../../lib/app-script-router":"imHk"}],"Mx92":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function getAndCache(key, loader) {
  var _a;

  var value = loader();
  (_a = CacheService.getScriptCache()) === null || _a === void 0 ? void 0 : _a.put(key, value);
  return value;
}

exports.getAndCache = getAndCache;
},{}],"C4mA":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var app_script_router_1 = require("../../lib/app-script-router");

var appsScript_1 = require("../common/appsScript");

var root_1 = require("./root");

function administer(request) {
  var _a, _b;

  var adminKey = "adminKey";

  if (request.parameter.admin) {
    var adminKeyValue = (_b = (_a = CacheService.getScriptCache()) === null || _a === void 0 ? void 0 : _a.get(adminKey), _b !== null && _b !== void 0 ? _b : appsScript_1.getAndCache(adminKey, function () {
      return PropertiesService.getScriptProperties().getProperty(adminKey);
    }));
    request.isAdmin = request.parameter.admin === adminKeyValue;
  }

  return request;
}

exports.administer = administer;
root_1.RootQuery.token = {
  get: function (request) {
    if (!request.isAdmin) {
      return app_script_router_1.Helpers.returnUnauthorised();
    }

    return app_script_router_1.Helpers.returnJSON({
      token: ScriptApp.getOAuthToken()
    });
  }
};
},{"../../lib/app-script-router":"imHk","../common/appsScript":"Mx92","./root":"XoxW"}],"jafE":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var app_script_router_1 = require("../../lib/app-script-router");

var root_1 = require("./root");

root_1.RootQuery.ping = {
  get: function (request) {
    return app_script_router_1.Helpers.returnJSON(__assign(__assign({}, request), {
      status: "ok",
      runTime: Date.now() - InstanceTime
    }));
  },
  post: function (request) {
    return app_script_router_1.Helpers.returnJSON(__assign(__assign({}, request), {
      status: "ok",
      runTime: Date.now() - InstanceTime
    }));
  }
};
},{"../../lib/app-script-router":"imHk","./root":"XoxW"}],"uCwy":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var app_script_router_1 = require("../../lib/app-script-router");

var root_1 = require("./root");

root_1.RoutingRoot.reflect = {
  get: function (request) {
    if (!request.isAdmin) {
      return app_script_router_1.Helpers.returnUnauthorised();
    }

    return app_script_router_1.Helpers.returnJSON({
      routerRoot: root_1.RoutingRoot,
      queryRoot: root_1.RootQuery,
      request: request
    });
  }
};
},{"../../lib/app-script-router":"imHk","./root":"XoxW"}],"XONy":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function loadEntities(spreadSheet, tableName) {
  var _a;

  var tableSheet = spreadSheet.getSheetByName(tableName);

  if (!tableSheet) {
    return [];
  }

  var rows = tableSheet.getLastRow();
  var columns = tableSheet.getLastColumn();
  var range = tableSheet.getRange(1, 1, rows, columns);
  var values = range.getValues();
  var propertyNames = (_a = values.shift(), _a !== null && _a !== void 0 ? _a : []);
  return values.map(function (x) {
    return loadEntity(propertyNames, x);
  });
}

exports.loadEntities = loadEntities;

function loadEntity(propertyNames, row) {
  var entity = {};

  for (var propertyNameIndex = 0; propertyNameIndex < propertyNames.length; propertyNameIndex++) {
    entity[propertyNames[propertyNameIndex]] = row[propertyNameIndex];
  }

  return entity;
}
},{}],"M0tu":[function(require,module,exports) {
"use strict";

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

function updateEntities(spreadSheet, tableName, entities) {
  var tableSheet = spreadSheet.getSheetByName(tableName);

  if (!tableSheet) {
    tableSheet = spreadSheet.insertSheet(tableName);
  }

  var keys = Object.keys(entities[0]);
  var rows = entities.length + 1;
  var columns = keys.length;
  var range = tableSheet.getRange(1, 1, rows, columns);
  tableSheet.clearContents();
  return range.setValues(__spreadArrays([keys], entities.map(function (x) {
    return generateEntityRow(x);
  })));
}

exports.updateEntities = updateEntities;

function generateEntityRow(entity) {
  return Object.values(entity);
}
},{}],"x5a9":[function(require,module,exports) {
"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License.
 *  MIT License

    Copyright (c) 2015 - present Microsoft Corporation

    All rights reserved.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
 *--------------------------------------------------------------------------------------------*/

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Lazy =
/** @class */
function () {
  function Lazy(executor) {
    this.executor = executor;
    this._didRun = false;
  }
  /**
   * True if the lazy value has been resolved.
   */


  Lazy.prototype.hasValue = function () {
    return this._didRun;
  };
  /**
   * Get the wrapped value.
   *
   * This will force evaluation of the lazy value if it has not been resolved yet. Lazy values are only
   * resolved once. `getValue` will re-throw exceptions that are hit while resolving the value
   */


  Lazy.prototype.getValue = function () {
    if (!this._didRun) {
      try {
        this._value = this.executor();
      } catch (err) {
        this._error = err;
      } finally {
        this._didRun = true;
      }
    }

    if (this._error) {
      throw this._error;
    }

    return this._value;
  };

  Object.defineProperty(Lazy.prototype, "rawValue", {
    /**
     * Get the wrapped value without forcing evaluation.
     */
    get: function () {
      return this._value;
    },
    enumerable: true,
    configurable: true
  });
  /**
   * Create a new lazy value that is the result of applying `f` to the wrapped value.
   *
   * This does not force the evaluation of the current lazy value.
   */

  Lazy.prototype.map = function (f) {
    var _this = this;

    return new Lazy(function () {
      return f(_this.getValue());
    });
  };

  return Lazy;
}();

exports.Lazy = Lazy;
},{}],"Xa8j":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var loader_1 = require("./loader");

var updater_1 = require("./updater");

var lazy_1 = require("./lazy");

var EntitySet =
/** @class */
function () {
  function EntitySet(options) {
    var _this = this;

    this.spreadSheet = options.spreadSheet;
    this.tableName = options.tableName;
    this.loaded = new lazy_1.Lazy(function () {
      return loader_1.loadEntities(_this.spreadSheet, _this.tableName);
    });
  }

  EntitySet.prototype.loadAll = function () {
    return this.loaded.getValue();
  };

  EntitySet.prototype.updateAll = function (entities) {
    var _this = this;

    this.loaded = new lazy_1.Lazy(function () {
      return loader_1.loadEntities(_this.spreadSheet, _this.tableName);
    });
    updater_1.updateEntities(this.spreadSheet, this.tableName, entities);
  };

  return EntitySet;
}();

exports.EntitySet = EntitySet;
},{"./loader":"XONy","./updater":"M0tu","./lazy":"x5a9"}],"Z2HK":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var entitySystem_1 = require("./entitySystem");

function getCacheKey(sheetName) {
  return "entity_cache-" + sheetName.toLowerCase();
}

function clearCache(sheetName) {
  var _a;

  (_a = CacheService.getScriptCache()) === null || _a === void 0 ? void 0 : _a.remove(getCacheKey(sheetName));
}

exports.clearCache = clearCache;

function putZippedCache(key, value) {
  var _a;

  (_a = CacheService.getScriptCache()) === null || _a === void 0 ? void 0 : _a.put(key, Utilities.base64Encode(Utilities.gzip(Utilities.newBlob(value)).getBytes()));
}

function getZippedCache(key) {
  var _a;

  var zipped = (_a = CacheService.getScriptCache()) === null || _a === void 0 ? void 0 : _a.get(key);

  if (!zipped) {
    return null;
  }

  return Utilities.ungzip(Utilities.newBlob(Utilities.base64Decode(zipped), "application/x-gzip")).getDataAsString();
}

function handleGet(operation, spreadSheet, sheetName) {
  var cacheKey = getCacheKey(sheetName);

  switch (operation.type) {
    case "all":
      {
        var data = getZippedCache(cacheKey);

        if (data) {
          return data;
        }

        data = JSON.stringify(new entitySystem_1.EntitySet({
          spreadSheet: spreadSheet,
          tableName: sheetName
        }).loadAll());
        putZippedCache(cacheKey, data);
        return data;
      }

    default:
      return JSON.stringify(null);
  }
}

exports.handleGet = handleGet;

function handlePost(operation, postData, spreadSheet, sheetName) {
  clearCache(sheetName);

  switch (operation.type) {
    case "all":
      {
        var data = JSON.parse(postData);
        var entitySet = new entitySystem_1.EntitySet({
          spreadSheet: spreadSheet,
          tableName: sheetName
        });
        entitySet.updateAll(data);
        return JSON.stringify({
          status: "ok"
        });
      }

    default:
      return JSON.stringify(null);
  }
}

exports.handlePost = handlePost;
},{"./entitySystem":"Xa8j"}],"WPUf":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var app_script_router_1 = require("../../lib/app-script-router");

var jsonWebAPI_1 = require("../../lib/spreadsheet-database/jsonWebAPI");

var root_1 = require("./root");

root_1.RootQuery.spreadSheet = {
  get: function (request) {
    return ContentService.createTextOutput(jsonWebAPI_1.handleGet(parseQuery(request.parameter), SpreadsheetApp.getActive(), request.parameter.spreadSheet)).setMimeType(ContentService.MimeType.JSON);
  },
  post: function (request) {
    if (!request.isAdmin) {
      return app_script_router_1.Helpers.returnUnauthorised();
    }

    return ContentService.createTextOutput(jsonWebAPI_1.handlePost(parseQuery(request.parameter), request.postData.contents, SpreadsheetApp.getActive(), request.parameter.spreadSheet)).setMimeType(ContentService.MimeType.JSON);
  }
};

function parseQuery(param) {
  switch (param.operation) {
    case "all":
      {
        return {
          type: "all"
        };
      }

    default:
      {
        return {
          type: "unknown"
        };
      }
  }
}
},{"../../lib/app-script-router":"imHk","../../lib/spreadsheet-database/jsonWebAPI":"Z2HK","./root":"XoxW"}],"oAgR":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var root_1 = require("./root");

root_1.RootQuery.gzip = {
  get: function (request) {
    return ContentService.createTextOutput(Utilities.base64Encode(Utilities.gzip(Utilities.newBlob(request.parameter.gzip)).getBytes()));
  },
  post: function (request) {
    return ContentService.createTextOutput(Utilities.base64Encode(Utilities.gzip(Utilities.newBlob(request.postData.contents)).getBytes()));
  }
};
root_1.RootQuery.ungzip = {
  get: function (request) {
    return ContentService.createTextOutput(Utilities.ungzip(Utilities.newBlob(Utilities.base64Decode(request.parameter.ungzip), "application/x-gzip")).getDataAsString());
  },
  post: function (request) {
    return ContentService.createTextOutput(Utilities.ungzip(Utilities.newBlob(Utilities.base64Decode(request.postData.contents), "application/x-gzip")).getDataAsString());
  }
};
},{"./root":"XoxW"}],"Tnxw":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./root"));

__export(require("./admin"));

__export(require("./ping"));

__export(require("./reflect"));

__export(require("./spreadSheet"));

__export(require("./gzip"));
},{"./root":"XoxW","./admin":"C4mA","./ping":"jafE","./reflect":"uCwy","./spreadSheet":"WPUf","./gzip":"oAgR"}],"s6MI":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./entitySystem"));
},{"./entitySystem":"Xa8j"}],"nYeO":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var spreadsheet_database_1 = require("../lib/spreadsheet-database");

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

function test() {
  var es = new spreadsheet_database_1.EntitySet({
    spreadSheet: SpreadsheetApp.getActive(),
    tableName: "Test"
  });
  var testSet = [];

  for (var index = 0; index < 1000; index++) {
    testSet.push({
      date: new Date(),
      value: index,
      boolean: index % 2 == 0,
      string: "test" + index,
      object: [1, 2, 3, 4]
    });
  }

  es.updateAll(testSet);
  var values = es.loadAll();
  Logger.log(JSON.stringify(values));
}

exports.test = test;
},{"../lib/spreadsheet-database":"s6MI"}],"G9Js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./polyfills.js");

require("./web-app");

var app_script_router_1 = require("../lib/app-script-router");

var jsonWebAPI_1 = require("../lib/spreadsheet-database/jsonWebAPI");

var web_app_1 = require("./web-app");

var test_1 = require("./test");

function doGet(request) {
  return new app_script_router_1.Handler(web_app_1.RoutingRoot).handleGet(web_app_1.administer(request));
}

exports.doGet = doGet;

function doPost(request) {
  return new app_script_router_1.Handler(web_app_1.RoutingRoot).handlePost(web_app_1.administer(request));
}

exports.doPost = doPost;

function onEdit(e) {
  var sheetName = e.source.getSheetName();
  console.log("Sheet Edit", sheetName);
  jsonWebAPI_1.clearCache(sheetName);
}

exports.onEdit = onEdit;

function doTest() {
  var testSet = Array.from(Array(5).keys());
  Logger.log(testSet.find(function (x) {
    return x == 1;
  }));
  Logger.log(testSet.includes(1));
  Logger.log("test".includes("t"));
  Logger.log(Object.values({
    test: "lol"
  }));
  test_1.test();
}

exports.doTest = doTest;
},{"./polyfills.js":"l8Od","./web-app":"Tnxw","../lib/app-script-router":"imHk","../lib/spreadsheet-database/jsonWebAPI":"Z2HK","./test":"nYeO"}]},{},["G9Js"], "MKOTH")