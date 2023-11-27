import { defineStore } from 'pinia';
import { store } from '@/store';
import type { LOVDetail, LOVParams } from '@/api/common/model';
import { requestCommonGetLOV } from '@/api/common';
import type { DetailsItem } from '../types';

export const useDetailsStore = () =>
  defineStore({
    id: 'details',
    state: () => ({
      LOVMaps: {} as Record<string, LOVDetail[]>,

      // 详情页数据
      detailsMap: {} as Record<string, DetailsItem[]>,
    }),
    actions: {
      async queryLovOptions(lov: LOVParams, field: string, val: string | null) {
        if (!val || !lov || this.LOVMaps[field]) return;
        requestCommonGetLOV(lov).then((res) => {
          this.LOVMaps[field] = res.data.details;
        });
      },
      getLovLabel(field: string, value: string) {
        return this.LOVMaps[field]?.find((c) => c.internalValue == value)?.externalValue || value;
      },
      setHistoryDetailsMap(key: string, value: any) {
        this.detailsMap[key] = value;
      },
    },
  })(store);
