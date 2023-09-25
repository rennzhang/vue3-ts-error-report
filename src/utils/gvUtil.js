// eslint-disable-next-line max-classes-per-file
import { message } from 'ant-vue-nancal';

const hostname = process.env.VUE_APP_ENV === 'dev' ? process.env.VUE_APP_BASE_API : window.location.origin;
const util = {
  mode: process.env.VUE_APP_ENV,
  origin: window.location.origin,
  hostname,
  baseUrl: `/levault`,
  success(msg, duration) {
    message.success(msg || '操作成功！', duration || 0.5);
  },
  warning(msg, duration) {
    message.warning(msg || '操作成功！', duration || 0.5);
  },
  error(msg, duration) {
    message.error(msg || '操作失败！', duration || 0.5);
  },
  getStorage(key) {
    if (key) {
      return JSON.parse(localStorage.getItem(key));
    } else {
      return null;
    }
  },
  toLogin() {
    let iamApi = gvUtil.hostname;
    let returnUrl = '';
    if (process.env.NODE_ENV === 'development') {
      returnUrl = `&return-url=${location.origin}/${process.env.VUE_APP_NGINX_VPATH_NAME}/`;
    }
    let hrefUrl = `${iamApi}/lzos-login/?app-code=${process.env.VUE_APP_APPCODE}${returnUrl}`;
    window.location.replace(hrefUrl);
  },
  setStorage(key, val) {
    if (key && val) {
      localStorage.setItem(key, JSON.stringify(val));
    }
  },
  removeStorage(key) {
    if (key) {
      localStorage.removeItem(key);
    }
  },
  getSession(key) {
    if (key) {
      return JSON.parse(sessionStorage.getItem(key));
    } else {
      return null;
    }
  },
  setSession(key, val) {
    if (key && val) {
      sessionStorage.setItem(key, JSON.stringify(val));
    }
  },
  removeSession(key) {
    if (key) {
      sessionStorage.removeItem(key);
    }
  },
  postMsg(data) {
    window.parent.postMessage(
      {
        appCode: process.env.VUE_APP_APPCODE,
        ...data,
      },
      '*'
    );
  },
};
// wujie 合并使用无界传入的util
export const gvUtil = window?.__POWERED_BY_WUJIE__ ? Object.assign(util, window?.$wujie?.props?.util) : util;
export default {
  install(Vue) {
    Vue.prototype.gvUtil = gvUtil;
  },
};
