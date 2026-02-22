"use client";

import { PerformanceItem } from "@/app/feature/all-performances/types";

import { AllPerformancesPagination } from "@/app/feature/all-performances/components/all-performances-pagination";
import { AllPerformancesGrid } from "@/app/feature/all-performances/components/all-performances-grid";
import { AllPerformancesSearch } from "@/app/feature/all-performances/components/all-performances-search";
import { AllPerformancesLocationFilter } from "@/app/feature/all-performances/components/all-performances-location-filter";
import { AllPerformancesTabs } from "@/app/feature/all-performances/components/all-performances-tabs";
import { AllPerformancesHeader } from "@/app/feature/all-performances/components/all-performances-header";
import Footer from "@/app/shared/components/footer";

interface AllPerformancesContentProps {
  performances: PerformanceItem[];
  isLoading?: boolean;
  pagination: {
    totalPages: number;
    currentPage: number;
    pageNumbers: (number | string)[];
    onPageClick: (page: number) => void;
    onPreviousClick: () => void;
    onNextClick: () => void;
    canGoPrevious: boolean;
    canGoNext: boolean;
  };
}

export const AllPerformancesContent = ({
  performances,
  isLoading = false,
  pagination,
}: AllPerformancesContentProps) => {
  return (
    <>
      <AllPerformancesHeader />
      <div className="pt-15 flex flex-col sm:flex-row justify-between">
        <div className="md:w-[285px] lg:w-full max-w-[560px] space-y-[10px]">
          <AllPerformancesTabs />
          <AllPerformancesSearch />
        </div>
        <AllPerformancesLocationFilter />
      </div>
      <div className="flex-1 pt-8">
        <div className="flex flex-col gap-4">
          <AllPerformancesGrid
            performances={performances}
            isLoading={isLoading}
          />
          {!isLoading && (
            <div className="flex justify-center pt-14 2xl:pt-40">
              <AllPerformancesPagination
                totalPages={pagination.totalPages}
                currentPage={pagination.currentPage}
                pageNumbers={pagination.pageNumbers}
                onPageClick={pagination.onPageClick}
                onPreviousClick={pagination.onPreviousClick}
                onNextClick={pagination.onNextClick}
                canGoPrevious={pagination.canGoPrevious}
                canGoNext={pagination.canGoNext}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
