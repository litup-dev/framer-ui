"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { saveReturnUrl } from "@/lib/login-utils";

import { postsQueryOptions } from "../query-options";
import { CommunityBoardTabs, type BoardTabValue } from "./community-board-tabs";
import { CommunityCategoryFilter } from "./community-category-filter";
import { CommunityPostCard } from "./community-post-card";
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
  // searchType: 실제 검색에 반영된(제출된) 값 / searchTypeDraft: 드롭다운에서 아직 제출 전인 선택값
  const [searchType, setSearchType] = useState<PostSearchType>(
    (searchParams.get("searchType") as PostSearchType) || "TITLE_CONTENT",
  );
  const [searchTypeDraft, setSearchTypeDraft] = useState<PostSearchType>(
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
    const urlSearchType = (searchParams.get("searchType") as PostSearchType) || "TITLE_CONTENT";
    setSearchType(urlSearchType);
    setSearchTypeDraft(urlSearchType);
    const urlPage = Number(searchParams.get("page")) || 1;
    setCurrentPage(urlPage);
  }, [searchParams]);

  const offset = (currentPage - 1) * LIMIT;

  const { data, isLoading } = useQuery({
    ...postsQueryOptions({
      board: board ?? undefined,
      category: category ?? undefined,
      keyword: keyword || undefined,
      searchType: keyword ? searchType : undefined,
      sort,
      offset,
      limit: LIMIT,
    }),
    // 필터/페이지 전환 시 이전 결과를 유지해 스켈레톤 flash 방지
    placeholderData: keepPreviousData,
  });

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
    setSearchType(searchTypeDraft);
    resetPage();
  };

  return (
    <div className="w-full min-h-screen">
      {/* 페이지 타이틀 (데스크탑 xl+) */}
      <h1 className="hidden xl:block text-[32px] font-bold tracking-[-0.04em] text-black mb-10">
        커뮤니티
      </h1>

      {/* 탭 + 검색 같은 줄 */}
      <div className="flex items-end justify-between border-b border-black/10">
        <CommunityBoardTabs value={board} onChange={handleBoardChange} />

        {/* 검색 (데스크탑 xl+) */}
        <form onSubmit={handleSearch} className="hidden xl:flex items-center gap-[10px] mb-3">
          <CommunitySearchTypeSelect value={searchTypeDraft} onChange={setSearchTypeDraft} />
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

      {/* 카테고리 필터 + 정렬 + 글쓰기 버튼(xl+ 은 같은 줄) */}
      <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
        <CommunityCategoryFilter value={category} onChange={handleCategoryChange} />
        <div className="flex items-center gap-6">
          <div className="hidden xl:block">
            <SortDropdown
              value={sort}
              options={SORT_OPTIONS}
              onChange={handleSortChange}
            />
          </div>
          <Link
            href={isAuthenticated ? "/community/write" : "/login"}
            onClick={() => {
              if (!isAuthenticated) saveReturnUrl(pathname);
            }}
            className="hidden xl:flex items-center justify-center w-[302px] h-[60px] bg-main text-white text-[16px] font-bold leading-none tracking-[-0.04em] rounded-[4px] hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {isAuthenticated ? "글쓰기" : "로그인 후 글 작성하기"}
          </Link>
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="mt-4 xl:mt-2">
        {posts.length > 0 ? (
          posts.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))
        ) : isLoading ? null : (
          <div className="py-20 text-center text-black/40 text-[16px] font-medium">
            게시글이 없습니다.
          </div>
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

      {/* 검색 (태블릿 md~xl 전용, 리스트 하단 인라인 바 — 피그마 고정폭 518px 가운데 정렬) */}
      <form onSubmit={handleSearch} className="hidden md:flex xl:hidden items-center justify-center gap-[10px] mt-10">
        <CommunitySearchTypeSelect value={searchTypeDraft} onChange={setSearchTypeDraft} className="w-[148px]" />
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

      {/* 모바일 글쓰기 FAB */}
      <CommunityWriteFab />
    </div>
  );
}
