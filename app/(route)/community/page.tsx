"use client";

import { Suspense } from "react";
import { CommunityContent } from "@/app/feature/community/components/community-content";
import { CommunityPostCardSkeleton } from "@/app/feature/community/components/community-post-card-skeleton";
import { PromoSection } from "@/app/feature/community/components/promo-section/promo-section";
import Footer from "@/app/shared/components/footer";

const CommunityPage = () => {
  return (
    <>
      {/* 고정 헤더(md~: 80px, 2xl~: 100px) 높이만큼 비우고 홍보 섹션 배치 */}
      <div className="w-full md:pt-20 2xl:pt-[100px]">
        <PromoSection />
      </div>
      {/* 홍보 섹션 하단 간격: 피그마 기준 1280~ 100px / 그 미만 60px */}
      <div className="w-full min-h-screen bg-[#fbfbfa] xl:bg-white px-6 md:px-6 pt-[60px] min-[1280px]:pt-[100px] xl:px-10 xl:max-w-[1360px] xl:mx-auto flex flex-col">
        <Suspense
          fallback={
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <CommunityPostCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <CommunityContent />
        </Suspense>
      </div>
      <Footer />
    </>
  );
};

export default CommunityPage;
