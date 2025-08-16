"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getDomainOptions } from "@/app/feature/home/query-options";

import { Marquee3D } from "@/components/shared/marquee-cards";
import PostCard from "@/app/feature/home/components/post-card";

export default function Home() {
  const { data: posts } = useSuspenseQuery({
    ...getDomainOptions(),
  });

  return (
    <div className="w-full flex flex-col items-center justify-center h-full gap-4 pb-20">
      <Suspense fallback={<div>Loading...</div>}>
        <Marquee3D />

        <div className="w-full flex flex-col gap-2">
          {posts.map((post) => (
            <PostCard key={`${post.category}-${post.title}`} post={post} />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
