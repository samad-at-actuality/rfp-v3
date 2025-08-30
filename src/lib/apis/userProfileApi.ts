import { TUser } from '@/types/TUser';
import { apiFetch } from '../fetchClient';

export const getUserInfo = () => {
  return apiFetch<TUser>('/api/users/me');
};
