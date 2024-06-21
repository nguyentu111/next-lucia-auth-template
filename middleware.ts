import { NextRequest, NextResponse } from "next/server";
import { LoginUrl, LuciaSessionName, PrivateUrl } from "@/contants";
import { useAuth } from "./providers/auth-provider";
import { auth, lucia } from "./lib/auth";
import { cookies } from "next/headers";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = !!cookies().get(LuciaSessionName)?.value;
  if (!auth && PrivateUrl.some((url) => url.test(pathname))) {
    const loginUrl = new URL(
      `${LoginUrl}?redirect=${encodeURIComponent(req.nextUrl.pathname)}`,
      req.url
    );
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
