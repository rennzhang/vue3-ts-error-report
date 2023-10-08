import { defineStore } from 'pinia';
import { store } from '@/store';

export const useAppStore = () =>
  defineStore({
    id: 'app',
    state: () => ({
      lang: 'zh_cn', // 多语言
    }),
    actions: {},
    persist: {
      storage: sessionStorage,
    },
  })(store);
