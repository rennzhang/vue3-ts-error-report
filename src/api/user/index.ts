import { LCGETWAY } from '@/config/api';
import { http } from '@/utils/request';
import { UserInfo } from './model';
export * from './model';
// 获取用户信息
export const getUserInfoByToken = (params: { token: string }) =>
  http.post<UserInfo>(`${LCGETWAY}/usrsvr/Usr/GetUserInfoByToken`, params);
