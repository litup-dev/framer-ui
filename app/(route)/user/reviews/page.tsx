"use client";

import { useState } from "react";
import { useRequireAuth } from "@/app/feature/user/hooks/useRequireAuth";
import UserPageLayout from "@/app/shared/components/user-page-layout";
import ClubReviewItem from "@/app/feature/user/components/club-review-item";
import SortDropdown from "@/app/shared/components/sort-dropdown";

type SortOption = "latest" | "oldest" | "rating-high" | "rating-low";

// Mock data
const mockClubReviews = [
  {
    clubId: "1",
    clubName: "제비다방",
    reviewCount: 2,
    reviews: [
      {
        id: "1",
        title: "2025년 1월 1일자",
        rating: 4.0,
        content: "분위기 너무좋고요\n일하는 직원들이랑 다같이라온것도 좋고\n먹어도 괜찮네요 시설도 좋고 상태도 좋으셔서 뭐든 다 좋아요 이런저런 이야기를",
        tags: ["분위기", "조명분위기", "고급적인", "고급분위기"],
        createdAt: "2024-12-07 23:00",
        updatedAt: "2024-12-07 23:55",
        images: [
          "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400",
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400",
        ],
      },
      {
        id: "2",
        title: "2025년 1월 1일자",
        rating: 4.0,
        content: "분위기 너무좋고요\n일하는 직원들이랑 다같이라온것도 좋고\n먹어도 괜찮네요 시설도 좋고 상태도 좋으셔서 뭐든 다 좋아요 이런저런 이야기를 분위기 너무좋고요\n일하는 직원들이랑 다같이라온것도 좋고\n먹어도 괜찮네요 시설도 좋고 상태도 좋으셔서 뭐든 다 좋아요 이런저런 이야기를",
        tags: ["분위기", "조명분위기", "고급적인", "고급분위기"],
        createdAt: "2024-12-07 23:00",
      },
    ],
  },
  {
    clubId: "2",
    clubName: "디테라이어바앨유수",
    reviewCount: 1,
    reviews: [
      {
        id: "3",
        title: "완전 좋았어요",
        rating: 5.0,
        content: "최고의 클럽입니다!",
        tags: ["완벽", "최고"],
        createdAt: "2024-12-06 20:00",
        images: [
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400",
        ],
      },
    ],
  },
  {
    clubId: "3",
    clubName: "앤올로드 림자",
    reviewCount: 1,
    reviews: [
      {
        id: "4",
        title: "좋았어요",
        rating: 4.5,
        content: "전반적으로 만족스러웠습니다.",
        tags: ["만족"],
        createdAt: "2024-12-05 19:00",
      },
    ],
  },
];

const sortOptions = [
  { value: "latest" as SortOption, label: "최신순" },
  { value: "oldest" as SortOption, label: "오래된순" },
  { value: "rating-high" as SortOption, label: "평점 높은순" },
  { value: "rating-low" as SortOption, label: "평점 낮은순" },
];

export default function ReviewsPage() {
  const { session, isLoading } = useRequireAuth();
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleEdit = (reviewId: string) => {
    console.log("Edit review:", reviewId);
    // TODO: 리뷰 수정 모달 또는 페이지로 이동
  };

  const handleDelete = (reviewId: string) => {
    if (confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
      console.log("Delete review:", reviewId);
      // TODO: API 호출로 리뷰 삭제
    }
  };

  return (
    <UserPageLayout
      session={session}
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
        {mockClubReviews.map((clubReview) => (
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
        ))}
      </div>
    </UserPageLayout>
  );
}
