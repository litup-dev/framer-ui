import type { MetadataRoute } from "next";

// 검색엔진(구글, 네이버, 빙, 다음)은 허용하고 AI 학습 봇과 SEO 스크래퍼는 막는다.
// robots.txt는 규칙을 지키는 봇에게만 유효하다.
const BLOCKED_BOTS = [
  // AI 학습/수집
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "PerplexityBot",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "Applebot-Extended",
  "meta-externalagent",
  "cohere-ai",
  "Diffbot",
  "ImagesiftBot",
  "Omgilibot",
  // SEO/스크래퍼
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "DataForSeoBot",
  "BLEXBot",
  "PetalBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/login"] },
      { userAgent: BLOCKED_BOTS, disallow: "/" },
    ],
  };
}
