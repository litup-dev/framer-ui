import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import jwt from "jsonwebtoken";

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
      try {
        const session = await getServerSession(authOptions);
        if (session?.user) {
          const userId = session.userId;
          const token = jwt.sign(
            {
              userId: userId,
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + 3600,
            },
            process.env.NEXTAUTH_SECRET!
          );
          console.log("서버사이드 토큰 생성됨");
          return token;
        }
        return null;
      } catch (error) {
        console.log("서버사이드 토큰 생성 실패:", error);
        return null;
      }
    } else {
      return null;
    }
  }

  private async createHeaders(
    customHeaders: Record<string, string> = {}
  ): Promise<Record<string, string>> {
    const token = await this.getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

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
    const headers = await this.createHeaders(customHeaders);

    console.log(`서버사이드 API 호출: ${method} ${url}`);
    console.log(
      "Authorization 헤더:",
      headers.Authorization ? "존재함" : "없음"
    );

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(
          `API 요청 실패: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API 요청 에러:", error);
      throw error;
    }
  }

  // 편의 메서드들
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
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", headers });
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
