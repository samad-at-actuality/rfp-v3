import { TOrg } from '@/types/TOrg';
import { apiFetch } from '../fetchClient';

export const getMyOrgs = (token?: string) => {
  return apiFetch<TOrg[]>('/api/orgs', { token });
};
