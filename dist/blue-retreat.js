/*!
 * 
 * blue-retreat.js 1.0.2
 * (c) 2016-2021 Blue
 * Released under the MIT License.
 * https://github.com/azhanging/blue-retreat
 * time:Sun, 28 Nov 2021 06:17:58 GMT
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("blue-utils"));
	else if(typeof define === 'function' && define.amd)
		define(["blue-utils"], factory);
	else if(typeof exports === 'object')
		exports["BlueRetreat"] = factory(require("blue-utils"));
	else
		root["BlueRetreat"] = factory(root["blueUtils"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE__1__) {
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
/* harmony import */ var blue_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var blue_utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(blue_utils__WEBPACK_IMPORTED_MODULE_0__);

var context = null;
var SET_KEEP_ALIVE_EXCLUDE = "SET_KEEP_ALIVE_EXCLUDE";
var STORE_MODULE_KEY = "KEEP_ALIVE";
//把keep alive exclude状态处理在store module
function storeRegisterModule() {
    var _a;
    this.store.registerModule(STORE_MODULE_KEY, {
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
//设置路由钩子状态
function setRouterHooks() {
    var _this = this;
    var router = this.router;
    //路由进前处理
    router.beforeEach(function (to, from, next) {
        beforePushHistory.call(_this, {
            to: to,
            from: from,
            next: next,
        });
    });
    //路由进入后的处理
    router.afterEach(function () {
        setTimeout(function () {
            //写入history
            pushHistory.call(_this);
        });
    });
}
//注册处理popState事件处理
function popStateEvent() {
    var popStateHandler = function (event) {
        if (!context)
            return;
        var history = context.history;
        var key = event.state.key;
        var nextHistory = queryHistoryByKey.call(context, {
            key: key,
            type: "next",
        });
        var currentHistory = queryHistoryByKey.call(context, {
            key: key,
        });
        //记录popstate的name,这里可能是被销毁过的history
        context.currentPopStateName = currentHistory ? currentHistory.name : null;
        //如果当前页的下一个页面（后退回来的页面）在history中有记录，这里清空缓存
        if (nextHistory && history.indexOf(nextHistory.key)) {
            var name_1 = nextHistory.name, key_1 = nextHistory.key;
            //获取store中的exclude state
            var exclude = context.getExcludeState();
            if (exclude.includes(name_1))
                return;
            exclude.push(name_1);
            //设置store
            setKeepAliveExclude.call(context, exclude);
            setTimeout(function () {
                var exclude = context.getExcludeState();
                var index = exclude.indexOf(name_1);
                if (index !== -1) {
                    exclude.splice(index, 1);
                }
                //设置store
                setKeepAliveExclude.call(context, exclude);
                //再历史中的index
                var historyIndex = queryHistoryByKey.call(context, {
                    key: key_1,
                    findIndex: true,
                });
                //这里删除排序
                if (historyIndex !== -1) {
                    history.splice(historyIndex, 1);
                }
            }, 50);
        }
    };
    var event = "popstate";
    window.addEventListener(event, popStateHandler);
    return function () {
        window.removeEventListener(event, popStateHandler);
    };
}
//进入路由前处理
function beforePushHistory(opts) {
    var _this = this;
    var to = opts.to, from = opts.from, next = opts.next;
    var meta = to.meta;
    var name = meta.name;
    //如果当前是通过popstate触发的，不进行缓存的处理
    if (name === this.currentPopStateName)
        return next();
    this.currentPopStateName = null;
    //找一下之前历史是否存在相同的缓存（回环访问的那种情况）
    var findHistory = queryHistoryByName.call(this, { name: name });
    //如果之前存在缓存了，先杀掉之前的缓存
    if (findHistory.length === 0)
        return next();
    //获取store中的exclude state
    var exclude = this.getExcludeState();
    if (!exclude.includes(name)) {
        //写入排除缓存name
        exclude.push(name);
        //设置store
        setKeepAliveExclude.call(this, exclude);
        //下一跳移除对应的规则
        setTimeout(function () {
            //获取store中的exclude state
            var exclude = _this.getExcludeState();
            var index = exclude.indexOf(name);
            if (index !== -1) {
                exclude.splice(index, 1);
            }
            //设置store
            setKeepAliveExclude.call(_this, exclude);
            //删除历史记录
            removeHistoryByName.call(_this, { name: name });
            //完成处理
            next();
        });
    }
    else {
        //完成处理
        next();
    }
}
//设置store
function setKeepAliveExclude(exclude) {
    this.store.commit(SET_KEEP_ALIVE_EXCLUDE, blue_utils__WEBPACK_IMPORTED_MODULE_0___default.a.deepCopy(exclude));
}
//路由访问的时候，加入对应的key处理
function pushHistory() {
    var key = history.state.key;
    if (!this.router || !key)
        return;
    var currentHistory = queryHistoryByKey.call(this, { key: key });
    if (currentHistory)
        return;
    var currentRoute = this.router.currentRoute;
    var meta = currentRoute.meta;
    var name = meta.name;
    if (!name)
        return;
    //写入历史
    this.history.push({
        //state.key
        key: key,
        //组件的name
        name: name,
        //这里是记录加入时间
        time: +new Date(),
    });
}
//删除历史记录
function removeHistoryByName(opts) {
    var name = opts.name;
    var history = this.history;
    var findHistory = queryHistoryByName.call(this, {
        name: name,
    });
    while (findHistory.length) {
        var index = history.indexOf(findHistory[findHistory.length - 1]);
        history.splice(index, 1);
        findHistory.pop();
    }
}
//通过key查询历史
function queryHistoryByKey(opts) {
    if (opts === void 0) { opts = {}; }
    var history = this.history;
    var 
    /*current next*/
    _a = opts.type, 
    /*current next*/
    type = _a === void 0 ? "current" : _a, _b = opts.findIndex, findIndex = _b === void 0 ? false : _b, key = opts.key;
    for (var index = 0; index < history.length; index++) {
        var currentHistory = history[index];
        var nextHistory = history[index + 1];
        if (currentHistory.key === key && type === "next" && nextHistory) {
            if (findIndex)
                return index;
            return nextHistory;
        }
        else if (currentHistory.key === key && type === "current") {
            if (findIndex)
                return index;
            return currentHistory;
        }
    }
    if (findIndex)
        return -1;
    return null;
}
//通过name查询历史记录 这里提供给router afterEach使用
function queryHistoryByName(opts) {
    if (opts === void 0) { opts = {}; }
    var name = opts.name;
    var findHistory = [];
    if (!name)
        return findHistory;
    var history = this.history;
    history.forEach(function (_history) {
        if (_history.name !== name)
            return;
        findHistory.push(_history);
    });
    return findHistory;
}
//注册popstate事件处理
popStateEvent();
var BlueRetreat = /** @class */ (function () {
    function BlueRetreat(options) {
        if (context)
            return context;
        this.options = blue_utils__WEBPACK_IMPORTED_MODULE_0___default.a.extend({
            router: null,
            store: null,
        }, options);
        //单例
        context = this;
        //历史记录存储
        this.history = [];
        //vue-router 相关的路由
        this.router = options.router;
        //Vuex相关
        this.store = options.store;
        //记录当前popstate触发的key
        this.currentPopStateName = null;
        //动态注册store
        storeRegisterModule.call(this);
        //设置afterEach
        setRouterHooks.call(this);
    }
    //获取store module keep alive
    BlueRetreat.prototype.getExcludeState = function () {
        var state = this.store.state;
        return state[STORE_MODULE_KEY].exclude || [];
    };
    return BlueRetreat;
}());
/* harmony default export */ __webpack_exports__["default"] = (BlueRetreat);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=blue-retreat.js.map