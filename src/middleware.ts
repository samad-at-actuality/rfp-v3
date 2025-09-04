import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth0 } from '@/lib/auth0';
import { getMyOrgs, getSuperAdminOrgs } from '@/lib/apis/organisationsApi';
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
      return NextResponse.redirect(`${origin}/auth/login`);
    }

    const userInfo = userInfo_.data;
    if (request.nextUrl.pathname === '/app/admin') {
      // If user is not a super admin, redirect to orgs page
      if (!userInfo?.isSuperAdmin) {
        return NextResponse.redirect(`${origin}/app/orgs`);
      }

      // If user is a super admin, allow access to /app/admin
      return NextResponse.next();
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

      const orgs_ = userInfo?.isSuperAdmin
        ? await getSuperAdminOrgs(session.tokenSet.accessToken)
        : await getMyOrgs(session.tokenSet.accessToken);
      if (orgs_.error || !orgs_.data) {
        return NextResponse.redirect(`${origin}/not-found`);
      }
      if (!orgs_.data || orgs_.data.length === 0) {
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
  } catch (error) {
    const { origin } = new URL(request.url);
    console.error(error);
    return NextResponse.redirect(`${origin}/not-found`);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api).*)',
  ],
};
