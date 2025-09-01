import { TRFP } from '@/types/TRfp';
import { apiFetch } from '../fetchClient';

export const getOrgRfps = ({ orgId }: { orgId: string }) => {
  return apiFetch<TRFP[]>(`/api/${orgId}/rfps`);
};
