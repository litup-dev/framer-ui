"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { useClubDetailStore } from "@/app/feature/club/detail/store";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Subtitle } from "@/components/shared/typography";

interface ClubDetailHeaderProps {
  images: string[];
  clubName?: string;
}

const ClubDetailHeader = ({ images, clubName }: ClubDetailHeaderProps) => {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isImageGalleryOpen } = useClubDetailStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const imageHeight = 490;
        const progress = Math.min(Math.max(scrollY / imageHeight, 0), 1);
        setScrollProgress(progress);
      });
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const carouselImages =
    images.length > 0
      ? images
      : [
          "/images/club_detail1.png",
          "/images/club_detail2.png",
          "/images/club_detail3.png",
          "/images/club_detail4.png",
        ];

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (carouselImages.length === 0) return null;

  return (
    <div className="relative w-full aspect-[3/4] h-[490px] xl:h-[490px] 2xl:h-[600px] bg-black">
      <AnimatePresence>
        {carouselImages.map((imageSrc, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="absolute inset-0 w-full h-full xl:hidden"
            style={{ zIndex: index === currentIndex ? 1 : 0 }}
          >
            <Image
              src={imageSrc}
              alt={clubName || `Club image ${index + 1}`}
              fill
              className="object-cover blur-[1px]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[#000000]/70" />
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="absolute inset-0 z-20 flex justify-center items-center pointer-events-none">
        <div className="w-full flex justify-center h-[490px] 2xl:h-[600px] pointer-events-auto">
          <Carousel
            className="w-full sm:w-auto h-[490px] 2xl:h-[600px]"
            opts={{
              align: "start",
              loop: false,
            }}
            setApi={setApi}
          >
            <CarouselContent className="h-[490px] 2xl:h-[600px] -ml-0">
              {carouselImages.map((imageSrc, index) => (
                <CarouselItem
                  key={index}
                  className="h-[490px] 2xl:h-[600px] pl-0  basis-full xl:!basis-auto min-w-0 flex items-center justify-center"
                >
                  <div className="relative w-full h-[490px] 2xl:h-[600px] flex items-center justify-center overflow-hidden">
                    {/* mobile: 원본 비율 유지, 컨테이너 안에 완전히 fit (letterbox) */}
                    <Image
                      src={imageSrc}
                      alt="Overlay"
                      fill
                      className="object-contain sm:!hidden"
                      sizes="100vw"
                    />
                    <div className="hidden sm:block relative w-full h-[490px] xl:h-[490px] 2xl:h-[600px] max-w-[440px] xl:max-w-none xl:w-auto xl:flex xl:items-center xl:justify-center">
                      <Image
                        src={imageSrc}
                        alt="Overlay"
                        width={440}
                        height={490}
                        className="w-full h-[490px] xl:w-auto xl:h-[490px] 2xl:h-[600px] object-cover xl:object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="absolute right-5 bottom-5 2xl:right-[80px] 2xl:bottom-[40px] z-[60] xl:hidden flex items-center px-2 py-1.5 rounded-full bg-black/60 pointer-events-auto">
          <Subtitle className="text-[12px] 2xl:text-[14px]">
            <span className="text-white">{currentIndex + 1}</span>
            <span className="text-white/60">{` / ${carouselImages.length}`}</span>
          </Subtitle>
        </div>
      </div>
      {/* xl/2xl 캐러셀 화살표 — viewport 기준 absolute 배치 (Figma: xl left=91 right=43, 2xl left=111 right=63) */}
      <button
        onClick={() => api?.scrollPrev()}
        aria-label="Previous slide"
        className="hidden xl:flex absolute top-1/2 -translate-y-1/2 z-50 xl:left-[43px] 2xl:left-[63px] size-12 items-center justify-center border-none bg-transparent shadow-none hover:bg-transparent disabled:opacity-20"
        disabled={!canScrollPrev}
      >
        <Image
          src="/images/arrow-white.svg"
          alt="previous"
          width={48}
          height={48}
        />
      </button>
      <button
        onClick={() => api?.scrollNext()}
        aria-label="Next slide"
        className="hidden xl:flex absolute top-1/2 -translate-y-1/2 z-50 xl:right-[43px] 2xl:right-[63px] size-12 items-center justify-center border-none bg-transparent shadow-none hover:bg-transparent disabled:opacity-20"
        disabled={!canScrollNext}
      >
        <Image
          src="/images/arrow-white.svg"
          alt="next"
          width={48}
          height={48}
          className="rotate-180"
        />
      </button>
      {mounted &&
        createPortal(
          <div
            onClick={() => router.back()}
            className="md:hidden flex items-center gap-2 p-2 hover:opacity-80 z-[999999] w-full fixed top-0 left-0 right-0"
            style={{
              backgroundColor: isImageGalleryOpen
                ? "transparent"
                : `rgba(255, 255, 255, ${scrollProgress})`,
              opacity: isImageGalleryOpen ? 0 : 1,
              pointerEvents: isImageGalleryOpen ? "none" : "auto",
            }}
          >
            <Image
              src="/images/arrow-white.svg"
              width={48}
              height={48}
              alt="arrow-up"
              className={cn(scrollProgress > 0.3 && "brightness-0")}
            />
          </div>,
          document.body,
        )}
    </div>
  );
};

export default ClubDetailHeader;
