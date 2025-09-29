"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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

  const [clickIndex, setClickIndex] = useState(0);

  const currentImageIndex =
    (getImageIndex() + clickIndex) % heroSectionImages.length;

  const handleImageChange = () => {
    setClickIndex((prev) => prev + 1);
  };

  return (
    <div className="cursor-pointer" onClick={handleImageChange}>
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
            key={currentImageIndex}
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
            {heroSectionImages[currentImageIndex]?.image && (
              <Image
                src={heroSectionImages[currentImageIndex].image}
                alt={heroSectionImages[currentImageIndex].id.toString()}
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
