"use client";

import { useState } from "react";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { useQuery } from "@tanstack/react-query";
import FadeIn from "@/components/shared/fade-in";

import { PostsItem } from "@/app/feature/home/types";
import { getPostsOptions } from "@/app/feature/home/query-options";

import { Marquee3D } from "@/components/shared/marquee-cards";
import PostCard from "@/app/feature/home/components/post-card";
import ModalCalendar from "@/app/shared/components/calendar";
import HeroSection from "@/app/feature/home/components/hero-section";
import Image from "next/image";
import CarouselCards from "@/app/feature/home/components/carousel";
import SelectShow from "@/app/feature/home/components/select-show";

export default function Home() {
  const { data: posts } = useQuery(getPostsOptions());
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  return (
    <FadeIn>
      <div className="w-full flex flex-col h-full gap-4 pb-20 px-10">
        <HeroSection selectedCategory={selectedCategory} />
        <Image
          src="/images/character.png"
          alt="character"
          width={600}
          height={300}
          className="absolute top-[240px] right-20 z-5"
        />
        <div className="flex gap-10 z-10 justify-between px-5 pt-20">
          <SelectShow onCategoryChange={handleCategoryChange} />
          <CarouselCards />
        </div>
      </div>
    </FadeIn>
  );
}
