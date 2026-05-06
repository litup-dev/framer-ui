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
import { Chip, Description, Subtitle } from "@/components/shared/typography";

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
      <div className="border-b-2 md:border-b-3 lg:border-b-3 xl:border-b-3 2xl:border-b-3 border-main pb-[6px] md:pb-[12px] lg:pb-[12px] xl:pb-[18px] 2xl:pb-4">
       <div className="flex items-center justify-between md:h-[24px] lg:h-[24px] xl:h-[28px] 2xl:h-[32px]">
        <div className="flex gap-2 xl:gap-2.5 2xl:gap-2.5 items-end">
          <div className="flex gap-1.5 md:gap-2 lg:gap-2 xl:gap-2 2xl:gap-2 items-center">
            <Image
              src="/images/review-modal-icon.svg"
              alt="리뷰"
              width={32}
              height={32}
              className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8"
            />
            <Subtitle className="text-[18px] sm:text-[20px] xl:text-[24px] 2xl:text-[24px]">
              {`리뷰 (${reviews.length ?? 0})`}
            </Subtitle>
          </div>
          <div className="flex gap-0.5 xl:gap-1 2xl:gap-1 items-center">
            <Image
              src="/images/rating.svg"
              alt="공연 일정"
              width={24}
              height={24}
              className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-6 2xl:h-6"
            />
            <Chip className="text-[16px] xl:text-[20px] 2xl:text-[20px] tracking-[-0.04em] text-black">
              {data.avgRating ?? 0}
            </Chip>
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
          className="flex items-center gap-0.5 md:gap-0.5 lg:gap-0.5 xl:gap-0.5 2xl:gap-0.5 border border-[rgba(23,23,23,0.1)] md:border-[rgba(23,23,23,0.2)] lg:border-[rgba(23,23,23,0.2)] xl:border-[rgba(23,23,23,0.2)] 2xl:border-[rgba(23,23,23,0.2)] rounded-[3px] pl-[11px] pr-[9px] py-[9px] md:pl-3 md:pr-2.5 md:py-[9px] lg:pl-3 lg:pr-2.5 lg:py-[9px] xl:pl-3 xl:pr-2.5 xl:py-[9px] 2xl:pl-3 2xl:pr-2.5 2xl:py-[9px] cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Chip className="text-[12px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] tracking-[-0.04em] text-black">
            작성하기
          </Chip>
          <Image
            src="/images/review_write.svg"
            alt="arrow-right"
            width={16}
            height={16}
            className="w-[14px] h-[14px] md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4 2xl:w-4 2xl:h-4"
          />
        </button>
       </div>
      </div>
      <div className="pt-3 md:pt-3 lg:pt-3 xl:pt-4 2xl:pt-4 flex justify-between text-description-14">
        <div className="flex items-center gap-0.5 md:gap-1 lg:gap-1 xl:gap-1 2xl:gap-1">
          <Chip className="text-[14px] 2xl:text-[16px] tracking-[-0.04em] text-black-80">
            내가 쓴 리뷰 보기
          </Chip>
          <Checkbox
            checked={isMine}
            onCheckedChange={setIsMine}
            className="w-5 h-5 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-6 2xl:h-6"
          />
        </div>
        <div
          className="flex items-center gap-0 md:gap-0 lg:gap-0 xl:gap-0 2xl:gap-0 cursor-pointer"
          onClick={() =>
            setSort(sort === "-createdAt" ? "+createdAt" : "-createdAt")
          }
        >
          <Chip className="text-[14px] 2xl:text-[16px] tracking-[-0.04em] text-black-60">
            {sort === "-createdAt" ? "최신순" : "오래된순"}
          </Chip>
          <ChevronDown
            className={cn(
              "h-5 w-5 md:h-5 md:w-5 lg:h-5 lg:w-5 xl:h-6 xl:w-6 2xl:h-6 2xl:w-6 transition-transform duration-200",
              sort === "-createdAt" ? "rotate-180" : "",
              "cursor-pointer",
            )}
          />
        </div>
      </div>
      <div className="pt-6 space-y-4 md:pt-6 md:space-y-5 lg:pt-6 lg:space-y-6 xl:pt-6 xl:space-y-6 2xl:pt-8 2xl:space-y-7">
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
