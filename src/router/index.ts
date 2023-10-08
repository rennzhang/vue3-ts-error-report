import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createRouterGuard } from './guard';

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_NGINX_VPATH_NAME),
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/use', // path路径名称小驼峰
      name: 'Use', // name名称大驼峰
      component: () => import('@/views/Use.vue'), // 懒加载
    },
    {
      path: '/group-composition', // path路径名称小驼峰
      name: 'GroupComposition', // name名称大驼峰
      component: () => import('@/views/CompanyDetails/GroupComposition.vue'), // 懒加载
    },
  ],
});

// 配置路由器
export function setupRouter(app: App<Element>) {
  createRouterGuard(router);
  app.use(router);
}