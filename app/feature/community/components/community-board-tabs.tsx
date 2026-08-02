"use client";

import { cn } from "@/lib/utils";
import type { BoardCode } from "../types";

export type BoardTabValue = BoardCode | null; // null = 전체 보기

type Tab =
  | { code: BoardTabValue; label: string; disabled?: false }
  | { code: "FAN"; label: string; disabled: true };

const TABS: Tab[] = [
  { code: null, label: "전체 보기" },
  { code: "FREE", label: "자유게시판" },
  { code: "FAN", label: "팬 커뮤니티", disabled: true },
];

interface CommunityBoardTabsProps {
  value: BoardTabValue;
  onChange: (board: BoardTabValue) => void;
  className?: string;
}

export function CommunityBoardTabs({ value, onChange, className }: CommunityBoardTabsProps) {
  return (
    <div className={cn("flex items-end w-full xl:w-auto", className)}>
      {TABS.map((tab) => {
        const isActive = !tab.disabled && tab.code === value;
        return (
          <button
            key={String(tab.code)}
            onClick={() => {
              if (!tab.disabled) onChange(tab.code as BoardTabValue);
            }}
            disabled={tab.disabled}
            className={cn(
              "flex-1 xl:flex-none px-3 pb-4 text-[16px] xl:text-[18px] font-bold leading-none tracking-[-0.04em] transition-colors whitespace-nowrap",
              "border-b-[3px] -mb-px",
              isActive
                ? "border-black text-black"
                : tab.disabled
                  ? "border-transparent text-black/25 cursor-not-allowed"
                  : "border-transparent text-black/40 hover:text-black/70",
            )}
          >
            {tab.label}
            {tab.disabled && (
              <span className="ml-1.5 text-[11px] font-semibold text-black/25">준비중</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
