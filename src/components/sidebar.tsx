'use client';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Package, Users, FilePen, User } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUserInfoCtx } from '@/ctx/user-context';

export const Sidebar = ({ showAdminButton }: { showAdminButton?: boolean }) => {
  const [currentPath, setCurrentPath] = React.useState('');

  React.useLayoutEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const projectSlug: string | undefined = currentPath
    ?.split('/app/orgs/')[1]
    ?.split('/')[0];

  const { userInfo } = useUserInfoCtx();

  if (showAdminButton) {
    return (
      <aside className='z-10 w-full flex-col border-r bg-background flex'>
        <nav className='flex-1 flex flex-col items-center gap-4 px-2 sm:py-4'>
          <LinkComponent
            onClick={() => {
              setCurrentPath(`/app/orgs`);
            }}
            whenEqual={currentPath === `/app/orgs`}
            currentPath={currentPath}
            linkPath={`/app/orgs`}
            name='Orgs'
          >
            <Home className='h-5 w-5' />
          </LinkComponent>

          <LinkComponent
            onClick={() => {
              setCurrentPath(`/app/admin`);
            }}
            whenEqual={currentPath === `/app/admin`}
            currentPath={currentPath}
            linkPath={`/app/admin`}
            name='Admin'
          >
            <User className='h-5 w-5' />
          </LinkComponent>
        </nav>
      </aside>
    );
  }
  return (
    <aside className='z-10 w-full flex-col border-r bg-background flex'>
      <nav className='flex-1 flex flex-col items-center gap-4 px-2 sm:py-4'>
        <LinkComponent
          onClick={() => {
            setCurrentPath(`/app/orgs/${projectSlug}`);
          }}
          whenEqual={currentPath === `/app/orgs/${projectSlug}`}
          currentPath={currentPath}
          linkPath={`/app/orgs/${projectSlug}`}
          name='Home'
        >
          <Home className='h-5 w-5' />
        </LinkComponent>
        {userInfo.isSuperAdmin && (
          <LinkComponent
            onClick={() => {
              setCurrentPath(`/app/admin`);
            }}
            whenEqual={currentPath === `/app/admin`}
            currentPath={currentPath}
            linkPath={`/app/admin`}
            name='Admin'
          >
            <User className='h-5 w-5 text-gray-600' />
          </LinkComponent>
        )}

        <LinkComponent
          onClick={() => {
            setCurrentPath(`/app/orgs/${projectSlug}/rfps`);
          }}
          currentPath={currentPath}
          linkPath={`/app/orgs/${projectSlug}/rfps`}
          name='RFP Response'
        >
          <FilePen className='h-5 w-5' />
        </LinkComponent>
        <LinkComponent
          onClick={() => {
            setCurrentPath(`/app/orgs/${projectSlug}/data`);
          }}
          currentPath={currentPath}
          linkPath={`/app/orgs/${projectSlug}/data`}
          name='Database'
        >
          <Package className='h-5 w-5' />
        </LinkComponent>
        <LinkComponent
          onClick={() => {
            setCurrentPath(`/app/orgs/${projectSlug}/team`);
          }}
          currentPath={currentPath}
          linkPath={`/app/orgs/${projectSlug}/team`}
          name='Team Members'
        >
          <Users className='h-5 w-5' />
        </LinkComponent>
      </nav>
      <div className='grid place-items-center pb-4'>
        {/* Wand action button can be added here when needed */}
      </div>
    </aside>
  );
};

const LinkComponent = ({
  currentPath,
  linkPath,
  name,
  children,
  whenEqual,
  onClick,
}: {
  currentPath: string | null;
  linkPath: string;
  name: string;
  children: React.ReactNode;
  whenEqual?: boolean;
  onClick?: () => void;
}) => {
  const router = useRouter();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={linkPath}
          onClick={() => {
            onClick?.();
            router.push(linkPath);
          }}
          className={`cursor-pointer group flex transition duration-100 size-10 shrink-0 items-center justify-center gap-2 rounded-lg text-lg font-semibold p-2 ${
            typeof whenEqual !== 'undefined'
              ? whenEqual
                ? ' bg-[#EEF2FF] text-blue-700 '
                : ' '
              : currentPath?.startsWith(linkPath)
                ? ' bg-[#EEF2FF] text-blue-700 '
                : ' text-muted-foreground'
          }`}
        >
          {children}
          <span className='sr-only'>{name}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side='right'>{name}</TooltipContent>
    </Tooltip>
  );
};
