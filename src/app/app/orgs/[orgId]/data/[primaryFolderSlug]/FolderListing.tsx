'use client'; // only if you plan to use hooks like useState/useEffect

import React, { useEffect, useState } from 'react';

import { PrimaryFolders } from '@/lib/PrimaryFolders';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { MoreHorizontal } from 'lucide-react';
import { apiFetch } from '@/lib/fetchClient';

interface FolderListingProps {
  orgId: string;
}

const FolderListing: React.FC<FolderListingProps> = ({ orgId }) => {
  const [folderCounts, setFolderCounts] = useState<Record<string, number>>({});

  const getFolderCount = async () => {
    //  setRenameLoading(id);
    try {
      const response = await apiFetch<any>(
        `/api/${orgId}/knowledge-hub/folders/count`,
        {
          method: 'GET',
        }
      );

      if (response) {
        console.log('Folder Count Data', response.data);
        const countsMap: Record<string, number> = {};
        response.data.forEach((item: any) => {
          countsMap[item.type] = item.count;
        });
        setFolderCounts(countsMap);
      }
    } catch (error) {
      console.error('Error renaming RFP:', error);
    }
  };

  useEffect(() => {
    getFolderCount();
  }, [orgId]);
  return (
    <div className='grid grid-cols-4 gap-8'>
      {PrimaryFolders.map((folder) => {
        const count = folderCounts[folder.id] || 0; // ✅ use id instead of type

        return (
          <Link
            key={folder.slug}
            href={`/app/orgs/${orgId}/data/${folder.slug}`}
            className='relative flex flex-col justify-between rounded-lg h-[80px] bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 p-4'
          >
            <MoreHorizontal className='w-5 h-5 text-gray-400 absolute top-3 right-3 cursor-pointer' />

            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <folder.icon className='w-5 h-5 text-gray-500' />
                <span className='text-gray-800 font-semibold text-base'>
                  {folder.name}
                </span>
              </div>
              <p className='text-sm text-gray-500'>
                {count} {count === 1 ? 'item' : 'items'}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default FolderListing;
