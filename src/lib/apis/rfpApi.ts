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

export const updateRfp = ({
  orgId,
  rfpId,
  payload,
}: {
  orgId: string;
  rfpId: string;
  payload: any;
}) => {
  return apiFetch<TRFP>(
    `/api/${orgId}/rfps/${rfpId}`,
    {
      method: 'PUT',
    },
    payload
  );
};

export const generateSummary = ({
  orgId,
  rfpId,
}: {
  orgId: string;
  rfpId: string;
}) => {
  return apiFetch<TRFP>(`/api/${orgId}/rfps${rfpId}/summary`, {
    method: 'POST',
  });
};

export const deleteRfp = ({
  orgId,
  rfpId,
}: {
  orgId: string;
  rfpId: string;
}) => {
  return apiFetch<TRFP>(`/api/${orgId}/rfps/${rfpId}`, {
    method: 'DELETE',
  });
};
