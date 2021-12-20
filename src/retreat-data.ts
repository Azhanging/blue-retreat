//需要撤退的数据
let retreatData: any = {};

//设置需要传递数据
export function setRetreatData(_retreatData: any): void {
  retreatData = _retreatData;
}

//清空传递数据
export function resetRetreatData(): void {
  retreatData = {};
}

//获取当前的撤退数据
export function getCurrentRetreatData() {
  return retreatData;
}

//获取传递数据
export function getRetreatData(opts: { once?: boolean } = {}): any {
  const {
    //只会使用一次
    once = true,
  } = opts;
  const current = retreatData;
  //只会使用一次，清空原有的数据
  once && resetRetreatData();
  return current;
}
