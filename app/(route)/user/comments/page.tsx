"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/user-store";
import { useReportModalStore } from "@/store/report-modal-store";
import UserPageLayout from "@/app/shared/components/user-page-layout";
import PerformanceCommentItem from "@/app/feature/user/components/performance-comment-item";
import SortDropdown from "@/app/shared/components/sort-dropdown";
import TabButton from "@/app/shared/components/tab-button";
import CommentPagination from "@/app/feature/user/components/comment-pagination";
import {
  getMyPerformanceCommentsOptions,
  getMyLikedPerformanceCommentsOptions,
} from "@/app/feature/user/query-options";
import { PerformanceCommentItem as PerformanceComment } from "@/app/feature/performance/detail/types";
import { useUserCommentHandlers } from "@/app/feature/user/hooks/use-user-comment-handlers";
import { useReportContent } from "@/app/feature/performance/detail/query-options";
import { REPORT_CATEGORIES } from "@/app/shared/constants";
import {
  Chip,
  Subtitle,
  Description,
  Title,
} from "@/components/shared/typography";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronRight } from "lucide-react";

type TabType = "written" | "liked";
type SortOption = "-createdAt" | "+createdAt";

const sortOptions = [
  { value: "-createdAt" as SortOption, label: "최신순" },
  { value: "+createdAt" as SortOption, label: "오래된순" },
];

export default function CommentsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const { openModal: openReportModal } = useReportModalStore();

  const [activeTab, setActiveTab] = useState<TabType>("written");
  const [sortBy, setSortBy] = useState<SortOption>("-createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const itemsPerPage = 10;

  const {
    maxLength,
    handleEditClick,
    handleEditCancel,
    handleEditTextChange,
    handleEditSubmit,
    handleDelete,
    handleLikeClick,
    updateCommentMutation,
  } = useUserCommentHandlers(
    activeTab,
    editingCommentId,
    setEditingCommentId,
    editingText,
    setEditingText,
    sortBy,
    (currentPage - 1) * itemsPerPage,
    itemsPerPage
  );

  const reportMutation = useReportContent();

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, sortBy]);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/login");
  //   }
  // }, [isAuthenticated, router]);

  const queryOptions =
    activeTab === "written"
      ? getMyPerformanceCommentsOptions(
          sortBy,
          (currentPage - 1) * itemsPerPage,
          itemsPerPage
        )
      : getMyLikedPerformanceCommentsOptions(
          sortBy,
          (currentPage - 1) * itemsPerPage,
          itemsPerPage
        );

  const { data: commentsData, isLoading } = useQuery({
    ...queryOptions,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return null;
  }

  const comments = commentsData?.items || [];
  const totalItems = commentsData?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 공연별로 코멘트 그룹화 (정렬 순서 유지)
  const groupedCommentsMap = new Map<number, any>();
  const performanceGroups: any[] = [];

  comments.forEach((comment: any) => {
    const performId = comment.performId;
    if (!groupedCommentsMap.has(performId)) {
      const group = {
        performanceId: performId,
        performanceName: comment.performTitle,
        comments: [],
      };
      groupedCommentsMap.set(performId, group);
      performanceGroups.push(group);
    }
    groupedCommentsMap.get(performId)!.comments.push(comment);
  });

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReport = (comment: PerformanceComment) => {
    const formatRelativeTime = (dateString: string) => {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ko,
      });
    };

    openReportModal({
      targetContent: (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gray-200" />
            <Subtitle className="text-[14px]">{comment.user.nickname}</Subtitle>
            <Description className="text-black-40 text-[12px]">
              {formatRelativeTime(comment.createdAt)}
            </Description>
          </div>
          <Chip className="font-normal text-black-80 text-[14px]">
            {comment.content}
          </Chip>
        </div>
      ),
      typeId: 1,
      entityId: comment.id,
      onSubmit: (categoryId: string, content: string) => {
        const categoryIndex = REPORT_CATEGORIES.findIndex(
          (cat) => cat.id === categoryId
        );

        reportMutation.mutate(
          {
            typeId: 1,
            categoryId: categoryIndex + 1,
            entityId: comment.id,
            content,
          },
          {
            onSuccess: () => {
              alert("신고가 접수되었습니다.");
            },
            onError: () => {
              alert("신고 접수에 실패했습니다.");
            },
          }
        );
      },
    });
  };

  return (
    <UserPageLayout
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
        {isLoading ? (
          <div>Loading...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            {activeTab === "written"
              ? "작성한 코멘트가 없습니다."
              : "좋아요 한 코멘트가 없습니다."}
          </div>
        ) : (
          performanceGroups.map(
            (performance: any, performanceIndex: number) => (
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
                  {performance.comments.map((comment: any) => {
                    return (
                      <PerformanceCommentItem
                        key={comment.id}
                        comment={{
                          id: String(comment.id),
                          content: comment.content,
                          likeCount: comment.likeCount,
                          createdAt: comment.createdAt,
                          isLiked: comment.isLiked,
                        }}
                        userNickname={
                          activeTab === "written"
                            ? user?.nickname || "익명"
                            : comment.user.nickname
                        }
                        userProfilePath={
                          activeTab === "written"
                            ? user?.profilePath || undefined
                            : comment.user.profilePath
                        }
                        tabType={
                          activeTab === "written"
                            ? "myComments"
                            : "likedComments"
                        }
                        isEditing={editingCommentId === comment.id}
                        editingText={editingText}
                        maxLength={maxLength}
                        onEditClick={() => handleEditClick(comment)}
                        onEditCancel={handleEditCancel}
                        onEditSubmit={() => handleEditSubmit(comment.id)}
                        onEditTextChange={handleEditTextChange}
                        onDelete={() => handleDelete(comment.id)}
                        onReport={() => handleReport(comment)}
                        onLikeClick={() => handleLikeClick(comment.id)}
                        isUpdating={updateCommentMutation.isPending}
                      />
                    );
                  })}
                </div>
              </div>
            )
          )
        )}
      </div>

      {/* 페이지네이션 */}
      <CommentPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </UserPageLayout>
  );
}
