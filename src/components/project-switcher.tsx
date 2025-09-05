'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { setLastVisitedOrgAction } from '@/actions/last-visited-org-actions';
import { useOrgCtx } from '@/ctx/org-ctx';

// along with display all the orgs, it should also redirect to the first org if no org is selected i.e. /app/orgs -> /app/orgs/{orgId}.
export function ProjectSwitcher() {
  const { orgs } = useOrgCtx();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const currentProjectSlug: string | undefined = pathname
    ?.split('/app/orgs/')[1]
    ?.split('/')[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          aria-label='Select a org'
          className='w-[300px] cursor-pointer justify-between overflow-hidden bg-[#F9FAFB] text-[14px] font-medium'
        >
          <div className='flex flex-1 items-center overflow-hidden text-ellipsis'>
            <Avatar className='mr-2 h-5 w-5'>
              <AvatarImage
                src={'https://avatar.vercel.sh/personal.png'}
                className='grayscale'
              />
              <AvatarFallback />
            </Avatar>
            {orgs.find((p) => p.id === currentProjectSlug)?.name ||
              'No Organizations found'}
          </div>
          <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full min-w-[300px] cursor-pointer p-0'>
        <Command>
          <CommandList>
            <CommandInput placeholder='Search Organisation...' />
            <CommandEmpty>No Organizations found.</CommandEmpty>
            <CommandGroup>
              {orgs.length > 0 ? (
                orgs.map((org) => (
                  <Link
                    href={`/app/orgs/${org.id}`}
                    className='w-full cursor-pointer'
                    onClick={() => {
                      setLastVisitedOrgAction({ orgId: org.id });
                    }}
                    key={org.id}
                  >
                    <CommandItem
                      value={org.id}
                      className='flex cursor-pointer justify-start gap-4 text-sm'
                    >
                      {currentProjectSlug !== org.id ? (
                        <div className='h-4 w-4' />
                      ) : (
                        <CheckIcon
                          className={cn(
                            'h-4 w-4',
                            true ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      )}
                      <span className='mr-2'>{org.name}</span>
                    </CommandItem>
                  </Link>
                ))
              ) : (
                <CommandItem>No organizations available</CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
