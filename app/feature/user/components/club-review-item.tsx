"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Star, Circle, Hash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Description, Subtitle, Title } from "@/components/shared/typography";

interface ClubReview {
  id: string;
  title: string;
  rating: number;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  images?: string[];
}

interface ClubReviewItemProps {
  clubName: string;
  reviewCount: number;
  reviews: ClubReview[];
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ClubReviewItem({
  clubName,
  reviewCount,
  reviews,
  onEdit,
  onDelete,
  isOpen,
  onToggle,
}: ClubReviewItemProps) {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(
    new Set()
  );

  const toggleReview = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const isContentLong = (content: string) => {
    const lines = content.split("\n");
    return lines.length > 3 || content.length > 150;
  };

  const getTruncatedContent = (content: string) => {
    const lines = content.split("\n");
    if (lines.length > 3) {
      return lines.slice(0, 3).join("\n");
    }
    return content.slice(0, 150);
  };

  return (
    <div>
      {/* 아코디언 헤더 */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between h-[88px] sm:h-[88px] md:h-[92px] lg:h-[92px] xl:h-[92px] 2xl:h-[112px] border-b border-[#202020]/10"
      >
        <div className="flex items-center gap-2 text-[18px] md:text-[20px] 2xl:text-[24px]">
          <Title>
            {clubName} {reviewCount}
          </Title>
        </div>
        <ChevronDown
          className={`w-6 h-6 md:w-7 md:h-7  2xl:w-8 2xl:h-8 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 아코디언 컨텐츠 */}
      {isOpen && (
        <div className="border-b border-[#202020]/10">
          {reviews.map((review, index) => {
            const isExpanded = expandedReviews.has(review.id);
            const showMoreButton = isContentLong(review.content);
            const displayContent =
              isExpanded || !showMoreButton
                ? review.content
                : getTruncatedContent(review.content);
            const hasImages = review.images && review.images.length > 0;

            // 이미지 유무에 따라 다른 max-height 적용
            const maxHeightClass = hasImages
              ? "max-h-[479px] sm:max-h-[479px] md:max-h-[455px] lg:max-h-[471px] xl:max-h-[471px] 2xl:max-h-[540px]"
              : "max-h-[322px] sm:max-h-[322px] md:max-h-[294px] lg:max-h-[306px] xl:max-h-[306px] 2xl:max-h-[334px]";

            return (
              <div key={review.id}>
                <div className="py-8 2xl:py-10 flex flex-col space-y-4 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-6 2xl:space-y-7">
                  {/* 리뷰 제목 + 평점 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Circle className="w-2 h-2 fill-black text-black" />
                      <Subtitle className="text-[16px]">
                        {review.title}
                      </Subtitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 md:w-4.5 2xl:h-4.5 fill-main text-main" />
                      <Description className="text-[14px] md:text-[16px]">
                        {review.rating.toFixed(1)}
                      </Description>
                    </div>
                  </div>

                  {/* 내용 */}
                  <div className="flex flex-col">
                    <Description
                      className={`text-[16px] leading-[1.7] whitespace-pre-line ${maxHeightClass} overflow-hidden`}
                    >
                      {displayContent}
                    </Description>
                    {showMoreButton && (
                      <button
                        onClick={() => toggleReview(review.id)}
                        className="mt-2 text-[16px] text-muted-foreground hover:underline text-left"
                      >
                        {isExpanded ? "접기" : "더보기"}
                      </button>
                    )}
                  </div>
                  {/* 이미지 */}
                  {hasImages && (
                    <div className="flex gap-3">
                      {review.images!.map((image, imgIndex) => (
                        <Image
                          key={imgIndex}
                          src={image}
                          alt={`Review image ${imgIndex + 1}`}
                          width={140}
                          height={177}
                          className="w-[111px] h-[141px] 2xl:w-[140px] 2xl:h-[177px] object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                  {/* 태그 */}
                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag, tagIndex) => (
                      <div
                        key={tagIndex}
                        className="inline-flex items-center gap-0.5 px-[10px] py-2 border border-[#202020]/20 rounded-[3px] h-[34px] text-[14px] font-bold"
                      >
                        <Hash className="self-start w-4 h-3.5 stroke-3" />
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>

                  {/* 날짜 및 액션 */}
                  <div className="flex items-center justify-between text-[12px] md:text-[14px] text-[#202020]/60">
                    <div className="flex items-center gap-4">
                      <Description>작성 : {review.createdAt}</Description>
                      {review.updatedAt && (
                        <Description>수정 : {review.updatedAt}</Description>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit?.(review.id)}
                        className="hover:text-main transition-colors"
                      >
                        수정
                      </button>
                      <span>|</span>
                      <button
                        onClick={() => onDelete?.(review.id)}
                        className="hover:text-red-500 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>

                {/* 리뷰 간 구분선 (마지막 아이템이 아닐 때만) */}
                {index < reviews.length - 1 && (
                  <Separator className="h-px bg-[#202020]/10" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
