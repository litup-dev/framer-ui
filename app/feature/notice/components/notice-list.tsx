"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { NoticeListItem } from "@/app/feature/notice/types";
import { NoticeListRow } from "@/app/feature/notice/components/notice-list-item";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  pageNumbers: (number | string)[];
  onPageClick: (page: number) => void;
  onPreviousClick: () => void;
  onNextClick: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

interface Props {
  notices: NoticeListItem[];
  isLoading: boolean;
  pagination: PaginationProps;
}

export const NoticeList = ({ notices, isLoading, pagination }: Props) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="min-h-[600px]">
        {isLoading ? (
          <div className="py-16 text-center text-black/40">불러오는 중…</div>
        ) : notices.length === 0 ? (
          <div className="py-16 text-center text-black/40">
            등록된 공지사항이 없습니다.
          </div>
        ) : (
          notices.map((n) => <NoticeListRow key={n.id} notice={n} />)
        )}
      </div>

      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  pagination.onPreviousClick();
                }}
                className={
                  pagination.canGoPrevious
                    ? "cursor-pointer hover:bg-white"
                    : "pointer-events-none opacity-50"
                }
                role="button"
              />
            </PaginationItem>
            {pagination.pageNumbers.map((page, index) => {
              if (page === "ellipsis-start" || page === "ellipsis-end") {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis className="text-gray" />
                  </PaginationItem>
                );
              }
              const pageNum = page as number;
              const isActive = pagination.currentPage === pageNum;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isActive) pagination.onPageClick(pageNum);
                    }}
                    isActive={isActive}
                    className={cn(
                      "cursor-pointer hover:bg-white",
                      !isActive && "text-gray",
                    )}
                    role="button"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  pagination.onNextClick();
                }}
                className={cn(
                  "hover:bg-white",
                  pagination.canGoNext
                    ? "cursor-pointer"
                    : "pointer-events-none opacity-50",
                )}
                role="button"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
