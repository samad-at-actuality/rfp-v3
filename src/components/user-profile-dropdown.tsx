'use client';
import Link from 'next/link';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserInfoCtx } from '@/ctx/user-context';

export function UserProfileDropDown() {
  const { userInfo } = useUserInfoCtx();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className=' h-10 w-10 rounded-full  text-[#3B82F6] border-[1px] border-[#BFDBFE] '
            style={{
              background: 'linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 100%)',
            }}
          >
            <Avatar className='h-8 w-8'>
              <AvatarFallback>
                <div className='text-lg'>
                  {userInfo.email![0].toUpperCase()}
                </div>
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>
                {userInfo.name}
              </p>
              <p className='text-xs leading-none text-muted-foreground'>
                {userInfo.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className='cursor-pointer'>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer'>
              Change Password
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <Link href='/auth/logout'>
            <DropdownMenuItem className='cursor-pointer text-red-400 font-semibold'>
              Logout
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
