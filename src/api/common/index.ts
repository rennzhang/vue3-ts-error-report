import { http } from '@/utils/request';
import type { SetUpGetInfoParams, SetUpGetInfoScheme, QueryAgentParams } from './model/index';

export const requestCommonSetUpGetInfoDialog = (params: SetUpGetInfoParams) =>
  http.post<any, HttpRes<{ scheme: SetUpGetInfoScheme }>>(`/levault/acnsvr/CompanyItem/SetUpGetInfoDialog`, params);

export const requestCommonQueryAgent = (params: QueryAgentParams) =>
  http.post<any, any>(`/levault/acnsvr/CompanyItem/QueryAgent`, params);
export const requestCommonGetHistoryList = (params: any) => http.post(`/levault/acnsvr/CompanyItem/GetAllSequence`, params);
// 根据历史列表id查询 对应的label
export const requestCommonGetLabel = (params: any) => http.post(`/levault/agentdesigner/classAttribute/listData`, params);
