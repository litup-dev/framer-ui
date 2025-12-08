import { Subtitle } from "@/components/shared/typography";
import { cn } from "@/lib/utils";
import { useHomeStore } from "@/app/feature/home/store/home-store";
import { useEffect } from "react";

interface SelectShowProps {
  onCategoryChange: (value: "week" | "today" | "free" | "area") => void;
  selectedCategory?: string;
  isAnimating?: boolean;
}

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

interface SelectItemProps {
  item: (typeof selectItems)[0];
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

  return (
    <div
      className={cn(
        "flex gap-3 md:hidden",
        selectedMobileBottomNavigation === "calendar" && "hidden"
      )}
    >
      {selectItems.map((item) => (
        <SelectItem
          key={item.id}
          item={item}
          onCategoryChange={onCategoryChange}
          selectedCategory={selectedCategory}
          isAnimating={isAnimating}
        />
      ))}
    </div>
  );
};

export default MobileSelectShow;
