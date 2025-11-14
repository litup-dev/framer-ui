import type { NextConfig } from "next";

// API 베이스 URL에서 호스트 추출
const getApiHostname = (): string | null => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) return null;
  
  try {
    const url = new URL(apiBaseUrl);
    return url.hostname;
  } catch {
    return null;
  }
};

const apiHostname = getApiHostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "newsroom.etomato.com",
        pathname: "/**",
      },
      // API 베이스 URL의 호스트 추가
      ...(apiHostname
        ? [
            {
              protocol: "https" as const,
              hostname: apiHostname,
              pathname: "/**",
            },
            {
              protocol: "http" as const,
              hostname: apiHostname,
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
