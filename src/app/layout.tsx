import React from 'react';
import { Inter } from 'next/font/google';

import './globals.css';
import { Auth0Provider } from '@auth0/nextjs-auth0';
import { auth0 } from '@/lib/auth0';

import { TOKEN_SETTER_server } from './__TOKEN_SETTER_server';

const interSans = Inter({
  variable: '--font-inter-sans',
  display: 'swap',
});

const defaultUrl =
  process.env.NEXT_PUBLIC_DOMAIN || process.env.VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_DOMAIN || process.env.VERCEL_URL}`
    : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Actuality Documentation',
  description: 'Your personal assistant for construction professionals',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  const getToken = async () => {
    'use server';
    try {
      const { token } = await auth0.getAccessToken();
      return token || '';
    } catch {
      return '';
    }
  };

  return (
    <html lang='en'>
      <body
        id='super_body'
        className={`${interSans.variable} h-screen w-screen overflow-hidden antialiased`}
      >
        <Auth0Provider>
          <TOKEN_SETTER_server getToken={getToken} />
          {children}
        </Auth0Provider>
      </body>
    </html>
  );
}
