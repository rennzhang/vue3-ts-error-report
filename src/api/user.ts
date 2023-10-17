import { LCGETWAY } from '@/config/api';
import { http } from '@/utils/request';

// 获取用户信息
export const getUserInfoApi = (params: any) => http.post(`${LCGETWAY}/usrsvr/Usr/GetUserInfoByToken`, params);
