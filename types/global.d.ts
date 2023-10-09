import type { VueComponent } from 'vue';
import type { UserType } from '../src/types/user';
/**
 * 全局类型声明，无需引入直接在 `.vue` 、`.ts` 、`.tsx` 文件使用即可获得类型提示
 */
declare global {
  /**
   * Window 的类型提示
   */
  interface Window {
    $wujie?: {
      bus: EventBus;
      location: Proxy;
      props: {
        level: number;
        parentVue: VueComponent;
        util: any;
        params: AppParams;
        setting: {
          lang: string;
          langType: {
            name: string;
            type: string;
          }[];
        };
        user: UserType;
      };
      [key: string]: any;
    };
    __POWERED_BY_WUJIE__?: boolean;
    gvUtil: any;
    ofRx: Function;
  }

  /**
   * 全局自定义环境变量的类型声明
   */
  interface ViteEnv {
    VITE_APP_BASE_API: string;
    VITE_APP_NGINX_VPATH_NAME: string;
    VITE_APP_APPCODE: string;
  }
  /**
   * 打包压缩格式的类型声明
   */
  type ViteCompression = 'none' | 'gzip' | 'brotli' | 'both' | 'gzip-clear' | 'brotli-clear' | 'both-clear';

  /**
   * 应用通信参数类型声明
   */
  interface AppParams {
    record: any | null; // 表单对象
    selectedRows: any[] | null; // 上级选中行
    relation: any | null; // 关系
    rootBasicClass: string | null; // 根基础类
    parentSelectedRows: any[] | null; // 祖先级选中行
    authBtns: any[] | null; // 权限按钮
  }

  /**
   * postMessage 通信数据类型声明
   */
  interface PostMessageData {
    type: string;
    data?: any;
    call?: boolean;
  }
  /**
   * 全局工具类的类型声明
   */
  var gvUtil: any;
  var ofRx: Function;

  declare type Nullable<T> = T | null;

  declare type NonNullable<T> = T extends null | undefined ? never : T;

  declare type Recordable<T = {}> = T & Record<string, any>;
}
