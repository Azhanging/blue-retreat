import utils from "blue-utils";

interface TBlueRetreatOptions {
  router: any;
  store: any;
}

//历史类型
interface THistory {
  //state.key
  key: string;
  //组件的name
  name: string;
  //这里是记录加入时间
  time: number;
}

let context: BlueRetreat = null;

const SET_KEEP_ALIVE_EXCLUDE: string = `SET_KEEP_ALIVE_EXCLUDE`;

const STORE_MODULE_KEY: string = `KEEP_ALIVE`;

//把keep alive exclude状态处理在store module
function storeRegisterModule() {
  this.store.registerModule(STORE_MODULE_KEY, {
    state: {
      exclude: [],
    },
    mutations: {
      [SET_KEEP_ALIVE_EXCLUDE](state, exclude) {
        state[STORE_MODULE_KEY] = exclude;
      },
    },
  });
}

//设置路由钩子状态
function setRouterHooks() {
  const { router } = this;
  //路由进前处理
  router.beforeEach((to: any, from: any, next: any) => {
    beforePushHistory.call(this, {
      to,
      from,
      next,
    });
  });
  //路由进入后的处理
  router.afterEach(() => {
    setTimeout(() => {
      //写入history
      pushHistory.call(this);
    });
  });
}

//注册处理popState事件处理
function popStateEvent(): Function {
  const popStateHandler = (event) => {
    if (!context) return;
    const { history } = context;
    const { key }: { key: string } = event.state;
    const nextHistory = queryHistoryByKey.call(context, {
      key,
      type: `next`,
    });
    const currentHistory: THistory | null = queryHistoryByKey.call(context, {
      key,
    });
    //记录popstate的name,这里可能是被销毁过的history
    context.currentPopStateName = currentHistory ? currentHistory.name : null;
    //如果当前页的下一个页面（后退回来的页面）在history中有记录，这里清空缓存
    if (nextHistory && history.indexOf(nextHistory.key)) {
      const { name, key } = nextHistory;
      //获取store中的exclude state
      const exclude = context.getExcludeState();
      if (exclude.includes(name)) return;
      exclude.push(name);
      //设置store
      setKeepAliveExclude.call(context, exclude);
      setTimeout(() => {
        const exclude = context.getExcludeState();
        const index = exclude.indexOf(name);
        if (index !== -1) {
          exclude.splice(index, 1);
        }
        //设置store
        setKeepAliveExclude.call(context, exclude);
        //再历史中的index
        const historyIndex = queryHistoryByKey.call(context, {
          key,
          findIndex: true,
        });
        //这里删除排序
        if (historyIndex !== -1) {
          history.splice(historyIndex, 1);
        }
      }, 50);
    }
  };

  const event = `popstate`;
  window.addEventListener(event, popStateHandler);
  return () => {
    window.removeEventListener(event, popStateHandler);
  };
}

//进入路由前处理
function beforePushHistory(this: BlueRetreat, opts) {
  const { to, from, next } = opts;
  const { meta } = to;
  const { name }: { name: string } = meta;
  //如果当前是通过popstate触发的，不进行缓存的处理
  if (name === this.currentPopStateName) return next();
  this.currentPopStateName = null;
  //找一下之前历史是否存在相同的缓存（回环访问的那种情况）
  const findHistory: THistory[] = queryHistoryByName.call(this, { name });
  //如果之前存在缓存了，先杀掉之前的缓存
  if (findHistory.length === 0) return next();
  //获取store中的exclude state
  const exclude = this.getExcludeState();
  if (!exclude.includes(name)) {
    //写入排除缓存name
    exclude.push(name);
    //设置store
    setKeepAliveExclude.call(this, exclude);
    //下一跳移除对应的规则
    setTimeout(() => {
      //获取store中的exclude state
      const exclude = this.getExcludeState();
      const index = exclude.indexOf(name);
      if (index !== -1) {
        exclude.splice(index, 1);
      }
      //设置store
      setKeepAliveExclude.call(this, exclude);
      //删除历史记录
      removeHistoryByName.call(this, { name });
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
  this.store.commit(SET_KEEP_ALIVE_EXCLUDE, utils.deepCopy(exclude));
}

//路由访问的时候，加入对应的key处理
function pushHistory(this: BlueRetreat): void {
  const { key }: { key: string } = history.state;
  if (!this.router || !key) return;
  const currentHistory = queryHistoryByKey.call(this, { key });
  if (currentHistory) return;
  const { currentRoute } = this.router;
  const { meta } = currentRoute;
  const { name }: { name: string } = meta;
  if (!name) return;
  //写入历史
  this.history.push({
    //state.key
    key,
    //组件的name
    name,
    //这里是记录加入时间
    time: +new Date(),
  });
}

//删除历史记录
function removeHistoryByName(this: BlueRetreat, opts: { name: string }) {
  const { name } = opts;
  const { history } = this;
  const findHistory: THistory[] = queryHistoryByName.call(this, {
    name,
  });
  while (findHistory.length) {
    const index = history.indexOf(findHistory[findHistory.length - 1]);
    history.splice(index, 1);
    findHistory.pop();
  }
}

//通过key查询历史
function queryHistoryByKey(
  this: BlueRetreat,
  opts: {
    type?: `current` | `next`;
    findIndex?: boolean;
    key?: string;
  } = {}
): THistory | number {
  const { history } = this;
  const {
    /*current next*/
    type = `current`,
    findIndex = false,
    key,
  } = opts;
  for (let index = 0; index < history.length; index++) {
    const currentHistory: THistory = history[index];
    const nextHistory = history[index + 1];
    if (currentHistory.key === key && type === `next` && nextHistory) {
      if (findIndex) return index;
      return nextHistory;
    } else if (currentHistory.key === key && type === `current`) {
      if (findIndex) return index;
      return currentHistory;
    }
  }
  if (findIndex) return -1;
  return null;
}

//通过name查询历史记录 这里提供给router afterEach使用
function queryHistoryByName(
  this: BlueRetreat,
  opts: {
    name?: string;
  } = {}
): THistory[] {
  const { name } = opts;
  const findHistory: THistory[] = [];
  if (!name) return findHistory;
  const { history } = this;
  history.forEach((_history: THistory) => {
    if (_history.name !== name) return;
    findHistory.push(_history);
  });
  return findHistory;
}

//注册popstate事件处理
popStateEvent();

export default class BlueRetreat {
  //配置信息
  options: TBlueRetreatOptions;
  //历史记录
  history: THistory[];
  //vue路由
  router: any;
  //Vuex
  store: any;
  //当前的popState的name值
  currentPopStateName: string;
  constructor(options: TBlueRetreatOptions) {
    if (context) return context;
    this.options = utils.extend(
      {
        router: null,
        store: null,
      },
      options
    ) as TBlueRetreatOptions;
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
  getExcludeState(): string[] {
    const { state } = this.store;
    return state[STORE_MODULE_KEY].exclude || [];
  }
}
