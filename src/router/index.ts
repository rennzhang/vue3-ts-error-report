import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import routes from '~pages';

const router = createRouter({
  history: createWebHistory('/'),
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
    },

    ...routes,
  ],
});

// 配置路由器
export function setupRouter(app: App<Element>) {
  app.use(router);
}
