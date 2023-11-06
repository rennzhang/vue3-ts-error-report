/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_APPCODE: string;

  readonly VITE_APP_BASE_API: string;
  //ngnix目录
  readonly VITE_APP_NGINX_VPATH_NAME: string;
  readonly VUE_APP_NGINX_VPATH_NAME: string;
  readonly VITE_API_DNT_MC_LOGIN_URL: string;

  readonly VITE_COMPRESSION: 'gzip' | 'brotli' | 'both' | 'none';
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
