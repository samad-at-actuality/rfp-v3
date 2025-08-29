import React from 'react';
import { Inter } from 'next/font/google';

import './globals.css';

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
  return (
    <html lang='en'>
      <body
        id='super_body'
        className={`${interSans.variable} flex h-screen w-screen flex-col overflow-hidden antialiased`}
      >
        <nav id='header'></nav>
        <main className='flex-1 overflow-hidden'>{children}</main>
      </body>
    </html>
  );
}
