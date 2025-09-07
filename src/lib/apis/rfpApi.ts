import { TRFP } from '@/types/TRfp';
import { apiFetch } from '../fetchClient';

export const getOrgRfps = ({ orgId }: { orgId: string }) => {
  return apiFetch<TRFP[]>(`/api/${orgId}/rfps`);
};

export const createRfp = ({ orgId, name }: { orgId: string; name: string }) => {
  return apiFetch<TRFP>(
    `/api/${orgId}/rfps`,
    {
      method: 'POST',
    },
    {
      name,
    }
  );
};

export const getRfpById = ({
  orgId,
  rfpId,
}: {
  orgId: string;
  rfpId: string;
}) => {
  return apiFetch<TRFP>(`/api/${orgId}/rfps/${rfpId}`);
};
