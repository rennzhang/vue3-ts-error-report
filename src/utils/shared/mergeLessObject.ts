import { has, cloneDeep } from 'lodash-es';
import { isEmpty } from '../is';

type MergeObject<T, U, P extends unknown[] = []> = U extends {
  [K: string]: never;
}
  ? T
  : {
      [K in P[number] | keyof T as K extends keyof U ? K : never]: K extends keyof U
        ? U[K]
        : K extends keyof T
        ? T[K]
        : never;
    };

/**
 * 仅合并 source 对象中含有的 key值

* @category Object
 * @param {Object} source 合并的对象
 * @param {Object} target 目标对象
 * @param keys 自定义 key 名
 * @returns Returns `object`
 * @example
 *
 *
 * const object = {
 *   'fruit': "apple",
 *   'vegetable': "potato"
 * };
 *
 * const other = {
 *   'fruit': "banana",
 *   'vegetable': "tomato",
 *   'tableware': "plate",
 *   'dimSum': "eggTart",
 * };
 *
 * const keys = ["dimSum"]
 * mergeLess(object, other, keys);
 * // => { 'fruits': "banana", 'vegetables': "tomato", 'dimSum': "eggTart" }
 */
export const mergeLess = <T extends object, U extends object, P extends (keyof U & string)[]>(
  source: T | undefined,
  target: U,
  keys?: P
): MergeObject<T, U, P> => {
  if (isEmpty(target) || !target) return source as any;
  if (isEmpty(source) || !source) return null as any;
  Object.keys(source).forEach((key) => {
    (source as any)[key] = cloneDeep(target[key]);
  });

  if (keys?.length) {
    keys.forEach((key) => {
      if (!has(target, key)) {
        console.warn(`在${(target as any).toString()}中未找到 ${key}！`);
      }
      (source as any)[key] = cloneDeep(target?.[key]);
    });
  }
  return source as any;
};
