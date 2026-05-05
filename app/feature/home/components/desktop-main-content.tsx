"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { InfiniteData } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { PerformanceItem } from "@/app/feature/home/types";
import { usePagination } from "@/app/feature/home/hooks/use-pagination";
import { useHomeStore } from "@/app/feature/home/store/home-store";
import { PerformancesPagination } from "@/app/feature/home/components/performances-pagination";
import { PerformanceCard } from "@/app/feature/home/components/performance-card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface DesktopMainContentProps {
  showAllItems: boolean;
  performances?: InfiniteData<{
    data: PerformanceItem[];
    offset: number;
    hasMore: boolean;
    total: number;
  }>;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
}

const DesktopMainContent = ({
  showAllItems,
  performances,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: DesktopMainContentProps) => {
  const { selectedCategory, selectedArea } = useHomeStore();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedArea]);

  const limit = 16;
  const total = (performances?.pages[0] as { total?: number })?.total || 0;

  const performanceItems = useMemo(() => {
    if (!performances?.pages || performances.pages.length === 0) return [];

    const targetOffset = (currentPage - 1) * limit;
    const pageIndex = performances.pages.findIndex(
      (page) => page.offset === targetOffset,
    );

    if (pageIndex !== -1) {
      return performances.pages[pageIndex].data;
    }

    return performances.pages[0]?.data || [];
  }, [performances?.pages, currentPage, limit]);

  const pagination = usePagination({
    total,
    limit,
    currentPage,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage: async () => {
      if (fetchNextPage) {
        await fetchNextPage();
      }
    },
    pages: performances?.pages || [],
  });

  const handlePageChange = useCallback(
    async (page: number) => {
      const totalPages = Math.ceil(total / limit);
      if (page < 1 || page > totalPages) return;

      const targetOffset = (page - 1) * limit;
      let currentMaxOffset = Math.max(
        ...(performances?.pages.map((p) => p.offset) || [0]),
        0,
      );

      while (targetOffset > currentMaxOffset && hasNextPage && fetchNextPage) {
        await fetchNextPage();
        await new Promise((resolve) => setTimeout(resolve, 50));
        currentMaxOffset = Math.max(
          ...(performances?.pages.map((p) => p.offset) || [0]),
          0,
        );
        if (currentMaxOffset >= targetOffset) {
          break;
        }
      }

      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [performances?.pages, hasNextPage, fetchNextPage, total, limit],
  );

  if (showAllItems) {
    return (
      <div className="hidden md:flex flex-col gap-4">
        <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10">
          {performanceItems.map((performance) => (
            <PerformanceCard key={performance.id} performance={performance} />
          ))}
        </div>
        <PerformancesPagination
          totalPages={pagination.totalPages}
          currentPage={currentPage}
          pageNumbers={pagination.pageNumbers}
          onPageClick={handlePageChange}
          onPreviousClick={() => handlePageChange(currentPage - 1)}
          onNextClick={() => handlePageChange(currentPage + 1)}
          canGoPrevious={currentPage > 1}
          canGoNext={currentPage < pagination.totalPages}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full hidden md:block",
        performanceItems.length === 0 && "min-h-[613px]",
      )}
    >
      <div className="hidden md:grid xl:hidden grid-cols-3 gap-x-3 lg:gap-x-4 gap-y-8 lg:gap-y-10">
        {performanceItems.slice(0, 9).map((performance) => (
          <PerformanceCard key={performance.id} performance={performance} />
        ))}
      </div>
      <Carousel
        className="hidden xl:block w-full relative z-10"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4 2xl:-ml-5">
          {performanceItems.map((performance) => (
            <CarouselItem
              key={performance.id}
              className="pl-2 sm:pl-4 2xl:pl-5 md:basis-1/3 lg:basis-1/4 2xl:basis-1/5"
            >
              <PerformanceCard performance={performance} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default DesktopMainContent;
