import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  isServer?: boolean;
}

class ApiClient {
  private baseURL: string;
  private isServer: boolean;

  constructor(baseURL: string, isServer: boolean = false) {
    this.baseURL = baseURL;
    this.isServer = isServer;
  }

  private async getAuthToken(): Promise<string | null> {
    if (this.isServer) {
      // 서버사이드에서는 next-auth 세션 사용 (당분간 유지)
      try {
        const session = await getServerSession(authOptions);
        if (session?.accessToken) {
          return session.accessToken;
        }
        return null;
      } catch (error) {
        return null;
      }
    } else {
      // 클라이언트에서는 localStorage에서 토큰 가져오기
      try {
        const token = localStorage.getItem("accessToken");
        return token;
      } catch (error) {
        return null;
      }
    }
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
        throw new Error(
          `API 요청 실패: ${response.status} ${response.statusText}`
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
