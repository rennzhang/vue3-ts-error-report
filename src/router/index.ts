import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createRouterGuard } from './guard';
import { WeComRoutes } from './routes/WeCom';
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
      name: 'GroupStructure', // name名称大驼峰
      component: () => import('@/views/GroupStructure/index.vue'), // 懒加载
    },
    {
      path: '/history-version', // path路径名称小驼峰
      name: 'HistoryVersion', // name名称大驼峰
      component: () => import('@/views/HistoricalVersion/HistoricalVersion.vue'), // 懒加载
    },
    {
      path: '/company-details',
      name: 'companyDetails',
      component: () => import('@/views/CompanyDetails/index.vue'),
    },
    ...WeComRoutes,
  ],
});

// 配置路由器
export function setupRouter(app: App<Element>) {
  createRouterGuard(router);
  app.use(router);
}
