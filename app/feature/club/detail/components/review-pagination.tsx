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

interface ReviewPaginationProps {
  totalPages: number;
  currentPage: number;
  pageNumbers: (number | string)[];
  onPageClick: (page: number) => void;
  onPreviousClick: () => void;
  onNextClick: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const ReviewPagination = ({
  totalPages,
  currentPage,
  pageNumbers,
  onPageClick,
  onPreviousClick,
  onNextClick,
  canGoPrevious,
  canGoNext,
}: ReviewPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPreviousClick();
            }}
            className={
              canGoPrevious
                ? "cursor-pointer hover:bg-white"
                : "pointer-events-none opacity-50"
            }
            role="button"
          />
        </PaginationItem>
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis className="text-gray" />
              </PaginationItem>
            );
          }
          const pageNum = page as number;
          const isActive = currentPage === pageNum;
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isActive) {
                    onPageClick(pageNum);
                  }
                }}
                isActive={isActive}
                className={cn(
                  "cursor-pointer hover:bg-white",
                  !isActive && "text-gray"
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
              onNextClick();
            }}
            className={cn(
              "hover:bg-white",
              canGoNext ? "cursor-pointer" : "pointer-events-none opacity-50"
            )}
            role="button"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
