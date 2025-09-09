'use client';
import { TMemberClient } from '@/types/TMember';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { useOrgCtx } from '@/ctx/org-ctx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TOrgRole } from '@/types/TUserRole';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateMemberRole } from '@/lib/apis/teamMemberApi';
import { toast } from 'sonner';
import { useUserInfoCtx } from '@/ctx/user-context';
import { Input } from '@/components/ui/input';
import { inviteMember, revokeMember } from '@/lib/apis/organisationsApi';
import { LoadingButton } from '@/components/loading-button';

export const TeamMemberPage = ({
  members: members_,
}: {
  members: TMemberClient[];
}) => {
  const {
    currentOrg: { role: currentOrgRole, id: currentOrgId },
    setOrgs,
  } = useOrgCtx();

  const { userInfo } = useUserInfoCtx();

  const [isSubmittingNewMember, setIsSubmittingNewMember] = useState(false);

  const [isChangingAccess, setIsChangingAccess] = useState<string>('');
  const [isRevokingAccess, setIsRevokingAccess] = useState<string>('');

  const [members, setMembers] = useState(members_);

  const exitingMembersEmails = members.map((member) => member.email);

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: TOrgRole.VIEWER,
  });
  const [error, setError] = useState({
    name: '',
    email: '',
    role: '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: '' }));
  };
  const handleSelectChange = (value: TOrgRole) => {
    setNewMember((prev) => ({ ...prev, role: value }));
    setError((prev) => ({ ...prev, role: '' }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (exitingMembersEmails.includes(newMember.email)) {
      toast.error('Member with this email already exists!');
      return;
    }

    if (!newMember.name || !newMember.email || !newMember.role) {
      toast.error('All fields are required!');
      return;
    }
    setIsSubmittingNewMember(true);
    try {
      const res = await inviteMember({
        orgId: currentOrgId,
        payload: { ...newMember },
      });
      if (res.data) {
        toast.success('Member invited successfully!');
        setNewMember({
          name: '',
          email: '',
          role: TOrgRole.VIEWER,
        });
        setError({
          name: '',
          email: '',
          role: '',
        });
        setMembers((prev) => [
          ...prev,
          {
            ...res.data,
            memberShip: {
              role: newMember.role,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: userInfo.id,
            },
          },
        ]);
      } else {
        toast.error('Failed to invite the member!');
      }
    } catch {
      toast.error('Failed to invite the member!');
    } finally {
      setIsSubmittingNewMember(false);
    }
  };
  const handleUpdateRole = async ({
    userId,
    role,
  }: {
    userId: string;
    role: TOrgRole;
  }) => {
    if (isChangingAccess === userId) {
      toast.error('Already changing access!');
      return;
    }
    setIsChangingAccess(userId);
    try {
      const res = await updateMemberRole({
        orgId: currentOrgId,
        userId,
        payload: { role },
      });

      if (res.data) {
        if (userInfo.id === userId) {
          setOrgs((p) =>
            p.map((org) => (org.id === currentOrgId ? { ...org, role } : org))
          );
        }
        setMembers((prev) =>
          prev.map((member) =>
            member.id === userId
              ? { ...member, memberShip: { ...member.memberShip, role } }
              : member
          )
        );
        toast.success('Role updated successfully!');
      } else {
        toast.error('Failed to update the role!');
      }
    } catch {
      toast.error('Failed to update the role!');
    } finally {
      setIsChangingAccess('');
    }
  };

  const handleRevokeAccess = async (userId: string) => {
    if (isChangingAccess === userId) {
      toast.error('Already changing access!');
      return;
    }
    if (isRevokingAccess === userId) {
      toast.error('Already revoking access!');
      return;
    }
    setIsRevokingAccess(userId);
    try {
      const res = await revokeMember({
        orgId: currentOrgId,
        userId,
      });
      if (res.data) {
        toast.success('Member revoked successfully!');
        setMembers((prev) => prev.filter((member) => member.id !== userId));
      } else {
        toast.error('Failed to revoke the member!');
      }
    } catch {
      toast.error('Failed to revoke the member!');
    } finally {
      setIsRevokingAccess('');
    }
  };
  return (
    <>
      <Card className='w-xl min-w-xl mx-auto my-20 space-y-0  flex flex-col gap-6  '>
        <CardHeader>
          <CardTitle>Members of the Organization</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {currentOrgRole === TOrgRole.ADMIN && (
            <>
              <CardDescription>
                Send email to invite users to the organization
              </CardDescription>

              <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
                <div className='flex gap-2'>
                  <div className='flex-1'>
                    <Input
                      required={true}
                      onChange={handleChange}
                      name='name'
                      id='name'
                      placeholder='Member name'
                      type='userName'
                      value={newMember.name}
                    />
                    {error.name && <p className='text-red-500'>{error.name}</p>}
                  </div>
                  <div>
                    <Select
                      required
                      onValueChange={handleSelectChange}
                      defaultValue={TOrgRole.VIEWER}
                      value={newMember.role}
                    >
                      <SelectTrigger className='w-[120px]'>
                        <SelectValue placeholder='Select access' />
                      </SelectTrigger>
                      <SelectContent>
                        {[TOrgRole.ADMIN, TOrgRole.EDITOR, TOrgRole.VIEWER].map(
                          (accessLevel) => (
                            <SelectItem key={accessLevel} value={accessLevel}>
                              {accessLevel}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    {error.role && <p className='text-red-500'>{error.role}</p>}
                  </div>
                </div>
                <div className='flex justify-end gap-2'>
                  <div className='flex-1'>
                    <Input
                      required={true}
                      onChange={handleChange}
                      placeholder='example@exmple.com'
                      type='email'
                      name='email'
                      id='email'
                      value={newMember.email}
                    />
                    {error.email && (
                      <p className='text-red-500'>{error.email}</p>
                    )}
                  </div>

                  <LoadingButton
                    label='Send Invite'
                    isLoading={isSubmittingNewMember}
                    className='sm'
                    onClick={handleSubmit}
                  />
                </div>
              </form>
            </>
          )}
          <div className='space-y-6'>
            {members.map((member) => (
              <div className='flex items-center gap-4' key={member.id}>
                <Avatar className='bg-gray-300 w-8 h-8'>
                  <AvatarFallback className='text-xs text-gray-700'>
                    {member.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col flex-1'>
                  <p className='text-sm font-medium leading-none'>
                    {member.name}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {member.email}
                  </p>
                </div>
                {[TOrgRole.VIEWER, TOrgRole.EDITOR].includes(currentOrgRole) ? (
                  <p className='text-sm font-medium leading-none'>
                    {member.memberShip.role}
                  </p>
                ) : (
                  <div className='flex flex-col items-center'>
                    <Select
                      disabled={
                        isChangingAccess === member.id ||
                        isRevokingAccess === member.id
                      }
                      onValueChange={(value: TOrgRole) => {
                        handleUpdateRole({
                          userId: member.id,
                          role: value,
                        });
                      }}
                      value={member.memberShip.role}
                    >
                      <SelectTrigger className='w-[120px]'>
                        <SelectValue placeholder='Select access' />
                      </SelectTrigger>
                      <SelectContent>
                        {[TOrgRole.ADMIN, TOrgRole.EDITOR, TOrgRole.VIEWER].map(
                          (accessLevel) => (
                            <SelectItem key={accessLevel} value={accessLevel}>
                              {accessLevel}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <button
                      className='p-0 text-red-400 underline cursor-pointer'
                      onClick={() => handleRevokeAccess(member.id)}
                    >
                      {isRevokingAccess === member.id
                        ? 'Revoking...'
                        : 'Revoke'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
