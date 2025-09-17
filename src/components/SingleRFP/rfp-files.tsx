import { extractFileNameFromKey } from '@/lib/utils';
import { ChevronDown, ChevronUp, FileIcon } from 'lucide-react';
import { useState } from 'react';

export function RfpFiles({ files }: { files: string[] }) {
  const [open, setOpen] = useState(true);

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
        <span>RFP Documents</span>
      </summary>

      <ul className='ml-6 mt-4 space-y-6'>
        {files.map((file) => (
          <li className='flex items-center gap-2 hover:text-black' key={file}>
            <FileIcon className='w-4 h-4' />
            <span className='flex-1 w-full overflow-hidden text-ellipsis whitespace-nowrap font-medium text-sm'>
              {extractFileNameFromKey(file)}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
