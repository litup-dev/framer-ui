"use client";

import { ErrorBoundary } from "react-error-boundary";
import { Marquee3D } from "@/components/shared/marquee-cards";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getDomainOptions } from "@/app/feature/domain/query-options";
import { Suspense } from "react";

export default function Home() {
  const { data } = useSuspenseQuery({
    ...getDomainOptions("123"),
  });

  return (
    <div className="w-full flex flex-col items-center justify-center h-full gap-4">
      <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <div>{data}</div>
        </Suspense>
      </ErrorBoundary>
      <Marquee3D />
    </div>
  );
}
