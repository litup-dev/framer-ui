// lib/error-codes.ts

/**
 * API 에러 코드를 상수로 관리합니다.
 * 백엔드에서 정의한 코드 값을 사용합니다.
 *
 * 백엔드 구조:
 * - code: 문자열 에러 코드 (예: 'CONFLICT', 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED')
 * - status: HTTP 상태 코드 또는 커스텀 코드 (예: 404, 10401, 10403)
 */
export const API_ERROR_CODES = {
  // HTTP Status 기반 에러 (code 필드에 문자열로 전달됨)
  CONFLICT: 'CONFLICT',           // status: 409
  NOT_FOUND: 'NOT_FOUND',         // status: 404
  FORBIDDEN: 'FORBIDDEN',         // status: 403
  UNAUTHORIZED: 'UNAUTHORIZED',   // status: 401
  BAD_REQUEST: 'BAD_REQUEST',     // status: 400

  // JWT 관련 에러 (code 필드에 문자열로 전달됨)
  INVALID_TOKEN: 'INVALID_TOKEN',                                      // status: 401
  NO_AUTHORIZATION_IN_COOKIE: 'FST_JWT_NO_AUTHORIZATION_IN_COOKIE',   // status: 10401
  AUTHORIZATION_TOKEN_EXPIRED: 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED',  // status: 10401
  AUTHORIZATION_TOKEN_UNTRUSTED: 'FST_JWT_AUTHORIZATION_TOKEN_UNTRUSTED', // status: 10401
  AUTHORIZATION_TOKEN_UNSIGNED: 'FAST_JWT_MISSING_SIGNATURE',          // status: 10401
  NO_AUTHORIZATION_IN_HEADER: 'FST_JWT_NO_AUTHORIZATION_IN_HEADER',    // status: 10401
  AUTHORIZATION_TOKEN_INVALID: 'FST_JWT_AUTHORIZATION_TOKEN_INVALID',  // status: 10401

  // 커스텀 숫자 status 코드
  /** JWT 관련 인증 실패 */
  JWT_AUTH_STATUS: 10401,
  /** 사용자가 비공개 처리한 콘텐츠에 접근 시도 */
  USER_CONTENT_PRIVATE_STATUS: 10403,
} as const;
