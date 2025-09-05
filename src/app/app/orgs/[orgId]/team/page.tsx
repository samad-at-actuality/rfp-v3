import { getTeamMembers } from '@/lib/apis/teamMemberApi';
import { TMemberClient } from '@/types/TMember';
import { notFound } from 'next/navigation';
import { TeamMemberPage } from './TeamMemberPage';

export default async function TeamPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const orgId = (await params).orgId;

  const teamMembers_ = await getTeamMembers(orgId);
  if (!teamMembers_.data) {
    return notFound();
  }

  const teamMembers__ = teamMembers_.data;
  const teamMembers: TMemberClient[] = teamMembers__.map(
    ({ orgMemberships, ...rest }) => {
      const orgMembership = orgMemberships.find(({ orgId }) => {
        return orgId === orgId;
      });
      return {
        ...rest,
        ...{
          memebrShipCreatedAt: orgMembership?.createdAt,
          memberShipRole: orgMembership?.role,
          memberShipUpdatedAt: orgMembership?.updatedAt,
          memberShipCreatedBy: orgMembership?.createdBy,
        },
      };
    }
  ) as TMemberClient[];

  return <TeamMemberPage members={teamMembers} />;
}
