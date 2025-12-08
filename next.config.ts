import type { NextConfig } from "next";

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
    unoptimized: true,
    remotePatterns: [
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
