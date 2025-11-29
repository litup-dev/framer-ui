import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const isTokenExpired = (tokenString: string): boolean => {
  try {
    const decoded = jwt.decode(tokenString) as any;
    if (!decoded || !decoded.exp) {
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp <= currentTime;
  } catch {
    return true;
  }
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  console.log(token, "<<<<< token");
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  const hasValidAccessToken =
    token?.accessToken && !isTokenExpired(token.accessToken as string);
  const hasValidRefreshToken =
    token?.refreshToken && !isTokenExpired(token.refreshToken as string);

  if (!hasValidAccessToken && !hasValidRefreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|.*\\.|$).*)"],
};
