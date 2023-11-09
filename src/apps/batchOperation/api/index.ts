import { http } from '@/utils/request';
import { LCGETWAY } from '@/config/api';
import type { LOVRecord } from './model/index';
export * from './model';

export const requestCommonQueryLOVList = () =>
  http.post<{ data: LOVRecord[] }>(`${LCGETWAY}/acnsvr/LovDef/QueryItem`, {
    className: 'LovDef',
    thisObj: {
      pageNo: 1,
      pageSize: 9999,
      condition: {
        name: '',
      },
      orderDesc: 'createAt',
    },
  });

export const requestCommonUpdateLOVItem = (params: any) =>
  http.post<{ data: LOVRecord[] }>(`${LCGETWAY}/acnsvr/LovDef/UpdateItem`, params);

export const requestCommonCreateLOVItem = (params: any) =>
  http.post<{ data: LOVRecord[] }>(`${LCGETWAY}/acnsvr/LovDef/CreateItem`, params);
