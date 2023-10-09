// 除参数 P 的 key 值，其他 key 值变为可选,
declare type RequirePart<T extends object, P extends keyof T> = Partial<Omit<T, P>> & {
  [K in P]: T[K];
};

// 重组对象
declare type Copy<T> = {
  [K in keyof T]: T[K];
};

type Merge<T, U> = Pick<T & U, keyof (T & U)>;
// 类型是否为 any
type IsAny<T> = '1' extends '2' & T ? true : false;

// 是否为无效值
type IsValid<T> = T extends null | '' | undefined ? false : true;

type RequiredByKeys<T extends object, K extends keyof any = keyof T> = Copy<Required<Pick<T, Extract<keyof T, K>>> & Omit<T, K>>;
