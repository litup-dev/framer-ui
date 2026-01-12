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
  underlineDecoration?: "decoration-2" | "decoration-3";
}

const SelectItem = ({
  item,
  onCategoryChange,
  selectedCategory,
  isAnimating = false,
  underlineDecoration = "decoration-2",
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
          ? `text-black underline ${underlineDecoration} underline-offset-4`
          : "text-[#20202066]"
      )}
    >
      <Subtitle>{item.label}</Subtitle>
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
        "flex gap-3 md:hidden",
        selectedMobileBottomNavigation === "calendar" && "hidden"
      )}
    >
      {SELECT_ITEMS.map((item) => {
        if (item.value === "area") {
          const displayLabel = selectedArea
            ? item.region?.find((area) => area.value === selectedArea)?.label ||
              "지역별"
            : "지역별";

          return (
            <div
              key={item.id}
              className={cn(
                "relative",
                !isAnimating && "cursor-pointer",
                isAreaSelected
                  ? "text-black underline decoration-2 underline-offset-4"
                  : "text-[#20202066]"
              )}
            >
              <Select
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
                  className={cn(
                    "border-none shadow-none p-0 h-auto w-auto gap-0 min-w-0",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    "items-center justify-start",
                    "[&>span]:opacity-0 [&>span]:p-0 [&>span]:h-auto [&>span]:min-w-0",
                    "[&>div]:hidden",
                    "absolute inset-0"
                  )}
                >
                  <SelectValue placeholder="지역별" />
                </SelectTrigger>
                <SelectContent className="p-4">
                  {item.region &&
                    item.region.map((area) => (
                      <UISelectItem key={area.id} value={area.value}>
                        {area.label}
                      </UISelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Subtitle>{displayLabel}</Subtitle>
            </div>
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
