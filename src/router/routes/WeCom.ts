import { type RouteRecordRaw } from 'vue-router';
// 企业微信相关路由
export const WeComRoutes: RouteRecordRaw[] = [
  {
    path: '/wecom',
    name: 'WeCom',
    children: [
      {
        path: '/wecom/company-details',
        name: 'WeComCompanyDetails',
        component: () => import('@/views/WeCom/CompanyDetails/index.vue'),
      },
      {
        path: '/wecom/risk-details',
        name: 'WeComRiskDetails',
        component: () => import('@/views/WeCom/RiskDetails/riskDetail.vue'),
      },
    ],
  },
];
