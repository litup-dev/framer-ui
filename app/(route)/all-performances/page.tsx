"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getAllPerformancesOptions } from "@/app/feature/all-performances/query-options";
import { useAllPerformancesPagination } from "@/app/feature/all-performances/hooks/use-all-performances-pagination";
import { useResponsiveLimit } from "@/app/feature/all-performances/hooks/use-responsive-limit";
import { AllPerformancesContent } from "@/app/feature/all-performances/components/all-performances-content";
import {
  allPerformancesFormSchema,
  AllPerformancesFormSchema,
  defaultValues,
} from "@/app/feature/all-performances/schema";

const AllPerformancesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = useResponsiveLimit();

  const form = useForm<AllPerformancesFormSchema>({
    resolver: zodResolver(allPerformancesFormSchema),
    defaultValues,
  });

  const keyword = useWatch({ control: form.control, name: "keyword" });
  const timeFilter = useWatch({ control: form.control, name: "timeFilter" });
  const area = useWatch({ control: form.control, name: "area" });

  const offset = useMemo(() => (currentPage - 1) * limit, [currentPage, limit]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, area, timeFilter]);

  const { data, isLoading } = useQuery(
    getAllPerformancesOptions({
      keyword: keyword?.trim() || undefined,
      timeFilter,
      area,
      offset,
      limit,
    })
  );

  const performances = data?.items || [];
  const total = data?.total || 0;

  const pagination = useAllPerformancesPagination({
    total,
    limit,
    currentPage,
    onPageChange: (page) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-full min-h-screen px-5 md:px-10 md:pt-20 lg:px-15 xl:px-20 flex flex-col">
        <AllPerformancesContent
          performances={performances}
          isLoading={isLoading}
          pagination={{
            totalPages: pagination.totalPages,
            currentPage,
            pageNumbers: pagination.pageNumbers,
            onPageClick: pagination.handlePageClick,
            onPreviousClick: pagination.handlePreviousClick,
            onNextClick: pagination.handleNextClick,
            canGoPrevious: pagination.canGoPrevious,
            canGoNext: pagination.canGoNext,
          }}
        />
      </div>
    </FormProvider>
  );
};

export default AllPerformancesPage;
