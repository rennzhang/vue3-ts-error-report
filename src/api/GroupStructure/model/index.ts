type DefaultThisObj = {
  code?: string;
  objId?: string;
  className?: string;
  company_code?: string;
  parent_id?: string;
  [key: string]: any;
};

interface GroupCommonParams<T extends DefaultThisObj> {
  className: string;
  thisObj: T;
}

interface AddCompanyThisObj {
  company_code: string;
  parent_id: string;
}

interface ValidateCompanyThisObj {
  company_code: string;
  parent_id: string;
  user_id: string;
}

export type AddCompanyParams = GroupCommonParams<AddCompanyThisObj>;
export type QueryGroupParams = GroupCommonParams<DefaultThisObj>;
export type ValidateCompanyParams = GroupCommonParams<ValidateCompanyThisObj>;
export type DeleteCompanyParams = GroupCommonParams<{ obj_id: string }>;

export interface GroupCompanyRecord {
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
