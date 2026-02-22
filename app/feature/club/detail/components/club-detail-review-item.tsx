"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Bell } from "lucide-react";
import { useClubDetailStore } from "@/app/feature/club/detail/store";
import { useUserStore } from "@/store/user-store";
import { useCommonModalStore } from "@/store/common-modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReviewOptions } from "@/app/feature/club/query-options";
import { formatDate } from "@/lib/date-utils";
import { Textarea } from "@/components/ui/textarea";
import { Description, Subtitle } from "@/components/shared/typography";

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
  publicId: number;
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
  const { user } = useUserStore();
  const { openModal } = useCommonModalStore();
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    if (textareaRef.current) {
      const textarea = textareaRef.current;

      textarea.style.height = "auto";
      textarea.style.overflow = "visible";
      const fullHeight = textarea.scrollHeight;

      if (isExpanded) {
        textarea.style.height = `${fullHeight}px`;
        textarea.style.overflow = "visible";
      } else {
        textarea.style.height = "auto";
        const computedStyle = getComputedStyle(textarea);
        const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
        const paddingTop = parseFloat(computedStyle.paddingTop) || 8;
        const paddingBottom = parseFloat(computedStyle.paddingBottom) || 8;
        const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
        const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;

        const threeLineHeight =
          lineHeight * 3 +
          paddingTop +
          paddingBottom +
          borderTop +
          borderBottom -
          2;

        textarea.style.height = `${threeLineHeight}px`;
        textarea.style.overflow = "hidden";

        setShowMoreButton(fullHeight > threeLineHeight + 2);
      }
    }
  }, [review.content, isExpanded]);

  const handleImageClick = (index: number) => {
    if (review.images.length > 0) {
      openImageGallery(review.images, index);
    }
  };

  const handleMoreClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-3 py-4 lg:py-6.5 xl:space-y-6.5 border-b">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
        <div className="flex-1 text-subtitle-14">{review.user.name}</div>
        <div className="flex items-center text-description-14 gap-0.5">
          <Image
            src="/images/review_rate.svg"
            alt="rating"
            width={16}
            height={16}
            className="pb-1"
          />
          <Description className="text-[16px]">
            {Number(review.rating).toLocaleString("ko-KR", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </Description>
        </div>
      </div>
      <Textarea
        ref={textareaRef}
        className="border-none shadow-none text-[14px] text-black-60 resize-none px-0"
        rows={3}
        value={review.content}
        readOnly
      />
      {showMoreButton && (
        <div className="flex justify-end text-description-14 text-black-40">
          <button onClick={handleMoreClick} className="hover:opacity-70">
            {isExpanded ? "접기" : "더보기"}
          </button>
        </div>
      )}
      {review.images.length > 0 && (
        <div className="flex gap-2">
          {review.images.map((image, index) => (
            <button
              key={`${review.id}-image-${index}-${image}`}
              onClick={() => handleImageClick(index)}
              className="relative w-[110px] h-[140px] xl:w-[140px] xl:h-[170px] bg-gray-200 rounded flex-shrink-0 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Image
                src={image}
                alt={`Review image ${index + 1}`}
                fill
                className="object-cover"
                sizes="110px"
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
                className="p-2 w-fit bg-white border rounded-[3px] text-subtitle-14"
              >
                {tag}
              </Subtitle>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between text-subtitle-12 text-black-40">
        <div className="flex gap-1 text-description-12">
          <div>작성: {formatDate(review.createdAt)}</div>
          <div>수정: {formatDate(review.updatedAt)}</div>
        </div>
        {isMyReview ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-0.5 hover:opacity-70"
            >
              <Description className="text-[14px]">수정</Description>
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-0.5 hover:opacity-70"
            >
              <Description className="text-[14px]">삭제</Description>
            </button>
          </div>
        ) : (
          <button className="flex items-center gap-0.5 hover:opacity-70">
            <Description className="text-[14px]">신고</Description>
            <Image
              src="/images/siren.svg"
              alt="report"
              width={16}
              height={16}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default ClubDetailReviewItem;
