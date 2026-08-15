"use client";

import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SEARCH_TYPE_OPTIONS } from "../constants";
import type { PostSearchType } from "../types";

export function CommunitySearchTypeSelect({
  value,
  onChange,
  className,
}: {
  value: PostSearchType;
  onChange: (value: PostSearchType) => void;
  className?: string;
}) {
  const label = SEARCH_TYPE_OPTIONS.find((option) => option.value === value)?.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center justify-between gap-[8px] h-[48px] px-[14px] bg-[#f8f8f8] rounded-[4px] text-[16px] font-semibold text-black/80 whitespace-nowrap shrink-0",
            className,
          )}
        >
          <span>{label}</span>
          <ChevronRight className="w-4 h-4 rotate-90 text-black/40" strokeWidth={2.5} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {SEARCH_TYPE_OPTIONS.map((option) => (
          <DropdownMenuItem key={option.value} onClick={() => onChange(option.value)}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
