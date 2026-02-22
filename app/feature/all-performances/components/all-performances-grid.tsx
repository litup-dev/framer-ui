import { PerformanceItem } from "@/app/feature/all-performances/types";
import { PerformanceCard } from "./performance-card";
import { PerformanceCardSkeleton } from "./performance-card-skeleton";

interface AllPerformancesGridProps {
  performances: PerformanceItem[];
  isLoading?: boolean;
}

export const AllPerformancesGrid = ({
  performances,
  isLoading = false,
}: AllPerformancesGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <PerformanceCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (performances.length === 0) {
    return <p className="text-center text-gray-500">공연이 없습니다.</p>;
  }

  return (
    <div
      className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 xl:gap-x-10 xl:gap-y-14
    gap-x-2.5 gap-y-6 lg:gap-x-5 lg:gap-y-12 2xl:gap-y-16"
    >
      {performances.map((performance) => (
        <PerformanceCard key={performance.id} performance={performance} />
      ))}
    </div>
  );
};
