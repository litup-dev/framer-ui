"use client";

import { CommunityPostForm } from "@/app/feature/community/components/community-post-form";
import { useRequireAuth } from "@/app/feature/community/hooks/use-require-auth";

export default function CommunityWritePage() {
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading || !isAuthenticated) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-black/30 text-[14px]">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-6 md:px-6 md:pt-24 2xl:pt-28 xl:px-[60px] 2xl:px-[120px] pt-6 pb-24 md:py-8 xl:py-10">
      <CommunityPostForm mode="create" />
    </div>
  );
}
