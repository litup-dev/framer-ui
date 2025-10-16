"use client";

import Image from "next/image";
import { characterSvg } from "@/public/images";
import { getTodayDay } from "@/lib/date-utils";
import { ChevronDown } from "lucide-react";
import { useHomeStore } from "@/app/feature/home/store/home-store";

export default function CharacterSection() {
  const { showAllItems, handleShowAllClick } = useHomeStore();

  return (
    <div className="absolute top-[200px] right-[80px] z-5">
      <div className="flex flex-col max-w-[360px] text-[#22222299] text-[16px]">
        <span>인디 씬을 사랑하는 사람들이 모이는 공간.</span>
        <span className="flex justify-end">
          공연 일정, 클럽 정보, 그리고 커뮤니티까지 한 번에.
        </span>
      </div>

      <div className="relative">
        <Image src={characterSvg} alt="character" width={860} height={300} />
        <div className="absolute top-[84px] right-0 flex flex-col items-center gap-2">
          <span className="font-bold text-[#222222] text-[76px] bg-[#FF491A] inline-block leading-[0.8] px-0.5">
            {getTodayDay()}
          </span>
          <span
            className="border rounded-full bg-white border-gray-400 px-2 py-1 flex items-center text-[16px] font-bold cursor-pointer hover:bg-gray-50"
            onClick={handleShowAllClick}
          >
            {showAllItems ? "기본보기" : "전체보기"}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showAllItems ? "rotate-180" : ""
              }`}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
