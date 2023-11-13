//* 活动管理-api */
import { http } from '@/utils/request';
import type { AddExistCustomersParams } from './model';
import { GETWAY } from '@/config/api';
export * from './model';

export const addExistCustomers = (params: AddExistCustomersParams) =>
  http.post(`${GETWAY}/ActivityItem/AddActivityCustomerRelation`, params);
