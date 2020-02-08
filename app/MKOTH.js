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
})({"Uhbr":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
}); // App Script is unable to raise a HTTP error code, any errors will return a error page (default or a preset below) with code 200.

class Helpers {
  static returnEmpty(request) {
    return ContentService.createTextOutput(`error: executed with no returns \n${JSON.stringify(request, undefined, 2)}`).setMimeType(ContentService.MimeType.TEXT);
  }

  static returnError(error, request) {
    return ContentService.createTextOutput(`error: ${error.name}\n${error.message}\n${error.stack}\n${JSON.stringify(request, undefined, 2)}`).setMimeType(ContentService.MimeType.TEXT);
  }

  static returnJSON(data) {
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
  }

  static returnUnauthorised() {
    return ContentService.createTextOutput("Unauthorised").setMimeType(ContentService.MimeType.TEXT);
  }

}

exports.Helpers = Helpers;
},{}],"kt80":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const helpers_1 = require("./helpers");

class Handler {
  constructor(routingRoot) {
    this.routingRoot = routingRoot;
  }

  handleGet(request) {
    return this.handle(request, router => router.get);
  }

  handlePost(request) {
    return this.handle(request, router => router.post);
  }

  handle(request, selector) {
    const router = this.traversePath(request.pathInfo || "");

    if (router) {
      const selected = selector(router);

      if (selected) {
        try {
          return selected(request);
        } catch (error) {
          return helpers_1.Helpers.returnError(error, request);
        }
      }
    }

    return helpers_1.Helpers.returnEmpty(request);
  }

  traversePath(path) {
    if (path === "") {
      return this.routingRoot;
    }

    const paths = path.split("/");
    const controllers = this.routingRoot;
    let routers = controllers;

    while (paths.length > 0) {
      const current = paths.shift();
      routers = routers[Object.getOwnPropertyNames(routers).filter(x => x.toLowerCase() === current.toLowerCase())[0]];

      if (!routers) {
        break;
      }
    }

    return routers;
  }

}

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

const app_script_router_1 = require("../../lib/app-script-router");

exports.RoutingRoot = {
  get(request) {
    var _a, _b, _c;

    const subHandler = exports.RootQuery[Object.keys(request.parameter).find(x => exports.RootQuery[x])];
    return _c = (_b = (_a = subHandler) === null || _a === void 0 ? void 0 : _a.get) === null || _b === void 0 ? void 0 : _b.call(subHandler, request), _c !== null && _c !== void 0 ? _c : app_script_router_1.Helpers.returnEmpty(request);
  },

  post(request) {
    var _a, _b, _c;

    const subHandler = exports.RootQuery[Object.keys(request.parameter).find(x => exports.RootQuery[x])];
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

  const value = loader();
  (_a = CacheService.getScriptCache()) === null || _a === void 0 ? void 0 : _a.put(key, value);
  return value;
}

exports.getAndCache = getAndCache;
},{}],"C4mA":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const app_script_router_1 = require("../../lib/app-script-router");

const appsScript_1 = require("../common/appsScript");

const root_1 = require("./root");

function administer(request) {
  var _a, _b;

  const adminKey = "adminKey";

  if (request.parameter.admin) {
    let adminKeyValue = (_b = (_a = CacheService.getScriptCache()) === null || _a === void 0 ? void 0 : _a.get(adminKey), _b !== null && _b !== void 0 ? _b : appsScript_1.getAndCache(adminKey, () => PropertiesService.getScriptProperties().getProperty(adminKey)));
    request.isAdmin = request.parameter.admin === adminKeyValue;
  }

  return request;
}

exports.administer = administer;
root_1.RootQuery.token = {
  get(request) {
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

Object.defineProperty(exports, "__esModule", {
  value: true
});

const app_script_router_1 = require("../../lib/app-script-router");

const root_1 = require("./root");

root_1.RootQuery.ping = {
  get(request) {
    return app_script_router_1.Helpers.returnJSON(Object.assign(Object.assign({}, request), {
      status: "ok",
      runTime: Date.now() - InstanceTime
    }));
  },

  post(request) {
    return app_script_router_1.Helpers.returnJSON(Object.assign(Object.assign({}, request), {
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

const app_script_router_1 = require("../../lib/app-script-router");

const root_1 = require("./root");

root_1.RoutingRoot.reflect = {
  get(request) {
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

  const tableSheet = spreadSheet.getSheetByName(tableName);

  if (!tableSheet) {
    return [];
  }

  const rows = tableSheet.getLastRow();
  const columns = tableSheet.getLastColumn();
  const range = tableSheet.getRange(1, 1, rows, columns);
  const values = range.getValues();
  const propertyNames = (_a = values.shift(), _a !== null && _a !== void 0 ? _a : []);
  return values.map(x => loadEntity(propertyNames, x));
}

exports.loadEntities = loadEntities;

function loadEntity(propertyNames, row) {
  let entity = {};

  for (let propertyNameIndex = 0; propertyNameIndex < propertyNames.length; propertyNameIndex++) {
    entity[propertyNames[propertyNameIndex]] = row[propertyNameIndex];
  }

  return entity;
}
},{}],"M0tu":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function updateEntities(spreadSheet, tableName, entities) {
  let tableSheet = spreadSheet.getSheetByName(tableName);

  if (!tableSheet) {
    tableSheet = spreadSheet.insertSheet(tableName);
  }

  const keys = Object.keys(entities[0]);
  const rows = entities.length + 1;
  const columns = keys.length;
  const range = tableSheet.getRange(1, 1, rows, columns);
  tableSheet.clearContents();
  return range.setValues([keys, ...entities.map(x => generateEntityRow(x))]);
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

class Lazy {
  constructor(executor) {
    this.executor = executor;
    this._didRun = false;
  }
  /**
   * True if the lazy value has been resolved.
   */


  hasValue() {
    return this._didRun;
  }
  /**
   * Get the wrapped value.
   *
   * This will force evaluation of the lazy value if it has not been resolved yet. Lazy values are only
   * resolved once. `getValue` will re-throw exceptions that are hit while resolving the value
   */


  getValue() {
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
  }
  /**
   * Get the wrapped value without forcing evaluation.
   */


  get rawValue() {
    return this._value;
  }
  /**
   * Create a new lazy value that is the result of applying `f` to the wrapped value.
   *
   * This does not force the evaluation of the current lazy value.
   */


  map(f) {
    return new Lazy(() => f(this.getValue()));
  }

}

exports.Lazy = Lazy;
},{}],"Xa8j":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const loader_1 = require("./loader");

const updater_1 = require("./updater");

const lazy_1 = require("./lazy");

class EntitySet {
  constructor(options) {
    this.spreadSheet = options.spreadSheet;
    this.tableName = options.tableName;
    this.loaded = new lazy_1.Lazy(() => loader_1.loadEntities(this.spreadSheet, this.tableName));
  }

  loadAll() {
    return this.loaded.getValue();
  }

  updateAll(entities) {
    this.loaded = new lazy_1.Lazy(() => loader_1.loadEntities(this.spreadSheet, this.tableName));
    updater_1.updateEntities(this.spreadSheet, this.tableName, entities);
  }

}

exports.EntitySet = EntitySet;
},{"./loader":"XONy","./updater":"M0tu","./lazy":"x5a9"}],"Z2HK":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const entitySystem_1 = require("./entitySystem");

function getCacheKey(name) {
  return "entity_cache-" + name;
}

function handleGet(operation, spreadSheet, sheetName) {
  const cache = CacheService.getScriptCache();
  const cacheKey = getCacheKey(sheetName);

  switch (operation.type) {
    case "all":
      {
        let data = cache.get(cacheKey);

        if (data) {
          return data;
        }

        data = JSON.stringify(new entitySystem_1.EntitySet({
          spreadSheet,
          tableName: sheetName
        }).loadAll());
        cache.put(cacheKey, data);
        return data;
      }

    default:
      return JSON.stringify(null);
  }
}

exports.handleGet = handleGet;

function handlePost(operation, postData, spreadSheet, sheetName) {
  var _a;

  (_a = CacheService.getScriptCache()) === null || _a === void 0 ? void 0 : _a.remove(getCacheKey(sheetName));

  switch (operation.type) {
    case "all":
      {
        const data = JSON.parse(postData);
        const entitySet = new entitySystem_1.EntitySet({
          spreadSheet,
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

const app_script_router_1 = require("../../lib/app-script-router");

const jsonWebAPI_1 = require("../../lib/spreadsheet-database/jsonWebAPI");

const root_1 = require("./root");

root_1.RootQuery.spreadSheet = {
  get(request) {
    return ContentService.createTextOutput(jsonWebAPI_1.handleGet(parseQuery(request.parameter), SpreadsheetApp.getActive(), request.parameter.spreadSheet)).setMimeType(ContentService.MimeType.JSON);
  },

  post(request) {
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
},{"../../lib/app-script-router":"imHk","../../lib/spreadsheet-database/jsonWebAPI":"Z2HK","./root":"XoxW"}],"Tnxw":[function(require,module,exports) {
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
},{"./root":"XoxW","./admin":"C4mA","./ping":"jafE","./reflect":"uCwy","./spreadSheet":"WPUf"}],"s6MI":[function(require,module,exports) {
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

const spreadsheet_database_1 = require("../lib/spreadsheet-database");

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

function test() {
  const es = new spreadsheet_database_1.EntitySet({
    spreadSheet: SpreadsheetApp.getActive(),
    tableName: "Test"
  });
  const testSet = [];

  for (let index = 0; index < 1000; index++) {
    testSet.push({
      date: new Date(),
      value: index,
      boolean: index % 2 == 0,
      string: "test" + index,
      object: [1, 2, 3, 4]
    });
  }

  es.updateAll(testSet);
  const values = es.loadAll();
  Logger.log(JSON.stringify(values));
}

exports.test = test;
},{"../lib/spreadsheet-database":"s6MI"}],"G9Js":[function(require,module,exports) {
"use strict"; //#region Polyfills
// import 'core-js/features/array/from'
// import 'core-js/features/array/find'
// import 'core-js/features/array/includes'
// import 'core-js/features/string/includes'
// import 'core-js/features/object/values'
//#endregion

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./web-app");

const app_script_router_1 = require("../lib/app-script-router");

const web_app_1 = require("./web-app");

const test_1 = require("./test");

function doGet(request) {
  return new app_script_router_1.Handler(web_app_1.RoutingRoot).handleGet(web_app_1.administer(request));
}

exports.doGet = doGet;

function doPost(request) {
  return new app_script_router_1.Handler(web_app_1.RoutingRoot).handlePost(web_app_1.administer(request));
}

exports.doPost = doPost;

function doTest() {
  var testSet = Array.from(Array(5).keys());
  Logger.log(testSet.find(x => x == 1));
  Logger.log(testSet.includes(1));
  Logger.log("test".includes("t"));
  Logger.log(Object.values({
    test: "lol"
  }));
  test_1.test();
}

exports.doTest = doTest;
},{"./web-app":"Tnxw","../lib/app-script-router":"imHk","./test":"nYeO"}]},{},["G9Js"], "MKOTH")