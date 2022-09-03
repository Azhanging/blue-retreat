//state key
export type TStateKey = string | number;

//路由匹配到的名字组，父子路由链路
export type TRouteNames = string[];

//历史类型
export interface TRouterHistory {
  //state.key
  key: TStateKey;
  //组件的name
  name: string;
  //路由链路name
  matchedNames: TRouteNames;
}

//路由类型
export type TRouter = any;
//store数据
export type TStore = any;

//路由三参数
export type TRouterTo = any;
export type TRouterFrom = any;
export type TRouterNext = Function;

//路由参数
export interface TRouterHookOptions {
  to: TRouterTo;
  from: TRouterFrom;
  next: TRouterNext;
}

//历史state数据处理
export type THistoryState = {
  //针对router3.x
  key?: string;
  //针对router4.x 没有确切的标识,差异点就是实际的position会一直递增
  position?: number;
  //其他内容值
  [p: string]: any;
};