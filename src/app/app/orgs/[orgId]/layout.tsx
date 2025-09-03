import { notFound, redirect } from 'next/navigation';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';

import { getUserInfo } from '@/lib/apis/userProfileApi';
import { getMyOrgs } from '@/lib/apis/organisationsApi';
import { LastOrgVisitSaver } from './LAST_ORG_VISIT_saver';

const HEADER_HEIGHT = 64;

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const userinfo = await getUserInfo();
  if (!userinfo) {
    return redirect('/auth/logout');
  }

  const orgs = await getMyOrgs();
  if (!orgs) {
    return redirect('/auth/logout');
  }
  const orgId = (await params).orgId;
  const org = orgs.find((org) => org.id === orgId);
  if (!org) {
    return notFound();
  }

  return (
    <div className='flex h-screen w-screen flex-col overflow-hidden'>
      <LastOrgVisitSaver orgId={org.id} />
      <Header headerHeight={`${HEADER_HEIGHT}px`} orgs={orgs} user={userinfo} />
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
  );
}
