import { TOrgRole } from './TRole';

export type TOrg = {
  name: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  role: TOrgRole;
};

export type TOrgs = TOrg[];
