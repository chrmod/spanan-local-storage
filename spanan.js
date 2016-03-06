(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _wrapper = require("./wrapper");

var _wrapper2 = _interopRequireDefault(_wrapper);

var _default = (function () {
  function _default() {
    var ctx = arguments.length <= 0 || arguments[0] === undefined ? window || global : arguments[0];

    _classCallCheck(this, _default);

    if (ctx.spanan) {
      throw new Error("spanan already loaded");
    }
    this.ctx = ctx;
    this.ctx.spanan = this;
    this.exportedFunctions = Object.create(null);
    this.wrappers = new Map();
    this.messageListener = this.messageListener.bind(this);
    this.isListening = false;
  }

  _createClass(_default, [{
    key: "destroy",
    value: function destroy() {
      this.stopListening();
      delete this.ctx.spanan;
    }
  }, {
    key: "registerWrapper",
    value: function registerWrapper(wrapper) {
      this.wrappers.set(wrapper.id, wrapper);
    }
  }, {
    key: "dispatchMessage",
    value: function dispatchMessage(ev) {
      var msg = undefined;

      if (typeof ev.data === "string" && ev.data.indexOf("spanan?") === 0) {
        var wrapperId = ev.data.split("?")[1];

        if (this.wrappers.has(wrapperId)) {
          this.wrappers.get(wrapperId).activate();
        } else {
          ev.source.postMessage(ev.data, "*");
        }
        return;
      }

      try {
        msg = JSON.parse(ev.data);
      } catch (e) {
        return false;
      }

      var isResponse = Boolean(msg.wrapperId) && Boolean(msg.transferId);

      if (isResponse) {
        var wrapper = this.wrappers.get(msg.wrapperId);

        if (wrapper) {
          wrapper.dispatchMessage(msg);
          return true;
        } else {
          return false;
        }
      } else if (msg.fnName && msg.fnArgs) {
        msg.source = ev.source;
        return this.dispatchCall(msg);
      } else {
        return false;
      }
    }
  }, {
    key: "dispatchCall",
    value: function dispatchCall(msg) {
      var exportedFunction = this.exportedFunctions[msg.fnName];

      if (!exportedFunction) {
        return false;
      }

      var value = exportedFunction.apply(null, msg.fnArgs);

      var valuePromise = value && value.then ? value : Promise.resolve(value);

      this.sendResponse(msg, valuePromise);

      return true;
    }
  }, {
    key: "sendResponse",
    value: function sendResponse(msg, valuePromise) {
      var responseTransfer = {
        transferId: msg.id,
        wrapperId: msg.wrapperId
      };

      valuePromise.then(function (value) {
        responseTransfer.response = value;

        var response = JSON.stringify(responseTransfer);

        msg.source.postMessage(response, "*");
      });
    }
  }, {
    key: "messageListener",
    value: function messageListener(ev) {
      this.dispatchMessage(ev);
    }
  }, {
    key: "startListening",
    value: function startListening() {
      if (!this.isListening) {
        this.ctx.addEventListener("message", this.messageListener);
        this.isListening = true;
      }
    }
  }, {
    key: "stopListening",
    value: function stopListening() {
      this.ctx.removeEventListener("message", this.messageListener);
      this.isListening = false;
    }
  }, {
    key: "export",
    value: function _export(functions) {
      this.startListening();
      this.exportedFunctions = functions;
    }
  }, {
    key: "import",
    value: function _import(target) {
      this.startListening();

      if (typeof target === "string") {
        target = this.constructor.createIframe(target);
      }

      var wrapper = new _wrapper2["default"](target);

      this.registerWrapper(wrapper);

      var handler = {
        get: function get(target, name) {
          return name in target ? target[name] : this.send(name);
        },

        send: function send(name) {
          return function () {
            return wrapper.send(name, arguments);
          };
        }
      };

      return new Proxy(wrapper, handler);
    }
  }], [{
    key: "createIframe",
    value: function createIframe(url) {
      var iframe = document.createElement("iframe");

      iframe.src = url;
      iframe.className = "spanan";
      iframe.style.display = "none";

      document.body.appendChild(iframe);

      return iframe;
    }
  }]);

  return _default;
})();

exports["default"] = _default;
module.exports = exports["default"];
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./wrapper":5}],2:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _facade = require("./facade");

var _facade2 = _interopRequireDefault(_facade);

new _facade2["default"]();
},{"./facade":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _uuid = require("./uuid");

var _uuid2 = _interopRequireDefault(_uuid);

var Transfer = (function () {
  function Transfer(fnName) {
    var fnArgs = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    _classCallCheck(this, Transfer);

    this.fnName = fnName;
    this.fnArgs = Array.prototype.slice.call(fnArgs);
    this.id = (0, _uuid2["default"])();
  }

  _createClass(Transfer, [{
    key: "toString",
    value: function toString() {
      return JSON.stringify(this);
    }
  }]);

  return Transfer;
})();

exports["default"] = Transfer;
module.exports = exports["default"];
},{"./uuid":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function () {
  // copied from http://stackoverflow.com/a/2117523
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};

module.exports = exports['default'];
},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _transfer = require("./transfer");

var _transfer2 = _interopRequireDefault(_transfer);

var _uuid = require("./uuid");

var _uuid2 = _interopRequireDefault(_uuid);

var loadingPromises = new WeakMap();

var _default = (function () {
  function _default(target) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, _default);

    this._isLoaded = false;
    this._callbacks = Object.create(null);
    this.timeout = options.timeout || 1000;
    this.id = (0, _uuid2["default"])();

    if (target instanceof HTMLElement && target.nodeName === "IFRAME") {
      this.iframe = target;
      this.target = target.contentWindow;
    } else {
      this.target = target;
    }
  }

  _createClass(_default, [{
    key: "send",
    value: function send(fnName, fnArgs) {
      var _this = this;

      var transfer = new _transfer2["default"](fnName, fnArgs),
          promise;

      transfer.wrapperId = this.id;

      promise = new Promise(function (resolve, reject) {
        var rejectTimeout = setTimeout(reject.bind(null, "timeout"), _this.timeout);

        _this.ready().then(function () {
          _this.target.postMessage(transfer.toString(), "*");

          _this._callbacks[transfer.id] = function () {
            clearTimeout(rejectTimeout);
            resolve.apply(null, arguments);
          };
        });
      });

      promise.transferId = transfer.id;

      return promise;
    }
  }, {
    key: "dispatchMessage",
    value: function dispatchMessage(response) {
      var transferId = response.transferId;
      if (transferId in this._callbacks) {
        this._callbacks[transferId].call(null, response.response);
        delete this._callbacks[transferId];
      }
    }
  }, {
    key: "activate",
    value: function activate() {
      this._callbacks[0]();
    }
  }, {
    key: "ready",
    value: function ready() {
      var _this2 = this;

      var loadingPromise = loadingPromises.get(this);

      if (!loadingPromise) {
        loadingPromise = new Promise(function (resolve) {
          var interval = undefined;
          _this2._callbacks[0] = function () {
            resolve();
            clearInterval(interval);
          };
          interval = setInterval(function () {
            _this2.target.postMessage("spanan?" + _this2.id, "*");
          }, 100);
        });

        loadingPromises.set(this, loadingPromise);
      }

      return loadingPromise;
    }
  }]);

  return _default;
})();

exports["default"] = _default;
module.exports = exports["default"];
},{"./transfer":3,"./uuid":4}]},{},[2])