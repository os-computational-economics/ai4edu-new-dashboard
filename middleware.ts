import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_PATH } from "./utils/constants";

export function middleware(request: NextRequest) {
  let has_refresh_token = request.cookies.has("refresh_token");
  if (!has_refresh_token && request.nextUrl.pathname !== AUTH_PATH) {
    // if refresh token is not present, redirect to auth page
    return NextResponse.redirect(new URL(AUTH_PATH, request.url));
  }
  // default, do nothing
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
