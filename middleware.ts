import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth(async function middleware(req: NextRequest & { auth: unknown }) {
  const { pathname } = req.nextUrl;
  const session = (req as { auth: { user?: { role?: string } } | null }).auth;

  const isProtectedUserRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/auth");

  // Redirect unauthenticated users
  if ((isProtectedUserRoute || isAdminRoute) && !session) {
    return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${pathname}`, req.url));
  }

  // Redirect non-admins from admin routes
  if (isAdminRoute && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/:path*", "/checkout/:path*"],
};
