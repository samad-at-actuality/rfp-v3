import { PrimaryFolders } from '@/lib/PrimaryFolders';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { MoreHorizontal } from 'lucide-react';
import FolderListing from './[primaryFolderSlug]/FolderListing';

export default async function DataPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const orgId = (await params).orgId;

  return (
    <div className='p-6 space-y-6' style={{ fontFamily: 'Inter, sans-serif' }}>
      <h2 className='text-2xl font-bold'>Knowledge Hub</h2>

      <FolderListing orgId={orgId} />

      {/* <div className="grid grid-cols-4 gap-8">
      {PrimaryFolders.map((folder) => (
        <Link
          key={folder.slug}
          href={`/app/orgs/${orgId}/data/${folder.slug}`}
          className="relative flex flex-col justify-between rounded-lg h-[80px] bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 p-4"
        >
          
          <MoreHorizontal className="w-5 h-5 text-gray-400 absolute top-3 right-3 cursor-pointer" />

       
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <folder.icon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-800 font-semibold text-base">
                {folder.name}
              </span>
            </div>
            <p className="text-sm text-gray-500">
                3 items
            </p>
          </div>
        </Link>
      ))}
    </div> */}
    </div>
  );
}
