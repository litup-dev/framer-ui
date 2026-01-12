"use client";

import { useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import {
  ReviewCategory,
  ReviewCategoryResponse,
} from "@/app/feature/club/types";
import { useClubDetailStore } from "@/app/feature/club/detail/store";

import { StarRating } from "@/app/feature/club/detail/components/review-star-rating";
import { Subtitle } from "@/components/shared/typography";

interface KeywordButtonProps {
  keyword: { id: number; keyword: string };
  isSelected: boolean;
  onClick: () => void;
}

const KeywordButton = ({
  keyword,
  isSelected,
  onClick,
}: KeywordButtonProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-center px-2 py-2 border cursor-pointer transition-colors w-fit lg:min-w-[96px] lg:h-[34px] rounded-[3px]",
        isSelected ? "bg-main text-white border-main" : "hover:bg-gray-100"
      )}
    >
      <Subtitle className="text-[14px] whitespace-nowrap">
        {keyword.keyword}
      </Subtitle>
    </div>
  );
};

interface CategorySectionProps {
  category: ReviewCategory | undefined;
  categoryName: string;
  selectedCategoryIds: number[];
  onToggleCategory: (id: number) => void;
}

const CategorySection = ({
  category,
  categoryName,
  selectedCategoryIds,
  onToggleCategory,
}: CategorySectionProps) => {
  if (!category) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="text-subtitle-12">{category.name || categoryName}</div>
      <div className="grid grid-cols-3 lg:flex lg:flex-col gap-3 lg:gap-4">
        {category.keywords.map((keyword) => (
          <KeywordButton
            key={keyword.id}
            keyword={keyword}
            isSelected={selectedCategoryIds.includes(keyword.id)}
            onClick={() => onToggleCategory(keyword.id)}
          />
        ))}
      </div>
    </div>
  );
};

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
      <div className="bg-white pt-10 px-5 lg:px-19 space-y-10 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-13">
        <CategorySection
          category={locationCategory}
          categoryName="위치"
          selectedCategoryIds={reviewCategories}
          onToggleCategory={setReviewCategories}
        />
        <CategorySection
          category={facilityCategory}
          categoryName="시설"
          selectedCategoryIds={reviewCategories}
          onToggleCategory={setReviewCategories}
        />
        <CategorySection
          category={soundCategory}
          categoryName="음향"
          selectedCategoryIds={reviewCategories}
          onToggleCategory={setReviewCategories}
        />
        <CategorySection
          category={cultureCategory}
          categoryName="문화"
          selectedCategoryIds={reviewCategories}
          onToggleCategory={setReviewCategories}
        />
      </div>
    </div>
  );
};
