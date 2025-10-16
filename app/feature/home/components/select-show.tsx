import { cn } from "@/lib/utils";
import * as React from "react";

interface SelectShowProps {
  onCategoryChange: (value: string) => void;
  selectedCategory?: string;
  isAnimating?: boolean;
}

const SelectShow = ({
  onCategoryChange,
  selectedCategory,
  isAnimating = false,
}: SelectShowProps) => {
  const selectItems = [
    {
      id: 1,
      label: "금주공연",
      value: "week",
    },
    {
      id: 2,
      label: "월간공연",
      value: "month",
    },
    {
      id: 3,
      label: "무료공연",
      value: "free",
    },
    {
      id: 4,
      label: "지역별",
      value: "local",
    },
  ];

  return (
    <div className="text-[24px] font-bold flex flex-col gap-2">
      <div className="flex gap-4">
        {selectItems.slice(0, 2).map((item) => (
          <div
            key={item.id}
            onClick={() => !isAnimating && onCategoryChange(item.value)}
            className={cn(
              !isAnimating && "cursor-pointer",
              selectedCategory === item.value
                ? "text-black underline decoration-3 underline-offset-4"
                : "text-[#20202066]"
            )}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div className="flex gap-4 pl-11.5">
        {selectItems.slice(2, 4).map((item) => (
          <div
            key={item.id}
            onClick={() => !isAnimating && onCategoryChange(item.value)}
            className={cn(
              !isAnimating && "cursor-pointer",
              selectedCategory === item.value
                ? "text-black underline decoration-3 underline-offset-4"
                : "text-[#20202066]"
            )}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectShow;
