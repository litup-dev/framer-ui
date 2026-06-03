"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FadeIn from "@/components/shared/fade-in";
import { getNoticesOptions } from "@/app/feature/notice/query-options";
import {
  defaultValues,
  NOTICE_PAGE_SIZE,
  noticeFormSchema,
  NoticeFormSchema,
} from "@/app/feature/notice/schema";
import { useNoticePagination } from "@/app/feature/notice/hooks/use-notice-pagination";
import { NoticeSearch } from "@/app/feature/notice/components/notice-search";
import { NoticeSortHeader } from "@/app/feature/notice/components/notice-sort-header";
import { NoticeList } from "@/app/feature/notice/components/notice-list";

const NoticePage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const form = useForm<NoticeFormSchema>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues,
  });

  const keyword = useWatch({ control: form.control, name: "keyword" });
  const sort = useWatch({ control: form.control, name: "sort" });

  const offset = useMemo(
    () => (currentPage - 1) * NOTICE_PAGE_SIZE,
    [currentPage],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, sort]);

  const { data, isLoading } = useQuery(
    getNoticesOptions({
      keyword: keyword?.trim() || undefined,
      sort,
      offset,
      limit: NOTICE_PAGE_SIZE,
    }),
  );

  const notices = data?.items ?? [];
  const total = data?.total ?? 0;

  const pagination = useNoticePagination({
    total,
    limit: NOTICE_PAGE_SIZE,
    currentPage,
    onPageChange: (page) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  return (
    <FormProvider {...form}>
      <FadeIn>
        <div className="container mx-auto px-5 md:px-10 lg:px-15 2xl:px-20 pt-10 md:pt-20 xl:pt-24 pb-12 max-w-[960px]">
          <h1 className="text-[22px] md:text-[28px] font-bold mb-6 text-black">
            공지사항
          </h1>
          <NoticeSearch />
          <NoticeSortHeader />
          <NoticeList
            notices={notices}
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
      </FadeIn>
    </FormProvider>
  );
};

export default NoticePage;
