"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  commentsQueryOptions,
  mentionableUsersQueryOptions,
} from "../query-options";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";
import { CommunityCommentItem } from "./community-comment-item";
import { CommunityCommentForm } from "./community-comment-form";
import { CommunityMobileCommentBar } from "./community-mobile-comment-bar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useAllPerformancesPagination } from "@/app/feature/all-performances/hooks/use-all-performances-pagination";
import { cn } from "@/lib/utils";
import type { SortType } from "../types";

const COMMENT_LIMIT = 20;

// 댓글 기본 정렬은 오래된순(+createdAt) — 게시글 목록(최신순 기본)과 다름
const COMMENT_SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: "+createdAt", label: "오래된순" },
  { value: "-createdAt", label: "최신순" },
];

interface CommunityCommentSectionProps {
  postId: number;
  commentCount: number;
}

export function CommunityCommentSection({ postId }: CommunityCommentSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<SortType>("+createdAt");
  const offset = (currentPage - 1) * COMMENT_LIMIT;

  const { isAuthenticated } = useCurrentUser();

  const { data, isLoading } = useQuery(commentsQueryOptions(postId, offset, COMMENT_LIMIT, sort));
  const comments = data?.data.items ?? [];
  const total = data?.data.total ?? 0;

  const handleSortToggle = () => {
    setSort((prev) => (prev === "+createdAt" ? "-createdAt" : "+createdAt"));
    setCurrentPage(1);
  };

  // 태그 대상 리스트는 로그인 유저만 필요 (비로그인 요청 시 401로 글로벌 리다이렉트 방지)
  const { data: mentionData } = useQuery({
    ...mentionableUsersQueryOptions(postId),
    enabled: isAuthenticated,
  });
  const mentionableUsers = mentionData?.data ?? [];

  const pagination = useAllPerformancesPagination({
    total,
    limit: COMMENT_LIMIT,
    currentPage,
    onPageChange: (page) => {
      setCurrentPage(page);
    },
  });

  return (
    <>
      <section className="mt-6 -mx-6 md:mx-0 px-6 md:px-0 py-6 md:py-0 bg-[#f7f6f5] md:bg-transparent">
        {/* 타이틀 */}
        <h2 className="mb-4 text-[18px] xl:text-[24px] font-bold tracking-[-0.04em] xl:tracking-[-0.08em] text-black">
          comment
        </h2>

        {/* 댓글 작성 폼 (데스크탑 인라인 — xl 이상) */}
        <div className="hidden xl:block mb-5">
          <CommunityCommentForm postId={postId} mentionableUsers={mentionableUsers} />
        </div>

        {/* 정렬 (댓글 작성 폼 아래, 목록 위) — 클릭 시 반대 정렬로 즉시 토글 */}
        <div className="flex justify-end mb-3">
          <button
            onClick={handleSortToggle}
            className="flex items-center gap-1 text-[13px] xl:text-[16px] font-semibold text-black"
          >
            {COMMENT_SORT_OPTIONS.find((o) => o.value === sort)?.label}
            <Image
              src="/images/sort-arrow.svg"
              alt=""
              width={20}
              height={20}
              className={cn("md:w-6 md:h-6 transition-transform", sort === "+createdAt" && "rotate-180")}
            />
          </button>
        </div>

        {/* 댓글 목록 */}
        {comments.length > 0 ? (
          <div>
            {comments.map((comment) => (
              <CommunityCommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                mentionableUsers={mentionableUsers}
              />
            ))}
          </div>
        ) : isLoading ? null : (
          <div className="py-10 text-center text-black/30 text-[14px]">
            첫 댓글을 남겨보세요.
          </div>
        )}

        {/* 댓글 페이지네이션 */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={pagination.handlePreviousClick}
                    className={cn(!pagination.canGoPrevious && "opacity-30 pointer-events-none")}
                  />
                </PaginationItem>
                {pagination.pageNumbers.map((page, i) => (
                  <PaginationItem key={i}>
                    {typeof page === "string" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => pagination.handlePageClick(page)}
                        className={cn(
                          "cursor-pointer",
                          page === currentPage ? "text-black" : "text-gray",
                        )}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={pagination.handleNextClick}
                    className={cn(!pagination.canGoNext && "opacity-30 pointer-events-none")}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>

      {/* 하단 고정 입력 바 (모바일/태블릿 — xl 미만) */}
      <div className="xl:hidden">
        <CommunityMobileCommentBar postId={postId} mentionableUsers={mentionableUsers} />
      </div>
    </>
  );
}
