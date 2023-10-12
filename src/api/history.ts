// 获取历史版本列表
import { http } from '@/utils/request';
export const getHistoryList = (params: any) => http.post('/acnsvr/CompanyItem/GetAllSequence', params);
// 根据历史列表id查询 对应的label
export const getLabel = (params: any) => http.post('/agentdesigner/classAttribute/listData', params);
