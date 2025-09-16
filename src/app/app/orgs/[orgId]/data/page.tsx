import FolderListing from './[primaryFolderSlug]/FolderListing';
import { getPrimaryFolderChildrenCount } from '@/lib/apis/foldersApi';

export default async function DataPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const orgId = (await params).orgId;
  const folderCounts = await getPrimaryFolderChildrenCount({ orgId });
  return (
    <div className='p-6 space-y-6'>
      <h2 className='text-2xl font-bold'>Knowledge Hub</h2>

      <FolderListing orgId={orgId} folderCounts={folderCounts.data || []} />
    </div>
  );
}
