"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/user-store";
import { useClubDetailStore } from "@/app/feature/club/detail/store";
import { useCommonModalStore } from "@/store/common-modal-store";
import UserPageLayout from "@/app/shared/components/user-page-layout";
import ClubReviewItem from "@/app/feature/user/components/club-review-item";
import SortDropdown from "@/app/shared/components/sort-dropdown";
import ClubDetailReviewModal from "@/app/feature/club/detail/components/club-detail-review-modal";
import { getUserClubReviewsOptions } from "@/app/feature/user/query-options";
import {
  getReviewCategoryOptions,
  deleteReviewOptions,
} from "@/app/feature/club/query-options";
import { ClubReviewsItem } from "@/app/feature/user/types";

type SortOption = "-createdAt" | "+createdAt";

const sortOptions = [
  { value: "-createdAt" as SortOption, label: "최신순" },
  { value: "+createdAt" as SortOption, label: "오래된순" },
];

export default function ReviewsPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useUserStore();
  const { openReviewModal } = useClubDetailStore();
  const { openModal } = useCommonModalStore();

  const [sortBy, setSortBy] = useState<SortOption>("-createdAt");
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  // 리뷰 카테고리 prefetch (캐시됨 - staleTime: Infinity)
  useQuery(getReviewCategoryOptions());

  // 유저 클럽 리뷰 조회
  const { data: reviewsData, isLoading } = useQuery({
    ...getUserClubReviewsOptions(sortBy),
    enabled: isAuthenticated,
  });

  // 리뷰 삭제 mutation
  const { mutate: deleteReview } = useMutation({
    ...deleteReviewOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userClubReviews"],
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // API 응답(배열)에 맞춰 데이터 구조 변환
  const clubReviews =
    reviewsData?.map((clubReviewData) => {
      return {
        clubId: String(clubReviewData.id),
        clubName: clubReviewData.name,
        reviewCount: clubReviewData.total,
        reviews: clubReviewData.reviews.map((review: ClubReviewsItem) => ({
          id: String(review.id),
          reviewId: review.id,
          clubId: clubReviewData.id,
          title: new Date(review.createdAt).toLocaleDateString("ko-KR"),
          rating: review.rating,
          content: review.content,
          tags: review.keywords.map((k: any) => k.name),
          keywordIds: review.keywords.map((k: any) => k.id),
          createdAt: new Date(review.createdAt).toLocaleString("ko-KR"),
          updatedAt: review.updatedAt
            ? new Date(review.updatedAt).toLocaleString("ko-KR")
            : undefined,
          images: review.images?.map((img: any) => img.filePath),
        })),
      };
    }) || [];

  const handleEdit = (reviewId: string, review: any) => {
    openReviewModal({
      mode: "edit",
      reviewId: Number(reviewId),
      rating: review.rating,
      content: review.content,
      categories: review.keywordIds,
      images: review.images,
    });
  };

  const handleDelete = (reviewId: string) => {
    openModal({
      description: "해당 리뷰를 삭제하시겠습니까?",
      confirmButton: {
        label: "삭제",
        onClick: () => deleteReview(Number(reviewId)),
      },
      cancelButton: {
        label: "취소",
        onClick: () => {},
      },
    });
  };

  const firstClubId = clubReviews.length > 0 ? clubReviews[0].clubId : null;

  return (
    <>
      <UserPageLayout
        title="클럽 리뷰"
        contentTopMargin={{
          sm: "mt-4",
          md: "md:mt-4",
          lg: "lg:mt-4",
          xl: "xl:mt-4",
          "2xl": "2xl:mt-4",
        }}
      >
        {/* 정렬 기준 */}
        <SortDropdown
          value={sortBy}
          options={sortOptions}
          onChange={setSortBy}
          className="flex justify-end"
        />

        {/* 리뷰 목록 */}
        <div className="space-y-0">
          {clubReviews.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              작성한 리뷰가 없습니다.
            </div>
          ) : (
            clubReviews.map((clubReview) => (
              <ClubReviewItem
                key={clubReview.clubId}
                clubName={clubReview.clubName}
                reviewCount={clubReview.reviewCount}
                reviews={clubReview.reviews}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isOpen={openAccordions.has(clubReview.clubId)}
                onToggle={() => {
                  const newOpen = new Set(openAccordions);
                  if (newOpen.has(clubReview.clubId)) {
                    newOpen.delete(clubReview.clubId);
                  } else {
                    newOpen.add(clubReview.clubId);
                  }
                  setOpenAccordions(newOpen);
                }}
              />
            ))
          )}
        </div>
      </UserPageLayout>

      {/* 리뷰 수정 모달 - entityId는 clubId를 사용 */}
      {firstClubId && <ClubDetailReviewModal entityId={Number(firstClubId)} />}
    </>
  );
}
