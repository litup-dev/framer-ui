"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import FadeIn from "@/components/shared/fade-in";
import PerformanceLayout from "@/app/feature/performance/detail/components/performance-layout";
import { getPerformanceDetailOptions } from "@/app/feature/performance/detail/query-options";

interface PerformanceDetailPageProps {
  params: Promise<{ id: string }>;
}

const DEFAULT_IMAGE = "/images/poster1.png";

const PerformanceDetailPage = ({ params }: PerformanceDetailPageProps) => {
  const { id } = use(params);
  const performanceId = parseInt(id);

  const { data, isLoading, error } = useQuery(getPerformanceDetailOptions(performanceId));

  if (isLoading) {
    return (
      <FadeIn>
        <div className="flex items-center justify-center min-h-screen">
          <div>Loading...</div>
        </div>
      </FadeIn>
    );
  }

  if (error || !data) {
    return (
      <FadeIn>
        <div className="flex items-center justify-center min-h-screen">
          <div>공연 정보를 불러올 수 없습니다.</div>
        </div>
      </FadeIn>
    );
  }

  const performance = data.data;
  const posterImages = performance.images
    .sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0))
    .map((img) => img.filePath);

  if (posterImages.length === 0) {
    posterImages.push(DEFAULT_IMAGE);
  }

  return (
    <FadeIn>
      <PerformanceLayout
        posterImages={posterImages}
        title={performance.title}
        performance={performance}
      />
    </FadeIn>
  );
};

export default PerformanceDetailPage;
