'use client';

import { CreateFolderDialog } from '@/components/create-folder-dialog';
import { useOrgCtx } from '@/ctx/org-ctx';
import { createRfp } from '@/lib/apis/rfpApi';
import { getRelativeTime } from '@/lib/utils';
import { TRFP } from '@/types/TRfp';
import { FileSignature, MoreHorizontal, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export const RFPListing = ({
  rfps: rfps_,
  orgId,
}: {
  rfps: TRFP[];
  orgId: string;
}) => {
  const [rfps, setRfps] = useState(rfps_);
  const {
    currentOrg: { role: currentOrgRole },
  } = useOrgCtx();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateFolder = async ({ name }: { name: string }) => {
    try {
      setIsLoading(true);
      const res = await createRfp({ orgId, name });

      if (res.data) {
        toast.success('RFP created successfully');
        setRfps((prev) => [...prev, res.data]);
        setIsOpen(false);
      } else {
        toast.error('Failed to create RFP');
      }
    } catch {
      toast.error('Failed to create RFP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='grid grid-cols-6 gap-8'>
      {currentOrgRole === 'ADMIN' && (
        <CreateFolderDialog
          formLabel='Create RFP'
          inputPlaceholder='RFP Name'
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
      {rfps.length === 0 && currentOrgRole !== 'ADMIN' && (
        <p className='text-gray-500 text-sm text-center'>No RFPs found</p>
      )}
      {rfps.map((rfp) => (
        <Link
          href={`/app/orgs/${orgId}/rfps/${rfp.id}`}
          key={rfp.id}
          className='flex rounded-lg h-[100px] shadow-[0px_1px_12px_0px_#1F29370D] hover:shadow-xl cursor-pointer transition-shadow duration-300 bg-white p-4 '
        >
          <div className='flex-1 flex flex-col justify-center gap-2'>
            <div className='flex items-center gap-2'>
              <FileSignature className='w-6 h-6 text-gray-500 font-semibold' />
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
