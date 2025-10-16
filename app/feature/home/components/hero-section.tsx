"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { heroSectionImages } from "@/app/feature/home/mock";
import { useHomeStore } from "@/app/feature/home/store/home-store";

const HeroSection = () => {
  const { selectedCategory, isAnimating, setIsAnimating } = useHomeStore();
  const [previousIndex, setPreviousIndex] = useState(0);

  const getImageIndex = () => {
    switch (selectedCategory) {
      case "week":
        return 0;
      case "month":
        return 1;
      case "free":
        return 2;
      case "local":
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
    <div className="cursor-pointer">
      <div
        className="relative overflow-hidden"
        style={{
          width: 590,
          height: 259,
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
                width={590}
                height={259}
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
                  width={590}
                  height={259}
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
                width={590}
                height={259}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
