import { getFilesInFolder, getFolderById } from '@/lib/apis/foldersApi';
import { PrimaryFolders } from '@/lib/PrimaryFolders';
import { notFound } from 'next/navigation';
import { PersonSummaryForm } from '@/components/person-summary-form/person-summary-form';
import { TFolderInfoSummayType } from '@/types/TFolderInfo';

export default async function FolderInfoPage({
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

  const folderInfo = await getFolderById({
    orgId,
    folderId: secondaryFolderSlug,
  });

  if (folderInfo.error || !folderInfo.data) {
    return (
      <div className='p-6'>
        <h1 className='text-2xl font-bold text-red-500'>
          Something went wrong
        </h1>
      </div>
    );
  }

  const files = await getFilesInFolder({
    orgId,
    folderId: secondaryFolderSlug,
  });

  if (folderInfo.data.type === TFolderInfoSummayType.PEOPLE) {
    return (
      <PersonSummaryForm
        folderInfo={folderInfo.data!}
        orgId={orgId}
        primaryFolderName={primaryFolder.name}
        primaryFolderSlug={primaryFolderSlug}
        files={files.data || []}
      />
    );
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold text-red-500'>Data Not Found</h1>
    </div>
  );
}
