import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth0 } from '@/lib/auth0';
import { getMyOrgs } from '@/lib/apis/organisationsApi';
import { getUserInfo } from '@/lib/apis/userProfileApi';

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

    const userInfo_ = await getUserInfo(session.tokenSet.accessToken);
    if (userInfo_.error || !userInfo_?.data) {
      return NextResponse.redirect(`${origin}/auth/logout`);
    }

    const userInfo = userInfo_.data;

    if (userInfo.isSuperAdmin) {
      // Allow access to admin routes and static assets
      if (request.nextUrl.pathname.startsWith('/app/admin')) {
        return NextResponse.next();
      }
      return NextResponse.redirect(`${origin}/app/admin`);
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

      const orgs_ = await getMyOrgs(session.tokenSet.accessToken);

      if (orgs_.error || !orgs_.data || orgs_.data.length === 0) {
        return NextResponse.redirect(`${origin}/not-found`);
      }

      const orgs = orgs_.data;

      if (lastTimeVisitedOrg) {
        const org = orgs.find((org) => org.id === lastTimeVisitedOrg.value);
        if (org) {
          return NextResponse.redirect(`${origin}/app/orgs/${org.id}`);
        }
      }

      return NextResponse.redirect(`${origin}/app/orgs/${orgs[0].id}`);
    }

    return await auth0.middleware(request);
  } catch {
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/not-found`);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api|assets).*)',
  ],
};
