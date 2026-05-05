"use client";

import { useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Ellipsis } from "lucide-react";

import { cn } from "@/lib/utils";
import { ClubSearchFormSchema } from "@/app/feature/club/schema";
import { ReviewCategory } from "@/app/feature/club/types";

import { Subtitle, Description } from "@/components/shared/typography";
import Image from "next/image";

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
        currentKeywords.filter((id) => id !== keywordId),
      );
    } else {
      setValue("keywords", [...currentKeywords, keywordId]);
    }
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex flex-wrap gap-2 text-center">
        {displayedKeywords.map((keyword) => {
          const isSelected = selectedKeywords.includes(keyword.id);
          return (
            <button
              key={keyword.id}
              onClick={() => handleKeywordClick(keyword.id)}
              className={cn(
                "w-fit h-[31px] sm:h-[34px] 2xl:h-[36px] rounded-[4px] px-[11px] 2xl:px-3 py-2.5 cursor-pointer transition-colors text-center whitespace-nowrap",
                isSelected
                  ? "bg-main text-white hover:bg-main/90"
                  : "bg-[rgba(23,23,23,0.04)] hover:bg-[rgba(23,23,23,0.08)]",
              )}
            >
              {isSelected ? (
                <Subtitle className="text-[13px] md:text-[14px] 2xl:text-[16px] text-white">
                  {keyword.keyword}
                </Subtitle>
              ) : (
                <Description className="text-[13px] md:text-[14px] 2xl:text-[16px] text-black/50">
                  {keyword.keyword}
                </Description>
              )}
            </button>
          );
        })}
        {!showAllKeywords && allKeywords.length > 6 && (
          <button
            onClick={() => setShowAllKeywords(true)}
            className="bg-[rgba(23,23,23,0.04)] cursor-pointer transition-colors text-center hover:bg-[rgba(23,23,23,0.08)] rounded-[4px] p-2 h-[31px] sm:h-[34px] 2xl:h-[36px] flex items-center justify-center"
          >
            <Ellipsis className="size-5 2xl:size-6 text-black/50" />
          </button>
        )}
        {showAllKeywords && allKeywords.length > 6 && (
          <button
            onClick={() => setShowAllKeywords(false)}
            className="bg-[rgba(23,23,23,0.04)] cursor-pointer transition-colors text-center hover:bg-[rgba(23,23,23,0.08)] rounded-[4px] w-[40px] items-center justify-center flex"
          >
            <Image
              src="/images/arrow-up.svg"
              alt="chevron-down"
              width={24}
              height={24}
              className="text-black/50"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default KeywordList;
