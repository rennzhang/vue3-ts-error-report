import { http } from '@/utils/request';
import type {
  QueryGroupParams,
  GroupCompanyRecord,
  AddCompanyParams,
  ValidateCompanyParams,
  DeleteCompanyParams,
} from './model';
import { GETWAY } from '@/config/api';
export * from './model';

//* 集团结构-api */
// 查询集团树结构
export const getGroupTree = (params: QueryGroupParams) =>
  http.post<GroupCompanyRecord[]>(`${GETWAY}/CompanyItemRelation/QueryCompanyTree`, params);

// 在集团树中添加公司前校验
export const validateInsertCompanyTreePre = (params: ValidateCompanyParams) =>
  http.post<unknown>(`${GETWAY}/CompanyItemRelation/ValidateInsertCompanyTreePre`, params);

// 在集团树中添加公司
export const insertCompanyTree = (params: AddCompanyParams) =>
  http.post<unknown>(`${GETWAY}/CompanyItemRelation/InsertCompanyTree`, params);

// 从集团结构树中删除公司
export const deleteCompanyForGroup = (params: DeleteCompanyParams) =>
  http.post<GroupCompanyRecord>(`${GETWAY}/CompanyItemRelation/DeleteCompanyTree`, params);
