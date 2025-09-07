import { notFound, redirect } from 'next/navigation';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';

import { getMyOrgs } from '@/lib/apis/organisationsApi';
import { OrgsWrapper } from '@/ctx/org-ctx';
import { LastOrgVisitSaver } from './LAST_ORG_VISIT_saver';
import { AskAIWrapper } from '@/ctx/ask-ai-ctx';
import { TPrimaryFolderEnum } from '@/types/TPrimaryFolderEnum';
import { getPrimaryFoldersChildren } from '@/lib/apis/foldersApi';

const HEADER_HEIGHT = 64;
const getKnowledgeHubStructure = async ({ orgId }: { orgId: string }) => {
  const [people, projects, company_info, past_rfps, other] =
    await Promise.allSettled([
      getPrimaryFoldersChildren({ orgId, type: TPrimaryFolderEnum.PEOPLE }),
      getPrimaryFoldersChildren({ orgId, type: TPrimaryFolderEnum.PROJECTS }),
      getPrimaryFoldersChildren({
        orgId,
        type: TPrimaryFolderEnum.COMPANY_INFO,
      }),
      getPrimaryFoldersChildren({ orgId, type: TPrimaryFolderEnum.PAST_RFPS }),
      getPrimaryFoldersChildren({ orgId, type: TPrimaryFolderEnum.OTHER }),
    ]);
  const result: {
    type: TPrimaryFolderEnum;
    label: string;
    index: number;
    values: { folderId: string; name: string }[];
  }[] = [];

  if (people.status === 'fulfilled' && people.value && people.value.data) {
    result.push({
      type: TPrimaryFolderEnum.PEOPLE,
      label: 'People',
      index: 0,
      values: people.value.data.map((folder) => ({
        folderId: folder.id,
        name: folder.name,
      })),
    });
  }
  if (
    projects.status === 'fulfilled' &&
    projects.value &&
    projects.value.data
  ) {
    result.push({
      type: TPrimaryFolderEnum.PROJECTS,
      label: 'Projects',
      index: 1,
      values: projects.value.data.map((folder) => ({
        folderId: folder.id,
        name: folder.name,
      })),
    });
  }
  if (
    company_info.status === 'fulfilled' &&
    company_info.value &&
    company_info.value.data
  ) {
    result.push({
      type: TPrimaryFolderEnum.COMPANY_INFO,
      label: 'Company Info',
      index: 2,
      values: company_info.value.data.map((folder) => ({
        folderId: folder.id,
        name: folder.name,
      })),
    });
  }
  if (
    past_rfps.status === 'fulfilled' &&
    past_rfps.value &&
    past_rfps.value.data
  ) {
    result.push({
      type: TPrimaryFolderEnum.PAST_RFPS,
      label: 'Past RFPS',
      index: 3,
      values: past_rfps.value.data.map((folder) => ({
        folderId: folder.id,
        name: folder.name,
      })),
    });
  }
  if (other.status === 'fulfilled' && other.value && other.value.data) {
    result.push({
      type: TPrimaryFolderEnum.OTHER,
      label: 'Other',
      index: 4,
      values: other.value.data.map((folder) => ({
        folderId: folder.id,
        name: folder.name,
      })),
    });
  }

  return result;
};

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const orgs_ = await getMyOrgs();

  if (!orgs_.data) {
    return redirect('/auth/logout');
  }

  const orgId = (await params).orgId;

  const org = orgs_.data.find((org) => org.id === orgId);

  if (!org) {
    return notFound();
  }
  const knowledgeHubStructure = await getKnowledgeHubStructure({ orgId });
  return (
    <OrgsWrapper orgs={orgs_.data} currentOrgId={org.id}>
      <AskAIWrapper knowledgeHubStructure={knowledgeHubStructure}>
        <div className='flex h-screen w-screen flex-col overflow-hidden'>
          <LastOrgVisitSaver orgId={org.id} />
          <Header
            headerHeight={`${HEADER_HEIGHT}px`}
            disableOrgSwitcher={false}
            disableAskAi={false}
            disableNotification={false}
          />
          <div className='flex h-full w-full flex-1 overflow-hidden'>
            <div
              style={{ width: `${HEADER_HEIGHT}px` }}
              className='h-full overflow-y-auto overflow-x-hidden'
            >
              <Sidebar />
            </div>
            <div className='flex-1 overflow-x-hidden overflow-y-auto bg-[#F9FAFB]'>
              {children}
            </div>
          </div>
        </div>
      </AskAIWrapper>
    </OrgsWrapper>
  );
}
