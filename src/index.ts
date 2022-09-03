import type {
  TStateKey,
  TRouterHistory,
  TRouterTo,
  TRouterFrom,
  TRouterNext,
  THistoryState,
  TStore,
  TRouter,
  TRouteNames,
  TRouterHookOptions,
} from "./types";
import { getCurrentRetreatData } from "./retreat-data";
import {
  unref,
  getStateKey,
  getRouteName,
  getRouteMatchedNames,
} from "./utils";
import { SET_KEEP_ALIVE_EXCLUDE, STORE_MODULE_NAME } from "./const";
import * as storeModule from "./store";
export * from "./retreat-data";
/* 
  一层 || 多层 实际占用一条历史记录
  路由进入时，先会排除原有记录上的所有
*/

//下一跳的延迟处理
const TICKET_TIME = 50;

//路由的历史记录
let routerHistory: TRouterHistory[] = [];

//当前的popState的name值
let currentPopStateName: string | null = null;

//配置vue|pinia相关的router以及store
let store: TStore = null;
let router: TRouter = null;

//初始化
//如果使用的是pinia，需要在createPinia()后使用当前进行初始化配置
export const defineBlueRetreat = (() => {
  let defineStatus = false;
  return (opts: { router: TRouter; store: TStore }) => {
    if (defineStatus) return;
    let { router: _router, store: _store } = opts;
    if (!(_router && _store)) {
      return console.log(
        `blue-retreat init error,please required set Vue Router and (Vuex|Pinia) in options`
      );
    }
    //设置相关配置信息
    router = _router;
    //动态注册store
    store = storeModule.storeRegister(_store);
    //设置afterEach
    setRouterHooks();
    //设置初始化状态
    defineStatus = true;
  };
})();

//设置路由钩子状态
function setRouterHooks() {
  //路由进前处理
  router.beforeEach((to: TRouterTo, from: TRouterFrom, next: TRouterNext) => {
    beforeRouterHook({
      to,
      from,
      next,
    });
  });
  //路由进入后的处理
  router.afterEach(() => {
    setTimeout(() => {
      //写入history
      afterRouterHook();
    }, TICKET_TIME);
  });
}

//注册处理popState事件处理
function popStateEvent() {
  //这里的类型
  const popStateHandler = (event: any) => {
    if (!event.state) {
      event.state = {};
    }
    //后退写入数据
    event.state.retreatData = getCurrentRetreatData();
    const state: THistoryState = event.state;
    const key = getStateKey(state);

    //通过key查询当前的路由记录
    const currentRouterHistory = queryHistoryByKey({
      key,
    });

    //查找当前记录的下一个路由,后退前的路由记录
    let nextRouterHistory = queryHistoryByKey({
      key,
      type: `next`,
    });

    //记录popstate的name,这里可能是被销毁过的history
    currentPopStateName = currentRouterHistory
      ? (currentRouterHistory as TRouterHistory).name
      : null;

    //这种在routerHistory是不存在的，这里需要移除最后一个路由缓存
    //由于一级多层级的都只存在一条历史记录，这里后退的过程中找不到对于之前层级的记录了，
    //这里将最后一条记录当作当作前记录来处理
    if (currentRouterHistory === null && routerHistory.length > 0) {
      nextRouterHistory = routerHistory[routerHistory.length - 1];
    }

    //如果当前页的下一个页面（后退回来的页面）在history中有记录，这里清空缓存
    if (nextRouterHistory) {
      const { name, key } = nextRouterHistory as TRouterHistory;
      //获取store中的exclude state
      const exclude = getExcludeState();
      //写入到排除记录
      exclude.push(name);
      //设置store
      setExcludeState(exclude);
      //下一宏任务处理
      setTimeout(() => {
        //设置store
        setExcludeState([]);
        //通过key删除历史记录
        removeHistoryByKey(key);
      }, TICKET_TIME);
    }
  };
  //注册内置popstate事件，监听后腿时的处理
  window.addEventListener(`popstate`, popStateHandler);
}

//注册popstate事件处理
popStateEvent();

//再历史中查找name相关的的name，记录到最长的链路
function filterMatchedRouteNamesInHistory(name: string): TRouteNames {
  const historyRouteName: TRouteNames = [];
  routerHistory.forEach((history: TRouterHistory) => {
    const { matchedNames } = history;
    if (matchedNames.includes(name)) {
      matchedNames.forEach((routeName) => {
        if (historyRouteName.includes(routeName)) return;
        historyRouteName.push(routeName);
      });
    }
  });
  return historyRouteName;
}

//进入路由前处理
//这里多为处理回环路由的状态
function beforeRouterHook(opts: TRouterHookOptions): void {
  const { to, next } = opts;
  //获取来源路由的名称
  const name: string = getRouteName(to);
  //如果当前是通过popstate触发的，不进行缓存的处理
  if (name === currentPopStateName) {
    currentPopStateName = null;
    return next();
  }
  currentPopStateName = null;
  //匹配的路由链路名
  let matchedRouteNames: TRouteNames = (() => {
    //访问的路由链路
    const matchedRouteNames = getRouteMatchedNames(to);
    //从历史记录中查找当前name的是否存在的多级的路由链路，
    //如果存在多级链路，比访问的链路更大，这里将会排除最大的访问链路
    //这里的处理将会尝试一级路由和多级路由只会占用一条历史记录
    const historyMatchedRouteNames = filterMatchedRouteNamesInHistory(name);
    if (historyMatchedRouteNames.length > matchedRouteNames.length) {
      return historyMatchedRouteNames;
    }
    return matchedRouteNames;
  })();
  //获取store中的exclude state
  const exclude = getExcludeState();
  //排除链路上name
  exclude.push(...matchedRouteNames);
  //设置store
  setExcludeState(exclude);
  //下一跳移除对应的规则
  setTimeout(() => {
    //设置store
    setExcludeState([]);
    //删除排除路由名
    removeHistoryByName(matchedRouteNames);
    //完成处理
    next();
  }, TICKET_TIME);
}

//路由访问的时候，加入对应的key处理
function afterRouterHook(): void {
  const state: THistoryState = history.state;
  //使用定位信息处理
  const key: TStateKey = getStateKey(state);
  if (!router || (!key && key !== 0)) return;
  const currentRouterHistory = queryHistoryByKey({ key });
  if (currentRouterHistory) return;
  const currentRoute = unref(router.currentRoute);
  //当前路由name
  const name: string = getRouteName(currentRoute);
  //路由链路name
  const routeMatchedNames = getRouteMatchedNames(currentRoute);
  if (!name) return;
  //写入历史
  routerHistory.push({
    //state.key
    key,
    //组件的name
    name,
    //匹配的路由链路名
    matchedNames: routeMatchedNames,
  });
}

//设置store
function setExcludeState(exclude: TRouteNames) {
  const _exclude = Object.assign([], exclude);
  if (storeModule.isPinia) {
    store.exclude = _exclude;
  } else if (storeModule.isVuex) {
    store.commit(SET_KEEP_ALIVE_EXCLUDE, _exclude);
  }
}

//删除历史记录
function removeHistoryByName(name: string | string[]) {
  function handler(name: string) {
    const findHistory: TRouterHistory[] = queryHistoryByName({
      name,
    });
    while (findHistory.length) {
      const lastIndex = findHistory.length - 1;
      const index = routerHistory.indexOf(findHistory[lastIndex]);
      routerHistory.splice(index, 1);
      findHistory.pop();
    }
  }
  if (typeof name === `string`) {
    handler(name);
  } else if (name instanceof Array) {
    name.forEach((routeName) => {
      handler(routeName);
    });
  }
}

//通过key删除历史记录
function removeHistoryByKey(key: TStateKey) {
  //再历史中的index
  const historyIndex = queryHistoryByKey({
    key,
    findIndex: true,
  });
  //这里删除排序
  if (historyIndex !== -1) {
    routerHistory.splice(historyIndex as number, 1);
  }
}

//通过key查询历史,
//查询key记录的索引
function queryHistoryByKey(
  opts: {
    type?: `current` | `next`;
    findIndex?: boolean;
    key?: TStateKey;
  } = {}
): TRouterHistory | number | null {
  const { type = `current`, findIndex = false, key } = opts;
  for (let index: number = 0; index < routerHistory.length; index++) {
    const currentRouterHistory: TRouterHistory = routerHistory[index];
    const nextRouterHistory = routerHistory[index + 1];
    if (
      currentRouterHistory.key === key &&
      type === `next` &&
      nextRouterHistory
    ) {
      if (findIndex) return index + 1;
      return nextRouterHistory;
    } else if (currentRouterHistory.key === key && type === `current`) {
      if (findIndex) return index;
      return currentRouterHistory;
    }
  }
  if (findIndex) return -1;
  return null;
}

//通过name查询历史记录 这里提供给router afterEach使用
function queryHistoryByName(
  opts: {
    name?: string;
  } = {}
): TRouterHistory[] {
  const { name } = opts;
  const findHistory: TRouterHistory[] = [];
  if (!name) return findHistory;
  routerHistory.forEach((history: TRouterHistory) => {
    if (history.name !== name) return;
    findHistory.push(history);
  });
  return findHistory;
}

//获取store module keep alive
export function getExcludeState(): TRouteNames {
  const exclude: TRouteNames = [];
  //不存在
  if (store) {
    //pinia处理
    if (storeModule.isPinia) {
      return store.exclude || exclude;
    } else if (storeModule.isVuex) {
      //Vuex处理
      return store.state[STORE_MODULE_NAME].exclude || exclude;
    }
  }
  return exclude;
}
