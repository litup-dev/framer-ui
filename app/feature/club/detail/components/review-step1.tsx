"use client";

import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import {
  ReviewCategory,
  ReviewCategoryResponse,
} from "@/app/feature/club/types";
import { useClubDetailStore } from "@/app/feature/club/detail/store";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

import { StarRating } from "@/app/feature/club/detail/components/review-star-rating";
import { Description, Subtitle } from "@/components/shared/typography";

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
        "flex items-center justify-center px-[11px] py-[10px] border cursor-pointer transition-colors w-fit  rounded-[3px]",
        isSelected ? "bg-main text-white border-main" : "hover:bg-gray-100",
      )}
    >
      <Description
        className={cn(
          "text-[14px] whitespace-nowrap text-black/80",
          isSelected ? "text-white" : "",
        )}
      >
        {keyword.keyword}
      </Description>
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
    <div className="flex flex-col gap-5 lg:gap-6">
      <Description className="2xl:text-[16px]">
        {category.name || categoryName}
      </Description>
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

interface ReviewStep1Props {
  clubName?: string;
  clubImage?: string;
}

export const ReviewStep1 = ({ clubName, clubImage }: ReviewStep1Props) => {
  const imageUrl = clubImage ? getImageUrl(clubImage) : null;
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
      <div className="flex flex-col p-6 2xl:pb-12.5 space-y-10 bg-[#F2F1EE]">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="w-22.5 h-22.5 bg-gray-300 rounded-full flex-shrink-0 relative overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={clubName || "클럽"}
                fill
                className="object-cover rounded-full"
              />
            ) : null}
          </div>
          <Subtitle className="text-[18px]">
            {clubName || "클럽"}에서의 시간이 어떠셨나요?
          </Subtitle>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <Description className="bg-white p-2 text-[12px] lg:px-[11px] lg:py-[10px] rounded-full text-main 2xl:text-[12px]">
            별점을 드래그하세요.
          </Description>
          <StarRating />
        </div>
      </div>
      <div className="bg-white pt-10 lg:pt-12 px-5 lg:px-12 space-y-10 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-13">
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
      {reviewCategories.length === 0 && (
        <p className="text-description-12 text-red-500 pt-4 px-5 lg:px-12">
          키워드를 1개 이상 선택해주세요.
        </p>
      )}
    </div>
  );
};
