import Link from 'next/link';
import Image from 'next/image';

import { BellRingIcon } from 'lucide-react';

import { TUser } from '@/types/TUser';
import { TOrg } from '@/types/TOrg';

import { ProjectSwitcher } from './project-switcher';
import { HeaderSearchBar } from './header-search-bar';
import { UserProfileDropDown } from './user-profile-dropdown';

export const Header = async ({
  headerHeight,
  orgs,
  user,
}: {
  headerHeight: string;
  orgs: TOrg[];
  user: TUser;
}) => {
  return (
    <div
      className='flex h-16 items-center border-b pr-6'
      style={{
        height: headerHeight,
      }}
    >
      <div className='grid aspect-square h-full place-items-center'>
        <Link href='/'>
          <Image
            src='/assets/actuality_logo.svg'
            width='38'
            height='38'
            alt='Actuality logo'
          />
        </Link>
      </div>

      <ProjectSwitcher orgs={orgs} />
      <div className='gap-6 flex flex-1 justify-end items-center'>
        <div className='border-r-2 border-gray-200 pr-4 mr-2'>
          <HeaderSearchBar />
        </div>
        <span>
          <BellRingIcon className='w-6 h-6 text-gray-400' />
        </span>

        <UserProfileDropDown name={user.name} email={user.email} />
      </div>
    </div>
  );
};
