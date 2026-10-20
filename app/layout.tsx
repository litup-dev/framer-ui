import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ReactQueryProvider from "@/providers/react-query-provider";

import { CommonModal } from "@/components/shared/common-modal";
import { ReportModal } from "@/components/shared/report-modal";
import localFont from "next/font/local";
import { Suspense } from "react";
import Script from "next/script";

const suit = localFont({
  src: "./fonts/SUIT-Variable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-suit",
});

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LITUP - 밴드 공연 정보 플랫폼",
  description: "이제 흩어진 공연 정보를 한 곳에서 확인할 수 있습니다. LITUP은 전국 밴드 공연 정보를 모아 제공하는 플랫폼입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${suit.variable} ${pretendard.variable}`}>
      <head>
        <script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          async
        ></script>
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <ReactQueryProvider>
            {children}
            <CommonModal />
            <ReportModal />
          </ReactQueryProvider>
        </Suspense>
        {/* Vercel Production 배포(main)에서만 활성화. Preview(develop)/로컬은 VERCEL_ENV가
            없거나 'production'이 아니라서 자동으로 비활성화된다. */}
        {process.env.VERCEL_ENV === "production" && <Analytics />}
        {/* Cloudflare Web Analytics. litup.kr은 프록시(주황 구름)가 꺼진 Vercel 직결이라
            자동 삽입이 안 되어 스니펫을 직접 넣는다. Vercel Production에서만 로드. */}
        {process.env.VERCEL_ENV === "production" && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "0a271ac55baf4ab68e57af545f314f3a"}'
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
