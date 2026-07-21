"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { commentsQueryOptions } from "../query-options";
import { CommunityCommentItem } from "./community-comment-item";
import { CommunityCommentForm } from "./community-comment-form";
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

const COMMENT_LIMIT = 20;

interface CommunityCommentSectionProps {
  postId: number;
  commentCount: number;
}

export function CommunityCommentSection({ postId, commentCount }: CommunityCommentSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const offset = (currentPage - 1) * COMMENT_LIMIT;

  const { data, isLoading } = useQuery(commentsQueryOptions(postId, offset, COMMENT_LIMIT));
  const comments = data?.data.items ?? [];
  const total = data?.data.total ?? 0;

  const pagination = useAllPerformancesPagination({
    total,
    limit: COMMENT_LIMIT,
    currentPage,
    onPageChange: (page) => {
      setCurrentPage(page);
    },
  });

  return (
    <section className="mt-6">
      {/* 타이틀 */}
      <h2 className="text-[18px] font-bold tracking-[-0.04em] text-black mb-4">
        comment
      </h2>

      {/* 댓글 작성 폼 */}
      <div className="mb-5">
        <CommunityCommentForm postId={postId} />
      </div>

      {/* 정렬 */}
      <div className="flex items-center justify-end mb-3">
        <button className="flex items-center gap-1 text-[13px] font-semibold text-black/60">
          등록순
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* 댓글 목록 */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="py-4 animate-pulse flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-black/10" />
                <div className="h-4 w-24 bg-black/10 rounded" />
              </div>
              <div className="h-4 w-3/4 bg-black/5 rounded ml-9" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="py-10 text-center text-black/30 text-[14px]">
          첫 댓글을 남겨보세요.
        </div>
      ) : (
        <div>
          {comments.map((comment) => (
            <CommunityCommentItem key={comment.id} comment={comment} postId={postId} />
          ))}
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
                      className="cursor-pointer"
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
  );
}
