"use client";

import { useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import {
  ReviewCategory,
  ReviewCategoryResponse,
} from "@/app/feature/club/types";
import { useClubDetailStore } from "@/app/feature/club/detail/store";

import { StarRating } from "@/app/feature/club/detail/components/review-star-rating";

export const ReviewStep1 = () => {
  const queryClient = useQueryClient();
  const categoriesData = queryClient.getQueryData<ReviewCategoryResponse>([
    "review-category",
  ]);
  const { reviewCategories, setReviewCategories } = useClubDetailStore();

  const categories: ReviewCategory[] = categoriesData?.data || [];

  const categoryMap: Record<string, ReviewCategory | undefined> = {};
  categories.forEach((category) => {
    categoryMap[category.code] = category;
  });

  const locationCategory = categoryMap["location"];
  const facilityCategory = categoryMap["facility"];
  const soundCategory = categoryMap["sound"];
  const cultureCategory = categoryMap["culture"];

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
          <div className="text-subtitle-12">
            {locationCategory?.name || "위치"}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {locationCategory?.keywords.map((keyword) => {
              const isSelected = reviewCategories.includes(keyword.id);
              return (
                <div
                  onClick={() => setReviewCategories(keyword.id)}
                  key={keyword.id}
                  className={cn(
                    "p-2 border text-center text-description-14 cursor-pointer transition-colors",
                    isSelected
                      ? "bg-main text-white border-main"
                      : "hover:bg-gray-100"
                  )}
                >
                  {keyword.keyword}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="text-subtitle-12">
            {facilityCategory?.name || "시설"}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {facilityCategory?.keywords.map((keyword) => {
              const isSelected = reviewCategories.includes(keyword.id);
              return (
                <div
                  onClick={() => setReviewCategories(keyword.id)}
                  key={keyword.id}
                  className={cn(
                    "p-2 border text-center text-description-14 cursor-pointer transition-colors",
                    isSelected
                      ? "bg-main text-white border-main"
                      : "hover:bg-gray-100"
                  )}
                >
                  {keyword.keyword}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="text-subtitle-12">
            {soundCategory?.name || "음향"}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {soundCategory?.keywords.map((keyword) => {
              const isSelected = reviewCategories.includes(keyword.id);
              return (
                <div
                  onClick={() => setReviewCategories(keyword.id)}
                  key={keyword.id}
                  className={cn(
                    "p-2 border text-center text-description-14 cursor-pointer transition-colors",
                    isSelected
                      ? "bg-main text-white border-main"
                      : "hover:bg-gray-100"
                  )}
                >
                  {keyword.keyword}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="text-subtitle-12">
            {cultureCategory?.name || "문화"}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {cultureCategory?.keywords.map((keyword) => {
              const isSelected = reviewCategories.includes(keyword.id);
              return (
                <div
                  onClick={() => setReviewCategories(keyword.id)}
                  key={keyword.id}
                  className={cn(
                    "p-2 border text-center text-description-14 cursor-pointer transition-colors",
                    isSelected
                      ? "bg-main text-white border-main"
                      : "hover:bg-gray-100"
                  )}
                >
                  {keyword.keyword}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
