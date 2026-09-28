import { API_ERROR_CODES } from "@/lib/error-codes";

export class ApiError extends Error {
  status: number;
  code: string | number;
  data: any;
  // true면 이 에러로는 /login 강제 리다이렉트를 하지 않음 (GET 기본값)
  skipAuthRedirect: boolean;

  constructor(
    message: string,
    status: number,
    code: string | number,
    data: any,
    skipAuthRedirect: boolean = false,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
    this.skipAuthRedirect = skipAuthRedirect;
  }
}

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  skipAuthRedirect?: boolean;
  // isServer?: boolean;
}

class ApiClient {
  private baseURL: string;
  private refreshPromise: Promise<boolean> | null = null;
  // private isServer: boolean;
  // private accessToken: string | null | undefined = undefined;

  constructor(baseURL: string, isServer: boolean = false) {
    this.baseURL = baseURL;
    // this.isServer = isServer;
  }

  // setAccessToken(token: string | null) {
  //   this.accessToken = token;
  // }

  // getAccessToken(): string | null | undefined {
  //   return this.accessToken;
  // }

  // private async getAuthToken(): Promise<string | null> {
  //   if (this.accessToken !== undefined) return this.accessToken ?? null;
  //   if (this.isServer) return null;
  //   const { user } = useUserStore.getState();
  //   return user?.token || null;
  // }

  private async createHeaders(
    customHeaders: Record<string, string> = {},
    isFormData: boolean = false,
  ): Promise<Record<string, string>> {
    // const token = await this.getAuthToken();

    const headers: Record<string, string> = {
      ...customHeaders,
    };

    if (isFormData) {
      delete headers["Content-Type"];
    } else {
      headers["Content-Type"] = "application/json";
    }

    // if (token) {
    //   headers.Authorization = `Bearer ${token}`;
    // }

    return headers;
  }

  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {},
  ): Promise<T> {
    const { method = "GET", headers: customHeaders = {}, body } = options;

    const url = `${this.baseURL}${endpoint}`;
    const isFormData = body instanceof FormData;
    const headers = await this.createHeaders(customHeaders, isFormData);

    const config: RequestInit = {
      method,
      headers,
      credentials: "include",
    };

    if (body && method !== "GET") {
      config.body = isFormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorData;
        let errorMessage = "API 요청 중 알 수 없는 오류가 발생했습니다.";
        // HTTP status를 기본 에러 코드로 사용
        let errorCode: string | number = response.status;
        // 백엔드가 인증 에러에 붙이는 커스텀 숫자 statusCode (예: 10401). code는 문자열이라 별도로 추적.
        let errorStatusCode: number = response.status;

        try {
          errorData = await response.json();

          // 서버 응답 구조를 순서대로 확인
          // 1. errorData.error.message, errorData.error.code (중첩 구조)
          // 2. errorData.message, errorData.code (플랫 구조)
          if (errorData.error) {
            errorMessage = errorData.error.message || errorMessage;
            errorCode = errorData.error.code || errorCode;
            errorStatusCode = errorData.error.statusCode ?? errorStatusCode;
          } else {
            errorMessage = errorData.message || errorMessage;
            errorCode = errorData.code || errorCode;
            errorStatusCode = errorData.statusCode ?? errorStatusCode;
          }
        } catch (e) {
          // 응답이 JSON 형식이 아닐 경우
          errorData = {
            message: `API 요청 실패: ${response.status} ${response.statusText}`,
          };
          errorMessage = errorData.message;
        }

        // 인증관련 에러(JWT 만료/무효 등)일때 토큰 재발급 시도
        if (errorStatusCode === API_ERROR_CODES.JWT_AUTH_STATUS) {
          const refreshed = await this.accessTokenRefresh();
          if (refreshed) {
            return this.request<T>(endpoint, options);
          }
        }

        // /login 리다이렉트는 handleGlobalError(전역 에러 핸들러)에서
        // skipAuthRedirect 값을 보고 일괄 처리한다 (중복 리다이렉트 방지).
        throw new ApiError(
          errorMessage,
          response.status,
          errorCode,
          errorData,
          options.skipAuthRedirect ?? false,
        );
      }

      if (response.status === 204) {
        return undefined as any;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // 병렬로 들어온 401 요청들이 동시에 refresh를 호출하지 않도록
  // 진행 중인 refresh promise를 공유한다 (refresh token rotation 백엔드 대응).
  private async accessTokenRefresh(): Promise<boolean> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = fetch(`${this.baseURL}/api/v1/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  // GET은 비로그인 접근이 기본 — 만료 토큰이어도 /login 강제 리다이렉트 안 함.
  // 로그인 필수 페이지의 GET은 useCurrentUser 등 페이지 가드가 처리한다.
  async get<T = any>(
    endpoint: string,
    options: Omit<ApiRequestOptions, "method" | "body"> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
      skipAuthRedirect: options.skipAuthRedirect ?? true,
    });
  }

  // mutation들은 로그인 필수 — 401 발생 시 /login 리다이렉트가 기본 동작.
  async post<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, "method" | "body"> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  async put<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, "method" | "body"> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  async delete<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, "method" | "body"> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE", body });
  }

  async patch<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<ApiRequestOptions, "method" | "body"> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }
}

// 클라이언트용 인스턴스 — 브라우저에서 상대 경로로 요청해 Next.js rewrite 프록시를 통과시킴
export const apiClient = new ApiClient("");

// 서버사이드용 인스턴스
export const serverApiClient = new ApiClient(
  process.env.API_BASE_URL || "",
  true,
);

// 사용 예시:
// 클라이언트에서: const data = await apiClient.get('/api/users');
// 서버사이드에서: const data = await serverApiClient.get('/api/users');
