import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth0 } from '@/lib/auth0';
import { getMyOrgs } from '@/lib/apis/organisationsApi';

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

    if (
      request.nextUrl.pathname === '/app/orgs' ||
      request.nextUrl.pathname === '/app' ||
      request.nextUrl.pathname === '/'
    ) {
      const cookieStore = await cookies();
      const lastTimeVisitedOrg = cookieStore.get(
        process.env.COOKIE_NAME_FOR_ORG_PREFERENCE!
      );

      const orgs = await getMyOrgs(session.tokenSet.accessToken);
      if (!orgs || orgs.length === 0) {
        return NextResponse.redirect(`${origin}/auth/login`);
      }

      if (lastTimeVisitedOrg) {
        const org = orgs.find((org) => org.id === lastTimeVisitedOrg.value);
        if (org) {
          return NextResponse.redirect(`${origin}/app/orgs/${org.id}`);
        }
      }

      return NextResponse.redirect(`${origin}/app/orgs/${orgs[0].id}`);
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
