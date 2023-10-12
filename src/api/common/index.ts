import { http } from '@/utils/request';
import type { SetUpGetInfoParams, SetUpGetInfoResponse, QueryAgentParams } from './model/index';

export const requestCommonSetUpGetInfoDialog = (params: SetUpGetInfoParams) =>
  http.post<any, SetUpGetInfoResponse>(`/acnsvr/CompanyItem/SetUpGetInfoDialog`, params);

export const requestCommonQueryAgent = (params: QueryAgentParams) =>
  http.post<any, any>(`/acnsvr/CompanyItem/QueryAgent`, params);
