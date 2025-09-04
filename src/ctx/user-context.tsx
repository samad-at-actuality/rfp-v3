'use client';

import React from 'react';
import { TUser } from '@/types/TUser';

const UserInfoContext = React.createContext<{
  userInfo: TUser;
  setUserInfo: React.Dispatch<React.SetStateAction<TUser>>;
} | null>(null);

export const UserInfoProvider = UserInfoContext.Provider;

export const UserInfoWrapper = ({
  children,
  userInfo: initialUserInfo,
}: {
  children: React.ReactNode;
  userInfo: TUser;
}) => {
  const [userInfo, setUserInfo] = React.useState<TUser>(initialUserInfo);

  return (
    <UserInfoProvider value={{ userInfo, setUserInfo }}>
      {children}
    </UserInfoProvider>
  );
};

export const useUserInfoCtx = () => {
  const context = React.useContext(UserInfoContext);
  if (!context) {
    throw new Error('useUserInfo must be used within a UserInfoWrapper');
  }
  return context;
};
