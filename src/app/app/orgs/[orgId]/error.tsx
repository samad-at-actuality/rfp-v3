'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center p-4 text-center'>
      <div className='mx-auto max-w-md space-y-6 rounded-lg border bg-background p-8 shadow-sm'>
        <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
          <AlertCircle className='h-8 w-8 text-red-600' />
        </div>

        <div className='space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight text-foreground'>
            Something went wrong!
          </h2>
          <p className='text-muted-foreground'>
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>

        <div className='flex flex-col gap-2 sm:flex-row sm:justify-center'>
          <Button variant='outline' onClick={reset} className='gap-2'>
            <RefreshCw className='h-4 w-4' />
            Try again
          </Button>
          <Button asChild variant='ghost'>
            <a href='/'>Go to home</a>
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className='mt-6 rounded-md border p-4 text-left text-sm'>
            <summary className='cursor-pointer font-medium'>
              Error details
            </summary>
            <pre className='mt-2 overflow-x-auto rounded bg-muted p-2 text-xs'>
              {error.stack || error.toString()}
            </pre>
            {error.digest && (
              <p className='mt-2 text-xs'>
                <span className='font-medium'>Digest:</span> {error.digest}
              </p>
            )}
          </details>
        )}
      </div>
    </div>
  );
}
