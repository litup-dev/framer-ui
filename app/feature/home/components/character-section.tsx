"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { characterSvg } from "@/public/images";
import { ChevronDown } from "lucide-react";
import { InfiniteData } from "@tanstack/react-query";
import { PerformanceItem } from "@/app/feature/home/types";
import { cn } from "@/lib/utils";
import { useHomeStore } from "@/app/feature/home/store/home-store";
import { Description, Subtitle, Title } from "@/components/shared/typography";

interface CharacterSectionProps {
  performances?: InfiniteData<{
    data: PerformanceItem[];
    offset: number;
    hasMore: boolean;
    total: number;
  }>;
}

const CATEGORY_BG_COLORS: Record<string, string> = {
  week: "#FF491A",
  today: "#AECACD",
  free: "#FFFFFF",
  area: "#F2F1EE",
};

const CATEGORY_ORDER = ["week", "today", "free", "area"] as const;

const getCategoryIndex = (category: string) => {
  const idx = CATEGORY_ORDER.indexOf(
    category as (typeof CATEGORY_ORDER)[number],
  );
  return idx >= 0 ? idx : 0;
};

const ANIMATION_TRANSITION = {
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1] as const,
  type: "tween" as const,
};

export default function CharacterSection({
  performances,
}: CharacterSectionProps) {
  const { showAllItems, handleShowAllClick, selectedCategory, setIsAnimating } =
    useHomeStore();
  const [previousIndex, setPreviousIndex] = useState(0);

  const total = (performances?.pages?.[0] as { total?: number })?.total || 0;
  const currentIndex = getCategoryIndex(selectedCategory);
  const previousBgColor =
    CATEGORY_BG_COLORS[CATEGORY_ORDER[previousIndex] ?? "week"];
  const currentBgColor =
    CATEGORY_BG_COLORS[selectedCategory] ?? CATEGORY_BG_COLORS.week;

  useEffect(() => {
    if (currentIndex !== previousIndex) {
      setIsAnimating(true);
    }
  }, [currentIndex, previousIndex, setIsAnimating]);

  const handleAnimationComplete = () => {
    setPreviousIndex(currentIndex);
    setIsAnimating(false);
  };

  return (
    <div className="hidden md:block absolute top-[180px] lg:top-[210px] xl:top-[280px] 2xl:top-[250px] right-4 md:right-6 lg:right-8 xl:right-[80px] z-5">
      <div className="max-w-[280px] md:max-w-[400px] lg:max-w-[400px] xl:max-w-[460px] 2xl:max-w-[500px] text-[#22222299]">
        <Description className="text-[12px] xl:text-[16px] leading-[140%] text-black/60">
          인디 씬을 사랑하는 사람들이 모이는 공간.
          <br />
          <span className="inline-block pl-4 md:pl-6 lg:pl-8">
            공연 일정, 클럽 정보, 그리고 커뮤니티까지 한 번에.
          </span>
        </Description>
      </div>

      <div className="relative w-full md:w-[550px] lg:w-[600px] xl:w-[700px] 2xl:w-[860px]">
        <Image src={characterSvg} alt="character" />
        <div className="absolute top-[75px] lg:top-[80px] xl:top-[60px] 2xl:top-[90px] right-5 xl:right-0 flex flex-col items-center gap-2">
          <div
            className="relative overflow-hidden flex justify-end w-full"
            style={{
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          >
            <div
              className={cn(
                "inline-block",
                currentIndex !== previousIndex && "invisible",
              )}
              style={{
                backgroundColor:
                  currentIndex === previousIndex ? currentBgColor : undefined,
              }}
            >
              <Title className="text-[44px] lg:text-[64px] xl:text-[76px] pr-1.5 leading-[0.8] text-black">
                {total}
              </Title>
            </div>

            {currentIndex !== previousIndex && (
              <div className="absolute inset-0 flex justify-end">
                <motion.div
                  key={`previous-${currentIndex}`}
                  initial={{ clipPath: "inset(0 0% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 100%)" }}
                  onAnimationComplete={handleAnimationComplete}
                  transition={ANIMATION_TRANSITION}
                  className="absolute right-0 top-0"
                  style={{
                    willChange: "clip-path",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{ backgroundColor: previousBgColor }}
                    className="inline-block"
                  >
                    <Title className="text-[44px] lg:text-[64px] xl:text-[76px] pr-1.5 leading-[0.8] text-black">
                      {total}
                    </Title>
                  </div>
                </motion.div>
                <AnimatePresence>
                  <motion.div
                    key={`laser-${currentIndex}`}
                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                    animate={{ clipPath: "inset(0 0% 0 0)" }}
                    exit={{ clipPath: "inset(0 0% 0 0)" }}
                    transition={ANIMATION_TRANSITION}
                    className="absolute right-0 top-0"
                    style={{
                      willChange: "clip-path",
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{ backgroundColor: currentBgColor }}
                      className="inline-block"
                    >
                      <Title className="text-[44px] lg:text-[64px] xl:text-[76px] pr-1.5 leading-[0.8] text-black">
                        {total}
                      </Title>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
          <span
            className="hidden xl:flex xl:gap-[3px] border rounded-full bg-white border-gray-400 pl-[13px] pr-[10px] py-[7px] items-center font-bold cursor-pointer hover:bg-gray-50"
            onClick={handleShowAllClick}
          >
            <Subtitle className="text-[16px]">
              {showAllItems ? "기본보기" : "전체보기"}
            </Subtitle>
            <ChevronDown
              className={`w-5 h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 transition-transform ${
                showAllItems ? "rotate-180" : ""
              }`}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
