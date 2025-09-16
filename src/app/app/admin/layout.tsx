import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';

const HEADER_HEIGHT = 64;

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen w-screen flex-col overflow-hidden'>
      <Header
        headerHeight={`${HEADER_HEIGHT}px`}
        disableAskAi={true}
        disableOrgSwitcher={true}
        disableNotification={true}
      />
      <div className='flex h-full w-full flex-1 overflow-hidden'>
        <div
          style={{ width: `${HEADER_HEIGHT}px` }}
          className='h-full overflow-y-auto overflow-x-hidden'
        >
          <Sidebar showAdminButton />
        </div>
        <div className='flex-1 overflow-x-hidden overflow-y-auto bg-[#F9FAFB]'>
          {children}
        </div>
      </div>
    </div>
  );
}
