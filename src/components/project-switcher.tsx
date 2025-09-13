'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CheckIcon, ChevronsUpDown, Plus, Building2 } from 'lucide-react';

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
import { Skeleton } from '@/components/ui/skeleton';

import { setLastVisitedOrgAction } from '@/actions/last-visited-org-actions';
import { useOrgCtx } from '@/ctx/org-ctx';

export function ProjectSwitcher() {
  const { orgs } = useOrgCtx();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract current project slug from URL
  const currentProjectSlug = useMemo(() => {
    return pathname?.split('/app/orgs/')[1]?.split('/')[0];
  }, [pathname]);

  // Find current organization
  const currentOrg = useMemo(() => {
    return orgs.find((org) => org.id === currentProjectSlug);
  }, [orgs, currentProjectSlug]);

  // Filter organizations based on search term
  const filteredOrgs = useMemo(() => {
    if (!searchTerm) {
      return orgs;
    }
    return orgs.filter(
      (org) =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orgs, searchTerm]);

  // Redirect to first org if no org is selected and we're on /app/orgs
  useEffect(() => {
    if (!currentProjectSlug && orgs.length > 0 && pathname === '/app/orgs') {
      router.push(`/app/orgs/${orgs[0].id}`);
      setLastVisitedOrgAction({ orgId: orgs[0].id });
    }
  }, [currentProjectSlug, orgs, pathname, router]);

  const handleSelect = (orgId: string) => {
    setLastVisitedOrgAction({ orgId });
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          aria-label='Select an organization'
          className={cn(
            'w-[300px] justify-between overflow-hidden bg-background text-sm font-medium',
            'hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <div className='flex items-center overflow-hidden'>
            <Avatar className='mr-2 h-5 w-5 flex-shrink-0'>
              <AvatarImage
                src={'https://avatar.vercel.sh/personal.png'}
                alt={'Organization'}
                className={cn('grayscale')}
              />
              <AvatarFallback>
                <Building2 className='h-3 w-3' />
              </AvatarFallback>
            </Avatar>
            <span className='truncate'>
              {currentOrg?.name || 'Select organization'}
            </span>
          </div>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-0' align='start'>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder='Search organization...'
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>
              {searchTerm
                ? 'No organizations found.'
                : 'No organizations available.'}
            </CommandEmpty>
            <CommandGroup heading='Organizations'>
              {filteredOrgs.length > 0 ? (
                filteredOrgs.map((org) => (
                  <Link
                    href={`/app/orgs/${org.id}`}
                    className='w-full cursor-pointer'
                    onClick={() => handleSelect(org.id)}
                    key={org.id}
                  >
                    <CommandItem
                      value={org.id}
                      className='flex items-center gap-2 text-sm cursor-pointer'
                    >
                      <div className='flex h-4 w-4 items-center justify-center'>
                        <CheckIcon
                          className={cn(
                            'h-4 w-4',
                            currentProjectSlug === org.id
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </div>
                      <Avatar className='mr-2 h-4 w-4'>
                        <AvatarImage
                          src={'https://avatar.vercel.sh/personal.png'}
                          alt={org.name}
                          className={cn('grayscale')}
                        />
                        <AvatarFallback>
                          <Building2 className='h-3 w-3' />
                        </AvatarFallback>
                      </Avatar>
                      <span className='truncate'>{org.name}</span>
                    </CommandItem>
                  </Link>
                ))
              ) : (
                <CommandItem disabled className='text-muted-foreground'>
                  No organizations available
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
