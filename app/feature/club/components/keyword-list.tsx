"use client";

import { useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Ellipsis } from "lucide-react";

import { cn } from "@/lib/utils";
import { ClubSearchFormSchema } from "@/app/feature/club/schema";
import { ReviewCategory } from "@/app/feature/club/types";

import { Subtitle, Description } from "@/components/shared/typography";

interface KeywordListProps {
  categories: ReviewCategory[] | undefined;
}

const KeywordList = ({ categories }: KeywordListProps) => {
  const { setValue, watch } = useFormContext<ClubSearchFormSchema>();
  const [showAllKeywords, setShowAllKeywords] = useState(false);

  const selectedKeywords = (watch("keywords") as number[]) || [];

  const allKeywords = useMemo(() => {
    if (!categories) return [];
    return categories.flatMap((category) => category.keywords);
  }, [categories]);

  const displayedKeywords = useMemo(() => {
    if (showAllKeywords) {
      return allKeywords;
    }
    return allKeywords.slice(0, 5);
  }, [allKeywords, showAllKeywords]);

  const handleKeywordClick = (keywordId: number) => {
    const currentKeywords = selectedKeywords;
    const isSelected = currentKeywords.includes(keywordId);

    if (isSelected) {
      setValue(
        "keywords",
        currentKeywords.filter((id) => id !== keywordId)
      );
    } else {
      setValue("keywords", [...currentKeywords, keywordId]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2.5 text-center">
        {displayedKeywords.map((keyword) => {
          const isSelected = selectedKeywords.includes(keyword.id);
          return (
            <button
              key={keyword.id}
              onClick={() => handleKeywordClick(keyword.id)}
              className={cn(
                "w-fit h-fit rounded-[4px] p-2.5 cursor-pointer transition-colors text-center whitespace-nowrap",
                isSelected
                  ? "bg-main text-white hover:bg-main/90"
                  : "bg-[#2020200A] hover:bg-[#2020201A]"
              )}
            >
              {isSelected ? (
                <Subtitle className="text-[14px] xl:text-[16px] text-white">
                  {keyword.keyword}
                </Subtitle>
              ) : (
                <Description className="text-[14px] xl:text-[16px] text-black/50">
                  {keyword.keyword}
                </Description>
              )}
            </button>
          );
        })}
        {!showAllKeywords && allKeywords.length > 6 && (
          <button
            onClick={() => setShowAllKeywords(true)}
            className="bg-[#2020200A] cursor-pointer transition-colors text-center hover:bg-[#2020201A] rounded-[4px] p-2.5"
          >
            <Subtitle className="text-[14px] xl:text-[16px]">
              <Ellipsis className="size-4" />
            </Subtitle>
          </button>
        )}
        {showAllKeywords && allKeywords.length > 6 && (
          <button
            onClick={() => setShowAllKeywords(false)}
            className="bg-[#2020200A] cursor-pointer transition-colors text-center hover:bg-[#2020201A] rounded-[4px] p-2.5"
          >
            <Subtitle className="text-[14px] xl:text-[16px]">접기</Subtitle>
          </button>
        )}
      </div>
    </div>
  );
};

export default KeywordList;
