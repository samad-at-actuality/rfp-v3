import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function middleware(request: NextRequest) {
  try {
    // authentication routes — let the middleware handle it
    if (request.nextUrl.pathname.startsWith('/auth')) {
      return await auth0.middleware(request);
    }

    const { origin } = new URL(request.url);
    const session = await auth0.getSession(request);

    // user does not have a session — redirect to login
    if (!session) {
      return NextResponse.redirect(`${origin}/auth/login`);
    }

    return await auth0.middleware(request);
  } catch (error) {
    const { origin } = new URL(request.url);
    console.log(error);
    return NextResponse.redirect(`${origin}/auth/login`);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api).*)',
  ],
};
