"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { InfiniteData } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { PerformanceItem } from "@/app/feature/home/types";
import { formatMonthDay } from "@/lib/date-utils";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";
import { Card, CardContent } from "@/components/ui/card";
import { Description, Subtitle } from "@/components/shared/typography";
import { PerformanceCardSkeleton } from "@/app/feature/home/components/performance-card";
import { useRouter } from "next/navigation";

const DEFAULT_IMAGE = "/images/poster_default.png";

interface MobileMainContentProps {
  selectedMobileBottomNavigation: "home" | "calendar";
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

const MobileMainContent = ({
  selectedMobileBottomNavigation,
  performances,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: MobileMainContentProps) => {
  const router = useRouter();

  const performanceItems: PerformanceItem[] =
    performances?.pages.flatMap((page) => page.data) || [];

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage?.();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (selectedMobileBottomNavigation !== "home") return null;

  if (!performances) {
    return (
      <div className="grid grid-cols-3 gap-x-2.5 gap-y-6 md:hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <PerformanceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

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
              <Card className="overflow-hidden gap-3">
                <div className="aspect-[4/5] relative">
                  <Image
                    src={imageUrl || DEFAULT_IMAGE}
                    alt={
                      performance.title ||
                      performance.club?.name ||
                      "Performance image"
                    }
                    fill
                    sizes="33vw"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute text-[#FFFFFF] rounded-[2px] bg-black/40 top-2 right-2 px-1.5 py-1">
                    <Subtitle className="text-[11px] xl:text-[14px] 2xl:text-[16px]">
                      {formatMonthDay(performance.performDate)}
                    </Subtitle>
                  </div>
                </div>
                <CardContent className="flex flex-col gap-1.5 justify-start">
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/club/${performance.club.id}`);
                    }}
                    className="cursor-pointer"
                  >
                    <Description className="truncate text-[12px] text-black/60">
                      {performance.club.name}
                    </Description>
                  </div>
                  <Subtitle className="truncate text-[14px]">
                    {performance.title}
                  </Subtitle>
                  {(() => {
                    const validArtists = performance.artists?.filter((a) => a.name?.trim()) ?? [];
                    return validArtists.length > 0 ? (
                      <div className="flex gap-1 items-center overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {validArtists.length >= 3 ? (
                          <Subtitle className="whitespace-nowrap flex-shrink-0 text-[12px] bg-gray h-[24px] rounded-[2px] text-black flex items-center justify-center px-2">
                            {validArtists[0].name} 외{" "}
                            {validArtists.length - 1}팀
                          </Subtitle>
                        ) : (
                          validArtists.map((artist, index) => (
                            <Subtitle
                              key={index}
                              className="whitespace-nowrap flex-shrink-0 text-[12px] bg-gray h-[24px] rounded-[2px] text-black flex items-center justify-center px-2"
                            >
                              {artist.name}
                            </Subtitle>
                          ))
                        )}
                      </div>
                    ) : null;
                  })()}
                </CardContent>
              </Card>
            </Link>
          </div>
        );
      })}
      {isFetchingNextPage && (
        <div className="col-span-3 flex justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default MobileMainContent;
