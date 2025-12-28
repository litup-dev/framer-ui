"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/app/feature/user/hooks/useRequireAuth";
import UserPageLayout from "@/app/shared/components/user-page-layout";
import PerformanceCommentItem from "@/app/feature/user/components/performance-comment-item";
import SortDropdown from "@/app/shared/components/sort-dropdown";
import TabButton from "@/app/shared/components/tab-button";
import { ChevronRight } from "lucide-react";
import { Title } from "@/components/shared/typography";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

type TabType = "written" | "liked";
type SortOption = "latest" | "oldest";

// Mock data - 공연별로 그룹화
const mockWrittenPerformances = [
  {
    performanceId: "1",
    performanceName: "나간성 로스트 필그림즈 Goyeo 서울",
    comments: [
      {
        id: "1-1",
        content:
          "나를 내일 내일 내일 나를 나를 내일 내일 내일 나를 나를 나를 내일 나를 내일",
        likeCount: 12,
        createdAt: "2025-01-10",
      },
      {
        id: "1-2",
        content: "나를 내일 내일 내일 나를 나를 내일 내일 내일",
        likeCount: 8,
        createdAt: "2025-01-09",
      },
    ],
  },
  {
    performanceId: "2",
    performanceName: "제3회",
    comments: [
      {
        id: "2-1",
        content:
          "나를 내일 내일 내일 나를 나를 내일 내일 내일 나를 나를 나를 내일 나를 내일 나를 내일",
        likeCount: 12,
        createdAt: "2025-01-08",
      },
    ],
  },
  {
    performanceId: "3",
    performanceName: "노홈피너 VOL.6 신년장 연극장",
    comments: [
      {
        id: "3-1",
        content:
          "나를 내일 내일 내일 나를 나를 내일 내일 내일 나를 나를 나를 내일 나를 내일 나를 내일",
        likeCount: 12,
        createdAt: "2025-01-07",
      },
    ],
  },
];

const mockLikedPerformances = [
  {
    performanceId: "4",
    performanceName: "좋아요한 공연 1",
    comments: [
      {
        id: "4-1",
        content: "좋아요 한 코멘트입니다.",
        likeCount: 25,
        createdAt: "2025-01-06",
        isLiked: true,
      },
    ],
  },
];

const sortOptions = [
  { value: "latest" as SortOption, label: "최신순" },
  { value: "oldest" as SortOption, label: "오래된순" },
];

export default function CommentsPage() {
  const { session, isLoading } = useRequireAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("written");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 페이지당 표시할 공연 수

  // 탭이 변경되면 페이지를 1로 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleEdit = (commentId: string) => {
    console.log("Edit comment:", commentId);
    // TODO: 코멘트 수정
  };

  const handleDelete = (commentId: string) => {
    if (confirm("정말 이 코멘트를 삭제하시겠습니까?")) {
      console.log("Delete comment:", commentId);
      // TODO: API 호출로 코멘트 삭제
    }
  };

  const currentPerformances =
    activeTab === "written" ? mockWrittenPerformances : mockLikedPerformances;

  // 페이징 계산
  const totalPages = Math.ceil(currentPerformances.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPerformances = currentPerformances.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 스크롤을 상단으로
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <UserPageLayout
      session={session}
      title="공연 코멘트"
      contentTopMargin={{
        sm: "mt-4",
        md: "md:mt-4",
        lg: "lg:mt-4",
        xl: "xl:mt-4",
        "2xl": "2xl:mt-4",
      }}
    >
      {/* 탭 */}
      <TabButton
        tabs={[
          { value: "written" as const, label: "작성한 코멘트" },
          { value: "liked" as const, label: "좋아요 한 코멘트" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* 정렬 기준 */}
      <SortDropdown value={sortBy} options={sortOptions} onChange={setSortBy} />

      {/* 코멘트 목록 */}
      <div className="mt-4">
        {paginatedPerformances.map((performance, performanceIndex) => (
          <div
            key={performance.performanceId}
            className={performanceIndex > 0 ? "mt-10" : ""}
          >
            {/* 공연명 */}
            <button
              className="flex items-center gap-1 mb-4 hover:opacity-70 transition-opacity"
              onClick={() =>
                router.push(`/performance/${performance.performanceId}`)
              }
            >
              <Title className="text-[14px] md:text-[18px]">
                {performance.performanceName}
              </Title>
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* 해당 공연의 코멘트들 */}
            <div className="flex flex-col gap-4">
              {performance.comments.map((comment) => (
                <PerformanceCommentItem
                  key={comment.id}
                  comment={comment}
                  userNickname={session.nickname || "익명"}
                  userProfilePath={session.profilePath || undefined}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isOwner={activeTab === "written"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination className="mt-12">
          <PaginationContent>
            {/* 이전 페이지 */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={
                  currentPage === 1
                    ? "opacity-40 cursor-not-allowed pointer-events-none"
                    : "hover:opacity-70 transition-opacity cursor-pointer"
                }
              />
            </PaginationItem>

            {/* 페이지 번호 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                  className={`w-8 h-8 text-sm rounded transition-colors cursor-pointer ${
                    currentPage === page
                      ? "bg-main text-white hover:bg-main hover:text-white"
                      : "text-[#202020]/60 hover:text-black"
                  }`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* 다음 페이지 */}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "opacity-40 cursor-not-allowed pointer-events-none"
                    : "hover:opacity-70 transition-opacity cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </UserPageLayout>
  );
}
