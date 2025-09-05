import { TOrgRole } from './TUserRole';

type orgMemberships = {
  orgId: string;
  role: TOrgRole;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type TUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  isSuperAdmin: boolean;
  updatedAt: string;
  // if isSuperAdmin:true, orgMemberships will be empty
  orgMemberships: orgMemberships[];
};
