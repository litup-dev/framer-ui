"use client";

import { useState } from "react";
import { SsgoiTransition } from "@ssgoi/react";
import FadeIn from "@/components/shared/fade-in";

import HeroSection from "@/app/feature/home/components/hero-section";
import Image from "next/image";
import CarouselCards from "@/app/feature/home/components/carousel";
import SelectShow from "@/app/feature/home/components/select-show";
import { Calendar } from "@/components/ui/calendar";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  return (
    <SsgoiTransition id="/home">
      <FadeIn>
        <div className="w-full flex flex-col h-full gap-10 pb-20 px-10">
          <HeroSection selectedCategory={selectedCategory} />
          <Image
            src="/images/character.png"
            alt="character"
            width={600}
            height={300}
            className="absolute top-[140px] right-20 z-5 animate-bounce-slow"
          />
          <div className="flex gap-10 z-10 justify-between px-5 pt-4">
            <SelectShow onCategoryChange={handleCategoryChange} />
            <CarouselCards />
          </div>
          <Calendar />
        </div>
      </FadeIn>
    </SsgoiTransition>
  );
}
