export interface UserInfo {
  objId: string;
  loginName: string;
  name: string;
  className: string;
  mobile: string;
  email: string;
  creator: string;
  modifier: string;
  personId: string;
  photo: string;
  remark: string;
  tenantId: string;
  tenantName: string;
  isDefault: number;
  isGlobal: boolean | null;
  isAdmin: number;
  isSuperAdminGrp: number;
  usrGrp: { name: string; code: string; usrGrpId: string }[];
  admRoles: [];
}

export interface UserType {
  token: string;
  userInfo: UserInfo | {};
  tenantId: string;
  userId: string;
  isSuperAdmin: boolean;
  from: string | null;
}
