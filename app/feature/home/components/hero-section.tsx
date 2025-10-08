"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { heroSectionImages } from "@/app/feature/home/mock";

interface HeroSectionProps {
  selectedCategory: string;
}

const HeroSection = ({ selectedCategory }: HeroSectionProps) => {
  const getImageIndex = () => {
    switch (selectedCategory) {
      case "today":
        return 0;
      case "week":
        return 1;
      case "month":
        return 2;
      case "hongdae":
        return 3;
      default:
        return 3;
    }
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
        <AnimatePresence mode="wait">
          <motion.div
            key={getImageIndex()}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
              type: "tween",
            }}
            className="absolute inset-0"
            style={{ willChange: "transform, opacity" }}
          >
            {heroSectionImages[getImageIndex()]?.image && (
              <Image
                src={heroSectionImages[getImageIndex()].image}
                alt={heroSectionImages[getImageIndex()].id.toString()}
                width={590}
                height={259}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeroSection;
