"use client";

import { useQuery } from "@tanstack/react-query";
import { CommunityPostForm } from "@/app/feature/community/components/community-post-form";
import { draftsQueryOptions } from "@/app/feature/community/query-options";
import { useRequireAuth } from "@/app/feature/community/hooks/use-require-auth";

export default function CommunityWritePage() {
  const { isAuthenticated, isLoading } = useRequireAuth();

  // 이어쓰기 안내용으로 가장 최근 draft 1개만 조회 (로그인된 경우만)
  const { data: draftsData } = useQuery({
    ...draftsQueryOptions(0, 1),
    enabled: isAuthenticated,
  });
  const latestDraftId = draftsData?.data.items[0]?.id ?? null;

  if (isLoading || !isAuthenticated) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-black/30 text-[14px]">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-6 md:px-6 xl:px-[60px] 2xl:px-[120px] pt-6 pb-24 md:pt-24 md:pb-8 2xl:pt-28 2xl:pb-10">
      <CommunityPostForm mode="create" existingDraftId={latestDraftId} />
    </div>
  );
}
