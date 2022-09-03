export declare type TStateKey = string | number;
export declare type TRouteNames = string[];
export interface TRouterHistory {
    key: TStateKey;
    name: string;
    matchedNames: TRouteNames;
}
export declare type TRouter = any;
export declare type TStore = any;
export declare type TRouterTo = any;
export declare type TRouterFrom = any;
export declare type TRouterNext = Function;
export interface TRouterHookOptions {
    to: TRouterTo;
    from: TRouterFrom;
    next: TRouterNext;
}
export declare type THistoryState = {
    key?: string;
    position?: number;
    [p: string]: any;
};
