import { ApiError } from "@/lib/api-client";
import { API_ERROR_CODES } from "@/lib/error-codes";
import { saveReturnUrl } from "@/lib/login-utils";

/**
 * 글로벌 에러 핸들러
 * 인증 에러 발생 시 자동으로 로그아웃 처리
 */
export function handleGlobalError(error: unknown): void {
  if (!(error instanceof ApiError)) {
    return;
  }

  // JWT 인증 에러 체크
  const authErrorCodes = [
    API_ERROR_CODES.INVALID_TOKEN,
    API_ERROR_CODES.NO_AUTHORIZATION_IN_COOKIE,
    API_ERROR_CODES.AUTHORIZATION_TOKEN_EXPIRED,
    API_ERROR_CODES.AUTHORIZATION_TOKEN_UNTRUSTED,
    API_ERROR_CODES.AUTHORIZATION_TOKEN_UNSIGNED,
    API_ERROR_CODES.NO_AUTHORIZATION_IN_HEADER,
    API_ERROR_CODES.AUTHORIZATION_TOKEN_INVALID,
  ];

  const isAuthError =
    authErrorCodes.includes(error.code as any) ||
    error.status === 401 ||
    error.status === API_ERROR_CODES.JWT_AUTH_STATUS;

  if (isAuthError) {
    if (typeof window !== "undefined") {
      if (!window.location.pathname.includes("/login")) {
        saveReturnUrl(window.location.pathname);
        window.location.href = "/login";
      }
    }
  }
}
