import { ApiError } from "@/lib/api-client";
import { API_ERROR_CODES } from "@/lib/error-codes";

/**
 * API 에러 객체를 받아 사용자에게 표시할 적절한 에러 메시지를 반환하는 커스텀 훅입니다.
 * @param error - useQuery 또는 useMutation에서 반환된 에러 객체
 * @returns 사용자에게 표시할 에러 메시지 문자열
 */
export function useApiErrorMessage(error: unknown): string | null {
  if (!error) {
    return null;
  }

  // ApiError가 아닌 경우 기본 처리
  if (!(error instanceof ApiError)) {
    return error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
  }

  // JWT 관련 인증 에러 처리 (최우선)
  if (isAuthError(error.code)) {
    return "로그인이 필요합니다. 다시 로그인해주세요.";
  }

  // HTTP 상태 코드 기반 처리
  switch (error.status) {
    case 401:
      return "인증이 필요합니다. 다시 로그인해주세요.";
    case 403:
      return "접근 권한이 없습니다.";
    case 404:
      return error.message;
    case 409:
      return error.message;
    case 500:
      return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  // 특정 커스텀 에러 코드 처리
  switch (error.code) {
    // case API_ERROR_CODES.USER_CONTENT_PRIVATE:
    //   return error.message;
    case API_ERROR_CODES.CONFLICT:
      return error.message;
    case API_ERROR_CODES.BAD_REQUEST:
      return error.message;
    default:
      // 그 외 모든 에러는 서버에서 보낸 메시지 그대로 사용
      return error.message || "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
}

/**
 * JWT 관련 인증 에러인지 확인
 */
function isAuthError(code: string | number): boolean {
  const authErrorCodes = [
    API_ERROR_CODES.INVALID_TOKEN,
    API_ERROR_CODES.NO_AUTHORIZATION_IN_COOKIE,
    API_ERROR_CODES.AUTHORIZATION_TOKEN_EXPIRED,
    API_ERROR_CODES.AUTHORIZATION_TOKEN_UNTRUSTED,
    API_ERROR_CODES.AUTHORIZATION_TOKEN_UNSIGNED,
    API_ERROR_CODES.NO_AUTHORIZATION_IN_HEADER,
    API_ERROR_CODES.AUTHORIZATION_TOKEN_INVALID,
  ];

  return authErrorCodes.includes(code as any);
}
