import { type RouteRecordRaw } from 'vue-router';
// 企业微信相关路由
export const WeComRoutes: RouteRecordRaw[] = [
  {
    path: '/wecom/company-details',
    name: 'WeCom',
    component: () => import('@/views/WeCom/CompanyDetails/index.vue'),
  },
  {
    path: '/wecom/risk-details',
    name: 'WeCom',
    component: () => import('@/views/WeCom/RiskDetails/index.vue'),
  },
];
