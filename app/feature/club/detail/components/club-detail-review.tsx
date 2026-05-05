"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";

import { ClubDetailData, Review } from "@/app/feature/club/types";
import { Checkbox } from "@/components/ui/checkbox";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";
import { useCommonModalStore } from "@/store/common-modal-store";
import { cn } from "@/lib/utils";

import { useClubDetailStore } from "@/app/feature/club/detail/store";
import ClubDetailReviewItem from "@/app/feature/club/detail/components/club-detail-review-item";
import ClubDetailReviewModal from "@/app/feature/club/detail/components/club-detail-review-modal";
import ClubDetailImageGallery from "@/app/feature/club/detail/components/club-detail-image-gallery";
import { ReviewPagination } from "@/app/feature/club/detail/components/review-pagination";
import { useReviewPagination } from "@/app/feature/club/detail/hooks/use-review-pagination";
import { Description, Subtitle } from "@/components/shared/typography";

interface ClubDetailReviewProps {
  data: ClubDetailData;
  reviews: Review[];
  total: number;
  currentPage: number;
  limit: number;
  onPageChange: (page: number) => void;
  isMine: boolean;
  setIsMine: (isMine: boolean) => void;
  sort: "-createdAt" | "+createdAt";
  setSort: (sort: "-createdAt" | "+createdAt") => void;
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
    id: number;
  };
  rating: number;
  keywordIds: number[];
  publicId: string;
}

const ClubDetailReview = ({
  data,
  reviews,
  total,
  currentPage,
  limit,
  onPageChange,
  isMine,
  setIsMine,
  sort,
  setSort,
}: ClubDetailReviewProps) => {
  const router = useRouter();
  const { openReviewModal } = useClubDetailStore();
  const { isAuthenticated } = useCurrentUser();
  const { openModal } = useCommonModalStore();
  const {
    totalPages,
    pageNumbers,
    handlePageClick,
    handlePreviousClick,
    handleNextClick,
    canGoPrevious,
    canGoNext,
  } = useReviewPagination({
    total,
    limit,
    currentPage,
    onPageChange,
  });

  const convertToReviewItems = (reviews: Review[]): ReviewItem[] => {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return [];

    return reviews
      .filter((review): review is Review => review != null)
      .map((review) => {
        const imageUrls =
          Array.isArray(review.images) && review.images.length > 0
            ? review.images
                .map((img) => (img.filePath ? getImageUrl(img.filePath) : null))
                .filter((url): url is string => url !== null)
            : [];

        return {
          id: review.id,
          images: imageUrls,
          content: review.content || "",
          tags:
            Array.isArray(review.keywords) && review.keywords.length > 0
              ? review.keywords
                  .map((keyword) => `#${keyword.name}`)
                  .filter((tag) => tag !== "#")
              : [],
          createdAt: review.createdAt || "",
          updatedAt: review.updatedAt || review.createdAt || "",
          user: {
            name: review.user.nickname || "",
            id: review.user.id,
            ...(review.user.profilePath && {
              profileImage: (() => {
                const url = getImageUrl(review.user.profilePath);
                return url !== null ? url : undefined;
              })(),
            }),
          },
          rating: review.rating || 0,
          keywordIds: review.keywords.map((k) => k.id),
          publicId: String(review.publicId),
        };
      });
  };

  const reviewItems = convertToReviewItems(reviews || []);

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 2xl:border-b-3 border-main pb-2 2xl:pb-3">
        <div className="flex gap-1 2xl:gap-1.5 items-center">
          <Image
            src="/images/review-icon.svg"
            alt="공연 일정"
            width={32}
            height={32}
            className="w-6 h-6 2xl:w-8 2xl:h-8"
          />
          <Subtitle className="text-[18px] sm:text-[20px] xl:text-[24px]">
            {`리뷰 (${reviews.length ?? 0})`}
          </Subtitle>
          <Image
            src="/images/rating.svg"
            alt="공연 일정"
            width={24}
            height={24}
            className="w-5 h-5 2xl:w-6 2xl:h-6 ml-1.5"
          />
          <div className="text-subtitle-16 2xl:text-[20px] text-black-80">
            {data.avgRating ?? 0}
          </div>
        </div>
        <button
          onClick={() => {
            if (isAuthenticated) openReviewModal();
            else
              openModal({
                description: "로그인 후 이용해주세요",
                confirmButton: {
                  label: "확인",
                  onClick: () => router.push("/login"),
                },
              });
          }}
          className="text-subtitle-12 2xl:text-[14px] flex items-center gap-1 border px-2.5 py-1.5 2xl:w-[88px] 2xl:h-[34px] 2xl:px-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          작성하기
          <Image
            src="/images/review_write.svg"
            alt="arrow-right"
            width={16}
            height={16}
            className="mb-1 w-3.5 h-3.5 2xl:w-4 2xl:h-4"
          />
        </button>
      </div>
      <div className="pt-4 2xl:pt-9 flex justify-between text-description-14">
        <div className="flex items-center gap-1 2xl:gap-2 text-black-80 font-semibold text-[14px] 2xl:text-[16px]">
          내가 쓴 리뷰 보기
          <Checkbox
            checked={isMine}
            onCheckedChange={setIsMine}
            className="2xl:w-6 2xl:h-6"
          />
        </div>
        <div
          className="flex items-center gap-1 2xl:gap-2 text-black-60 font-semibold text-[14px] 2xl:text-[16px] cursor-pointer"
          onClick={() =>
            setSort(sort === "-createdAt" ? "+createdAt" : "-createdAt")
          }
        >
          {sort === "-createdAt" ? "최신순" : "오래된순"}
          <ChevronDown
            className={cn(
              "h-4 w-4 2xl:h-6 2xl:w-6 transition-transform duration-200",
              sort === "-createdAt" ? "rotate-180" : "",
              "cursor-pointer",
            )}
          />
        </div>
      </div>
      <div className="">
        {reviewItems.length > 0 ? (
          reviewItems.map((review) => (
            <ClubDetailReviewItem
              key={review.id}
              review={review}
              entityId={data.id}
            />
          ))
        ) : (
          <div className="py-20">
            <Description className="py-8 text-center text-[14px] sm:text-[16px] text-black-60">
              아직 작성된 리뷰가 없습니다.
            </Description>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="pt-14 sm:pt-20 pb-24 sm:pb-30 flex justify-center">
          <ReviewPagination
            totalPages={totalPages}
            currentPage={currentPage}
            pageNumbers={pageNumbers}
            onPageClick={handlePageClick}
            onPreviousClick={handlePreviousClick}
            onNextClick={handleNextClick}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
          />
        </div>
      )}

      <ClubDetailReviewModal
        entityId={data.id}
        clubName={data.name}
        clubImage={
          data.images && data.images.length > 0
            ? data.images[0].filePath
            : undefined
        }
      />
      <ClubDetailImageGallery />
    </div>
  );
};

export default ClubDetailReview;
