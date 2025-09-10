import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self' * data: blob:;
      script-src 'self' 'unsafe-inline' 'unsafe-eval' * data: blob:;
      style-src 'self' 'unsafe-inline' * data:;
      img-src 'self' * data: blob:;
      font-src 'self' * data:;
      connect-src 'self' *;
      frame-src *;
    `
      .replace(/\s{2,}/g, ' ')
      .trim(),
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
