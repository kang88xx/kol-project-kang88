import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  // A token issued before the username migration lacks `username`; treat it as logged out
  // so stale cookies fall through to /login instead of bouncing between proxy and page.
  const isLoggedIn = Boolean(req.auth?.user?.username);
  const isLoginPage = pathname === "/login";

  if (!isLoggedIn && !isLoginPage) {
    const url = new URL("/login", req.nextUrl);
    if (pathname !== "/") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/projects", req.nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg|ico)$).*)"],
};
