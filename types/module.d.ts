export {};

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (key: string, params?: any) => string;
  }
}

declare module 'pinia-plugin-persistedstate' {
  export interface PersistedStateOptions<S, Store> {
    persist?: {
      key?: string;
    };
  }
}
declare module 'axios' {
  export interface AxiosRequestConfig<D> {
    shade?: boolean;
  }
}
