import { http } from '@/utils/request';
import { LCGETWAY } from '@/config/api';
import type { SetUpGetInfoParams, SetUpGetInfoScheme, QueryAgentParams } from './model/index';

export const requestCommonSetUpGetInfoDialog = (params: SetUpGetInfoParams) =>
  http.post<any, HttpRes<{ scheme: SetUpGetInfoScheme }>>(`${LCGETWAY}/acnsvr/CompanyItem/SetUpGetInfoDialog`, params);

export const requestCommonQueryAgent = (params: QueryAgentParams) =>
  http.post<any, any>(`${LCGETWAY}/acnsvr/CompanyItem/QueryAgent`, params);
<<<<<<< HEAD
export const requestCommonGetHistoryList = (params: any) => http.post(`/acnsvr/CompanyItem/GetAllSequence`, params);
// 根据历史列表id查询 对应的label
export const requestCommonGetLabel = (params: any) => http.post(`/agentdesigner/classAttribute/listData`, params);
=======
export const requestCommonGetHistoryList = (params: any) =>
  http.post(`${LCGETWAY}/acnsvr/CompanyItem/GetAllSequence`, params);
// 根据历史列表id查询 对应的label
export const requestCommonGetLabel = (params: any) =>
  http.post(`${LCGETWAY}/agentdesigner/classAttribute/listData`, params);
>>>>>>> bbc89473b62a911ffdc63978888ad19db4b4ee38
