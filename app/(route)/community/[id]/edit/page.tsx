"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CommunityPostForm } from "@/app/feature/community/components/community-post-form";
import { postDetailQueryOptions } from "@/app/feature/community/query-options";
import { useRequireAuth } from "@/app/feature/community/hooks/use-require-auth";

export default function CommunityEditPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    ...postDetailQueryOptions(postId),
    enabled: isAuthenticated,
  });
  const post = data?.data;

  useEffect(() => {
    if (post && !post.isMine) {
      router.replace(`/community/${postId}`);
    }
  }, [post, postId, router]);

  if (authLoading || !isAuthenticated || isLoading || !post) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-black/30 text-[14px]">로딩 중...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-black/40 text-[14px]">게시글을 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-6 md:px-6 xl:px-[60px] 2xl:px-[120px] pt-6 pb-24 md:pt-24 md:pb-8 2xl:pt-28 2xl:pb-10">
      <CommunityPostForm
        mode="edit"
        postId={postId}
        initialIsDraft={post.isDraft ?? false}
        initial={{
          boardCode: post.boardCode,
          categoryCode: post.category?.code ?? null,
          title: post.title,
          content: post.content,
          imageIds: post.images.map((i) => i.id),
          images: post.images,
          clubTags: post.clubTags,
          performTags: post.performTags,
        }}
      />
    </div>
  );
}
