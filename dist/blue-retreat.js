/*!
 * 
 * blue-retreat.js 1.0.3
 * (c) 2016-2022 Blue
 * Released under the MIT License.
 * https://github.com/azhanging/blue-retreat
 * time:Mon, 29 Aug 2022 16:40:07 GMT
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



//mutation 方法名
var SET_KEEP_ALIVE_EXCLUDE = "SET_KEEP_ALIVE_EXCLUDE";
//vuex模块名
var STORE_MODULE_KEY = "KEEP_ALIVE";
//路由的历史记录
var routerHistory = [];
//当前的popState的name值
var currentPopStateName = null;
//配置vue|pinia相关的router以及store
var store = null;
var router = null;
//实际的存储环境
var isPinia = false;
var isVuex = false;
//针对vue3 ref处理
function isRef(ref) {
    return ref.__v_isRef;
}
//针对vue3 ref处理
function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
//初始化
//如果使用的是pinia，需要在createPinia()后使用当前进行初始化配置
var initBlueRetreat = (function () {
    var initStatus = false;
    return function (opts) {
        if (initStatus)
            return;
        var _router = opts.router, _store = opts.store;
        if (!(_router && _store)) {
            return console.log("blue-retreat init error,please required set Vue Router and (Vuex|Pinia) in options");
        }
        //设置相关配置信息
        router = _router;
        store = _store;
        //动态注册store
        storeRegister();
        //设置afterEach
        setRouterHooks();
        //设置初始化状态
        initStatus = true;
    };
})();
//把keep alive exclude状态处理在store module
//需要createPinia()后使用当前
function storeRegister() {
    //对于pinia的处理 这里处理pinia的定义
    //Pinia的传入defineStore来构建
    if (typeof store === "function") {
        piniaStore();
    }
    else {
        vuexStore();
    }
}
//Pinia store
function piniaStore() {
    var useRetreatStore = store(STORE_MODULE_KEY, {
        state: function () { return ({
            //排除数据
            exclude: [],
        }); },
    });
    //获取store的实例
    store = useRetreatStore();
    //判断是否为pinia特性
    if (!store || !store.$id) {
        store = null;
        new Error("store is not Pinia");
    }
    else {
        //存储库判断
        isPinia = true;
    }
}
//vuex store
function vuexStore() {
    var _a;
    //对于vuex的处理
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
    //存储库判断
    isVuex = true;
}
//设置路由钩子状态
function setRouterHooks() {
    //路由进前处理
    router.beforeEach(function (to, from, next) {
        beforePushHistory({
            to: to,
            from: from,
            next: next,
        });
    });
    //路由进入后的处理
    router.afterEach(function () {
        setTimeout(function () {
            //写入history
            pushHistory();
        });
    });
}
//注册处理popState事件处理
function popStateEvent() {
    var popStateHandler = function (event) {
        if (!event.state) {
            event.state = {};
        }
        event.state.retreatData = Object(_retreat_data__WEBPACK_IMPORTED_MODULE_0__["getCurrentRetreatData"])();
        var state = event.state;
        var key = state.key || state.position;
        var nextRouterHistory = queryHistoryByKey({
            key: key,
            type: "next",
        });
        var currentRouterHistory = queryHistoryByKey({
            key: key,
        });
        //记录popstate的name,这里可能是被销毁过的history
        currentPopStateName = currentRouterHistory
            ? currentRouterHistory.name
            : null;
        //如果是那种回环访问，当前的页面是后退回来产生的新页面
        //这种在routerHistory是不存在的，这里需要移除最后一个路由缓存
        if (currentRouterHistory === null && routerHistory.length > 0) {
            nextRouterHistory = routerHistory[routerHistory.length - 1];
        }
        //如果当前页的下一个页面（后退回来的页面）在history中有记录，这里清空缓存
        if (nextRouterHistory) {
            var _a = nextRouterHistory, name_1 = _a.name, key_1 = _a.key;
            //获取store中的exclude state
            var exclude = getExcludeState();
            if (exclude.includes(name_1))
                return;
            exclude.push(name_1);
            //设置store
            setKeepAliveExclude(exclude);
            setTimeout(function () {
                var exclude = getExcludeState();
                var index = exclude.indexOf(name_1);
                if (index !== -1) {
                    exclude.splice(index, 1);
                }
                //设置store
                setKeepAliveExclude(exclude);
                //再历史中的index
                var historyIndex = queryHistoryByKey({
                    key: key_1,
                    findIndex: true,
                });
                //这里删除排序
                if (historyIndex !== -1) {
                    routerHistory.splice(historyIndex, 1);
                }
            }, 50);
        }
    };
    window.addEventListener("popstate", popStateHandler);
}
//注册popstate事件处理
popStateEvent();
//进入路由前处理
function beforePushHistory(opts) {
    var to = opts.to, from = opts.from, next = opts.next;
    var meta = to.meta;
    var name = meta.name;
    //如果当前是通过popstate触发的，不进行缓存的处理
    if (name === currentPopStateName)
        return next();
    currentPopStateName = null;
    //找一下之前历史是否存在相同的缓存（回环访问的那种情况）
    var findHistory = queryHistoryByName({ name: name });
    //如果之前存在缓存了，先杀掉之前的缓存
    if (findHistory.length === 0)
        return next();
    //获取store中的exclude state
    var exclude = getExcludeState();
    if (!exclude.includes(name)) {
        //写入排除缓存name
        exclude.push(name);
        //设置store
        setKeepAliveExclude(exclude);
        //下一跳移除对应的规则
        setTimeout(function () {
            //获取store中的exclude state
            var exclude = getExcludeState();
            var index = exclude.indexOf(name);
            if (index !== -1) {
                exclude.splice(index, 1);
            }
            //设置store
            setKeepAliveExclude(exclude);
            //删除历史记录
            removeHistoryByName({ name: name });
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
    var _exclude = Object.assign([], exclude);
    if (isPinia) {
        store.exclude = _exclude;
    }
    else {
        store.commit(SET_KEEP_ALIVE_EXCLUDE, _exclude);
    }
}
//路由访问的时候，加入对应的key处理
function pushHistory() {
    var state = history.state;
    var key = state.key || state.position;
    if (!router || !key)
        return;
    var currentRouterHistory = queryHistoryByKey({ key: key });
    if (currentRouterHistory)
        return;
    var currentRoute = router.currentRoute;
    var meta = unref(currentRoute).meta;
    var name = meta.name;
    if (!name)
        return;
    //写入历史
    routerHistory.push({
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
    var findHistory = queryHistoryByName({
        name: name,
    });
    while (findHistory.length) {
        var index = routerHistory.indexOf(findHistory[findHistory.length - 1]);
        routerHistory.splice(index, 1);
        findHistory.pop();
    }
}
//通过key查询历史
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
//通过name查询历史记录 这里提供给router afterEach使用
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
//获取store module keep alive
function getExcludeState() {
    var exclude = [];
    //不存在
    if (store) {
        //pinia处理
        if (isPinia) {
            return store.exclude || exclude;
        }
        else if (isVuex) {
            //Vuex处理
            return store.state[STORE_MODULE_KEY].exclude || exclude;
        }
    }
    return exclude;
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
//需要撤退的数据
var retreatData = {};
//设置需要传递数据
function setRetreatData(_retreatData) {
    retreatData = _retreatData;
}
//清空传递数据
function resetRetreatData() {
    retreatData = {};
}
//获取当前的撤退数据
function getCurrentRetreatData() {
    return retreatData;
}
//获取传递数据
function getRetreatData(opts) {
    if (opts === void 0) { opts = {}; }
    var 
    //只会使用一次
    _a = opts.once, 
    //只会使用一次
    once = _a === void 0 ? true : _a;
    var current = retreatData;
    //只会使用一次，清空原有的数据
    once && resetRetreatData();
    return current;
}


/***/ })
/******/ ]);
});
//# sourceMappingURL=blue-retreat.js.map