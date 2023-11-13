type DefaultThisObj = {
  code?: string;
  objId?: string;
  className?: string;
  company_code?: string;
  parent_id?: string;
  [key: string]: any;
};

interface CommonParams<T extends DefaultThisObj> {
  className: string;
  thisObj: T;
}
interface AddExistCustomersThisObj {
  rightId: string;
  leftId: string;
  tenantId: string;
  userId: string;
}

export type AddExistCustomersParams = CommonParams<AddExistCustomersThisObj>;
