import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home.vue'),
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('@/views/error.vue'),
  },
  {
    path: '*',
    component: () => import('@/views/404.vue'),
  },
];

export default new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_NGINX_VPATH_NAME,
  routes,
});
