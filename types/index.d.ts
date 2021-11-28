interface TBlueRetreatOptions {
    router: any;
    store: any;
}
interface THistory {
    key: string;
    name: string;
    time: number;
}
export default class BlueRetreat {
    options: TBlueRetreatOptions;
    history: THistory[];
    router: any;
    store: any;
    currentPopStateName: string;
    constructor(options: TBlueRetreatOptions);
    getExcludeState(): string[];
}
export {};
