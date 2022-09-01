import type { TStateKey, THistoryState, TRouterTo } from "./types";

//针对vue3 ref处理
function isRef(ref: any): boolean {
  return ref.__v_isRef;
}

//针对vue3 ref处理
export function unref(ref: any): any {
  return isRef(ref) ? ref.value : ref;
}

//获取状态
export function getStateKey(state: THistoryState): TStateKey {
  return state.key || state.position || ``;
}

//获取路由name
export function getRouteName(to: TRouterTo): string {
  const { meta } = to;
  return to.name || meta.name;
}

//获取路由匹配名
export function getRouteMatchedNames(to: TRouterTo): string[] {
  return to.matched.map(
    (route: any) => route.name || (route.meta && route.meta.name) || ``
  );
}
