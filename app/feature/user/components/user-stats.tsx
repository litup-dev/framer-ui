"use client";

import { ChevronRight } from "lucide-react";
import { Title, Description } from "@/components/shared/typography";
import { UserStats as UserStatsType } from "@/app/feature/user/types";

interface UserStatsProps {
  data?: UserStatsType;
}

export default function UserStats({ data }: UserStatsProps) {
  // TODO: 게시글 수, 댓글 수 API 추가 예정

  return (
    <div className="bg-main rounded-lg p-4 md:p-5 lg:p-10 xl:p-8 2xl:p-10 h-[120px] md:h-[160px] lg:h-[267px] xl:h-[240px] 2xl:h-[267px]">
      <div className="grid grid-cols-3 divide-x divide-black/10 md:divide-x-2 h-full">
        {/* 기대돼요 */}
        <div className="flex flex-col items-start justify-between text-white px-4 md:px-5 lg:px-10 xl:px-8 2xl:px-10 first:pl-0 last:pr-0 h-full">
          <div className="flex items-center gap-1 text-sm md:text-base">
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
            <Title className="text-[12px] md:text-[14px] lg:text-[20px]">기대돼요</Title>
          </div>
          <div className="text-[40px] md:text-4xl lg:text-[72px] font-bold">
            {data?.attendCount ?? 0}
            <span className="text-[14px] md:text-[16px] lg:text-[24px]">개</span>
          </div>
        </div>

        {/* 서비스 준비 중 영역 (게시글 + 댓글) */}
        <div className="col-span-2 flex items-center justify-center text-white px-4 md:px-5 lg:px-10 xl:px-8 2xl:px-10">
          <Description className="text-[12px] md:text-[14px] lg:text-[16px] text-white text-center">
            서비스 준비 중입니다
          </Description>
        </div>
      </div>
    </div>
  );
}
