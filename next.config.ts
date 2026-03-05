import type { NextConfig } from "next";

const getHostname = (url: string | undefined): string | null => {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

const apiHostname = getHostname(process.env.NEXT_PUBLIC_API_BASE_URL);
const imageHostname = getHostname(
  process.env.NEXT_PUBLIC_IMAGE_PREFIX_URL,
);

const remotePatterns = [
  ...(apiHostname
    ? [
        { protocol: "https" as const, hostname: apiHostname, pathname: "/**" },
        { protocol: "http" as const, hostname: apiHostname, pathname: "/**" },
      ]
    : []),
  ...(imageHostname && imageHostname !== apiHostname
    ? [
        { protocol: "https" as const, hostname: imageHostname, pathname: "/**" },
        { protocol: "http" as const, hostname: imageHostname, pathname: "/**" },
      ]
    : []),
];

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns,
  },
};

export default nextConfig;
