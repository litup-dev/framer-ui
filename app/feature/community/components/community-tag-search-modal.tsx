"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { Check, ChevronLeft, Search } from "lucide-react";
import { searchClubsForTag, searchPerformancesForTag, toTaggableClub, toTaggablePerform } from "../api-tag-search";
import { cn } from "@/lib/utils";
import type { TaggableClub, TaggablePerform } from "../types";

const MAX_TAGS = 5;
const PERFORM_LIMIT = 20;

export type TagMode = "ALL" | "CLUB" | "PERFORM";

// 검색 범위(클럽+공연/클럽/공연)는 글쓰기 화면의 드롭다운에서 미리 고르는 값이라
// 여기서는 선택 UI 없이 그 값을 그대로 반영만 한다.
export const TAG_MODE_OPTIONS: { value: TagMode; label: string }[] = [
  { value: "ALL", label: "클럽+공연" },
  { value: "CLUB", label: "클럽" },
  { value: "PERFORM", label: "공연" },
];

interface CommunityTagSearchPanelProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  mode: TagMode;
  initialClubs: TaggableClub[];
  initialPerforms: TaggablePerform[];
  onClose: () => void;
  onConfirm: (clubs: TaggableClub[], performs: TaggablePerform[]) => void;
}

// xl 이상: 태그 검색창 바로 위에 앵커되는 드롭다운 패널.
// md~xl: 같은 앵커 팝업이지만 좌측 "# 클럽" 필터 없이 검색창만.
// md 미만: 전체 화면을 덮는 검색 모드로 전환 (자체 검색창 + 닫기 버튼 포함).
export function CommunityTagSearchModal({
  keyword,
  onKeywordChange,
  mode,
  initialClubs,
  initialPerforms,
  onClose,
  onConfirm,
}: CommunityTagSearchPanelProps) {
  const modeLabel = TAG_MODE_OPTIONS.find((o) => o.value === mode)?.label ?? "";
  const [draftClubs, setDraftClubs] = useState<TaggableClub[]>(initialClubs);
  const [draftPerforms, setDraftPerforms] = useState<TaggablePerform[]>(initialPerforms);

  // 모바일(전체화면 모드)에서 배경 스크롤 방지
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const totalSelected = draftClubs.length + draftPerforms.length;
  const isFull = totalSelected >= MAX_TAGS;

  const showClubs = mode === "ALL" || mode === "CLUB";
  const showPerforms = mode === "ALL" || mode === "PERFORM";

  const { data: clubData, isLoading: isClubLoading } = useQuery({
    queryKey: ["tag-search", "club", keyword],
    queryFn: () => searchClubsForTag(keyword),
    enabled: showClubs,
  });
  const clubs = useMemo(() => (clubData?.data.items ?? []).map(toTaggableClub), [clubData]);

  const {
    data: performPages,
    isLoading: isPerformLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["tag-search", "perform", keyword],
    queryFn: ({ pageParam }) => searchPerformancesForTag(keyword, pageParam, PERFORM_LIMIT),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.data.items.length, 0);
      return loaded < lastPage.data.total ? loaded : undefined;
    },
    enabled: showPerforms,
  });
  const performs = useMemo(
    () => (performPages?.pages.flatMap((p) => p.data.items) ?? []).map(toTaggablePerform),
    [performPages],
  );

  const toggleClub = (club: TaggableClub) => {
    setDraftClubs((prev) => {
      const exists = prev.some((c) => c.id === club.id);
      if (exists) return prev.filter((c) => c.id !== club.id);
      if (isFull) return prev;
      return [...prev, club];
    });
  };

  const togglePerform = (perform: TaggablePerform) => {
    setDraftPerforms((prev) => {
      const exists = prev.some((p) => p.id === perform.id);
      if (exists) return prev.filter((p) => p.id !== perform.id);
      if (isFull) return prev;
      return [...prev, perform];
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <>
      {/* 바깥 클릭 시 닫기 — 화면을 어둡게 가리지 않는 투명 캐처 (md 미만은 전체화면이라 무의미) */}
      <div className="hidden md:block fixed inset-0 z-[90]" onClick={onClose} />

      <div
        className={cn(
          "fixed inset-0 z-[200] bg-white flex flex-col overflow-hidden",
          "md:absolute md:inset-auto md:left-0 md:bottom-full md:mb-2 md:z-[100]",
          "md:rounded-[6px] md:border md:border-[#e8e8e8] md:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)]",
          "md:w-full md:max-w-[720px] md:h-[480px]",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모바일 전용: 자체 검색창 (md 이상에서는 바깥 검색창을 그대로 사용) */}
        <div className="flex md:hidden items-center gap-2 px-4 pt-4 pb-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="검색 닫기"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-black"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center gap-2 h-11 px-3.5 bg-black/[0.03] rounded-[4px]">
            <input
              type="text"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="검색어를 입력해 주세요."
              autoFocus
              className="flex-1 min-w-0 bg-transparent text-[14px] text-black placeholder:text-black/30 outline-none"
            />
            <Search className="w-4 h-4 text-black/40 flex-shrink-0" />
          </div>
        </div>

        {/* 현재 검색 범위(글쓰기 화면 드롭다운에서 결정됨) + 확인 */}
        <div className="flex items-center justify-between px-4 md:px-5 pt-2 md:pt-4 pb-3 border-b border-black/10">
          <p className="text-[13px] font-bold text-black">{modeLabel} 검색 결과</p>
          <button
            type="button"
            onClick={() => onConfirm(draftClubs, draftPerforms)}
            className="px-3.5 py-2.5 text-[13px] font-bold rounded-[3px] bg-main text-white hover:opacity-90 transition-opacity"
          >
            확인
          </button>
        </div>

        <p className="px-4 md:px-5 pt-3 text-[12px] font-medium text-black/40">
          클럽+공연 합쳐서 최대 {MAX_TAGS}개까지 선택할 수 있어요. ({totalSelected}/{MAX_TAGS})
        </p>

        {/* 리스트 */}
        <div className="flex-1 overflow-y-auto px-4 md:px-5 py-3" onScroll={handleScroll}>
          {showClubs && (
            <div className="mb-4">
              <p className="text-[13px] font-bold text-black/60 mb-2">클럽</p>
              {isClubLoading ? (
                <p className="text-[13px] text-black/30 py-3">검색 중...</p>
              ) : clubs.length === 0 ? (
                <p className="text-[13px] text-black/30 py-3">검색 결과가 없습니다.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {clubs.map((club) => {
                    const checked = draftClubs.some((c) => c.id === club.id);
                    return (
                      <TagRow
                        key={club.id}
                        checked={checked}
                        disabled={!checked && isFull}
                        onClick={() => toggleClub(club)}
                        imageUrl={club.imageUrl}
                        imageShape="circle"
                        title={club.name}
                        subtitle={club.address}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {showPerforms && (
            <div>
              <p className="text-[13px] font-bold text-black/60 mb-2">공연</p>
              {isPerformLoading ? (
                <p className="text-[13px] text-black/30 py-3">검색 중...</p>
              ) : performs.length === 0 ? (
                <p className="text-[13px] text-black/30 py-3">검색 결과가 없습니다.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {performs.map((perform) => {
                    const checked = draftPerforms.some((p) => p.id === perform.id);
                    return (
                      <TagRow
                        key={perform.id}
                        checked={checked}
                        disabled={!checked && isFull}
                        onClick={() => togglePerform(perform)}
                        imageUrl={perform.imageUrl}
                        imageShape="square"
                        title={perform.title}
                        subtitle={perform.artistLabel}
                        subtitle2={formatDate(perform.performDate)}
                      />
                    );
                  })}
                </div>
              )}
              {isFetchingNextPage && (
                <p className="text-[12px] text-black/30 py-2 text-center">불러오는 중...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

interface TagRowProps {
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
  imageUrl: string | null;
  imageShape: "circle" | "square";
  title: string;
  subtitle: string;
  subtitle2?: string;
}

function TagRow({ checked, disabled, onClick, imageUrl, imageShape, title, subtitle, subtitle2 }: TagRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-3 p-3 rounded-[4px] text-left transition-colors hover:bg-black/[0.03]",
        disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      <span
        className={cn(
          "flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border-2",
          checked ? "bg-main border-main text-white" : "border-black/20",
        )}
      >
        {checked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
      </span>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className={cn(
            "flex-shrink-0 object-cover bg-black/10",
            imageShape === "circle" ? "w-10 h-10 rounded-full" : "w-9 h-11 rounded-[2px]",
          )}
        />
      ) : (
        <div
          className={cn(
            "flex-shrink-0 bg-black/10",
            imageShape === "circle" ? "w-10 h-10 rounded-full" : "w-9 h-11 rounded-[2px]",
          )}
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold text-black truncate">{title}</p>
        <p className="text-[12px] text-black/50 truncate">{subtitle}</p>
        {subtitle2 && <p className="text-[12px] text-black/50 truncate">{subtitle2}</p>}
      </div>
    </button>
  );
}
