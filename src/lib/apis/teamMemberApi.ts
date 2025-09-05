import { TMember } from '@/types/TMember';
import { apiFetch } from '../fetchClient';

export const getTeamMembers = (orgId: string) => {
  return apiFetch<TMember[]>(`/api/${orgId}/team`);
};
