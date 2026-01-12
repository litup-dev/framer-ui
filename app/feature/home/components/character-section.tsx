"use client";

import Image from "next/image";
import { characterSvg } from "@/public/images";
import { ChevronDown } from "lucide-react";
import { InfiniteData } from "@tanstack/react-query";
import { PerformanceItem } from "@/app/feature/home/types";
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

export default function CharacterSection({
  performances,
}: CharacterSectionProps) {
  const { showAllItems, handleShowAllClick } = useHomeStore();

  const total = (performances?.pages?.[0] as { total?: number })?.total || 0;

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
        <div className="absolute top-[75px] lg:top-[80px] xl:top-[45px] 2xl:top-[75px] right-5 xl:right-0 flex flex-col items-center gap-2">
          <Title className="text-[44px] lg:text-[64px] xl:text-[76px] pr-1.5 leading-[0.8] bg-[#FF491A] text-black">
            {total}
          </Title>
          <span
            className="hidden xl:flex border rounded-full bg-white border-gray-400 px-2 py-1 items-center font-bold cursor-pointer hover:bg-gray-50"
            onClick={handleShowAllClick}
          >
            <Subtitle className="text-[16px]">
              {showAllItems ? "기본보기" : "전체보기"}
            </Subtitle>
            <ChevronDown
              className={`w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 transition-transform ${
                showAllItems ? "rotate-180" : ""
              }`}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
