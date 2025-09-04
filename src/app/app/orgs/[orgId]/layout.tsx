import { notFound, redirect } from 'next/navigation';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';

import { getMyOrgs, getSuperAdminOrgs } from '@/lib/apis/organisationsApi';
import { getUserInfo } from '@/lib/apis/userProfileApi';
import { OrgsWrapper } from '@/ctx/org-ctx';
import { LastOrgVisitSaver } from './LAST_ORG_VISIT_saver';

const HEADER_HEIGHT = 64;

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const userInfo = await getUserInfo();

  const orgs = userInfo?.isSuperAdmin
    ? await getSuperAdminOrgs()
    : await getMyOrgs();

  if (!orgs) {
    return redirect('/auth/logout');
  }

  const orgId = (await params).orgId;

  const org = orgs.find((org) => org.id === orgId);

  if (!org) {
    return notFound();
  }

  return (
    <OrgsWrapper orgs={orgs} currentOrgId={org.id}>
      <div className='flex h-screen w-screen flex-col overflow-hidden'>
        <LastOrgVisitSaver orgId={org.id} />
        <Header
          headerHeight={`${HEADER_HEIGHT}px`}
          disableOrgSwitcher={false}
          disableAskAi={false}
        />
        <div className='flex h-full w-full flex-1 overflow-hidden'>
          <div
            style={{ width: `${HEADER_HEIGHT}px` }}
            className='h-full overflow-y-auto overflow-x-hidden'
          >
            <Sidebar />
          </div>
          <div className='flex-1 overflow-x-hidden overflow-y-auto bg-[#F9FAFB]'>
            {children}
          </div>
        </div>
      </div>
    </OrgsWrapper>
  );
}
