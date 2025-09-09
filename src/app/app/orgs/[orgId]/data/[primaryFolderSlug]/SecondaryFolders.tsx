'use client';

import { TFolderInfo } from '@/types/TFolderInfo';
import { TPrimaryFolderEnum } from '@/types/TPrimaryFolderEnum';
import { getRelativeTime } from '@/lib/utils';
import { FolderOpenIcon, MoreHorizontal, PlusIcon } from 'lucide-react';
import { CreateFolderDialog } from '@/components/create-folder-dialog';
import Link from 'next/link';
import { useOrgCtx } from '@/ctx/org-ctx';
import { useState } from 'react';
import { createFolder } from '@/lib/apis/foldersApi';
import { toast } from 'sonner';

export const SecondaryFolders = ({
  folders: folders_,
  primaryFolderSlug,
  primaryFolderType,
}: {
  folders: TFolderInfo[];
  primaryFolderSlug: string;
  primaryFolderType: TPrimaryFolderEnum;
}) => {
  const {
    currentOrg: { id: orgId, role: currentOrgRole },
  } = useOrgCtx();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [folders, setFolders] = useState(folders_);

  const handleCreateFolder = async ({ name }: { name: string }) => {
    try {
      setIsLoading(true);
      const res = await createFolder({ orgId, type: primaryFolderType, name });

      if (res.data) {
        toast.success('Folder created successfully');
        setFolders((prev) => [...prev, res.data]);
        setIsOpen(false);
      } else {
        toast.error('Failed to create folder');
      }
    } catch {
      toast.error('Failed to create folder');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className='grid grid-cols-5 gap-8'>
      {currentOrgRole === 'ADMIN' && (
        <CreateFolderDialog
          trigger={
            <div className='flex items-center justify-center border-[1px] border-dashed border-gray-600 gap-2 rounded-lg h-[100px] hover:shadow-xl cursor-pointer transition-shadow duration-300 bg-white p-4 '>
              <span>
                <PlusIcon />
              </span>
            </div>
          }
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSave={handleCreateFolder}
          isLoading={isLoading}
        />
      )}
      {folders.map((rfp) => (
        <Link
          href={`/app/orgs/${orgId}/data/${primaryFolderSlug}/${rfp.id}`}
          key={rfp.id}
          className='flex rounded-lg h-[100px] shadow-[0px_1px_12px_0px_#1F29370D] hover:shadow-xl cursor-pointer transition-shadow duration-300 bg-white p-4 '
        >
          <div className='flex-1 flex flex-col justify-center gap-2'>
            <div className='flex items-center gap-2'>
              <FolderOpenIcon className='w-6 h-6 text-gray-500 font-semibold' />
              <span className='text-[#1F2937] font-semibold text-[16px]'>
                {rfp.name}
              </span>
            </div>
            <span className='text-gray-500 text-sm'>
              {rfp.createdAt !== rfp.updatedAt ? 'Edited' : 'Created'}{' '}
              {getRelativeTime(
                rfp.createdAt === rfp.updatedAt ? rfp.createdAt : rfp.updatedAt
              )}
            </span>
          </div>
          <div>
            <MoreHorizontal className='w-6 h-6 text-gray-500' />
          </div>
        </Link>
      ))}
    </div>
  );
};
