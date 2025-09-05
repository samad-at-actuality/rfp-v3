import Link from 'next/link';
import Image from 'next/image';

import { BellRingIcon } from 'lucide-react';

import { ProjectSwitcher } from './project-switcher';
import { HeaderSearchBar } from './header-search-bar';
import { UserProfileDropDown } from './user-profile-dropdown';

export const Header = async ({
  headerHeight,
  disableOrgSwitcher,
  disableAskAi,
  disableNotification,
}: {
  headerHeight: string;
  disableOrgSwitcher: boolean;
  disableAskAi: boolean;
  disableNotification: boolean;
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
            width={38}
            height={38}
            alt='Actuality logo'
          />
        </Link>
      </div>

      {!disableOrgSwitcher && <ProjectSwitcher />}
      <div className='gap-6 flex flex-1 justify-end items-center'>
        {!disableAskAi && (
          <div className='border-r-2 border-gray-200 pr-4 mr-2'>
            <HeaderSearchBar />
          </div>
        )}
        {!disableNotification && (
          <span>
            <BellRingIcon className='w-6 h-6 text-gray-400' />
          </span>
        )}
        <UserProfileDropDown />
      </div>
    </div>
  );
};
