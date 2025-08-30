'use client';
import Image from 'next/image';
import { Input } from './ui/input';

export const HeaderSearchBar = () => {
  return (
    <div className='w-[400px] rounded-3xl relative ml-auto flex items-center border-1 shadow-[0px_1px_4px_0px_#1F29370D]'>
      <Image
        src='/assets/magic-wand.svg'
        alt='logo'
        width={20}
        height={20}
        className='text-muted-foreground absolute left-3 h-[20px] w-[20px]  '
      />
      <Input
        type='search'
        placeholder={'Ask AI ...'}
        className='bg-background w-full rounded-3xl border-0 pl-10 outline-none focus-visible:outline-none'
      />
    </div>
  );
};
