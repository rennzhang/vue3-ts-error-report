import { defineStore } from 'pinia';
import { store } from '@/store';
import type { LOVDetail, LOVParams } from '@/api/common/model';
import { requestCommonGetLOV } from '@/api/common';
import type { DetailsItem } from '../types';

export const useDetailsStore = () =>
  defineStore({
    id: 'details',
    state: () => ({
      /** 存储的 LOV Options Map 对象 */
      LOVMaps: {} as Record<string, LOVDetail[]>,

      // 详情页数据
      detailsMap: {} as Record<string, DetailsItem[]>,
    }),
    actions: {
      /**
       * 根据lov参数查询lov数据，并存储到LOVMaps中，key为field
       * @param lov 查询lov所需的参数
       * @param field 需要查询的字段，用于存储查询结果
       */
      async queryLovOptions(lov: LOVParams, field: string) {
        if (!lov || this.LOVMaps[field]) return;
        await requestCommonGetLOV(lov).then((res) => {
          this.LOVMaps[field] = res.data.details;
        });
      },

      /**
       * 根据field和value获取对应的label
       * @param field 字段，用于获取LOVMaps中的值 => LOVMaps[field]
       * @param value 值
       * @returns label
       */
      getLovLabel(field: string, value: string) {
        return this.LOVMaps[field]?.find((c) => c.internalValue == value)?.externalValue || value;
      },

      setHistoryDetailsMap(key: string, value: any) {
        this.detailsMap[key] = value;
      },
    },
  })(store);
