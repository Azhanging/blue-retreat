import type { TStore } from "./types";
import { SET_KEEP_ALIVE_EXCLUDE, STORE_MODULE_NAME } from "./const";

//实际的存储环境
export let isPinia = false;
export let isVuex = false;

//把keep alive exclude状态处理在store module
//需要createPinia()后使用当前
export function storeRegister(store: TStore): TStore {
  //对于pinia的处理 这里处理pinia的定义
  //Pinia的传入defineStore来构建
  if (typeof store === `function`) {
    return piniaStore(store);
  } else {
    return vuexStore(store);
  }
}

//Pinia store
function piniaStore(store: TStore): TStore {
  const useRetreatStore = store(STORE_MODULE_NAME, {
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
    console.error(`store is not Pinia`);
  } else {
    //存储库判断
    isPinia = true;
  }
  return store;
}

//vuex store
function vuexStore(store: TStore): TStore {
  //对于vuex的处理
  store.registerModule(STORE_MODULE_NAME, {
    state: {
      exclude: [],
    },
    mutations: {
      [SET_KEEP_ALIVE_EXCLUDE](state, exclude) {
        state.exclude = exclude;
      },
    },
  });
  //存储库判断
  isVuex = true;
  return store;
}
