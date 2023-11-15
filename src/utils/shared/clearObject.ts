import { isObject, isArray, isNumber, isString, isBoolean } from '@/utils/is';
// 重置 vue reactive 对象为默认值的方法
export const clearObject = <T extends Record<string, any> = any>(source?: T): T | null => {
  if (source && typeof source === 'object') {
    const res = source as any;
    Object.keys(source).forEach((key) => {
      const val = source[key];
      if (isObject(val)) {
        res[key] = {};
      } else if (isArray(val)) {
        res[key] = [];
      } else if (isNumber(val)) {
        res[key] = 0;
      } else if (isString(val)) {
        res[key] = '';
      } else if (isBoolean(val)) {
        res[key] = false;
      }
    });
    return res;
  }
  return null;
};
