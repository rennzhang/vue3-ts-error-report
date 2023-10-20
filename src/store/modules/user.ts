import { defineStore } from 'pinia';
import { store } from '@/store';
import type { UserType, UserInfo } from '@/types/user';
import { getUserInfoApi } from '@/api/user';
import { tap, map, firstValueFrom } from 'rxjs';

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
      async xGetUserInfo(token: string) {
        let $Api = ofRx(getUserInfoApi({ token })).pipe(
          map((res: any) => (this.userInfo = res.data)),
          tap((data: UserInfo) => {
            this.tenantId = data.tenantId;
            this.userId = data.objId;
            this.isSuperAdmin = !!data.isSuperAdminGrp;
          })
        );
        return firstValueFrom($Api);
      },
    },
    persist: {
      storage: localStorage,
    },
  })(store);
