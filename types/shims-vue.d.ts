declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  interface ComponentCustomProperties {
    $t: (key: string, params?: any) => string;
  }
  export default component;
}

// declare module '@/assets/iconfont/iconfont';
declare module 'vue-i18n';

declare module '~pages' {
  import { RouteRecordRaw } from 'vue-router';
  const routes: RouteRecordRaw[];
  export default routes;
}

declare module '*.js';
