import Image from "next/image";
import { Subtitle } from "@/components/shared/typography";
import { cn } from "@/lib/utils";
import { useHomeStore } from "@/app/feature/home/store/home-store";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem as UISelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SELECT_ITEMS } from "@/app/feature/home/constants";

interface SelectShowProps {
  onCategoryChange: (value: "week" | "today" | "free" | "area") => void;
  selectedCategory?: string;
  isAnimating?: boolean;
  selectedArea?: string;
  onAreaChange?: (value: string | "seoul" | "hongdae" | "busan") => void;
}

interface SelectItemProps {
  item: (typeof SELECT_ITEMS)[number];
  onCategoryChange: (value: "week" | "today" | "free" | "area") => void;
  selectedCategory?: string;
  isAnimating?: boolean;
}

const SelectItem = ({
  item,
  onCategoryChange,
  selectedCategory,
  isAnimating = false,
}: SelectItemProps) => {
  return (
    <div
      onClick={() =>
        !isAnimating &&
        onCategoryChange(item.value as "week" | "today" | "free" | "area")
      }
      className={cn(
        !isAnimating && "cursor-pointer",
        selectedCategory === item.value
          ? "text-[#171717] underline decoration-1 underline-offset-4"
          : "text-[#A2A2A2]"
      )}
    >
      <Subtitle className="text-[14px]">{item.label}</Subtitle>
    </div>
  );
};

const MobileSelectShow = ({
  onCategoryChange,
  selectedCategory,
  isAnimating = false,
  selectedArea,
  onAreaChange,
}: SelectShowProps) => {
  const { selectedMobileBottomNavigation, resetMobileNavigationOnDesktop } =
    useHomeStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        resetMobileNavigationOnDesktop();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resetMobileNavigationOnDesktop]);

  const isAreaSelected = selectedCategory === "area" && selectedArea;

  return (
    <div
      className={cn(
        "flex items-center gap-4 md:hidden mt-[72px]",
        selectedMobileBottomNavigation === "calendar" && "hidden"
      )}
    >
      {SELECT_ITEMS.map((item) => {
        if (item.value === "area") {
          return (
            <Select
              key={item.id}
              value={selectedArea}
              onValueChange={(value) => {
                if (!isAnimating && onAreaChange) {
                  onAreaChange(value);
                  if (!isAreaSelected) {
                    onCategoryChange("area");
                  }
                }
              }}
              disabled={isAnimating}
            >
              <SelectTrigger
                visibleIcon={false}
                className={cn(
                  "border-none shadow-none p-0 h-auto w-auto gap-0 min-w-0",
                  "data-[size=default]:h-auto",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  "items-center justify-start",
                  "font-bold tracking-[-0.04em] leading-percent !text-[14px]",
                  "data-[placeholder]:!text-[14px] data-[placeholder]:!text-[#A2A2A2]",
                  "[&>span]:p-0 [&>span]:h-auto [&>span]:min-w-0",
                  !isAnimating && "cursor-pointer",
                  isAreaSelected ? "text-[#171717]" : "text-[#A2A2A2]"
                )}
              >
                <SelectValue
                  placeholder="지역별"
                  className={cn(
                    isAreaSelected &&
                      "underline decoration-1 underline-offset-4",
                  )}
                />
                <Image
                  src="/images/rec-arrow-right.png"
                  alt="지역별"
                  width={20}
                  height={20}
                  className="size-5 rotate-90"
                />
              </SelectTrigger>
              <SelectContent
                className="p-4 [&>div]:!space-y-0"
                sideOffset={3}
                fitContent
              >
                {item.region &&
                  item.region.map((area) => (
                    <UISelectItem
                      key={area.id}
                      value={area.value}
                      className="px-0 py-2 text-[14px]"
                    >
                      {area.label}
                    </UISelectItem>
                  ))}
              </SelectContent>
            </Select>
          );
        }
        return (
          <SelectItem
            key={item.id}
            item={item}
            onCategoryChange={onCategoryChange}
            selectedCategory={selectedCategory}
            isAnimating={isAnimating}
          />
        );
      })}
    </div>
  );
};

export default MobileSelectShow;
