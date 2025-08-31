import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://k.kakaocdn.net/**"),
      new URL("http://k.kakaocdn.net/**"),
    ],
  },
};

export default nextConfig;
