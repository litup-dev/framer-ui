import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const isLoggedIn = request.cookies.get("isLogin")?.value === "true";

  // 로그인 상태로 /login에 접근하면 로그인 폼을 다시 보여주지 않고 원래 가려던 곳으로 돌려보냄
  if (isLoggedIn && pathname === "/login") {
    const returnUrl = searchParams.get("returnUrl");
    const redirectTo = returnUrl && returnUrl.startsWith("/") ? returnUrl : "/home";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|.*\\.|$).*)"],
};
