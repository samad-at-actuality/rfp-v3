import { TOrgRole } from './TRole';

export type TMember = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  isSuperAdmin: boolean;
  updatedAt: string;
  orgMemberships: [
    {
      orgId: string;
      role: TOrgRole;
      createdAt: string;
      updatedAt: string;
      createdBy: string;
    },
  ];
};

export type TMemberClient = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  isSuperAdmin: boolean;
  updatedAt: string;
  memebrShipCreatedAt: string;
  memberShipRole: TOrgRole;
  memberShipUpdatedAt: string;
  memberShipCreatedBy: string;
};
