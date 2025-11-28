"use client";

import Image from "next/image";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";

import { usePagination } from "@/app/feature/home/hooks/use-pagination";
import { getPerformancesOptions } from "@/app/feature/home/query-options";
import { useHomeStore } from "@/app/feature/home/store/home-store";
import {
  getToday,
  getTodayDate,
  getStartOfWeek,
  getEndOfWeek,
} from "@/lib/date-utils";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";
import { PerformancesPagination } from "@/app/feature/home/components/performances-pagination";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Subtitle } from "@/components/shared/typography";

interface DesktopMainContentProps {
  showAllItems: boolean;
}

const DesktopMainContent = ({ showAllItems }: DesktopMainContentProps) => {
  const { selectedCategory } = useHomeStore();
  const today = getTodayDate();

  const startDate =
    selectedCategory === "week" ? getStartOfWeek(today) : getToday();

  const endDate =
    selectedCategory === "week" ? getEndOfWeek(today) : getToday();

  const {
    data: performances,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(getPerformancesOptions(startDate, endDate));

  const performanceItems =
    performances?.pages.flatMap((page) => page.data) || [];

  const limit = 16;
  const total = (performances?.pages[0] as { total?: number })?.total || 0;
  const currentPage = performances?.pages.length || 1;

  const pagination = usePagination({
    total,
    limit,
    currentPage,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    pages: performances?.pages || [],
  });

  if (showAllItems) {
    return (
      <div className="hidden md:flex flex-col gap-4">
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {performanceItems.map((performance) => {
            const mainImage =
              performance.images.find((img) => img.isMain) ||
              performance.images[0];
            const imageUrl = getImageUrl(mainImage?.filePath);
            const artistsText = performance.artists
              .map((artist) => artist.name)
              .join(", ");

            return (
              <Link
                key={performance.id}
                href={`/home/detail/${performance.id}`}
              >
                <Card
                  className="overflow-hidden gap-3 pb-2"
                  data-hero-key={performance.id}
                >
                  <div className="aspect-[3/4] relative">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={
                          performance.title ||
                          performance.club?.name ||
                          "Performance image"
                        }
                        fill
                        sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">
                          이미지 없음
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="flex flex-col justify-start truncate gap-2.5">
                    <Subtitle>{performance.club.name}</Subtitle>
                    <Subtitle>{performance.title}</Subtitle>
                    <p className="text-chip-14 2xl:text-chip-16">
                      {artistsText || "아티스트 정보 없음"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
        <PerformancesPagination
          totalPages={pagination.totalPages}
          currentPage={currentPage}
          pageNumbers={pagination.pageNumbers}
          onPageClick={pagination.handlePageClick}
          onPreviousClick={pagination.handlePreviousClick}
          onNextClick={pagination.handleNextClick}
          canGoPrevious={pagination.canGoPrevious}
          canGoNext={pagination.canGoNext}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full hidden md:block">
      <Carousel
        className="w-full relative z-10"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {performanceItems.map((performance) => {
            const mainImage =
              performance.images.find((img) => img.isMain) ||
              performance.images[0];
            const imageUrl = getImageUrl(mainImage?.filePath);
            const artistsText = performance.artists
              .map((artist) => artist.name)
              .join(", ");

            return (
              <CarouselItem
                key={performance.id}
                className="pl-2 sm:pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <Link href={`/home/detail/${performance.id}`}>
                  <Card
                    className="overflow-hidden"
                    data-hero-key={performance.id}
                  >
                    <div className="aspect-[3/4] relative">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={
                            performance.title ||
                            performance.club?.name ||
                            "Performance image"
                          }
                          fill
                          sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            이미지 없음
                          </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="flex flex-col justify-start">
                      <h3 className="text-gray-400 text-[16px] font-medium mb-1 truncate">
                        {performance.club.name}
                      </h3>
                      <p className="font-bold text-[20px] text-[#202020] mb-1 truncate">
                        {performance.title}
                      </p>
                      <p className="font-normal text-[14px] text-gray-400">
                        {artistsText || "아티스트 정보 없음"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default DesktopMainContent;
