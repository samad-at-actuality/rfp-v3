import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FolderOpenIcon, MoreHorizontal, PlusIcon } from 'lucide-react';
import { getOrgRfps } from '@/lib/apis/rfpApi';
import { getRelativeTime } from '@/lib/utils';

export default async function RfpHomePage({
  params: { orgId },
}: {
  params: { orgId: string };
}) {
  const rfps = await getOrgRfps({ orgId });
  if (!rfps) {
    return redirect('/auth/logout');
  }
  console.log('rfps: ', rfps);
  return (
    <div className='p-6 space-y-6'>
      <h2 className='text-2xl font-bold'>RFPs</h2>
      <div className='grid grid-cols-5 gap-8'>
        <div className='flex items-center justify-center border-[1px] border-dashed border-gray-600 gap-2 rounded-lg h-[100px] hover:shadow-xl cursor-pointer transition-shadow duration-300 bg-white p-4 '>
          <span>
            <PlusIcon />
          </span>
          New RFP
        </div>
        {rfps.map((rfp) => (
          <Link
            href={`/app/orgs/${orgId}/rfps/${rfp.id}`}
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
                  rfp.createdAt === rfp.updatedAt
                    ? rfp.createdAt
                    : rfp.updatedAt
                )}
              </span>
            </div>
            <div>
              <MoreHorizontal className='w-6 h-6 text-gray-500' />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
