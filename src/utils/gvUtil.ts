import type { App } from 'vue';
import { i18n } from '@/lang';
import { message } from 'n-designv3';
const { VITE_APP_ENV, VITE_APP_BASE_API } = import.meta.env;
const hostname = VITE_APP_ENV === 'dev' ? VITE_APP_BASE_API : window.location.origin;

const util = {
  mode: VITE_APP_ENV,
  origin: window.location.origin,
  hostname,
  baseUrl: `/levault`,
  t: i18n.global.t,
  appParams: {}, // iframe 通信参数
  appOrigin: '', // iframe 通信域名
  // iframe 通信
  postMsg(data: PostMessageData) {
    window.parent.postMessage(data, util.appOrigin || '*');
  },
  success(msg: string, duration: number) {
    message.success(msg || i18n.t('aiwork_operation_success'), duration || 0.5);
  },
  warning(msg: string, duration: number) {
    message.warning(msg || i18n.t('aiwork_operation_failed'), duration || 0.5);
  },
  error(msg: string, duration: number) {
    message.error(msg || i18n.t('aiwork_operation_failed'), duration || 0.5);
  },
};

// wujie 合并使用无界传入的util
export const gvUtil: any = window?.__POWERED_BY_WUJIE__ ? Object.assign(util, window?.$wujie?.props?.util) : util;

// 注册全局变量
window.gvUtil = gvUtil;

// iframe 通信
window.addEventListener('message', function (event) {
  if (event.data.type == 'init' && event.data.from === 'lzos') {
    util.appParams = event.data.data;
    util.appOrigin = event.origin;
    return;
  }
  if (event.data.type == 'gvUtil.getLanguage' && event.data.from === 'lzos') {
    // iframe 通信获取语言包
    i18n.global.setLocaleMessage('en_us', event.data.data.en_us);
    i18n.global.setLocaleMessage('zh_cn', event.data.data.zh_cn);
    return;
  }
});

// 配置工具类
export function setupUtil(app: App<Element>) {
  app.use({
    install(app: App) {
      app.config.globalProperties.gvUtil = gvUtil;
    },
  });
}
