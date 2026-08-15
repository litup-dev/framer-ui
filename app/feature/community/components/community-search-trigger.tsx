"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CommunitySearchTypeSelect } from "./community-search-type-select";
import type { PostSearchType } from "../types";

/**
 * 커뮤니티 목록 페이지 전용 검색 진입 버튼 + 상단 시트.
 * md(744px) 미만 모바일 전용 — 744 이상은 인라인 검색바(CommunityContent)를 사용한다.
 * /community 페이지가 아니면 아무것도 렌더링하지 않는다.
 */
export function CommunitySearchTrigger({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState<PostSearchType>("TITLE_CONTENT");

  const isCommunityListPage = pathname === "/community";

  const openSearch = () => {
    setSearchInput(searchParams.get("keyword") ?? "");
    setSearchType((searchParams.get("searchType") as PostSearchType) || "TITLE_CONTENT");
    setIsSearchOpen(true);
  };
  const closeSearch = () => setIsSearchOpen(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      params.set("keyword", trimmed);
      params.set("searchType", searchType);
    } else {
      params.delete("keyword");
      params.delete("searchType");
    }
    params.delete("page");
    router.push(`/community${params.toString() ? `?${params.toString()}` : ""}`);
    setIsSearchOpen(false);
  };

  if (!isCommunityListPage) return null;

  return (
    <>
      <button
        onClick={openSearch}
        className={cn("w-12 h-12 flex items-center justify-center", className)}
        aria-label="검색"
      >
        <Search className="w-6 h-6" strokeWidth={2} />
      </button>

      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-[60] xl:hidden"
              onClick={closeSearch}
            />
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 right-0 bg-white z-[70] xl:hidden shadow-md"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 px-4 h-[60px] max-w-[744px] mx-auto"
              >
                <button
                  type="submit"
                  className="flex-shrink-0 text-black/60"
                  aria-label="검색"
                >
                  <Search className="w-5 h-5" />
                </button>
                <CommunitySearchTypeSelect
                  value={searchType}
                  onChange={setSearchType}
                  className="h-10 px-3 text-[14px]"
                />
                <input
                  type="text"
                  autoFocus
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="검색어를 입력해 주세요."
                  className="flex-1 min-w-0 bg-transparent text-[16px] font-semibold text-black placeholder:text-black/20 outline-none"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="flex-shrink-0 text-black/60"
                  aria-label="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
