"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { useHomeStore } from "@/app/feature/home/store/home-store";
import {
  getToday,
  getTodayDate,
  getStartOfWeek,
  getEndOfWeek,
} from "@/lib/date-utils";
import { addWeeks, format } from "date-fns";
import { ko } from "date-fns/locale";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";
import { getPerformancesOptions } from "@/app/feature/home/query-options";
import { Card, CardContent } from "@/components/ui/card";

import { Description, Subtitle } from "@/components/shared/typography";

interface MobileMainContentProps {
  selectedMobileBottomNavigation: "home" | "calendar";
}

const MobileMainContent = ({
  selectedMobileBottomNavigation,
}: MobileMainContentProps) => {
  const { selectedCategory, selectedArea } = useHomeStore();
  const today = getTodayDate();

  let startDate: string;
  let endDate: string;

  if (selectedCategory === "week") {
    startDate = getStartOfWeek(today);
    endDate = getEndOfWeek(today);
  } else if (selectedCategory === "today") {
    startDate = getToday();
    endDate = getToday();
  } else if (selectedCategory === "free") {
    startDate = getToday();
    endDate = format(addWeeks(today, 1), "yyyy-MM-dd", { locale: ko });
  } else {
    startDate = getToday();
    endDate = format(addWeeks(today, 1), "yyyy-MM-dd", { locale: ko });
  }

  const isFree = selectedCategory === "free" ? true : undefined;
  const area =
    selectedCategory === "area" && selectedArea ? selectedArea : undefined;

  const {
    data: performances,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    getPerformancesOptions(startDate, endDate, area, isFree)
  );

  const performanceItems =
    performances?.pages.flatMap((page) => page.data) || [];

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (selectedMobileBottomNavigation === "home") {
    return (
      <div className="grid grid-cols-3 gap-x-2.5 gap-y-6 md:hidden">
        {performanceItems.map((performance, index) => {
          const isLastItem = index === performanceItems.length - 1;
          const mainImage =
            performance.images.find((img) => img.isMain) ||
            performance.images[0];
          const imageUrl = getImageUrl(mainImage?.filePath);

          return (
            <div
              key={performance.id}
              ref={isLastItem ? ref : null}
              className="w-full"
            >
              <Link href={`/performance/${performance.id}`}>
                <Card className="overflow-hidden gap-3 pb-2">
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
                        sizes="33vw"
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
                  <CardContent className="flex flex-col gap-1.5 justify-start">
                    <Description className="truncate text-[12px] text-black/60">
                      {performance.club.name}
                    </Description>
                    <Subtitle className="truncate text-[14px]">
                      {performance.title}
                    </Subtitle>
                    <div className="flex flex-col gap-1">
                      {performance.artists && performance.artists.length > 0 ? (
                        performance.artists.length >= 3 ? (
                          <Subtitle className="truncate text-[12px] text-black/60">
                            {performance.artists[0].name} 외{" "}
                            {performance.artists.length - 1}팀
                          </Subtitle>
                        ) : (
                          performance.artists.map((artist, index) => (
                            <Subtitle
                              key={index}
                              className="truncate text-[12px] text-black/60"
                            >
                              {artist.name}
                            </Subtitle>
                          ))
                        )
                      ) : (
                        <Subtitle className="truncate text-[12px] text-black/60">
                          아티스트 정보 없음
                        </Subtitle>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          );
        })}
        {isFetchingNextPage && (
          <div className="col-span-3 flex justify-center py-4">
            <span className="text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
            </span>
          </div>
        )}
      </div>
    );
  }
};

export default MobileMainContent;
