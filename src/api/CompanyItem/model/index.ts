import { CommonParams } from '@/api/common';

export type GroupAllocationParams = CommonParams<{
  objIdList: string[] | undefined;
  deptId: any;
}>;
export type DivisionAllocationParams = CommonParams<{
  objIdList: string[] | undefined;
  salesPersonId: any;
}>;

type DefaultThisObj = {
  code?: string;
  objId?: string;
  className?: string;
  company_code?: string;
  parent_id?: string;
  [key: string]: any;
};

interface AddCompanyThisObj {
  curCompanyCode: string;
  companyCode: string;
  parentId: string;
  userId: string;
}

export type AddCompanyParams = CommonParams<AddCompanyThisObj>;
export type QueryGroupParams = CommonParams<DefaultThisObj>;
export type ValidateCompanyParams = CommonParams<AddCompanyThisObj>;
export type DeleteCompanyParams = CommonParams<{ objId: string }>;

export interface GroupCompanyRecord {
  code?: string;
  companyObjId: string;
  className: string;
  container?: any;
  createAt: string;
  creator: string;
  headName?: any;
  isGlobal: number;
  lastUpdate: string;
  leftClass: string;
  leftId: number;
  lifeCycleState: string;
  modifier: string;
  objId: string;
  recycled?: any;
  remark?: any;
  rightClass?: any;
  rightId?: any;
  tenantId?: any;
  companyCode: string;
  treeId: string;
  companyName: string;
  children: GroupCompanyRecord[];
}
