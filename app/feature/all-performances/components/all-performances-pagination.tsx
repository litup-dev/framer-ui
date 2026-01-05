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

interface AllPerformancesPaginationProps {
  totalPages: number;
  currentPage: number;
  pageNumbers: (number | string)[];
  onPageClick: (page: number) => void;
  onPreviousClick: () => void;
  onNextClick: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const AllPerformancesPagination = ({
  totalPages,
  currentPage,
  pageNumbers,
  onPageClick,
  onPreviousClick,
  onNextClick,
  canGoPrevious,
  canGoNext,
}: AllPerformancesPaginationProps) => {
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
                ? "cursor-pointer"
                : "pointer-events-none opacity-50"
            }
            role="button"
          />
        </PaginationItem>
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
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
                className="cursor-pointer"
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
            className={
              canGoNext ? "cursor-pointer" : "pointer-events-none opacity-50"
            }
            role="button"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};




