'use client';

import { useEffect } from 'react';
import { setLastVisitedOrgAction } from '@/actions/last-visited-org-actions';

// Reason to have this weired component is to save the last visited org in the cookie
// as cookies.set now allowed in server component
// from here we call action to save the last visited org in the cookie
// which is the read at the /app/orgs TODO: implement the same in middleware
export const LastOrgVisitSaver = ({ orgId }: { orgId: string }) => {
  useEffect(() => {
    setLastVisitedOrgAction({ orgId });
  }, []);
  return <></>;
};
