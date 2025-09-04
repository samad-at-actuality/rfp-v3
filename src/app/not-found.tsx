import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 text-center'>
      <div className='space-y-6'>
        <div className='mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/20'>
            <span className='text-2xl font-bold text-primary'>404</span>
          </div>
        </div>

        <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
          Page not found
        </h1>

        <p className='mx-auto max-w-xl text-lg text-gray-600'>
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved or deleted.
        </p>

        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <Button asChild className='gap-2' size='lg'>
            <Link href='/'>
              <Home className='h-4 w-4' />
              Go back home
            </Link>
          </Button>

          <Button variant='outline' asChild className='gap-2' size='lg'>
            <Link href='javascript:history.back()'>
              <ArrowLeft className='h-4 w-4' />
              Go back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
