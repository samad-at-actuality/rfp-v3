import { redirect } from 'next/navigation';

import { getOrgRfps } from '@/lib/apis/rfpApi';

import { RFPListing } from './RFPListing';

export default async function RfpHomePage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const orgId = (await params).orgId;
  const rfps_ = await getOrgRfps({ orgId });
  if (!rfps_.data) {
    return redirect('/auth/logout');
  }
  const rfps = rfps_.data;

  return (
    <div className='p-6 space-y-6'>
      <h2 className='text-2xl font-bold'>RFPs</h2>
      <RFPListing rfps={rfps} orgId={orgId} />
    </div>
  );
}
