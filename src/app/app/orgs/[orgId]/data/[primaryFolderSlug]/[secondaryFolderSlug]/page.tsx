import { getFilesInFolder, getFolderById } from '@/lib/apis/foldersApi';
import { PrimaryFolders } from '@/lib/PrimaryFolders';
import { notFound } from 'next/navigation';
import { SummaryForm } from './SummaryForm';

export default async function TertiaryFolderPage({
  params,
}: {
  params: Promise<{
    secondaryFolderSlug: string;
    primaryFolderSlug: string;
    orgId: string;
  }>;
}) {
  const { secondaryFolderSlug, primaryFolderSlug, orgId } = await params;
  const primaryFolder = PrimaryFolders.find(
    (folder) => folder.slug === primaryFolderSlug
  );
  if (!primaryFolder) {
    return notFound();
  }
  if (primaryFolder.type === 'PEOPLE' || primaryFolder.type === 'PROJECTS') {
    const folderInfo = await getFolderById({
      orgId,
      folderId: secondaryFolderSlug,
    });
    return <pre className='w-full'>{JSON.stringify(folderInfo, null, 2)}</pre>;
  }
  const files = await getFilesInFolder({
    orgId,
    folderId: secondaryFolderSlug,
  });

  return <pre className='w-full'>{JSON.stringify(files, null, 2)}</pre>;
}
