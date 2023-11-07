import { http } from '@/utils/request';
import { LCGETWAY } from '@/config/api';
import type {
  SetUpGetInfoParams,
  SetUpGetInfoScheme,
  QueryAgentParams,
  HistoryRecord,
  GetLabDataType,
  QueryAgentRes,
  LOVDetail,
} from './model/index';
export * from './model';
export * from './model/uncert';
export const requestCommonSetUpGetInfoDialog = (params: SetUpGetInfoParams) =>
  http.post<{ scheme: SetUpGetInfoScheme }>(`${LCGETWAY}/acnsvr/CompanyItem/SetUpGetInfoDialog`, params);

export const requestCommonQueryAgent = <T = any>(params: QueryAgentParams) =>
  http.post<QueryAgentRes<T>>(`${LCGETWAY}/acnsvr/CompanyItem/QueryAgent`, params);

export const requestCommonGetHistoryList = (params: any) =>
  http.post<HistoryRecord[]>(`${LCGETWAY}/acnsvr/CompanyItem/GetAllSequence`, params);

// 根据历史列表id查询 对应的label
export const requestCommonGetLabel = (params: any) =>
  http.post<GetLabDataType[]>(`${LCGETWAY}/agentdesigner/classAttribute/listData`, params);

// 查询 LOV
export const requestCommonGetLOV = (params: { code: string }) =>
  http.post<{ details: LOVDetail[] }>(`${LCGETWAY}/lovsvr/Lov/GetLovByCode`, params);
