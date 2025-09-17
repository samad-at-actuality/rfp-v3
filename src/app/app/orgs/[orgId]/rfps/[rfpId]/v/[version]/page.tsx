import { RfpDetailPageWrapperForVersion } from '@/components/SingleRFP/rfp-detail';
import { getRfpById } from '@/lib/apis/rfpApi';
import { notFound } from 'next/navigation';

export default async function RfpVersionPage({
  params,
}: {
  params: Promise<{
    orgId: string;
    rfpId: string;
    version: number;
  }>;
}) {
  const { orgId, rfpId, version } = await params;
  const rfp = await getRfpById({ orgId, rfpId, version });
  if (!rfp.data) {
    return notFound();
  }
  return <RfpDetailPageWrapperForVersion rfp={rfp.data} />;
}
