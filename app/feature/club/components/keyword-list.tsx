"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { ClubSearchFormSchema } from "@/app/feature/club/schema";
import { ReviewCategory } from "@/app/feature/club/types";

import { Subtitle, Description } from "@/components/shared/typography";
import Image from "next/image";

interface KeywordListProps {
  categories: ReviewCategory[] | undefined;
}

const KeywordList = ({ categories }: KeywordListProps) => {
  const { setValue, watch } = useFormContext<ClubSearchFormSchema>();
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const ellipsisRef = useRef<HTMLButtonElement>(null);
  const measureRowRef = useRef<HTMLDivElement>(null);

  const selectedKeywords = (watch("keywords") as number[]) || [];

  const allKeywords = useMemo(() => {
    if (!categories) return [];
    return categories.flatMap((category) => category.keywords);
  }, [categories]);

  const hasMore = allKeywords.length > 0;

  const calculate = useCallback(() => {
    if (!containerRef.current || !measureRowRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const ellipsisWidth = ellipsisRef.current?.offsetWidth ?? 0;
    const gap = 8; // gap-2 = 8px

    // ellipsis 버튼과의 gap을 확보한 가용 너비
    const availableWidth =
      ellipsisWidth > 0
        ? containerWidth - ellipsisWidth - gap
        : containerWidth;

    const chipElements = Array.from(
      measureRowRef.current.children,
    ) as HTMLElement[];

    let usedWidth = 0;
    let count = 0;

    for (const chip of chipElements) {
      const chipWidth = chip.offsetWidth;
      const widthWithGap =
        count === 0 ? chipWidth : usedWidth + gap + chipWidth;

      if (widthWithGap > availableWidth) break;

      usedWidth = widthWithGap;
      count++;
    }

    setVisibleCount(count);
  }, []);

  useEffect(() => {
    if (showAllKeywords) return;

    const el = containerRef.current;
    if (!el) return;

    // 초기 계산 — 측정용 div가 paint된 후 실행
    const raf = requestAnimationFrame(() => {
      calculate();
    });

    const observer = new ResizeObserver(calculate);
    observer.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [showAllKeywords, allKeywords.length, calculate]);

  const handleKeywordClick = (keywordId: number) => {
    const currentKeywords = selectedKeywords;
    const isSelected = currentKeywords.includes(keywordId);

    if (isSelected) {
      setValue(
        "keywords",
        currentKeywords.filter((id) => id !== keywordId),
      );
    } else {
      setValue("keywords", [...currentKeywords, keywordId]);
    }
  };

  const renderChip = (
    keyword: { id: number; keyword: string },
    opts: { visible: boolean },
  ) => {
    const isSelected = selectedKeywords.includes(keyword.id);
    return (
      <button
        key={keyword.id}
        onClick={() => handleKeywordClick(keyword.id)}
        style={opts.visible ? undefined : { visibility: "hidden" }}
        className={cn(
          "shrink-0 h-[31px] sm:h-[34px] 2xl:h-[36px] rounded-[4px] px-2.5 2xl:px-3 cursor-pointer transition-colors whitespace-nowrap flex items-center justify-center",
          isSelected
            ? "bg-main text-white hover:bg-main/90"
            : "bg-[rgba(23,23,23,0.04)] hover:bg-[rgba(23,23,23,0.08)]",
        )}
      >
        {isSelected ? (
          <p className="text-[13px] md:text-[14px] 2xl:text-[16px] font-bold tracking-[-0.04em] leading-none text-white whitespace-nowrap">
            {keyword.keyword}
          </p>
        ) : (
          <p className="text-[13px] md:text-[14px] 2xl:text-[16px] font-medium tracking-[-0.04em] leading-none text-black/50 whitespace-nowrap">
            {keyword.keyword}
          </p>
        )}
      </button>
    );
  };

  if (showAllKeywords) {
    // expanded: flex-wrap으로 모든 키워드 + arrow-up 버튼 표시
    return (
      <div className="space-y-3 w-full">
        <div className="flex flex-wrap gap-2">
          {allKeywords.map((keyword) =>
            renderChip(keyword, { visible: true }),
          )}
          {hasMore && (
            <button
              onClick={() => setShowAllKeywords(false)}
              className="shrink-0 bg-[rgba(23,23,23,0.04)] cursor-pointer transition-colors text-center hover:bg-[rgba(23,23,23,0.08)] rounded-[4px] px-2.5 2xl:px-3 h-[31px] sm:h-[34px] 2xl:h-[36px] flex items-center justify-center"
            >
              <Image
                src="/images/arrow-up.svg"
                alt="chevron-up"
                width={24}
                height={24}
                className="size-5 2xl:size-6 text-black/50"
              />
            </button>
          )}
        </div>
      </div>
    );
  }

  // collapsed: 측정용 offscreen row + 실제 표시 row (ellipsis는 칩 바로 옆)
  const measured = visibleCount !== null;

  return (
    <div className="space-y-3 w-full">
      {/* 측정용 row: offscreen에 모든 칩 렌더해서 offsetWidth 측정 */}
      <div
        ref={measureRowRef}
        aria-hidden="true"
        className="flex flex-nowrap gap-2"
        style={{
          position: "absolute",
          left: -9999,
          top: -9999,
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        {allKeywords.map((keyword) =>
          renderChip(keyword, { visible: false }),
        )}
      </div>

      {/* 실제 표시 row: visibleCount만큼만 렌더 + ellipsis 바로 옆 */}
      <div
        ref={containerRef}
        className="flex flex-nowrap gap-2 overflow-hidden"
      >
        {(measured ? allKeywords.slice(0, visibleCount) : []).map((keyword) =>
          renderChip(keyword, { visible: true }),
        )}
        {hasMore && (
          <button
            ref={ellipsisRef}
            onClick={() => setShowAllKeywords(true)}
            className="shrink-0 bg-[rgba(23,23,23,0.04)] cursor-pointer transition-colors text-center hover:bg-[rgba(23,23,23,0.08)] rounded-[4px] px-2.5 2xl:px-3 h-[31px] sm:h-[34px] 2xl:h-[36px] flex items-center justify-center"
            style={measured ? undefined : { visibility: "hidden" }}
          >
            <Image
              src="/images/more.png"
              alt="more"
              width={24}
              height={24}
              className="size-5 2xl:size-6"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default KeywordList;
