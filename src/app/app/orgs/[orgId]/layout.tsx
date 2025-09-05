import { notFound, redirect } from 'next/navigation';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';

import { getMyOrgs } from '@/lib/apis/organisationsApi';
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
  const orgs_ = await getMyOrgs();

  if (!orgs_.data) {
    return redirect('/auth/logout');
  }

  const orgId = (await params).orgId;

  const org = orgs_.data.find((org) => org.id === orgId);

  if (!org) {
    return notFound();
  }

  return (
    <OrgsWrapper orgs={orgs_.data} currentOrgId={org.id}>
      <div className='flex h-screen w-screen flex-col overflow-hidden'>
        <LastOrgVisitSaver orgId={org.id} />
        <Header
          headerHeight={`${HEADER_HEIGHT}px`}
          disableOrgSwitcher={false}
          disableAskAi={false}
          disableNotification={false}
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
