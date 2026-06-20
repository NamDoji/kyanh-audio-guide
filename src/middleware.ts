import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin pages (but not the login page itself)
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin/") &&
    !pathname.startsWith("/api/admin/login");
  const isWriteStopApi = (pathname.startsWith("/api/stops") &&
    ["POST", "PUT", "DELETE"].includes(request.method));

  if ((isAdminPage || isAdminApi || isWriteStopApi) && !isAdminAuthenticatedFromRequest(request)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized. Please log in at /admin/login" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/stops/:path*"],
};
