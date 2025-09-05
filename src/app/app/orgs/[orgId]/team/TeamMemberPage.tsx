'use client';
import { TMemberClient } from '@/types/TMember';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useOrgCtx } from '@/ctx/org-ctx';

export const TeamMemberPage = ({
  members: members_,
}: {
  members: TMemberClient[];
}) => {
  const {
    currentOrg: { role: currentOrgRole },
  } = useOrgCtx();

  const [isSubmittingNewMember, setIsSubmittingNewMember] = useState(false);

  const [isChangingAccess, setIsChangingAccess] = useState(false);

  const [members, setMembers] = useState(members_);
  return (
    <>
      <Card className='w-xl min-w-xl mx-auto my-20'>
        <CardHeader className='pb-3'>
          <CardTitle>Members of the Organization :{currentOrgRole}</CardTitle>
        </CardHeader>
        <CardContent>{currentOrgRole}</CardContent>
      </Card>
    </>
  );
};
