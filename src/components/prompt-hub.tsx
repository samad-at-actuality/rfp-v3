'use client';

import { useUserInfoCtx } from '@/ctx/user-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const PromptHubPage = ({ orgId }: { orgId: string }) => {
  const { userInfo } = useUserInfoCtx();
  const router = useRouter();
  useEffect(() => {
    if (!userInfo.isSuperAdmin) {
      router.push('/app/orgs');
    }
  }, []);
  return <div>PromptHubPage fodlers listing</div>;
};
