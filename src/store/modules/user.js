import { baseActions, baseMutations } from '@/baseFramework/baseStore';
import { gvUtil } from '@/utils/gvUtil';

// wujie 读取wujie传入的store信息
const { token, tenantId, userId, isSuperAdmin } = window?.$wujie?.props?.user || {};
const isWujie = window?.__POWERED_BY_WUJIE__;
export default {
  namespaced: true,
  state: {
    token: isWujie ? token : gvUtil.getStorage('uisvr:token') || '',
    userInfo: isWujie ? window?.$wujie?.props?.user : gvUtil.getStorage('uisvr:userInfo') || {},
    tenantId: isWujie ? tenantId : gvUtil.getStorage('uisvr:tenantId') || '',
    userId: isWujie ? userId : gvUtil.getStorage('uisvr:userId') || '',
    isSuperAdmin: isWujie ? isSuperAdmin : false,
    from: isWujie ? 'lzos' : null,
  },
  mutations: {
    ...baseMutations,
  },
  actions: {
    ...baseActions,
  },
};
