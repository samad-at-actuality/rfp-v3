import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getPrimaryFoldersChildren } from '@/lib/apis/foldersApi';
import { PrimaryFolders } from '@/lib/PrimaryFolders';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SecondaryFolders } from './SecondaryFolders';
export const dynamic = 'force-dynamic';

export default async function DataPage({
  params,
}: {
  params: Promise<{ orgId: string; primaryFolderSlug: string }>;
}) {
  const { orgId, primaryFolderSlug } = await params;
  const primaryFolder = PrimaryFolders.find(
    (folder) => folder.slug === primaryFolderSlug
  );

  if (!primaryFolder) {
    return notFound();
  }
  const folders = await getPrimaryFoldersChildren({
    orgId,
    type: primaryFolder.type,
  });

  // Sort folders by creation date (newest first)
  const sortedFolders = folders.data
    ? [...folders.data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];
  return (
    <div className='p-6 space-y-6'>
      <Breadcrumb>
        <BreadcrumbList className='text-[rgb(3.939% 3.939% 3.939%)]'>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={`/app/orgs/${orgId}/data`}
                className='text-2xl font-bold'
              >
                Knowledge Hub
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <span className='text-2xl font-bold'>{primaryFolder.name}</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <SecondaryFolders
        folders={sortedFolders}
        primaryFolderSlug={primaryFolderSlug}
        primaryFolderType={primaryFolder.type}
      />
    </div>
  );
}
