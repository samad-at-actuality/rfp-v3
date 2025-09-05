'use client';
import React from 'react';
import { TOrg } from '@/types/TOrg';

const OrgContext = React.createContext<{
  orgs: TOrg[];
  setOrgs: React.Dispatch<React.SetStateAction<TOrg[]>>;
  currentOrg: TOrg;
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
  currentOrgId,
}: {
  children: React.ReactNode;
  orgs: TOrg[];
  currentOrgId: string;
}) => {
  const [orgs, setOrgs] = React.useState<TOrg[]>(initialOrgs);
  const currentOrg = orgs.find((org) => org.id === currentOrgId)!;

  return (
    <OrgProvider value={{ orgs, setOrgs, currentOrg }}>{children}</OrgProvider>
  );
};
