"use client";

import Image from "next/image";
import { characterSvg } from "@/public/images";
import { getTodayDay } from "@/lib/date-utils";
import { ChevronDown } from "lucide-react";
import { useHomeStore } from "@/app/feature/home/store/home-store";
import { Chip } from "@/components/shared/typography";

export default function CharacterSection() {
  const { showAllItems, handleShowAllClick } = useHomeStore();

  return (
    <div className="hidden md:block absolute top-[200px] lg:top-[250px] xl:top-[300px] 2xl:top-[250px] right-4 md:right-6 lg:right-8 xl:right-[80px] z-5">
      <div className="flex flex-col max-w-[280px] md:max-w-[320px] lg:max-w-[360px] xl:max-w-[460px] 2xl:max-w-[500px] text-[#22222299] text-[14px] md:text-[16px]">
        <Chip>인디 씬을 사랑하는 사람들이 모이는 공간.</Chip>
        <Chip className="flex justify-end">
          공연 일정, 클럽 정보, 그리고 커뮤니티까지 한 번에.
        </Chip>
      </div>

      <div className="relative w-full md:w-[400px] lg:w-[500px] 2xl:w-[860px]">
        <Image src={characterSvg} alt="character" />
        <div className="absolute top-[55px] lg:top-[0px] xl:top-[20px] 2xl:top-[70px] right-5 xl:right-0 flex flex-col items-center gap-2">
          <div className="text-[#222222] bg-[#FF491A] inline-block leading-[0.8]">
            <span className="font-bold text-[44px] lg:text-[64px] xl:text-[76px] tracking-[-0.08em] pr-1.5">
              {getTodayDay()}
            </span>
          </div>
          <span
            className="hidden lg:flex border rounded-full bg-white border-gray-400 px-2 py-1 items-center font-bold cursor-pointer hover:bg-gray-50"
            onClick={handleShowAllClick}
          >
            <p className="text-chip-14 xl:text-chip-16">
              {showAllItems ? "기본보기" : "전체보기"}
            </p>
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
