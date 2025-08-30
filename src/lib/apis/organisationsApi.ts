import { TOrg } from '@/types/TOrg';
import { apiFetch } from '../fetchClient';

export const getMyOrgs = () => {
  return apiFetch<TOrg[]>('/api/orgs');
};
