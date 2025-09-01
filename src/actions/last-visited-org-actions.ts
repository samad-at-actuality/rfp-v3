'use server';

import { cookies } from 'next/headers';

export const setLastVisitedOrgAction = async ({ orgId }: { orgId: string }) => {
  const cookieStore = await cookies();
  cookieStore.set(process.env.COOKIE_NAME_FOR_ORG_PREFERENCE!, orgId);
};
