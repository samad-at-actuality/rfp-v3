import React from 'react';
import { Inter } from 'next/font/google';

import './globals.css';
import { Auth0Provider } from '@auth0/nextjs-auth0';
import { getUserInfo } from '@/lib/apis/userProfileApi';
import { UserInfoWrapper } from '@/ctx/user-context';

const interSans = Inter({
  variable: '--font-inter-sans',
  display: 'swap',
});

const defaultUrl =
  process.env.NEXT_PUBLIC_DOMAIN || process.env.VERCEL_URL
    ? `${process.env.NEXT_PUBLIC_DOMAIN || process.env.VERCEL_URL}`
    : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Actuality Documentation',
  description: 'Your personal assistant for construction professionals',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.ReactNode> {
  const userInfo = await getUserInfo();
  return (
    <html lang='en'>
      <body
        id='super_body'
        className={`${interSans.variable} h-screen w-screen overflow-hidden antialiased bg-white`}
      >
        <Auth0Provider>
          <UserInfoWrapper userInfo={userInfo!}>{children}</UserInfoWrapper>
        </Auth0Provider>
      </body>
    </html>
  );
}
