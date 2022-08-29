import { getCurrentRetreatData } from "./retreat-data";
export * from "./retreat-data";

//state key
type TStateKey = string | number;

//历史类型
interface TRouterHistory {
  //state.key
  key: TStateKey;
  //组件的name
  name: string;
  //这里是记录加入时间
  time: number;
}

//mutation 方法名
const SET_KEEP_ALIVE_EXCLUDE: string = `SET_KEEP_ALIVE_EXCLUDE`;

//vuex模块名
const STORE_MODULE_KEY: string = `KEEP_ALIVE`;

//路由的历史记录
let routerHistory: TRouterHistory[] = [];

//当前的popState的name值
let currentPopStateName: string = null;

//配置vue|pinia相关的router以及store
let store: any = null;
let router: any = null;

//实际的存储环境
let isPinia = false;
let isVuex = false;

//针对vue3 ref处理
function isRef(ref: any): boolean {
  return ref.__v_isRef;
}

//针对vue3 ref处理
function unref(ref: any): any {
  return isRef(ref) ? ref.value : ref;
}

//初始化
//如果使用的是pinia，需要在createPinia()后使用当前进行初始化配置
export const initBlueRetreat = (() => {
  let initStatus = false;
  return (opts: { router: any; store: any }) => {
    if (initStatus) return;
    let { router: _router, store: _store } = opts;
    if (!(_router && _store)) {
      return console.log(
        `blue-retreat init error,please required set Vue Router and (Vuex|Pinia) in options`
      );
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
function storeRegister(): void {
  //对于pinia的处理 这里处理pinia的定义
  //Pinia的传入defineStore来构建
  if (typeof store === `function`) {
    piniaStore();
  } else {
    vuexStore();
  }
}

//Pinia store
function piniaStore(): void {
  const useRetreatStore = store(STORE_MODULE_KEY, {
    state: () => ({
      //排除数据
      exclude: [],
    }),
  });
  //获取store的实例
  store = useRetreatStore();
  //判断是否为pinia特性
  if (!store || !store.$id) {
    store = null;
    new Error(`store is not Pinia`);
  } else {
    //存储库判断
    isPinia = true;
  }
}

//vuex store
function vuexStore(): void {
  //对于vuex的处理
  store.registerModule(STORE_MODULE_KEY, {
    state: {
      exclude: [],
    },
    mutations: {
      [SET_KEEP_ALIVE_EXCLUDE](state, exclude) {
        state[STORE_MODULE_KEY] = exclude;
      },
    },
  });
  //存储库判断
  isVuex = true;
}

//设置路由钩子状态
function setRouterHooks() {
  //路由进前处理
  router.beforeEach((to: any, from: any, next: any) => {
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
  const popStateHandler = (event) => {
    if (!event.state) {
      event.state = {};
    }
    event.state.retreatData = getCurrentRetreatData();
    const { state }: { state: any } = event;
    const key = state.key || state.position;
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
function beforePushHistory(opts) {
  const { to, from, next } = opts;
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
  if (isPinia) {
    store.exclude = _exclude;
  } else {
    store.commit(SET_KEEP_ALIVE_EXCLUDE, _exclude);
  }
}

//路由访问的时候，加入对应的key处理
function pushHistory(): void {
  const { state }: { state: any } = history;
  const key: TStateKey = state.key || state.position;
  if (!router || !key) return;
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
    //这里是记录加入时间
    time: +new Date(),
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

//通过key查询历史
function queryHistoryByKey(
  opts: {
    type?: `current` | `next`;
    findIndex?: boolean;
    key?: TStateKey;
  } = {}
): TRouterHistory | number | null {
  const {
    /*current next*/
    type = `current`,
    findIndex = false,
    key,
  } = opts;
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
  const exclude = [];
  //不存在
  if (store) {
    //pinia处理
    if (isPinia) {
      return store.exclude || exclude;
    } else if (isVuex) {
      //Vuex处理
      return store.state[STORE_MODULE_KEY].exclude || exclude;
    }
  }
  return exclude;
}
