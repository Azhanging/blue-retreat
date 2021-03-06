/*!
 * 
 * blue-retreat.js 1.0.3
 * (c) 2016-2021 Blue
 * Released under the MIT License.
 * https://github.com/azhanging/blue-retreat
 * time:Mon, 20 Dec 2021 15:01:18 GMT
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["BlueRetreat"] = factory();
	else
		root["BlueRetreat"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./static";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initBlueRetreat", function() { return initBlueRetreat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getExcludeState", function() { return getExcludeState; });
/* harmony import */ var _retreat_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setRetreatData", function() { return _retreat_data__WEBPACK_IMPORTED_MODULE_0__["setRetreatData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resetRetreatData", function() { return _retreat_data__WEBPACK_IMPORTED_MODULE_0__["resetRetreatData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCurrentRetreatData", function() { return _retreat_data__WEBPACK_IMPORTED_MODULE_0__["getCurrentRetreatData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getRetreatData", function() { return _retreat_data__WEBPACK_IMPORTED_MODULE_0__["getRetreatData"]; });



//mutation ?????????
var SET_KEEP_ALIVE_EXCLUDE = "SET_KEEP_ALIVE_EXCLUDE";
//vuex?????????
var STORE_MODULE_KEY = "KEEP_ALIVE";
//?????????????????????
var routerHistory = [];
//?????????popState???name???
var currentPopStateName = null;
//??????vue?????????router??????store
var store = null;
var router = null;
//?????????
var initBlueRetreat = (function () {
    var initStatus = false;
    return function (opts) {
        if (initStatus)
            return;
        var _router = opts.router, _store = opts.store;
        if (!(_router && _store)) {
            return console.log("blue-retreat init error,please required set Vue Router and Vuex in options");
        }
        //????????????????????????
        router = _router;
        store = _store;
        //????????????store
        storeRegisterModule();
        //??????afterEach
        setRouterHooks();
        //?????????????????????
        initStatus = true;
    };
})();
//???keep alive exclude???????????????store module
function storeRegisterModule() {
    var _a;
    store.registerModule(STORE_MODULE_KEY, {
        state: {
            exclude: [],
        },
        mutations: (_a = {},
            _a[SET_KEEP_ALIVE_EXCLUDE] = function (state, exclude) {
                state[STORE_MODULE_KEY] = exclude;
            },
            _a),
    });
}
//????????????????????????
function setRouterHooks() {
    //??????????????????
    router.beforeEach(function (to, from, next) {
        beforePushHistory({
            to: to,
            from: from,
            next: next,
        });
    });
    //????????????????????????
    router.afterEach(function () {
        setTimeout(function () {
            //??????history
            pushHistory();
        });
    });
}
//????????????popState????????????
function popStateEvent() {
    var popStateHandler = function (event) {
        if (!event.state) {
            event.state = {};
        }
        event.state.retreatData = Object(_retreat_data__WEBPACK_IMPORTED_MODULE_0__["getCurrentRetreatData"])();
        var key = event.state.key;
        var nextRouterHistory = queryHistoryByKey({
            key: key,
            type: "next",
        });
        var currentRouterHistory = queryHistoryByKey({
            key: key,
        });
        //??????popstate???name,??????????????????????????????history
        currentPopStateName = currentRouterHistory
            ? currentRouterHistory.name
            : null;
        //??????????????????????????????????????????????????????????????????????????????
        //?????????routerHistory????????????????????????????????????????????????????????????
        if (currentRouterHistory === null && routerHistory.length > 0) {
            nextRouterHistory = routerHistory[routerHistory.length - 1];
        }
        //???????????????????????????????????????????????????????????????history?????????????????????????????????
        if (nextRouterHistory) {
            var _a = nextRouterHistory, name_1 = _a.name, key_1 = _a.key;
            //??????store??????exclude state
            var exclude = getExcludeState();
            if (exclude.includes(name_1))
                return;
            exclude.push(name_1);
            //??????store
            setKeepAliveExclude(exclude);
            setTimeout(function () {
                var exclude = getExcludeState();
                var index = exclude.indexOf(name_1);
                if (index !== -1) {
                    exclude.splice(index, 1);
                }
                //??????store
                setKeepAliveExclude(exclude);
                //???????????????index
                var historyIndex = queryHistoryByKey({
                    key: key_1,
                    findIndex: true,
                });
                //??????????????????
                if (historyIndex !== -1) {
                    routerHistory.splice(historyIndex, 1);
                }
            }, 50);
        }
    };
    window.addEventListener("popstate", popStateHandler);
}
//??????popstate????????????
popStateEvent();
//?????????????????????
function beforePushHistory(opts) {
    var to = opts.to, from = opts.from, next = opts.next;
    var meta = to.meta;
    var name = meta.name;
    //?????????????????????popstate????????????????????????????????????
    if (name === currentPopStateName)
        return next();
    currentPopStateName = null;
    //?????????????????????????????????????????????????????????????????????????????????
    var findHistory = queryHistoryByName({ name: name });
    //??????????????????????????????????????????????????????
    if (findHistory.length === 0)
        return next();
    //??????store??????exclude state
    var exclude = getExcludeState();
    if (!exclude.includes(name)) {
        //??????????????????name
        exclude.push(name);
        //??????store
        setKeepAliveExclude(exclude);
        //??????????????????????????????
        setTimeout(function () {
            //??????store??????exclude state
            var exclude = getExcludeState();
            var index = exclude.indexOf(name);
            if (index !== -1) {
                exclude.splice(index, 1);
            }
            //??????store
            setKeepAliveExclude(exclude);
            //??????????????????
            removeHistoryByName({ name: name });
            //????????????
            next();
        });
    }
    else {
        //????????????
        next();
    }
}
//??????store
function setKeepAliveExclude(exclude) {
    store.commit(SET_KEEP_ALIVE_EXCLUDE, Object.assign([], exclude));
}
//???????????????????????????????????????key??????
function pushHistory() {
    var key = history.state.key;
    if (!router || !key)
        return;
    var currentRouterHistory = queryHistoryByKey({ key: key });
    if (currentRouterHistory)
        return;
    var currentRoute = router.currentRoute;
    var meta = currentRoute.meta;
    var name = meta.name;
    if (!name)
        return;
    //????????????
    routerHistory.push({
        //state.key
        key: key,
        //?????????name
        name: name,
        //???????????????????????????
        time: +new Date(),
    });
}
//??????????????????
function removeHistoryByName(opts) {
    var name = opts.name;
    var findHistory = queryHistoryByName({
        name: name,
    });
    while (findHistory.length) {
        var index = routerHistory.indexOf(findHistory[findHistory.length - 1]);
        routerHistory.splice(index, 1);
        findHistory.pop();
    }
}
//??????key????????????
function queryHistoryByKey(opts) {
    if (opts === void 0) { opts = {}; }
    var 
    /*current next*/
    _a = opts.type, 
    /*current next*/
    type = _a === void 0 ? "current" : _a, _b = opts.findIndex, findIndex = _b === void 0 ? false : _b, key = opts.key;
    for (var index = 0; index < routerHistory.length; index++) {
        var currentRouterHistory = routerHistory[index];
        var nextRouterHistory = routerHistory[index + 1];
        if (currentRouterHistory.key === key &&
            type === "next" &&
            nextRouterHistory) {
            if (findIndex)
                return index;
            return nextRouterHistory;
        }
        else if (currentRouterHistory.key === key && type === "current") {
            if (findIndex)
                return index;
            return currentRouterHistory;
        }
    }
    if (findIndex)
        return -1;
    return null;
}
//??????name?????????????????? ???????????????router afterEach??????
function queryHistoryByName(opts) {
    if (opts === void 0) { opts = {}; }
    var name = opts.name;
    var findHistory = [];
    if (!name)
        return findHistory;
    routerHistory.forEach(function (history) {
        if (history.name !== name)
            return;
        findHistory.push(history);
    });
    return findHistory;
}
//??????store module keep alive
function getExcludeState() {
    var state = store.state;
    return state[STORE_MODULE_KEY].exclude || [];
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setRetreatData", function() { return setRetreatData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetRetreatData", function() { return resetRetreatData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentRetreatData", function() { return getCurrentRetreatData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRetreatData", function() { return getRetreatData; });
//?????????????????????
var retreatData = {};
//????????????????????????
function setRetreatData(_retreatData) {
    retreatData = _retreatData;
}
//??????????????????
function resetRetreatData() {
    retreatData = {};
}
//???????????????????????????
function getCurrentRetreatData() {
    return retreatData;
}
//??????????????????
function getRetreatData(opts) {
    if (opts === void 0) { opts = {}; }
    var 
    //??????????????????
    _a = opts.once, 
    //??????????????????
    once = _a === void 0 ? true : _a;
    var current = retreatData;
    //??????????????????????????????????????????
    once && resetRetreatData();
    return current;
}


/***/ })
/******/ ]);
});
//# sourceMappingURL=blue-retreat.js.map