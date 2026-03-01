import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PerformanceItem } from "@/app/feature/all-performances/types";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

import { Card, CardContent } from "@/components/ui/card";
import { Description, Subtitle } from "@/components/shared/typography";
import { formatDate, formatMonthDay } from "@/lib/date-utils";
import { getToday } from "@/lib/date-utils";

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
              <span className="text-gray-500 text-sm">이미지 없음</span>
            </div>
          )}
          {formatMonthDay(performance.performDate) === getToday() && (
            <div className="absolute text-[#FFFFFF] rounded-[3px] bg-main top-2 right-2 px-2 py-1.5 xl:top-3 xl:right-3 2xl:top-4 2xl:right-4 xl:px-2.5 xl:py-2 2xl:px-3 2xl:py-2 backdrop-blur-xs">
              <Subtitle className="text-[11px] sm:text-[12px] xl:text-[14px] 2xl:text-[16px]">
                오늘 공연
              </Subtitle>
            </div>
          )}
        </div>

        <CardContent className="flex flex-col justify-start gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/club/${performance.club.id}`);
            }}
            className="text-left w-full"
          >
            <Description className="text-[12px] 2xl:text-[16px] text-black/60 hover:text-black/80 cursor-pointer">
              {performance.club.name}
            </Description>
          </button>
          <Subtitle className="text-[14px] 2xl:text-[20px] leading-[120%] truncate sm:line-clamp-2 sm:whitespace-normal">
            {performance.title}
          </Subtitle>
          <Description className="text-[12px] 2xl:text-[16px] text-black">
            {artistsText || "아티스트 정보 없음"}
          </Description>
          <div className="flex gap-1 text-black/40 pt-1">
            <Description className="text-[12px] 2xl:text-[16px] text-black/40">
              {formatDate(performance.performDate, "yyyy.MM.dd")}
            </Description>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
