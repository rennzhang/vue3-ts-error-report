import { http } from '@/utils/request';
import { LCGETWAY } from '@/config/api';
import type {
  SetUpGetInfoParams,
  SetUpGetInfoScheme,
  QueryAgentParams,
  HistoryRecord,
  GetLabDataType,
} from './model/index';
export * from './model';
export const requestCommonSetUpGetInfoDialog = (params: SetUpGetInfoParams) =>
  http.post<{ scheme: SetUpGetInfoScheme }>(`${LCGETWAY}/acnsvr/CompanyItem/SetUpGetInfoDialog`, params);

export const requestCommonQueryAgent = (params: QueryAgentParams) =>
  http.post<any>(`${LCGETWAY}/acnsvr/CompanyItem/QueryAgent`, params);

export const requestCommonGetHistoryList = (params: any) =>
  http.post<HistoryRecord[]>(`${LCGETWAY}/acnsvr/CompanyItem/GetAllSequence`, params);

// 根据历史列表id查询 对应的label
export const requestCommonGetLabel = (params: any) =>
  http.post<GetLabDataType[]>(`${LCGETWAY}/agentdesigner/classAttribute/listData`, params);