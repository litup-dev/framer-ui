import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    if (pathname === "/") {
      return NextResponse.next();
    }

    if (pathname === "/login" && token) {
      return NextResponse.redirect(new URL("/home", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        if (pathname === "/") return true;
        if (pathname === "/login") return true;
        if (pathname.startsWith("/api")) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|.*\\.|$).*)"],
};
