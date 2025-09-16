import PhPage from '@/components/promptHub/ph-page';
import RfpPage from '@/components/SingleRFP/rfp-page';
import { getRfpById } from '@/lib/apis/rfpApi';
import { notFound } from 'next/navigation';

export default async function SingleRfpPage({
  params,
}: {
  params: Promise<{ orgId: string; rfpId: string }>;
}) {
  const {rfpId } = await params;
       const orgId = (await params).orgId;

  const rfp = await getRfpById({ orgId, rfpId });
  if (!rfp.data) {
    return notFound();
  }
  return <PhPage rfp={rfp.data} orgId={orgId} />;
}
