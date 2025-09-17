'use client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { JSX, useEffect, useState } from 'react';

export type TSummaryLink = {
  label: string;
  show: boolean;
  icon: JSX.Element;
};

export function RfpSummmaryLinks({
  summary_tabs,
}: {
  summary_tabs: TSummaryLink[];
}) {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setOpen(true); // Set initial open state after mount
  }, []);

  if (!isMounted) {
    return (
      <div className='w-full p-4'>
        <div className='font-medium flex items-center gap-2'>
          <ChevronDown className='w-4 h-4' />
          <span>Summary</span>
        </div>
      </div>
    );
  }

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className='w-full p-4'
    >
      <summary className='cursor-pointer list-none font-medium flex items-center gap-2'>
        {open ? (
          <ChevronUp className='w-4 h-4' />
        ) : (
          <ChevronDown className='w-4 h-4' />
        )}
        <span>Summary</span>
      </summary>

      <ul className='ml-6 mt-4 space-y-4'>
        {summary_tabs
          .filter((x) => x.show)
          .map((tab) => (
            <li
              className='flex items-center gap-2 hover:text-black'
              key={tab.label}
            >
              <Link
                className='flex items-center gap-2 hover:text-black w-full h-full'
                href={`#${tab.label.split(' ').join('')}`}
              >
                {tab.icon}
                <span className='flex-1 w-full overflow-hidden text-ellipsis whitespace-nowrap font-medium text-sm'>
                  {tab.label}
                </span>
              </Link>
            </li>
          ))}
      </ul>
    </details>
  );
}
