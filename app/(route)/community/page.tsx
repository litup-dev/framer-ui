"use client";

import { Suspense } from "react";
import { CommunityContent } from "@/app/feature/community/components/community-content";
import { CommunityPostCardSkeleton } from "@/app/feature/community/components/community-post-card-skeleton";
import Footer from "@/app/shared/components/footer";

const CommunityPage = () => {
  return (
    <>
      <div className="w-full min-h-screen px-6 md:px-6 md:pt-24 2xl:pt-28 xl:px-[60px] 2xl:px-[120px] flex flex-col">
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
