import { type RouteRecordRaw } from 'vue-router';
// 企业微信相关路由
export const CompanyInfoRoutes: RouteRecordRaw[] = [
  {
    path: '/group-composition', // path路径名称小驼峰
    name: 'GroupStructure', // name名称大驼峰
    component: () => import('@/views/GroupStructure/index.vue'), // 懒加载
  },
  {
    path: '/history-version', // path路径名称小驼峰
    name: 'HistoryVersion', // name名称大驼峰
    component: () => import('@/views/HistoricalVersion/index.vue'), // 懒加载
  },
  {
    path: '/company-details',
    name: 'companyDetails',
    props: {
      className: 'CompanyItem',
    },
    component: () => import('@/views/CompanyDetails/index.vue'),
  },
  {
    path: '/wecom',
    name: 'WeCom',
    children: [
      {
        path: '/wecom/home',
        name: 'WeComHome',
        component: () => import('@/views/WeCom/home/index.vue'),
      },
      {
        path: '/wecom/company-details',
        name: 'WeComCompanyDetails',
        component: () => import('@/views/CompanyDetails/index.vue'),
      },
      {
        path: '/wecom/risk-details',
        name: 'WeComRiskDetails',
        component: () => import('@/views/WeCom/RiskDetails/riskDetail.vue'),
      },
    ],
  },
];
