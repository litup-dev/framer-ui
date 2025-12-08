"use client";

import { ChevronRight } from "lucide-react";

export default function UserStats() {
  const stats = [
    { label: "기대돼요", count: 0 },
    { label: "작성한 게시글", count: 2 },
    { label: "댓글", count: 5 },
  ];

  return (
    <div className="bg-main rounded-lg p-4 md:p-5 lg:p-10 xl:p-8 2xl:p-10 h-[120px] md:h-[160px] lg:h-[267px] xl:h-[240px] 2xl:h-[267px]">
      <div className="grid grid-cols-3 divide-x divide-black/10 h-full">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-start justify-between text-white px-4 md:px-5 lg:px-10 xl:px-8 2xl:px-10 first:pl-0 last:pr-0 h-full">
            <div className="flex items-center gap-1 text-sm md:text-base">
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              <span>{stat.label}</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold">
              {stat.count}
              <span className="text-lg md:text-xl">개</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
