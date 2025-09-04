'use client';
import React, { useState } from 'react';
import { TOrg } from '@/types/TOrg';

const OrgContext = React.createContext<{
  orgs: TOrg[];
  setOrgs: React.Dispatch<React.SetStateAction<TOrg[]>>;
  currentOrgId: string;
  setCurrentOrgId: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

const OrgProvider = OrgContext.Provider;

export const useOrgCtx = () => {
  const context = React.useContext(OrgContext);
  if (!context) {
    throw new Error('useOrgCtx must be used within a OrgProvider');
  }
  return context;
};

export const OrgsWrapper = ({
  children,
  orgs: initialOrgs,
  currentOrgId: initialCurrentOrgId,
}: {
  children: React.ReactNode;
  orgs: TOrg[];
  currentOrgId: string;
}) => {
  const [orgs, setOrgs] = React.useState<TOrg[]>(initialOrgs);
  const [currentOrgId, setCurrentOrgId] = useState<string>(initialCurrentOrgId);
  return (
    <OrgProvider value={{ orgs, setOrgs, currentOrgId, setCurrentOrgId }}>
      {children}
    </OrgProvider>
  );
};
