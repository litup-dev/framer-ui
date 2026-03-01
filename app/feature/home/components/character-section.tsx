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
    <div className="hidden md:block absolute top-[180px] lg:top-[210px] xl:top-[280px] 2xl:top-[250px] right-4 md:right-6 lg:right-8 xl:right-[80px] z-5">
      <div className="relative w-full md:w-[550px] lg:w-[600px] xl:w-[700px] 2xl:w-[860px]">
        <div className="absolute top-[115px] lg:top-[120px] xl:top-[168px] 2xl:top-[196px] right-5 xl:right-0 flex flex-col items-center gap-2">
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
                  "text-[44px] lg:text-[64px] xl:text-[76px] pr-1.5 leading-[0.8]",
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
                        "text-[44px] lg:text-[64px] xl:text-[76px] pr-1.5 leading-[0.8]",
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
                          "text-[44px] lg:text-[64px] xl:text-[76px] pr-1.5 leading-[0.8]",
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
