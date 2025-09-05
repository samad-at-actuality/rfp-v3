import { TMember } from '@/types/TMember';
import { apiFetch } from '../fetchClient';
import { TOrgRole } from '@/types/TUserRole';

export const getTeamMembers = (orgId: string) => {
  return apiFetch<TMember[]>(`/api/${orgId}/team`);
};

export const updateMemberRole = ({
  orgId,
  userId,
  payload,
}: {
  orgId: string;
  userId: string;
  payload: { role: TOrgRole };
}) => {
  return apiFetch<TMember>(
    `/api/${orgId}/team/${userId}`,
    { method: 'PUT' },
    payload
  );
};
