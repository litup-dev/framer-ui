"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { saveReturnUrl } from "@/lib/login-utils";

import { postsQueryOptions } from "../query-options";
import { CommunityBoardTabs, type BoardTabValue } from "./community-board-tabs";
import { CommunityCategoryFilter } from "./community-category-filter";
import { CommunityPostCard } from "./community-post-card";
import { CommunityPostCardSkeleton } from "./community-post-card-skeleton";
import { CommunityWriteFab } from "./community-write-fab";
import { CommunitySearchTypeSelect } from "./community-search-type-select";
import SortDropdown from "@/app/shared/components/sort-dropdown";
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
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";
import { cn } from "@/lib/utils";
import type { BoardCode, CategoryCode, SortType, PostSearchType } from "../types";

const SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: "-createdAt", label: "최신순" },
  { value: "+createdAt", label: "오래된순" },
];

const LIMIT = 10;

export function CommunityContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { isAuthenticated } = useCurrentUser();

  const [board, setBoard] = useState<BoardTabValue>(
    (searchParams.get("board") as BoardCode) || null,
  );
  const [category, setCategory] = useState<CategoryCode | null>(
    (searchParams.get("category") as CategoryCode) || null,
  );
  const [sort, setSort] = useState<SortType>(
    (searchParams.get("sort") as SortType) || "-createdAt",
  );
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [inputValue, setInputValue] = useState(searchParams.get("keyword") || "");
  const [searchType, setSearchType] = useState<PostSearchType>(
    (searchParams.get("searchType") as PostSearchType) || "TITLE_CONTENT",
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );

  // 외부(모바일 헤더 검색 등)에서 URL params가 바뀌면 로컬 상태와 동기화
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword") ?? "";
    setKeyword(urlKeyword);
    setInputValue(urlKeyword);
    setSearchType((searchParams.get("searchType") as PostSearchType) || "TITLE_CONTENT");
    const urlPage = Number(searchParams.get("page")) || 1;
    setCurrentPage(urlPage);
  }, [searchParams]);

  const offset = (currentPage - 1) * LIMIT;

  const { data, isLoading } = useQuery(
    postsQueryOptions({
      board: board ?? undefined,
      category: category ?? undefined,
      keyword: keyword || undefined,
      searchType: keyword ? searchType : undefined,
      sort,
      offset,
      limit: LIMIT,
    }),
  );

  const posts = data?.data.items ?? [];
  const total = data?.data.total ?? 0;

  const pagination = useAllPerformancesPagination({
    total,
    limit: LIMIT,
    currentPage,
    onPageChange: (page) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  const resetPage = useCallback(() => setCurrentPage(1), []);

  const handleBoardChange = (next: BoardTabValue) => {
    setBoard(next);
    setCategory(null);
    resetPage();
  };

  const handleCategoryChange = (next: CategoryCode | null) => {
    setCategory(next);
    resetPage();
  };

  const handleSortChange = (next: SortType) => {
    setSort(next);
    resetPage();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(inputValue);
    resetPage();
  };

  return (
    <div className="w-full min-h-screen">
      {/* 2컬럼: 메인 + 우측 사이드바 (xl+) */}
      <div className="flex gap-8 xl:gap-12 items-start">

        {/* ── 메인 컬럼 ── */}
        <div className="flex-1 min-w-0">

          {/* 탭 + 검색 같은 줄 */}
          <div className="flex items-end justify-between border-b border-black/10">
            <CommunityBoardTabs value={board} onChange={handleBoardChange} />

            {/* 검색 (데스크탑 xl+) */}
            <form onSubmit={handleSearch} className="hidden xl:flex items-center gap-[10px] mb-3">
              <CommunitySearchTypeSelect value={searchType} onChange={setSearchType} />
              <div className="flex items-center justify-between gap-2 h-[48px] w-[360px] px-[14px] bg-[#f8f8f8] rounded-[4px]">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="검색어를 입력해 주세요."
                  className="flex-1 min-w-0 bg-transparent text-[16px] font-semibold text-black placeholder:text-black/20 outline-none"
                />
                <button type="submit" className="flex-shrink-0 text-black/40 hover:text-black transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* 카테고리 필터 + 정렬 (정렬은 데스크탑 xl+ 만) */}
          <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
            <CommunityCategoryFilter value={category} onChange={handleCategoryChange} />
            <div className="hidden xl:block">
              <SortDropdown
                value={sort}
                options={SORT_OPTIONS}
                onChange={handleSortChange}
              />
            </div>
          </div>

          {/* 게시글 목록 */}
          <div className="mt-4 xl:mt-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <CommunityPostCardSkeleton key={i} />
              ))
            ) : posts.length === 0 ? (
              <div className="py-20 text-center text-black/40 text-[16px] font-medium">
                게시글이 없습니다.
              </div>
            ) : (
              posts.map((post) => (
                <CommunityPostCard key={post.id} post={post} />
              ))
            )}
          </div>

          {/* 페이지네이션 */}
          {!isLoading && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-10 md:mt-12">
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
                            "cursor-pointer font-bold",
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
        </div>

        {/* ── 우측 사이드바 (xl 이상) ── */}
        <div className="hidden xl:block w-[180px] flex-shrink-0">
          <div className="sticky top-28 flex flex-col gap-3">
            <Link
              href={isAuthenticated ? "/community/write" : "/login"}
              onClick={() => {
                if (!isAuthenticated) saveReturnUrl(pathname);
              }}
              className="flex items-center justify-center w-full py-3.5 bg-main text-white text-[15px] font-bold leading-none tracking-[-0.04em] rounded-[4px] hover:opacity-90 transition-opacity text-center"
            >
              {isAuthenticated ? "글쓰기" : "로그인 후 글 작성하기"}
            </Link>

            {/* 알림 카드 자리 (실제 알림 API 연동 예정) */}
            <div className="flex flex-col gap-2" aria-hidden="true">
              {/* 알림 컴포넌트 placeholder - 다음 스프린트에서 구현 */}
            </div>
          </div>
        </div>

      </div>

      {/* 모바일 글쓰기 FAB */}
      <CommunityWriteFab />
    </div>
  );
}
