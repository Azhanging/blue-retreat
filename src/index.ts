import type {
  TStateKey,
  TRouterHistory,
  TRouterTo,
  TRouterFrom,
  TRouterNext,
  THistoryState,
  TStore,
  TRouter,
  TRouterHookOptions,
} from "./types";
import { getCurrentRetreatData } from "./retreat-data";
import { unref, getStateKey } from "./utils";
import { SET_KEEP_ALIVE_EXCLUDE, STORE_MODULE_NAME } from "./const";
import * as storeModule from "./store";
export * from "./retreat-data";

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
    beforePushHistory({
      to,
      from,
      next,
    });
  });
  //路由进入后的处理
  router.afterEach(() => {
    setTimeout(() => {
      //写入history
      pushHistory();
    });
  });
}

//注册处理popState事件处理
function popStateEvent() {
  //这里的类型
  const popStateHandler = (event: any) => {
    if (!event.state) {
      event.state = {};
    }
    event.state.retreatData = getCurrentRetreatData();
    const { state }: { state: THistoryState } = event;
    const key = getStateKey(state);
    let nextRouterHistory = queryHistoryByKey({
      key,
      type: `next`,
    });
    const currentRouterHistory = queryHistoryByKey({
      key,
    });
    //记录popstate的name,这里可能是被销毁过的history
    currentPopStateName = currentRouterHistory
      ? (currentRouterHistory as TRouterHistory).name
      : null;
    //如果是那种回环访问，当前的页面是后退回来产生的新页面
    //这种在routerHistory是不存在的，这里需要移除最后一个路由缓存
    if (currentRouterHistory === null && routerHistory.length > 0) {
      nextRouterHistory = routerHistory[routerHistory.length - 1];
    }
    //如果当前页的下一个页面（后退回来的页面）在history中有记录，这里清空缓存
    if (nextRouterHistory) {
      const { name, key } = nextRouterHistory as TRouterHistory;
      //获取store中的exclude state
      const exclude = getExcludeState();
      if (exclude.includes(name)) return;
      exclude.push(name);
      //设置store
      setKeepAliveExclude(exclude);
      //下一宏任务处理
      setTimeout(() => {
        const exclude = getExcludeState();
        const index = exclude.indexOf(name);
        if (index !== -1) {
          exclude.splice(index, 1);
        }
        //设置store
        setKeepAliveExclude(exclude);
        //再历史中的index
        const historyIndex = queryHistoryByKey({
          key,
          findIndex: true,
        });
        //这里删除排序
        if (historyIndex !== -1) {
          routerHistory.splice(historyIndex as number, 1);
        }
      }, 50);
    }
  };
  window.addEventListener(`popstate`, popStateHandler);
}

//注册popstate事件处理
popStateEvent();

//进入路由前处理
function beforePushHistory(opts: TRouterHookOptions) {
  const { to, next } = opts;
  const { meta } = to;
  const { name }: { name: string } = meta;
  //如果当前是通过popstate触发的，不进行缓存的处理
  if (name === currentPopStateName) return next();
  currentPopStateName = null;
  //找一下之前历史是否存在相同的缓存（回环访问的那种情况）
  const findHistory: TRouterHistory[] = queryHistoryByName({ name });
  //如果之前存在缓存了，先杀掉之前的缓存
  if (findHistory.length === 0) return next();
  //获取store中的exclude state
  const exclude = getExcludeState();
  if (!exclude.includes(name)) {
    //写入排除缓存name
    exclude.push(name);
    //设置store
    setKeepAliveExclude(exclude);
    //下一跳移除对应的规则
    setTimeout(() => {
      //获取store中的exclude state
      const exclude = getExcludeState();
      const index = exclude.indexOf(name);
      if (index !== -1) {
        exclude.splice(index, 1);
      }
      //设置store
      setKeepAliveExclude(exclude);
      //删除历史记录
      removeHistoryByName({ name });
      //完成处理
      next();
    });
  } else {
    //完成处理
    next();
  }
}

//设置store
function setKeepAliveExclude(exclude: string[]) {
  const _exclude = Object.assign([], exclude);
  if (storeModule.isPinia) {
    store.exclude = _exclude;
  } else if (storeModule.isVuex) {
    store.commit(SET_KEEP_ALIVE_EXCLUDE, _exclude);
  }
}

//路由访问的时候，加入对应的key处理
function pushHistory(): void {
  const { state }: { state: THistoryState } = history;
  //使用定位信息处理
  const key: TStateKey = getStateKey(state);
  if (!router || (!key && key !== 0)) return;
  const currentRouterHistory = queryHistoryByKey({ key });
  if (currentRouterHistory) return;
  const { currentRoute } = router;
  const { meta } = unref(currentRoute);
  const { name }: { name: string } = meta;
  if (!name) return;
  //写入历史
  routerHistory.push({
    //state.key
    key,
    //组件的name
    name,
  });
}

//删除历史记录
function removeHistoryByName(opts: { name: string }) {
  const { name } = opts;
  const findHistory: TRouterHistory[] = queryHistoryByName({
    name,
  });
  while (findHistory.length) {
    const index = routerHistory.indexOf(findHistory[findHistory.length - 1]);
    routerHistory.splice(index, 1);
    findHistory.pop();
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
      if (findIndex) return index;
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
export function getExcludeState(): string[] {
  const exclude: string[] = [];
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
