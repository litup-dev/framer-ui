"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { NoticeListItem as NoticeItemType } from "@/app/feature/notice/types";

interface Props {
  notice: NoticeItemType;
}

export const NoticeListRow = ({ notice }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-black/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full grid grid-cols-[1fr_120px_40px] md:grid-cols-[1fr_140px_40px] items-center py-4 text-left hover:bg-black/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate text-[15px] md:text-[16px] text-black">
            {notice.title}
          </span>
        </div>
        <div className="text-[13px] text-black/60">
          {format(new Date(notice.createdAt), "yyyy.MM.dd")}
        </div>
        <div className="flex justify-end pr-4">
          <ChevronDown
            strokeWidth={2.5}
            className={cn(
              "w-4 h-4 text-black/80 transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </button>
      {open && (
        <div className="px-1 pb-5 text-[14px] md:text-[15px] text-black/80 whitespace-pre-line">
          {notice.content}
        </div>
      )}
    </div>
  );
};
