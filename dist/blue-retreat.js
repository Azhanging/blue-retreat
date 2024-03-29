/*!
 * 
 * blue-retreat.js 1.0.6
 * (c) 2016-2022 Blue
 * Released under the MIT License.
 * https://github.com/azhanging/blue-retreat
 * time:Wed, 14 Sep 2022 16:23:54 GMT
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defineBlueRetreat", function() { return defineBlueRetreat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getExcludeState", function() { return getExcludeState; });
/* harmony import */ var _retreat_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setRetreatData", function() { return _retreat_data__WEBPACK_IMPORTED_MODULE_0__["setRetreatData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resetRetreatData", function() { return _retreat_data__WEBPACK_IMPORTED_MODULE_0__["resetRetreatData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCurrentRetreatData", function() { return _retreat_data__WEBPACK_IMPORTED_MODULE_0__["getCurrentRetreatData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getRetreatData", function() { return _retreat_data__WEBPACK_IMPORTED_MODULE_0__["getRetreatData"]; });






/*
  一层 || 多层 实际占用一条历史记录
  路由进入时，先会排除原有记录上的所有
*/
//下一跳的延迟处理
var TICKET_TIME = 50;
//路由的历史记录
var routerHistory = [];
//当前的popState的name值
var currentPopStateName = null;
//配置vue|pinia相关的router以及store
var store = null;
var router = null;
//初始化
//如果使用的是pinia，需要在createPinia()后使用当前进行初始化配置
var defineBlueRetreat = (function () {
    var defineStatus = false;
    return function (opts) {
        if (defineStatus)
            return;
        var _router = opts.router, _store = opts.store;
        if (!(_router && _store)) {
            return console.log("blue-retreat init error,please required set Vue Router and (Vuex|Pinia) in options");
        }
        //设置相关配置信息
        router = _router;
        //动态注册store
        store = _store__WEBPACK_IMPORTED_MODULE_3__["storeRegister"](_store);
        //设置afterEach
        setRouterHooks();
        //设置初始化状态
        defineStatus = true;
    };
})();
//设置路由钩子状态
function setRouterHooks() {
    //路由进前处理
    router.beforeEach(function (to, from, next) {
        beforeRouterHook({
            to: to,
            from: from,
            next: next,
        });
    });
    //路由进入后的处理
    router.afterEach(function () {
        setTimeout(function () {
            //写入history
            afterRouterHook();
        }, TICKET_TIME);
    });
}
//注册处理popState事件处理
function popStateEvent() {
    //这里的类型
    var popStateHandler = function (event) {
        if (!event.state) {
            event.state = {};
        }
        //后退写入数据
        event.state.retreatData = Object(_retreat_data__WEBPACK_IMPORTED_MODULE_0__["getCurrentRetreatData"])();
        var state = event.state;
        var key = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getStateKey"])(state);
        //通过key查询当前的路由记录
        var currentRouterHistory = queryHistoryByKey({
            key: key,
        });
        //查找当前记录的下一个路由,后退前的路由记录
        var nextRouterHistory = queryHistoryByKey({
            key: key,
            type: "next",
        });
        //记录popstate的name,这里可能是被销毁过的history
        currentPopStateName = currentRouterHistory
            ? currentRouterHistory.name
            : null;
        //这种在routerHistory是不存在的，这里需要移除最后一个路由缓存
        //由于一级多层级的都只存在一条历史记录，这里后退的过程中找不到对于之前层级的记录了，
        //这里将最后一条记录当作当作前记录来处理
        if (currentRouterHistory === null && routerHistory.length > 0) {
            nextRouterHistory = routerHistory[routerHistory.length - 1];
        }
        //如果当前页的下一个页面（后退回来的页面）在history中有记录，这里清空缓存
        if (nextRouterHistory) {
            var _a = nextRouterHistory, name_1 = _a.name, key_1 = _a.key;
            //获取store中的exclude state
            var exclude = getExcludeState();
            //写入到排除记录
            exclude.push(name_1);
            //设置store
            setExcludeState(exclude);
            //下一宏任务处理
            setTimeout(function () {
                //设置store
                setExcludeState([]);
                //通过key删除历史记录
                removeHistoryByKey(key_1);
            }, TICKET_TIME);
        }
    };
    //注册内置popstate事件，监听后腿时的处理
    window.addEventListener("popstate", popStateHandler);
}
//注册popstate事件处理
popStateEvent();
//再历史中查找name相关的的name，记录到最长的链路
function filterMatchedRouteNamesInHistory(name) {
    var historyRouteName = [];
    routerHistory.forEach(function (history) {
        var matchedNames = history.matchedNames;
        if (matchedNames.includes(name)) {
            matchedNames.forEach(function (routeName) {
                if (historyRouteName.includes(routeName))
                    return;
                historyRouteName.push(routeName);
            });
        }
    });
    return historyRouteName;
}
//进入路由前处理
//这里多为处理回环路由的状态
function beforeRouterHook(opts) {
    var to = opts.to, next = opts.next;
    //获取来源路由的名称
    var name = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getRouteName"])(to);
    //如果当前是通过popstate触发的，不进行缓存的处理
    if (name === currentPopStateName) {
        currentPopStateName = null;
        return next();
    }
    currentPopStateName = null;
    //匹配的路由链路名
    var matchedRouteNames = (function () {
        //访问的路由链路
        var matchedRouteNames = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getRouteMatchedNames"])(to);
        //从历史记录中查找当前name的是否存在的多级的路由链路，
        //如果存在多级链路，比访问的链路更大，这里将会排除最大的访问链路
        //这里的处理将会尝试一级路由和多级路由只会占用一条历史记录
        var historyMatchedRouteNames = filterMatchedRouteNamesInHistory(name);
        if (historyMatchedRouteNames.length > matchedRouteNames.length) {
            return historyMatchedRouteNames;
        }
        return matchedRouteNames;
    })();
    //获取store中的exclude state
    var exclude = getExcludeState();
    //排除链路上name
    exclude.push.apply(exclude, matchedRouteNames);
    //设置store
    setExcludeState(exclude);
    //下一跳移除对应的规则
    setTimeout(function () {
        //设置store
        setExcludeState([]);
        //删除排除路由名
        removeHistoryByName(matchedRouteNames);
        //完成处理
        next();
    }, TICKET_TIME);
}
//路由访问的时候，加入对应的key处理
function afterRouterHook() {
    var state = history.state;
    //使用定位信息处理
    var key = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getStateKey"])(state);
    if (!router || (!key && key !== 0))
        return;
    var currentRouterHistory = queryHistoryByKey({ key: key });
    if (currentRouterHistory)
        return;
    var currentRoute = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["unref"])(router.currentRoute);
    //当前路由name
    var name = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getRouteName"])(currentRoute);
    //路由链路name
    var routeMatchedNames = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getRouteMatchedNames"])(currentRoute);
    if (!name)
        return;
    //写入历史
    routerHistory.push({
        //state.key
        key: key,
        //组件的name
        name: name,
        //匹配的路由链路名
        matchedNames: routeMatchedNames,
    });
}
//设置store
function setExcludeState(exclude) {
    var _exclude = Object.assign([], exclude);
    if (_store__WEBPACK_IMPORTED_MODULE_3__["isPinia"]) {
        store.exclude = _exclude;
    }
    else if (_store__WEBPACK_IMPORTED_MODULE_3__["isVuex"]) {
        store.commit(_const__WEBPACK_IMPORTED_MODULE_2__["SET_KEEP_ALIVE_EXCLUDE"], _exclude);
    }
}
//删除历史记录
function removeHistoryByName(name) {
    function handler(name) {
        var findHistory = queryHistoryByName({
            name: name,
        });
        while (findHistory.length) {
            var lastIndex = findHistory.length - 1;
            var index = routerHistory.indexOf(findHistory[lastIndex]);
            routerHistory.splice(index, 1);
            findHistory.pop();
        }
    }
    if (typeof name === "string") {
        handler(name);
    }
    else if (name instanceof Array) {
        name.forEach(function (routeName) {
            handler(routeName);
        });
    }
}
//通过key删除历史记录
function removeHistoryByKey(key) {
    //再历史中的index
    var historyIndex = queryHistoryByKey({
        key: key,
        findIndex: true,
    });
    //这里删除排序
    if (historyIndex !== -1) {
        routerHistory.splice(historyIndex, 1);
    }
}
//通过key查询历史,
//查询key记录的索引
function queryHistoryByKey(opts) {
    if (opts === void 0) { opts = {}; }
    var _a = opts.type, type = _a === void 0 ? "current" : _a, _b = opts.findIndex, findIndex = _b === void 0 ? false : _b, key = opts.key;
    for (var index = 0; index < routerHistory.length; index++) {
        var currentRouterHistory = routerHistory[index];
        var nextRouterHistory = routerHistory[index + 1];
        if (currentRouterHistory.key === key &&
            type === "next" &&
            nextRouterHistory) {
            if (findIndex)
                return index + 1;
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
        if (_store__WEBPACK_IMPORTED_MODULE_3__["isPinia"]) {
            return store.exclude || exclude;
        }
        else if (_store__WEBPACK_IMPORTED_MODULE_3__["isVuex"]) {
            //Vuex处理
            return store.state[_const__WEBPACK_IMPORTED_MODULE_2__["STORE_MODULE_NAME"]].exclude || exclude;
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


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unref", function() { return unref; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStateKey", function() { return getStateKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRouteName", function() { return getRouteName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRouteMatchedNames", function() { return getRouteMatchedNames; });
//针对vue3 ref处理
function isRef(ref) {
    return ref.__v_isRef;
}
//针对vue3 ref处理
function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
//获取状态
function getStateKey(state) {
    return state.key || state.position || "";
}
//获取路由name
function getRouteName(to) {
    var _a = to.meta, meta = _a === void 0 ? {} : _a;
    return meta.name || to.name || "";
}
//获取路由匹配名
function getRouteMatchedNames(to) {
    return to.matched.map(function (route) { return route.name || (route.meta && route.meta.name) || ""; });
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_KEEP_ALIVE_EXCLUDE", function() { return SET_KEEP_ALIVE_EXCLUDE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "STORE_MODULE_NAME", function() { return STORE_MODULE_NAME; });
//mutation 方法名
var SET_KEEP_ALIVE_EXCLUDE = "SET_KEEP_ALIVE_EXCLUDE";
//模块名 || store id
var STORE_MODULE_NAME = "KEEP_ALIVE";


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPinia", function() { return isPinia; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isVuex", function() { return isVuex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "storeRegister", function() { return storeRegister; });
/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

//实际的存储环境
var isPinia = false;
var isVuex = false;
//把keep alive exclude状态处理在store module
//需要createPinia()后使用当前
function storeRegister(store) {
    //对于pinia的处理 这里处理pinia的定义
    //Pinia的传入defineStore来构建
    if (typeof store === "function") {
        return piniaStore(store);
    }
    else {
        return vuexStore(store);
    }
}
//Pinia store
function piniaStore(store) {
    var useRetreatStore = store(_const__WEBPACK_IMPORTED_MODULE_0__["STORE_MODULE_NAME"], {
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
        console.error("store is not Pinia");
    }
    else {
        //存储库判断
        isPinia = true;
    }
    return store;
}
//vuex store
function vuexStore(store) {
    var _a;
    //对于vuex的处理
    store.registerModule(_const__WEBPACK_IMPORTED_MODULE_0__["STORE_MODULE_NAME"], {
        state: {
            exclude: [],
        },
        mutations: (_a = {},
            _a[_const__WEBPACK_IMPORTED_MODULE_0__["SET_KEEP_ALIVE_EXCLUDE"]] = function (state, exclude) {
                state.exclude = exclude;
            },
            _a),
    });
    //存储库判断
    isVuex = true;
    return store;
}


/***/ })
/******/ ]);
});
//# sourceMappingURL=blue-retreat.js.map