import Image from "next/image";
import Link from "next/link";

import { PerformanceItem } from "@/app/feature/all-performances/types";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

import { Card, CardContent } from "@/components/ui/card";
import { Description, Subtitle } from "@/components/shared/typography";
import { formatDate, formatMonthDay } from "@/lib/date-utils";

interface PerformanceCardProps {
  performance: PerformanceItem;
}

export const PerformanceCard = ({ performance }: PerformanceCardProps) => {
  const mainImage =
    performance.images.find((img) => img.isMain) || performance.images[0];
  const imageUrl = getImageUrl(mainImage?.filePath);
  const artistsText = performance.artists
    .map((artist) => artist.name)
    .join(", ");

  return (
    <Link href={`/performance/${performance.id}`}>
      <Card className="overflow-hidden gap-2.5 2xl:gap-6 pb-2">
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
          <div className="absolute text-[#FFFFFF] rounded-[3px] bg-[#000000]/50 top-2.5 right-2.5 px-2 py-1.5 xl:top-3 xl:right-3 2xl:top-4 2xl:right-4 xl:px-2.5 xl:py-2 2xl:px-3 2xl:py-2 backdrop-blur-xs">
            <Subtitle className="text-[12px] xl:text-[14px] 2xl:text-[16px]">
              {formatMonthDay(performance.performDate)}
            </Subtitle>
          </div>
        </div>

        <CardContent className="flex flex-col justify-start truncate gap-2.5">
          <Description className="text-[12px] 2xl:text-[16px] text-black/60">
            {performance.club.name}
          </Description>
          <Subtitle className="text-[14px] 2xl:text-[20px]">
            {performance.title}
          </Subtitle>
          <Description className="text-[12px] 2xl:text-[16px] text-black">
            {artistsText || "아티스트 정보 없음"}
          </Description>
          <div className="flex gap-1 text-black/40 pt-1">
            <Description className="text-[12px] 2xl:text-[16px] text-black/40">
              {formatDate(performance.createdAt, "yyyy.MM.dd")} -
            </Description>
            <Description className="text-[12px] 2xl:text-[16px] text-black/40">
              {formatDate(performance.performDate, "yyyy.MM.dd")}
            </Description>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
