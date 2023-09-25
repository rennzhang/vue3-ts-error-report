import axios from 'axios';
import store from '@/store';
import { message } from 'ant-vue-nancal';
import { gvUtil } from '@/utils/gvUtil';

let shadeNum = 0;
const service = axios.create({
  // 超时
  timeout: 50000,
  baseURL: gvUtil.baseUrl,
});

const isWujie = window?.__POWERED_BY_WUJIE__;
const { requestCeptor } = window?.$wujie?.props || {};
// wujie 使用wujie传入的requestCeptor方法为axios添加拦截器 调用axios的第三个参数 shade 是控制是否在请求时打开遮罩的。可以设置成false取消打开遮罩（比如lov接口可以不打开遮罩）
if (isWujie) {
  requestCeptor(service);
} else {
  service.interceptors.request.use(
    config => {
      const { token, tenantId, userId } = store.state.user;
      let { lang } = store.state.setting;
      if (token) {
        config.headers.token = token;
        config.headers['user-id'] = userId;
        config.headers['tenant-id'] = tenantId;
        config.headers['lang'] = lang;
      }
      if (config.method == 'GET') {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else {
        config.headers['Content-Type'] = 'application/json';
      }
      if (config.upload) {
        config.headers['Content-Type'] = 'multipart/form-data';
      }
      // 统一遮照
      let shade = config.shade === undefined ? true : config.shade;
      if (!!shade && typeof store.dispatch === 'function') {
        store.dispatch('setting/setObject', { loading: true });
        shadeNum++;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  service.interceptors.response.use(
    res => {
      let isInner = store.state.user.from == 'lzos';
      let shade = res.config.shade == undefined ? true : res.config.shade;
      if (!!shade && typeof store.dispatch === 'function') {
        if (shadeNum > 0) {
          shadeNum--;
        }
        if (shadeNum === 0) {
          store.dispatch('setting/setObject', { loading: false });
        }
      }
      if (res.data.mfail !== '0') {
        isInner
          ? gvUtil.postMsg({
              type: 'message.error',
              data: res.data.msg,
            })
          : message.error(res.data.msg);
        return Promise.reject(res.data);
      }
      return res.data;
    },
    error => {
      shadeNum = 0;
      store.dispatch('setting/setObject', { loading: false });
      let isInner = store.state.user.from == 'lzos';
      if (error?.response?.status == 401) {
        if (isInner) {
          gvUtil.postMsg({ type: 'logout' });
        } else {
          window.localStorage.removeItem('uisvr:token');
          gvUtil.toLogin();
        }
        return error;
      }
      isInner
        ? gvUtil.postMsg({
            type: 'message.error',
            data: error?.response?.data?.msg,
          })
        : message.error(error?.response?.data?.msg);
      return Promise.reject(error);
    }
  );
}

export function post(url, data, shade, upload) {
  return new Promise((resolve, reject) => {
    service({
      method: 'post',
      url,
      data,
      shade,
      upload,
    })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function get(url, data, shade) {
  return new Promise((resolve, reject) => {
    service({
      method: 'get',
      url,
      params: data,
      shade,
    })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export default service;
