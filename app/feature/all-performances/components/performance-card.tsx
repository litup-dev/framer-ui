import Image from "next/image";
import Link from "next/link";

import { PerformanceItem } from "@/app/feature/all-performances/types";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

import { Card, CardContent } from "@/components/ui/card";
import { Subtitle } from "@/components/shared/typography";

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
              <span className="text-gray-500 text-sm">이미지 없음</span>
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
};
