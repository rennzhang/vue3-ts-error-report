import { defineStore } from 'pinia';
import { store } from '@/store';
import { getUserInfoByToken, UserType } from '@/api/user/';

const { token, tenantId, userId, isSuperAdmin, userInfo } = window?.$wujie?.props?.user || {};
export const useUserStore = () =>
  defineStore({
    id: 'user',
    state: (): UserType => ({
      token: token || '',
      userInfo: userInfo || {},
      tenantId: tenantId || '',
      userId: userId || '',
      isSuperAdmin: !!isSuperAdmin || false,
      from: '' || null,
    }),
    actions: {
      async getUserInfo(token: string) {
        getUserInfoByToken({ token }).then((res) => {
          this.userInfo = res.data;
          this.tenantId = res.data.tenantId;
          this.userId = res.data.objId;
          this.isSuperAdmin = !!res.data.isSuperAdminGrp;
        });
      },
    },
    persist: {
      storage: localStorage,
    },
  })(store);
