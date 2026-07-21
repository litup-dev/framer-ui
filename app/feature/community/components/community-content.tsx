"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

import { postsQueryOptions } from "../query-options";
import { CommunityBoardTabs, type BoardTabValue } from "./community-board-tabs";
import { CommunityCategoryFilter } from "./community-category-filter";
import { CommunityPostCard } from "./community-post-card";
import { CommunityPostCardSkeleton } from "./community-post-card-skeleton";
import { CommunityWriteFab } from "./community-write-fab";
import SortDropdown from "@/app/shared/components/sort-dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import type { BoardCode, CategoryCode, SortType, SearchType } from "../types";

const SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: "-createdAt", label: "최신순" },
  { value: "+createdAt", label: "오래된순" },
];

const SEARCH_TYPE_OPTIONS: { value: SearchType; label: string }[] = [
  { value: "all", label: "제목 + 내용" },
  { value: "title", label: "제목" },
  { value: "content", label: "내용" },
  { value: "author", label: "작성자" },
];

const LIMIT = 10;

export function CommunityContent() {
  const searchParams = useSearchParams();
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
  const [searchType, setSearchType] = useState<SearchType>("all");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [inputValue, setInputValue] = useState(searchParams.get("keyword") || "");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );

  const offset = (currentPage - 1) * LIMIT;

  const { data, isLoading } = useQuery(
    postsQueryOptions({
      board: board ?? undefined,
      category: category ?? undefined,
      keyword: keyword || undefined,
      searchType,
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
      {/* 페이지 타이틀 */}
      <h1 className="text-[24px] md:text-[28px] font-bold leading-none tracking-[-0.04em] text-black mb-6 md:mb-7">
        커뮤니티
      </h1>

      {/* 2컬럼: 메인 + 우측 사이드바 */}
      <div className="flex gap-8 xl:gap-12 items-start">

        {/* ── 메인 컬럼 ── */}
        <div className="flex-1 min-w-0">

          {/* 탭 + 검색 같은 줄 */}
          <div className="flex items-end justify-between border-b border-black/10">
            <CommunityBoardTabs value={board} onChange={handleBoardChange} />

            {/* 검색 (데스크탑) */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-1 mb-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-2 text-[13px] font-semibold text-black/50 hover:text-black/70 transition-colors outline-none"
                  >
                    {SEARCH_TYPE_OPTIONS.find((o) => o.value === searchType)?.label ?? "제목 + 내용"}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[120px]">
                  {SEARCH_TYPE_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      onSelect={() => setSearchType(opt.value)}
                      className="text-[13px] font-semibold"
                    >
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-2 px-3 py-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="검색어를 입력해 주세요."
                  className="w-[160px] xl:w-[200px] bg-transparent text-[13px] font-medium text-black placeholder:text-black/30 outline-none"
                />
                <button type="submit" className="flex-shrink-0 text-black/40 hover:text-black transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* 카테고리 필터 + 정렬 */}
          <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
            <CommunityCategoryFilter value={category} onChange={handleCategoryChange} />
            <SortDropdown
              value={sort}
              options={SORT_OPTIONS}
              onChange={handleSortChange}
              className=""
            />
          </div>

          {/* 검색 (모바일) */}
          <form onSubmit={handleSearch} className="mt-3 md:hidden">
            <div className="flex items-center gap-2 px-3.5 py-3 bg-black/[0.03] rounded-[4px] border border-black/20">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="검색어를 입력해 주세요."
                className="flex-1 bg-transparent text-[14px] font-medium text-black placeholder:text-black/30 outline-none"
              />
              <button type="submit" className="flex-shrink-0 text-black/40">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* 게시글 목록 */}
          <div className="mt-2">
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
                            page === currentPage && "text-black",
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

        {/* ── 우측 사이드바 (데스크탑 전용) ── */}
        <div className="hidden md:block w-[160px] xl:w-[180px] flex-shrink-0">
          <div className="sticky top-28">
            <Link
              href={isAuthenticated ? "/community/write" : "/login"}
              className="flex items-center justify-center w-full py-3.5 bg-main text-white text-[15px] font-bold leading-none tracking-[-0.04em] rounded-[4px] hover:opacity-90 transition-opacity"
            >
              글쓰기
            </Link>
          </div>
        </div>

      </div>

      {/* 모바일 글쓰기 FAB */}
      <CommunityWriteFab />
    </div>
  );
}
