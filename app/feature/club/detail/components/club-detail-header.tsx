"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useClubDetailStore } from "@/app/feature/club/detail/store";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ClubDetailHeaderProps {
  images: string[];
  clubName?: string;
}

const ClubDetailHeader = ({ images, clubName }: ClubDetailHeaderProps) => {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const { isImageGalleryOpen } = useClubDetailStore();

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

  const carouselImages = images.length > 0 
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
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
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
              className="object-cover blur-[10px]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[#000000]/70" />
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="absolute inset-0 z-20 flex justify-center items-center pointer-events-none">
        <div className="w-full flex justify-center h-[220px] sm:h-[490px] xl:h-[490px] 2xl:h-[600px] pointer-events-auto">
          <Carousel
            className="w-full sm:w-auto h-[220px] sm:h-[490px] xl:h-[490px] 2xl:h-[600px]"
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setApi}
          >
            <CarouselContent className="h-[220px] sm:h-[490px] xl:h-[490px] 2xl:h-[600px] -ml-0">
              {carouselImages.map((imageSrc, index) => (
                <CarouselItem
                  key={index}
                  className="h-[220px] sm:h-[490px] xl:h-[490px] 2xl:h-[600px] pl-0  basis-full xl:!basis-auto min-w-0 flex items-center justify-center"
                >
                  <div className="relative w-full h-[220px] sm:h-[490px] xl:h-[490px] 2xl:h-[600px] sm:flex sm:items-center sm:justify-center">
                    <Image
                      src={imageSrc}
                      alt="Overlay"
                      fill
                      className="object-cover sm:!hidden"
                      sizes="100vw"
                    />
                    <div className="hidden sm:block relative w-full h-[490px] xl:h-[490px] 2xl:h-[600px] max-w-[440px] xl:max-w-none xl:w-auto xl:flex xl:items-center xl:justify-center">
                      <img
                        src={imageSrc}
                        alt="Overlay"
                        className="w-full h-[490px] xl:w-auto xl:h-[490px] 2xl:h-[600px] object-cover xl:object-contain"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <div
        onClick={() => router.back()}
        className="md:hidden flex items-center gap-2 p-2 hover:opacity-80 z-[1000000] w-full fixed top-0 left-0"
        style={{
          backgroundColor: isImageGalleryOpen
            ? "transparent"
            : `rgba(255, 255, 255, ${scrollProgress})`,
          color:
            isImageGalleryOpen || scrollProgress > 0.5 ? "#111827" : "#ffffff",
          opacity: isImageGalleryOpen ? 0 : 1,
          pointerEvents: isImageGalleryOpen ? "none" : "auto",
        }}
      >
        <ChevronLeft className="w-8 h-8" />
      </div>
    </div>
  );
};

export default ClubDetailHeader;
