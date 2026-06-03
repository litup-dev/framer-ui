"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { NoticeFormSchema } from "@/app/feature/notice/schema";
import { NoticeSort } from "@/app/feature/notice/types";

const cycle = (
  current: NoticeSort,
  field: "title" | "createdAt",
): NoticeSort => {
  if (field === "title") {
    if (current === "-title") return "title";
    return "-title";
  }
  if (current === "-createdAt") return "createdAt";
  return "-createdAt";
};

const SortIcon = ({
  field,
  current,
}: {
  field: "title" | "createdAt";
  current: NoticeSort;
}) => {
  const active =
    (field === "title" && (current === "title" || current === "-title")) ||
    (field === "createdAt" &&
      (current === "createdAt" || current === "-createdAt"));
  if (!active) return null;
  const desc = current.startsWith("-");
  return desc ? (
    <ChevronDown className="w-4 h-4" />
  ) : (
    <ChevronUp className="w-4 h-4" />
  );
};

export const NoticeSortHeader = () => {
  const { setValue, control } = useFormContext<NoticeFormSchema>();
  const sort = useWatch({ control, name: "sort" });

  const onClick = (field: "title" | "createdAt") => {
    setValue("sort", cycle(sort, field));
  };

  return (
    <div className="grid grid-cols-[1fr_120px_40px] md:grid-cols-[1fr_140px_40px] items-center border-b border-black/20 py-3 text-[14px] text-black/60">
      <button
        type="button"
        className={cn("flex items-center gap-1 text-left", "cursor-pointer")}
        onClick={() => onClick("title")}
      >
        제목
        <SortIcon field="title" current={sort} />
      </button>
      <button
        type="button"
        className="flex items-center gap-1 justify-start"
        onClick={() => onClick("createdAt")}
      >
        등록일
        <SortIcon field="createdAt" current={sort} />
      </button>
      <div />
    </div>
  );
};
