/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// declare module 'axios';
declare module 'ramda'; // 安装 @types/ramda 就不需要定义了

declare module 'rxjs';

declare module '*.js';
