"use client";

import { ErrorBoundary, Suspense } from "@suspensive/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { getPostsByIdOptions } from "@/app/feature/home/query-options";

import PostCard from "@/app/feature/home/components/post-card";

export default function PostDetail() {
  const params = useParams();
  const postId = params.id as string;

  const { data: post } = useSuspenseQuery(getPostsByIdOptions(postId));

  return (
    <ErrorBoundary fallback={<div>Error</div>}>
      <div className="w-full flex flex-col items-center justify-center h-full gap-4 pb-20">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="w-full flex flex-col gap-2 px-4 py-2">
            <PostCard post={post} />
          </div>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
