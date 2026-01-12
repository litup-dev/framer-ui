"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

import { heroSectionImages } from "@/app/feature/home/mock";
import { useHomeStore } from "@/app/feature/home/store/home-store";

const HeroSection = () => {
  const { selectedCategory, setIsAnimating, selectedMobileBottomNavigation } =
    useHomeStore();
  const [previousIndex, setPreviousIndex] = useState(0);

  const getImageIndex = () => {
    switch (selectedCategory) {
      case "week":
        return 0;
      case "today":
        return 1;
      case "free":
        return 2;
      case "area":
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getImageIndex();

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
    <div
      className={cn(selectedMobileBottomNavigation === "calendar" && "hidden")}
    >
      <div
        className="relative overflow-hidden w-[250px] md:w-[270px] lg:w-[400px] xl:w-[600px] aspect-[590/259]"
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        {currentIndex !== previousIndex && (
          <motion.div
            key={`previous-${currentIndex}`}
            initial={{ clipPath: "inset(0 0% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 100%)" }}
            onAnimationComplete={handleAnimationComplete}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              type: "tween",
            }}
            className="absolute inset-0"
            style={{
              willChange: "clip-path",
              zIndex: 1,
            }}
          >
            {heroSectionImages[previousIndex]?.image && (
              <Image
                src={heroSectionImages[previousIndex].image}
                alt={heroSectionImages[previousIndex].id.toString()}
                fill
                sizes="(max-width: 768px) 250px, (max-width: 1024px) 270px, (max-width: 1280px) 400px, 600px"
                className="object-contain"
              />
            )}
          </motion.div>
        )}

        {currentIndex !== previousIndex && (
          <AnimatePresence>
            <motion.div
              key={`laser-${currentIndex}`}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              exit={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
                type: "tween",
              }}
              className="absolute inset-0"
              style={{
                willChange: "clip-path",
                zIndex: 2,
              }}
            >
              {heroSectionImages[currentIndex]?.image && (
                <Image
                  src={heroSectionImages[currentIndex].image}
                  alt={heroSectionImages[currentIndex].id.toString()}
                  fill
                  sizes="(max-width: 768px) 250px, (max-width: 1024px) 270px, (max-width: 1280px) 400px, 600px"
                  className="object-contain"
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {currentIndex === previousIndex && (
          <div className="absolute inset-0">
            {heroSectionImages[currentIndex]?.image && (
              <Image
                src={heroSectionImages[currentIndex].image}
                alt={heroSectionImages[currentIndex].id.toString()}
                fill
                sizes="(max-width: 768px) 250px, (max-width: 1024px) 270px, (max-width: 1280px) 400px, 600px"
                priority
                className="object-contain"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
