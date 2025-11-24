import { useMemo } from "react";

interface UsePaginationProps {
  total: number;
  limit: number;
  currentPage: number;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<any>;
  pages: Array<{ offset: number }>;
}

export const usePagination = ({
  total,
  limit,
  currentPage,
  hasNextPage,
  fetchNextPage,
  pages,
}: UsePaginationProps) => {
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const getPageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

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

  const handlePageClick = async (page: number) => {
    const targetOffset = (page - 1) * limit;
    const currentMaxOffset = Math.max(...pages.map((p) => p.offset), 0);

    if (targetOffset > currentMaxOffset && hasNextPage) {
      const pagesToLoad = Math.ceil((targetOffset - currentMaxOffset) / limit);
      for (let i = 0; i < pagesToLoad && hasNextPage; i++) {
        await fetchNextPage();
      }
    }
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return {
    totalPages,
    pageNumbers: getPageNumbers(),
    handlePageClick,
    handlePreviousClick,
    handleNextClick,
    canGoPrevious: currentPage > 1,
    canGoNext: hasNextPage,
  };
};
