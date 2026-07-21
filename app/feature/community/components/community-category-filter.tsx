"use client";

import { cn } from "@/lib/utils";
import type { CategoryCode } from "../types";

const CATEGORIES: { code: CategoryCode | null; label: string }[] = [
  { code: null, label: "모두 보기" },
  { code: "GENERAL", label: "일반글" },
  { code: "BAND_PROMO", label: "밴드 홍보" },
  { code: "PERFORM_REVIEW", label: "공연 후기" },
];

interface CommunityCategoryFilterProps {
  value: CategoryCode | null;
  onChange: (category: CategoryCode | null) => void;
}

export function CommunityCategoryFilter({
  value,
  onChange,
}: CommunityCategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {CATEGORIES.map((cat) => {
        const isActive = cat.code === value;
        return (
          <button
            key={cat.code ?? "all"}
            onClick={() => onChange(cat.code)}
            className={cn(
              "px-[18px] py-[14px] rounded-[3px] text-[14px] md:text-[16px] font-semibold leading-none tracking-[-0.04em] transition-colors border",
              isActive
                ? "border-main text-main font-bold"
                : "border-black/10 text-black/80 hover:border-black/30",
            )}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
