import { post } from '@/service/request';
import { GenerateService } from '@/baseFramework/baseService';

// 获取token
export const getTokenApi = GenerateService(params => post(`/usrsvr/Usr/GetTokenFromCode`, { code: params.code }));
