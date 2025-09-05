import { getTeamMembers } from '@/lib/apis/teamMemberApi';
import { TMemberClient } from '@/types/TMember';
import { notFound } from 'next/navigation';
import { TeamMemberPage } from './TeamMemberPage';
import { TOrgRole } from '@/types/TUserRole';

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

  const teamMembers = teamMembers__.map(
    ({ orgMemberships, ...rest }): TMemberClient => {
      const orgMembership = orgMemberships.find((memberShip) => {
        return memberShip.orgId === orgId;
      }) as {
        createdAt: string;
        role: TOrgRole;
        updatedAt: string;
        createdBy: string;
      };

      return {
        ...rest,
        memberShip: {
          createdAt: orgMembership.createdAt!,
          role: orgMembership.role!,
          updatedAt: orgMembership.updatedAt!,
          createdBy: orgMembership.createdBy!,
        },
      };
    }
  );

  return <TeamMemberPage members={teamMembers} />;
}
