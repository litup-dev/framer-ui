import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PerformanceItem } from "@/app/feature/all-performances/types";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

import { Card, CardContent } from "@/components/ui/card";
import { Description, Subtitle } from "@/components/shared/typography";
import {
  formatDate,
  formatMonthDay,
  getTodayDate,
} from "@/lib/date-utils";

interface PerformanceCardProps {
  performance: PerformanceItem;
}

export const PerformanceCard = ({ performance }: PerformanceCardProps) => {
  const router = useRouter();
  const mainImage =
    performance.images.find((img) => img.isMain) || performance.images[0];
  const imageUrl = getImageUrl(mainImage?.filePath);
  const artistsText = performance.artists
    .map((artist) => artist.name)
    .join(", ");

  return (
    <Link href={`/performance/${performance.id}`}>
      <Card className="overflow-hidden gap-3.5 md:gap-5 2xl:gap-6 pb-2">
        <div className="aspect-[4/5] relative">
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
              <span className="text-gray-500 text-sm">이미지 없음</span>
            </div>
          )}
          {formatMonthDay(performance.performDate) ===
            formatMonthDay(getTodayDate()) && (
            <div className="absolute text-white bg-main top-2 right-2 lg:top-3 lg:right-3 xl:top-3 xl:right-3 2xl:top-4 2xl:right-4 rounded-[2px] md:rounded-[3px] px-2 py-1.5 md:px-[9px] md:py-[7px] lg:px-[11px] lg:py-2 xl:px-[11px] xl:py-2 2xl:px-3 2xl:py-[9px]">
              <Subtitle className="text-[11px] md:text-[12px] lg:text-[14px] xl:text-[14px] 2xl:text-[16px] tracking-[-0.08em]">
                오늘 공연
              </Subtitle>
            </div>
          )}
        </div>

        <CardContent className="flex flex-col justify-start gap-3.5 md:gap-5 lg:gap-5 xl:gap-5 2xl:gap-5">
          <div className="flex flex-col gap-1 md:gap-2 2xl:gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/club/${performance.club.id}`);
              }}
              className="text-left w-full"
            >
              <Description className="text-[12px] md:text-[14px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px] leading-[1.2] text-[#171717]/60 hover:text-[#171717]/80 cursor-pointer">
                {performance.club.name}
              </Description>
            </button>
            <Subtitle className="text-[14px] md:text-[16px] lg:text-[18px] xl:text-[18px] 2xl:text-[20px] leading-[120%] truncate sm:line-clamp-2 sm:whitespace-normal">
              {performance.title}
            </Subtitle>
            <Description className="text-[12px] md:text-[14px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px] leading-[1.2] text-[#171717]">
              {artistsText || "아티스트 정보 없음"}
            </Description>
          </div>
          <Description className="text-[12px] md:text-[14px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px] text-[#171717]/40">
            {formatDate(performance.performDate, "yyyy.MM.dd")}
          </Description>
        </CardContent>
      </Card>
    </Link>
  );
};
