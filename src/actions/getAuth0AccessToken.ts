'use server';

import { auth0 } from '@/lib/auth0';

export const getAuth0AccessToken = async () => {
  const { token: accessToken } = await auth0.getAccessToken();
  return accessToken;
};
