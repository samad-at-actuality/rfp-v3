import { TOrg } from '@/types/TOrg';
import { apiFetch } from '../fetchClient';
import { TOrgRole } from '@/types/TUserRole';
import { TMember } from '@/types/TMember';

export const getMyOrgs = (token?: string) => {
  return apiFetch<TOrg[]>('/api/orgs', { token });
};

export const getSuperAdminOrgs = (token?: string) => {
  return apiFetch<TOrg[]>('/api/super-admin/orgs', {
    token,
  });
};

export const getOrgById = (orgId: string) => {
  return apiFetch<TOrg>(`/api/orgs/${orgId}`);
};

export const createOrg = (payload: {
  name: string;
  description: string;
  adminName: string;
  adminEmail: string;
}) => {
  return apiFetch<TOrg>(`/api/super-admin/orgs`, { method: 'POST' }, payload);
};

export const inviteMember = (payload: {
  orgId: string;
  payload: {
    name: string;
    email: string;
    role: TOrgRole;
  };
}) => {
  return apiFetch<TMember>(
    `/api/${payload.orgId}/team`,
    { method: 'POST' },
    payload.payload
  );
};

export const revokeMember = (payload: { orgId: string; userId: string }) => {
  return apiFetch<{ success: boolean }>(
    `/api/${payload.orgId}/team/${payload.userId}`,
    {
      method: 'DELETE',
    }
  );
};
