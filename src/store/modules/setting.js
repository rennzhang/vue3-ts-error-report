import { baseActions, baseMutations } from '@/baseFramework/baseStore';

// wujie 读取wujie传入的store信息
const { lang } = window?.$wujie?.props?.setting || {};
const isWujie = window?.__POWERED_BY_WUJIE__;
export default {
  namespaced: true,
  state: {
    lang: isWujie ? lang : 'zh_cn',
  },
  mutations: {
    ...baseMutations,
  },
  actions: {
    ...baseActions,
  },
};
