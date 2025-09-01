import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { getMyOrgs } from '@/lib/apis/organisationsApi';
import { setLastVisitedOrgAction } from '@/actions/last-visited-org-actions';

export const metadata = {
  title: 'Actuality Documentation',
  description: 'Your personal assistant for construction professionals',
};

export default async function AppPage() {
  const orgs = await getMyOrgs();
  if (!orgs) {
    return notFound();
  }
  const cookieStore = await cookies();
  const lastTimeVisitedOrg = cookieStore.get(
    process.env.COOKIE_NAME_FOR_ORG_PREFERENCE!
  );
  if (lastTimeVisitedOrg) {
    const org = orgs.find((org) => org.id === lastTimeVisitedOrg.value);
    if (org) {
      return redirect(`/app/orgs/${org.id}`);
    }
  }
  await setLastVisitedOrgAction({ orgId: orgs[0].id });

  return redirect(`/app/orgs/${orgs[0].id}`);
}
