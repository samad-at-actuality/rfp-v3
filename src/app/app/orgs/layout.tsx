import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen w-screen flex-col overflow-hidden'>
      <Header />
      <div className='flex h-full w-full flex-1 overflow-hidden'>
        <Sidebar />
        <div className='flex-1 overflow-x-hidden overflow-y-auto'>
          {children}
        </div>
      </div>
    </div>
  );
}
