import { TUser } from '@/types/TUser';
import { apiFetch } from '../fetchClient';

export const getUserInfo = (token?: string) => {
  return apiFetch<TUser>('/api/users/me', { token });
};
