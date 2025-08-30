type orgMemberships = {
  orgId: string;
  role: string;
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
  orgMemberships: orgMemberships[];
};
