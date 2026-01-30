import { useUserStore } from "@/store/user-store";

export class ApiError extends Error {
  status: number;
  code: string | number;
  data: any;

  constructor(
    message: string,
    status: number,
    code: string | number,
    data: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  isServer?: boolean;
}

class ApiClient {
  private baseURL: string;
  private isServer: boolean;
  private accessToken: string | null = null;

  constructor(baseURL: string, isServer: boolean = false) {
    this.baseURL = baseURL;
    this.isServer = isServer;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async getAuthToken(): Promise<string | null> {
    if (this.accessToken) return this.accessToken;
    if (this.isServer) return null;
    const { user } = useUserStore.getState();
    return user?.token || null;
  }

  private async createHeaders(
    customHeaders: Record<string, string> = {},
    isFormData: boolean = false
  ): Promise<Record<string, string>> {
    const token = await this.getAuthToken();

    const headers: Record<string, string> = {
      ...customHeaders,
    };

    if (isFormData) {
      delete headers["Content-Type"];
    } else {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { method = "GET", headers: customHeaders = {}, body } = options;

    const url = `${this.baseURL}${endpoint}`;
    const isFormData = body instanceof FormData;
    const headers = await this.createHeaders(customHeaders, isFormData);

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      config.body = isFormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorData;
        let errorMessage = 'API 요청 중 알 수 없는 오류가 발생했습니다.';
        // HTTP status를 기본 에러 코드로 사용
        let errorCode: string | number = response.status;

        try {
          errorData = await response.json();

          // 서버 응답 구조를 순서대로 확인
          // 1. errorData.error.message, errorData.error.code (중첩 구조)
          // 2. errorData.message, errorData.code (플랫 구조)
          if (errorData.error) {
            errorMessage = errorData.error.message || errorMessage;
            errorCode = errorData.error.code || errorCode;
          } else {
            errorMessage = errorData.message || errorMessage;
            errorCode = errorData.code || errorCode;
          }
        } catch (e) {
          // 응답이 JSON 형식이 아닐 경우
          errorData = {
            message: `API 요청 실패: ${response.status} ${response.statusText}`,
          };
          errorMessage = errorData.message;
        }

        throw new ApiError(errorMessage, response.status, errorCode, errorData);
      }

      if (response.status === 204) {
        return undefined as any;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async get<T = any>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", headers });
  }

  async post<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body, headers });
  }

  async put<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body, headers });
  }

  async delete<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", body, headers });
  }

  async patch<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body, headers });
  }
}

// 클라이언트용 인스턴스
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_BASE_URL || ""
);

// 서버사이드용 인스턴스
export const serverApiClient = new ApiClient(
  process.env.API_BASE_URL || "",
  true
);

// 사용 예시:
// 클라이언트에서: const data = await apiClient.get('/api/users');
// 서버사이드에서: const data = await serverApiClient.get('/api/users');
