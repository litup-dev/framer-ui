"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";

import { ClubDetailData, Review } from "@/app/feature/club/types";
import { Checkbox } from "@/components/ui/checkbox";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

import { useClubDetailStore } from "@/app/feature/club/detail/store";
import ClubDetailReviewItem from "@/app/feature/club/detail/components/club-detail-review-item";
import ClubDetailReviewModal from "@/app/feature/club/detail/components/club-detail-review-modal";
import ClubDetailImageGallery from "@/app/feature/club/detail/components/club-detail-image-gallery";

interface ClubDetailReviewProps {
  data: ClubDetailData;
  reviews: Review[];
}

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
  };
  rating: number;
}

const ClubDetailReview = ({ data, reviews }: ClubDetailReviewProps) => {
  const { openReviewModal } = useClubDetailStore();

  const convertToReviewItems = (reviews: Review[]): ReviewItem[] => {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return [];

    return reviews
      .filter((review): review is Review => review != null)
      .map((review) => {
        const imageUrls =
          Array.isArray(review.images) && review.images.length > 0
            ? review.images
                .map((img) =>
                  img?.filePath ? getImageUrl(img.filePath) : null
                )
                .filter((url): url is string => url !== null)
            : [];

        return {
          id: review.id,
          images: imageUrls,
          content: review.content || "",
          tags:
            Array.isArray(review.keywords) && review.keywords.length > 0
              ? review.keywords.map((keyword) => `#${keyword?.name || ""}`)
              : [],
          createdAt: review.createdAt || "",
          updatedAt: review.updatedAt || review.createdAt || "",
          user: {
            name: review.user?.nickname || "",
            ...(review.user?.profilePath && {
              profileImage: getImageUrl(review.user.profilePath) || undefined,
            }),
          },
          rating: review.rating || 0,
        };
      });
  };

  const reviewItems = convertToReviewItems(reviews || []);

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-main pb-2">
        <div className="flex gap-1 items-center">
          <Image
            src="/images/review.svg"
            alt="공연 일정"
            width={24}
            height={24}
          />
          <div className="text-subtitle-18">리뷰</div>
          <Image
            src="/images/rating.svg"
            alt="공연 일정"
            width={20}
            height={20}
          />
          <div className="text-subtitle-16 text-black-80">
            {data.avgRating ?? 0}
          </div>
        </div>
        <button
          onClick={openReviewModal}
          className="text-subtitle-12 flex items-center gap-1 border px-2.5 py-1.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          작성하기
          <Image
            src="/images/review_write.svg"
            alt="arrow-right"
            width={14}
            height={14}
            className="mb-1"
          />
        </button>
      </div>
      <div className="pt-4 flex justify-between text-description-14">
        <div className="flex items-center gap-1 text-black-80 font-semibold text-[14px]">
          내가 쓴 리뷰 보기
          <Checkbox />
        </div>
        <div className="flex items-center gap-1 text-black-60 font-semibold text-[14px]">
          최신순
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      <div className="pt-4">
        {reviewItems.length > 0 ? (
          reviewItems.map((review) => (
            <ClubDetailReviewItem key={review.id} review={review} />
          ))
        ) : (
          <div className="py-8 text-center text-black-60">
            아직 작성된 리뷰가 없습니다.
          </div>
        )}
      </div>
      <ClubDetailReviewModal />
      <ClubDetailImageGallery />
    </div>
  );
};

export default ClubDetailReview;
