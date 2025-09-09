'use client';

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className='fixed flex items-center justify-center bg-white/80 backdrop-blur-sm w-full h-full'>
      <div className='flex flex-col items-center gap-4'>
        <Loader2 className='h-12 w-12 animate-spin text-primary' />
        <p className='text-lg font-medium text-gray-700'>Loading...</p>
      </div>
    </div>
  );
}
