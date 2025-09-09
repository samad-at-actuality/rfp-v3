import RfpPage from '@/components/SingleRFP/rfp-page';
import { getRfpById } from '@/lib/apis/rfpApi';
import { notFound } from 'next/navigation';

export default async function SingleRfpPage({
  params,
}: {
  params: Promise<{ orgId: string; rfpId: string }>;
}) {
  const { orgId, rfpId } = await params;
  const rfp = await getRfpById({ orgId, rfpId });
  if (!rfp.data) {
    return notFound();
  }
  return <RfpPage rfp={rfp.data} orgId={orgId} />;
}
