"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface PosterCarouselProps {
  images: string[];
  title: string;
  variant: "lg" | "md" | "sm";
}

/**
 * 포스터 이미지 슬라이드 컴포넌트
 * - LG+: 메인 슬라이드 + 썸네일 미리보기 (active border 3px main color)
 * - MD 이하: 메인 슬라이드 + 커스텀 인디케이터 (n/nn)
 */
const PosterCarousel = ({ images, title, variant }: PosterCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };

  // API 이벤트: 현재 슬라이드 추적
  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // LG+ 레이아웃: 메인 슬라이드 + 썸네일
  if (variant === "lg") {
    return (
      <div className="w-full">
        {/* 메인 포스터 슬라이드 */}
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent className="-ml-0">
            {images.map((img, index) => (
              <CarouselItem key={index} className="pl-0">
                <div className="relative w-full h-[530px] xl:h-[585px] 2xl:h-[890px] overflow-hidden bg-gray-200">
                  <Image
                    src={img}
                    alt={`${title} - ${index + 1}`}
                    fill
                    sizes="(max-width: 1279px) 420px, (max-width: 1535px) 490px, 750px"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* 썸네일 미리보기 */}
        <div className="flex gap-2 lg:gap-2 xl:gap-2 2xl:gap-2.5 mt-2 xl:mt-2 2xl:mt-2.5">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative w-16 h-16 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 flex-shrink-0 overflow-hidden bg-gray-200 cursor-pointer transition-all",
                current === index
                  ? "border-[3px] border-main"
                  : "border-[3px] border-transparent hover:border-main/50"
              )}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // MD 이하 레이아웃: 메인 슬라이드 + 인디케이터
  const heightClass = variant === "md" ? "h-[830px]" : "h-[440px]";

  return (
    <div className="relative w-full">
      {/* 메인 포스터 슬라이드 */}
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent className="-ml-0">
          {images.map((img, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className={cn("relative w-full overflow-hidden bg-gray-200", heightClass)}>
                <Image
                  src={img}
                  alt={`${title} - ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* 커스텀 인디케이터: 우측 하단 */}
      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-[4px] text-[14px] font-medium">
        {current + 1}/{images.length.toString().padStart(2, "0")}
      </div>
    </div>
  );
};

export default PosterCarousel;
