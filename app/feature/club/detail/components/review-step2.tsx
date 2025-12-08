"use client";

import { Textarea } from "@/components/ui/textarea";
import { StarDisplay } from "./review-star-display";

interface ReviewStep2Props {
  rating: number;
}

export const ReviewStep2 = ({ rating }: ReviewStep2Props) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="px-5 py-15 space-y-6 w-full h-full flex flex-col">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded-full flex-shrink-0" />
          <div className="flex items-center gap-2">
            <span className="text-subtitle-18">제비다방</span>
            <StarDisplay rating={rating} size="sm" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-subtitle-16">사진 첨부</div>
          <div className="flex gap-3">
            <div className="relative w-20 h-20 bg-black rounded flex-shrink-0">
              <button className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                ×
              </button>
            </div>
            {Array.from({ length: 2 }).map((_, idx) => (
              <div
                key={idx}
                className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center flex-shrink-0"
              >
                <span className="text-2xl text-gray-400">+</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <div className="text-subtitle-16">내용 작성</div>
          <Textarea
            className="w-full flex-1 p-4 min-h-[320px] border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-main"
            placeholder="내용을 입력하세요."
          />
        </div>
      </div>
    </div>
  );
};
