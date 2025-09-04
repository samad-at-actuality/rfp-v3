import { TOrg } from '@/types/TOrg';
import { apiFetch } from '../fetchClient';

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
