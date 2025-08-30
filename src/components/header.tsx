import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { BellRingIcon } from 'lucide-react';

import { getUserInfo } from '@/lib/apis/userProfileApi';
import { getMyOrgs } from '@/lib/apis/organisationsApi';
import { ProjectSwitcher } from './project-switcher';
import { HeaderSearchBar } from './header-search-bar';
import { UserProfileDropDown } from './user-profile-dropdown';

export const Header = async () => {
  const usernfo = await getUserInfo();
  if (!usernfo) {
    return redirect('/auth/logout');
  }

  const orgs = await getMyOrgs();
  if (!orgs) {
    return redirect('/auth/logout');
  }

  return (
    <div className='flex h-16 items-center border-b pr-6'>
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

      <ProjectSwitcher orgs={orgs} redirectToFirstOrg={true} />
      <div className='gap-6 flex flex-1 justify-end items-center'>
        <div className='border-r-2 border-gray-200 pr-4 mr-2'>
          <HeaderSearchBar />
        </div>
        <span>
          <BellRingIcon className='w-6 h-6 text-gray-400' />
        </span>

        <UserProfileDropDown name={usernfo.name} email={usernfo.email} />
      </div>
    </div>
  );
};
