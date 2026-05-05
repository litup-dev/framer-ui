"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { InfiniteData } from "@tanstack/react-query";
import { PerformanceItem } from "@/app/feature/home/types";
import { cn } from "@/lib/utils";
import { useHomeStore } from "@/app/feature/home/store/home-store";
import { Subtitle, Title } from "@/components/shared/typography";

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
  today: "#171717",
  free: "#F3703C",
  seoul: "#C4B59C",
  hongdae: "#C4B59C",
  busan: "#C4B59C",
};

const INDEX_TO_COLOR_KEY = [
  "week",
  "today",
  "free",
  "seoul",
  "hongdae",
  "busan",
] as const;

const getCategoryIndex = (category: string, selectedArea: string) => {
  switch (category) {
    case "week":
      return 0;
    case "today":
      return 1;
    case "free":
      return 2;
    case "area": {
      const areaKey = selectedArea || "seoul";
      const idx = INDEX_TO_COLOR_KEY.indexOf(
        areaKey as (typeof INDEX_TO_COLOR_KEY)[number],
      );
      return idx >= 0 ? idx : 3;
    }
    default:
      return 0;
  }
};

const getColorKey = (category: string, selectedArea: string) => {
  if (category === "area") {
    return selectedArea || "seoul";
  }
  return category;
};

const ANIMATION_TRANSITION = {
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1] as const,
  type: "tween" as const,
};

export default function CharacterSection({
  performances,
}: CharacterSectionProps) {
  const {
    showAllItems,
    handleShowAllClick,
    selectedCategory,
    selectedArea,
    setIsAnimating,
  } = useHomeStore();
  const [previousIndex, setPreviousIndex] = useState(0);

  const total = (performances?.pages?.[0] as { total?: number })?.total || 0;
  const currentIndex = getCategoryIndex(selectedCategory, selectedArea);
  const colorKey = getColorKey(selectedCategory, selectedArea);
  const previousBgColor =
    CATEGORY_BG_COLORS[INDEX_TO_COLOR_KEY[previousIndex] ?? "week"] ??
    CATEGORY_BG_COLORS.week;
  const currentBgColor =
    CATEGORY_BG_COLORS[colorKey] ?? CATEGORY_BG_COLORS.week;

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
    <div className="block absolute top-[43px] md:top-[167px] lg:top-[201px] xl:top-[280px] 2xl:top-[250px] right-[20px] md:right-[40px] lg:right-[60px] xl:right-[60px] 2xl:right-[80px] z-20">
      <div className="relative w-full md:w-[550px] lg:w-[600px] xl:w-[700px] 2xl:w-[860px]">
        <div className="absolute top-[115px] lg:top-[120px] xl:top-[14px] 2xl:top-[164px] right-0 flex flex-col items-end xl:gap-2 2xl:gap-3">
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
              <Title
                className={cn(
                  "text-[30px] min-[744px]:text-[42px] lg:text-[52px] xl:text-[56px] 2xl:text-[84px] pr-0.5 lg:pr-1 xl:pr-1.5 leading-[22px] min-[744px]:leading-[30px] lg:leading-[38px] xl:leading-[40px] 2xl:leading-[61px] tracking-[-2.4px] min-[744px]:tracking-[-3.36px] lg:tracking-[-4.16px] xl:tracking-[-4.48px] 2xl:tracking-[-6.72px]",
                  colorKey === "today" && "text-white",
                  colorKey !== "today" &&
                    colorKey !== "busan" &&
                    colorKey !== "hongdae" &&
                    colorKey !== "free" &&
                    "text-black",
                )}
              >
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
                    <Title
                      className={cn(
                        "text-[22px] min-[744px]:text-[30px] lg:text-[38px] xl:text-[56px] 2xl:text-[84px] pr-1.5 leading-[22px] min-[744px]:leading-[30px] lg:leading-[38px] xl:leading-[40px] 2xl:leading-[61px] xl:tracking-[-4.48px] 2xl:tracking-[-6.72px]",
                        INDEX_TO_COLOR_KEY[previousIndex] === "today" &&
                          "text-white",

                        INDEX_TO_COLOR_KEY[previousIndex] !== "today" &&
                          "text-black",
                      )}
                    >
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
                      <Title
                        className={cn(
                          "text-[22px] min-[744px]:text-[30px] lg:text-[38px] xl:text-[56px] 2xl:text-[84px] pr-1.5 leading-[22px] min-[744px]:leading-[30px] lg:leading-[38px] xl:leading-[40px] 2xl:leading-[61px] xl:tracking-[-4.48px] 2xl:tracking-[-6.72px]",
                          colorKey === "today" && "text-white",
                        )}
                      >
                        {total}
                      </Title>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
          <span
            className="hidden xl:flex border-2 rounded-full bg-white border-[rgba(23,23,23,0.2)] xl:pl-3 xl:pr-[7px] xl:py-[6px] 2xl:pl-[13px] 2xl:pr-[7px] 2xl:py-[7px] items-center justify-center font-bold cursor-pointer hover:bg-gray-50"
            onClick={handleShowAllClick}
          >
            <Subtitle className="text-[14px] xl:tracking-[-0.56px] 2xl:text-[16px] 2xl:tracking-[-0.64px] text-[#171717]">
              {showAllItems ? "기본보기" : "전체보기"}
            </Subtitle>
            <ChevronDown
              className={`xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 transition-transform ${
                showAllItems ? "rotate-180" : ""
              }`}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
