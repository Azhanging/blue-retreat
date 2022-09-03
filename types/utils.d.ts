import type { TStateKey, THistoryState, TRouterTo } from "./types";
export declare function unref(ref: any): any;
export declare function getStateKey(state: THistoryState): TStateKey;
export declare function getRouteName(to: TRouterTo): string;
export declare function getRouteMatchedNames(to: TRouterTo): string[];
