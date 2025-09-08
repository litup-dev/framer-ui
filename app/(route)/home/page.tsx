"use client";

import { ErrorBoundary, Suspense } from "@suspensive/react";
import { useQuery } from "@tanstack/react-query";
import FadeIn from "@/components/shared/fade-in";

import { PostsItem } from "@/app/feature/home/types";
import { getPostsOptions } from "@/app/feature/home/query-options";

import { Marquee3D } from "@/components/shared/marquee-cards";
import PostCard from "@/app/feature/home/components/post-card";
import ModalCalendar from "@/app/shared/components/calendar";

export default function Home() {
  const { data: posts } = useQuery(getPostsOptions());

  return (
    <ErrorBoundary fallback={<div>Error</div>}>
      <FadeIn>
        <div className="w-full flex flex-col items-center justify-center h-full gap-4 pb-20">
          <Suspense fallback={<div>Loading...</div>}>
            <Marquee3D />
            <ModalCalendar />

            <div className="w-full flex flex-col gap-2 px-4 py-2">
              {posts?.map((post: PostsItem) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </Suspense>
        </div>
      </FadeIn>
    </ErrorBoundary>
  );
}
