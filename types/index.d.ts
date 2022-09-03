import type { TStore, TRouter, TRouteNames } from "./types";
export * from "./retreat-data";
declare let store: TStore;
declare let router: TRouter;
export declare const defineBlueRetreat: (opts: {
    router: TRouter;
    store: TStore;
}) => void;
export declare function getExcludeState(): TRouteNames;
