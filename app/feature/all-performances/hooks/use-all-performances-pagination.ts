import { useMemo } from "react";

interface UseAllPerformancesPaginationProps {
  total: number;
  limit: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const useAllPerformancesPagination = ({
  total,
  limit,
  currentPage,
  onPageChange,
}: UseAllPerformancesPaginationProps) => {
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const getPageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      if (start > 1) {
        pageNumbers.push(1);
        if (start > 2) {
          pageNumbers.push("ellipsis-start");
        }
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pageNumbers.push("ellipsis-end");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };

  return {
    totalPages,
    pageNumbers: getPageNumbers(),
    handlePageClick,
    handlePreviousClick,
    handleNextClick,
    canGoPrevious: currentPage > 1,
    canGoNext: currentPage < totalPages,
  };
};



