import { useUserStore } from '@/store/modules/user';
import Axios from 'axios';
import { of, switchMap } from 'rxjs';
import { getUrlParams } from '@/utils';
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
        const urlParams = getUrlParams();
        const { token, tenantId, userId } = useUserStore();
        if (token) {
          config.headers = {
            ...config.headers,
            token,
            ['user-id']: userId,
            ['tenant-id']: tenantId,
          };
        } else if (urlParams?.accessKeyId) {
          config.headers = {
            ...config.headers,
            accessKeyId: urlParams.accessKeyId,
            accessKeySecret: urlParams.accessKeySecret,
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
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
      (error) => {
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

  public request<R, D = any>(config: AxiosRequestConfig<D>) {
    return new Promise<{
      data: R;
      mfail: string;
      errors?: string;
      msg?: string;
    }>((resolve, reject) => {
      Http.axiosInstance
        .request<R>(config)
        .then((res) => {
          resolve(res as any);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public post<R, D = any>(url: string, data: D, config?: AxiosRequestConfig<D>) {
    return this.request<R, D>({
      method: 'post',
      url,
      data,
      ...config,
    });
  }

  public get<R, D = any>(url: string, params: D, config?: AxiosRequestConfig<D>) {
    return this.request<R, D>({
      method: 'get',
      url,
      params,
      ...config,
    });
  }
}

// 将api转化为rxjs的observer 以便使用rxjs的操作符
window.ofRx = (api: Promise<any>) => {
  return of(0).pipe(switchMap(() => api));
};

export const http = new Http();
