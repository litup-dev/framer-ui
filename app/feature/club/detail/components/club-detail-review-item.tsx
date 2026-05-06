"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useClubDetailStore } from "@/app/feature/club/detail/store";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";
import { useCommonModalStore } from "@/store/common-modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReviewOptions } from "@/app/feature/club/query-options";
import { formatDate } from "@/lib/date-utils";
import { Chip, Subtitle } from "@/components/shared/typography";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ReviewItem {
  id: number;
  images: string[];
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    profileImage?: string;
    id: number;
  };
  rating: number;
  keywordIds: number[];
  publicId: string;
}

interface ClubDetailReviewItemProps {
  review: ReviewItem;
  entityId: number;
}

const ClubDetailReviewItem = ({
  review,
  entityId,
}: ClubDetailReviewItemProps) => {
  const { openImageGallery, openReviewModal } = useClubDetailStore();
  const { user } = useCurrentUser();
  const { openModal } = useCommonModalStore();
  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLDivElement>(null);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isMyReview = user?.publicId === String(review.publicId);

  const deleteReviewMutation = useMutation({
    ...deleteReviewOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", String(entityId)],
      });
      queryClient.invalidateQueries({
        queryKey: ["userClubReviews"],
      });
    },
  });

  const handleEditClick = () => {
    openReviewModal({
      mode: "edit",
      reviewId: review.id,
      rating: review.rating,
      content: review.content,
      categories: review.keywordIds,
      images: review.images,
    });
  };

  const handleDeleteClick = () => {
    openModal({
      description: "해당 리뷰를 삭제하시겠습니까?",
      confirmButton: {
        label: "삭제",
        onClick: () => deleteReviewMutation.mutate(review.id),
      },
      cancelButton: {
        label: "취소",
        onClick: () => {},
      },
    });
  };

  useEffect(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 22;
    const threeLineHeight = lineHeight * 3;
    setShowMoreButton(el.scrollHeight > threeLineHeight + 2);
  }, [review.content, isExpanded]);

  const handleImageClick = (index: number) => {
    if (review.images.length > 0) {
      openImageGallery(review.images, index);
    }
  };

  const handleMoreClick = () => {
    setIsExpanded(!isExpanded);
  };

  console.log(review, "<<<");

  return (
    <div className="space-y-4 pt-0 pb-4 md:space-y-5 md:pt-0 md:pb-5 lg:space-y-6 lg:pt-0 lg:pb-6 xl:space-y-6 xl:pt-0 xl:pb-6 2xl:space-y-7 2xl:pt-0 2xl:pb-7 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#f5f5f5] rounded-full flex-shrink-0" />
          <Link href={`/user/${review.publicId}`}>
            <Subtitle as="span" className="text-[14px] xl:text-[16px] 2xl:text-[16px]">
              {review.user.name}
            </Subtitle>
          </Link>
        </div>
        <div className="flex items-center gap-0.5">
          <Image
            src="/images/review_rate.svg"
            alt="rating"
            width={18}
            height={18}
            className="w-4 h-4 2xl:w-[18px] 2xl:h-[18px]"
          />
          <Chip className="text-[14px] 2xl:text-[16px] tracking-[-0.04em] text-black">
            {Number(review.rating).toLocaleString("ko-KR", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </Chip>
        </div>
      </div>
      <div className="flex flex-col items-start gap-0 md:gap-2 lg:gap-2 xl:gap-2 2xl:gap-2">
        <div
          ref={contentRef}
          className={cn(
            "w-full text-[14px] md:text-[16px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px] leading-[1.6] tracking-[-0.04em] font-medium text-black whitespace-pre-wrap break-words",
            !isExpanded && "line-clamp-3",
          )}
        >
          {review.content}
        </div>
        {showMoreButton && (
          <button onClick={handleMoreClick} className="hover:opacity-70">
            <Chip className="text-[14px] md:text-[16px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px] tracking-[-0.08em] text-black-40">
              {isExpanded ? "접기" : "더보기"}
            </Chip>
          </button>
        )}
      </div>
      {review.images.length > 0 && (
        <div className="flex gap-[10px] md:gap-[10px] lg:gap-[10px] xl:gap-[10px] 2xl:gap-3">
          {review.images.map((image, index) => (
            <button
              key={`${review.id}-image-${index}-${image}`}
              onClick={() => handleImageClick(index)}
              className="relative w-[111px] h-[141px] md:w-[111px] md:h-[141px] lg:w-[111px] lg:h-[141px] xl:w-[111px] xl:h-[141px] 2xl:w-[140px] 2xl:h-[178px] bg-gray-200 rounded-[3px] flex-shrink-0 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Image
                src={image}
                alt={`Review image ${index + 1}`}
                fill
                className="object-cover"
                sizes="140px"
              />
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {review.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {review.tags.map((tag, index) => (
              <Subtitle
                key={`${review.id}-tag-${index}-${tag}`}
                className="p-2 2xl:px-2.5 2xl:py-2 2xl:h-[34px] flex items-center w-fit bg-white border rounded-[3px] text-subtitle-14"
              >
                {tag}
              </Subtitle>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between text-black-40">
        <div className="flex gap-1 md:gap-2 lg:gap-2 xl:gap-2 2xl:gap-2">
          <Chip className="text-[12px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] tracking-[-0.04em]">
            작성: {formatDate(review.createdAt)}
          </Chip>
          <Chip className="text-[12px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] tracking-[-0.04em]">
            수정: {formatDate(review.updatedAt)}
          </Chip>
        </div>
        {isMyReview ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-0.5 hover:opacity-70"
            >
              <Chip className="text-[14px] tracking-[-0.04em]">수정</Chip>
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-0.5 hover:opacity-70"
            >
              <Chip className="text-[14px] tracking-[-0.04em]">삭제</Chip>
            </button>
          </div>
        ) : (
          <button className="flex items-center gap-0 hover:opacity-70">
            <Chip className="text-[12px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] tracking-[-0.04em]">
              신고
            </Chip>
            <Image
              src="/images/siren.svg"
              alt="report"
              width={16}
              height={16}
              className="w-[14px] h-[14px] md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-4 2xl:h-4"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default ClubDetailReviewItem;
