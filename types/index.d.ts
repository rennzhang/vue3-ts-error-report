// 此文件跟同级目录的 global.d.ts 文件一样也是全局类型声明，只不过这里存放一些零散的全局类型，无需引入直接在 .vue 、.ts 、.tsx 文件使用即可获得类型提示

declare module '*.vue' {
  import { Component } from 'vue';
  const component: Component;
  export default component;
}

declare module '@/assets/iconfont/iconfont';
declare module 'vue-i18n';

declare module '~pages' {
  import { RouteRecordRaw } from 'vue-router';
  const routes: RouteRecordRaw[];
  export default routes;
}
