import { useUserStore } from '@/store/modules/user';
import Axios from 'axios';
import { of, switchMap } from 'rxjs';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class Http {
  constructor() {
    const isWujie = window?.__POWERED_BY_WUJIE__;
    const { util } = window?.$wujie?.props || {};
    // 设置拦截器
    if (isWujie) {
      util.interceptor(Http.axiosInstance);
    } else {
      this.setInterceptor(Http.axiosInstance);
    }
  }
  // 当前Axios实例对象
  private static axiosInstance: AxiosInstance = Axios.create({
    timeout: 50000, // 超时
    baseURL: gvUtil.baseUrl,
  });

  private setInterceptor(axiosInstance: AxiosInstance): void {
    axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig): any => {
        const { token, tenantId, userId } = useUserStore();
        if (token) {
          config.headers = {
            ...config.headers,
            token,
            ['user-id']: userId,
            ['tenant-id']: tenantId,
          };
        }
        return config;
      },
      error => Promise.reject(error)
    );
    axiosInstance.interceptors.response.use(
      (res: AxiosResponse) => {
        let isInner = useUserStore().from == 'lzos';

        if (res.headers['content-type'].includes('application/octet-stream')) {
          return res;
        }
        if (res.data.mfail !== '0') {
          if (isInner) {
            gvUtil.postMsg({
              type: 'gvUtil.error',
              data: res.data.msg,
            });
          } else {
            gvUtil.error(res.data.msg);
          }
          return Promise.reject(res.data);
        }
        return res.data;
      },
      error => {
        let isInner = useUserStore().from == 'lzos';
        if (error?.response?.status == 401) {
          if (isInner) {
            gvUtil.postMsg({
              type: 'gvUtil.toLogin',
            });
          } else {
            gvUtil.error(error?.response?.data?.msg);
          }
          return error;
        }
        if (isInner) {
          gvUtil.postMsg({
            type: 'gvUtil.error',
            data: error?.response?.data?.msg,
          });
        } else {
          gvUtil.error(error?.response?.data?.msg);
        }
        return Promise.reject(error);
      }
    );
  }

  public request<D, R>(config: AxiosRequestConfig<D>): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      Http.axiosInstance
        .request<D>(config)
        .then(res => {
          resolve(res as R);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public post<D, R>(url: string, data: D, shade?: boolean): Promise<R> {
    return this.request<D, R>({
      method: 'post',
      url,
      data,
      shade,
    });
  }

  public get<D, R>(url: string, params: D, shade?: boolean): Promise<R> {
    return this.request<D, R>({
      method: 'get',
      url,
      params,
      shade,
    });
  }
}

// 将api转化为rxjs的observer 以便使用rxjs的操作符
window.ofRx = (api: Promise<any>) => {
  return of(0).pipe(switchMap(() => api));
};

export const http = new Http();
