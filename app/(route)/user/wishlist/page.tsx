"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useReportModalStore } from "@/store/report-modal-store";
import { useCommonModalStore } from "@/store/common-modal-store";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

type TabType = "written" | "liked";
type SortOption = "-createdAt" | "+createdAt";

const sortOptions = [
  { value: "-createdAt" as SortOption, label: "최신순" },
  { value: "+createdAt" as SortOption, label: "오래된순" },
];

export default function CommentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useCurrentUser();

  const [activeTab, setActiveTab] = useState<TabType>("written");
  const [sortBy, setSortBy] = useState<SortOption>("-createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const itemsPerPage = 10;

  const {} = useUserCommentHandlers(
    activeTab,
    editingCommentId,
    setEditingCommentId,
    editingText,
    setEditingText,
    sortBy,
    (currentPage - 1) * itemsPerPage,
    itemsPerPage,
  );

  const queryOptions =
    activeTab === "written"
      ? getMyPerformanceCommentsOptions(
          sortBy,
          (currentPage - 1) * itemsPerPage,
          itemsPerPage,
        )
      : getMyLikedPerformanceCommentsOptions(
          sortBy,
          (currentPage - 1) * itemsPerPage,
          itemsPerPage,
        );

  const { data: commentsData, isLoading } = useQuery({
    ...queryOptions,
    enabled: isAuthenticated,
  });

  const totalItems = commentsData?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ko,
    });
  };

  return (
    <UserPageLayout
      title="보고 싶은 공연"
      contentTopMargin={{
        sm: "mt-4",
        md: "md:mt-4",
        lg: "lg:mt-4",
        xl: "xl:mt-4",
        "2xl": "2xl:mt-4",
      }}
    >
      {/* 페이지네이션 */}
      <CommentPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </UserPageLayout>
  );
}
