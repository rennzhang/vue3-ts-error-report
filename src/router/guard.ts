import type { Router } from 'vue-router';
import { i18n } from '@/lang';
import langCodes from '@/lang/langCode';
import { useUserStore } from '@/store/modules/user';
import { useAppStore } from '@/store/modules/app';
import langCode from '@/lang/langCode';
const whiteList = ['/404', '/error', '/login'];

const isWujie = window?.__POWERED_BY_WUJIE__;
const util = window?.$wujie?.props?.util || {};
export function createRouterGuard(router: Router) {
  router.beforeEach(async (to, _, next) => {
    // wujie接入
    if (isWujie) {
      const res = await util.getLanguage(import.meta.env.VITE_APP_NGINX_VPATH_NAME, langCodes);
      i18n.global.setLocaleMessage('en_us', res.en_us);
      i18n.global.setLocaleMessage('zh_cn', res.zh_cn);

      console.group('[[wujie接入]]');
      console.log('>>> $wujie.props', window.$wujie?.props);
      console.log('>>> $wujie', window.$wujie);
      console.groupEnd();
      next();
      return;
    }
    // iframe接入
    if (to.query.tk) {
      const userStore = useUserStore();
      const appStore = useAppStore();
      userStore.token = <string>to.query.tk;
      userStore.from = <string>to.query.from;
      appStore.lang = <string>to.query.lang;
      i18n.global.locale.value = <string>to.query.lang;
      userStore.getUserInfo(<string>to.query.tk);
      // 获取语言包
      gvUtil.postMsg({
        type: 'gvUtil.getLanguage',
        data: [import.meta.env.VITE_APP_NGINX_VPATH_NAME, langCode],
        call: true,
      });
      next();
      return;
    }

    if (whiteList.indexOf(to.path) !== -1) {
      next();
      return;
    }

    next();
  });
}
