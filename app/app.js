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
})({"FurB":[function(require,module,exports) {
"use strict";

exports.__esModule = true; // App Script is unable to raise a HTTP error code, any errors will return a error page (default or a preset below) with code 200.

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

  return Helpers;
}();

exports.Helpers = Helpers;
},{}],"UAuT":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var Helpers_1 = require("./Helpers");

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
          return Helpers_1.Helpers.returnError(error, request);
        }
      }
    }

    return Helpers_1.Helpers.returnEmpty(request);
  };

  Handler.prototype.traversePath = function (path) {
    if (path === "") {
      return this.routingRoot;
    }

    var paths = path.split("/");
    var controllers = this.routingRoot;
    var routers = controllers;

    var _loop_1 = function _loop_1() {
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
},{"./Helpers":"FurB"}],"MJGD":[function(require,module,exports) {
"use strict";

exports.__esModule = true;
},{}],"im2B":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) {
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}

exports.__esModule = true;

__export(require("./Handler"));

__export(require("./Helpers"));

__export(require("./types"));
},{"./Handler":"UAuT","./Helpers":"FurB","./types":"MJGD"}],"TbLB":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var app_script_router_1 = require("../app-script-router");

exports.RoutingRoot = {
  get: function get(request) {
    var subHandler = exports.RootQuery[Object.keys(request.parameter).filter(function (x) {
      return exports.RootQuery[x];
    })[0]];

    if (subHandler && subHandler.get) {
      return subHandler.get(request);
    } else {
      return app_script_router_1.Helpers.returnEmpty(request);
    }
  },
  post: function post(request) {
    var subHandler = exports.RootQuery[Object.keys(request.parameter).filter(function (x) {
      return exports.RootQuery[x];
    })[0]];

    if (subHandler && subHandler.post) {
      return subHandler.post(request);
    } else {
      return app_script_router_1.Helpers.returnEmpty(request);
    }
  }
};
exports.RootQuery = {};
},{"../app-script-router":"im2B"}],"XYhl":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

exports.__esModule = true;

var root_1 = require("./root");

var app_script_router_1 = require("../app-script-router");

root_1.RootQuery.ping = {
  get: function get(request) {
    return app_script_router_1.Helpers.returnJSON(__assign(__assign({}, request), {
      status: "ok"
    }));
  },
  post: function post(request) {
    return app_script_router_1.Helpers.returnJSON(__assign(__assign({}, request), {
      status: "ok"
    }));
  }
};
},{"./root":"TbLB","../app-script-router":"im2B"}],"EVxB":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var app_script_router_1 = require("../app-script-router");

var root_1 = require("./root");

require("./ping");

function doGet(request) {
  return new app_script_router_1.Handler(root_1.RoutingRoot).handleGet(request);
}

exports.doGet = doGet;

function doPost(request) {
  return new app_script_router_1.Handler(root_1.RoutingRoot).handleGet(request);
}

exports.doPost = doPost;
},{"../app-script-router":"im2B","./root":"TbLB","./ping":"XYhl"}]},{},["EVxB"], "MKOTH")