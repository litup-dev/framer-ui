"use client";

import { StarRating } from "./review-star-rating";

export const ReviewStep1 = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col text-subtitle-18 p-6 space-y-14 bg-[#F2F1EE]">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="w-22.5 h-22.5 bg-gray-300 rounded-full flex-shrink-0" />
          <div>제비다방에서의 시간이 어떠셨나요?</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="bg-white border p-2 rounded-full text-description-12 text-main">
            별점을 드래그하세요.
          </div>
          <StarRating />
        </div>
      </div>
      <div className="bg-white pt-10 px-5 space-y-10">
        <div className="flex flex-col gap-5">
          <div className="text-subtitle-12">위치</div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="p-2 border text-center text-description-14"
              >
                조용한 분위기
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="text-subtitle-12">시설</div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="p-2 border text-center text-description-14"
              >
                조용한 분위기
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="text-subtitle-12">음향</div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="p-2 border text-center text-description-14"
              >
                조용한 분위기
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="text-subtitle-12">문화</div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="p-2 border text-center text-description-14"
              >
                조용한 분위기
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
