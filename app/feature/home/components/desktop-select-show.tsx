import { Subtitle } from "@/components/shared/typography";
import { cn } from "@/lib/utils";
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

interface CategorySelectItemProps {
  item: (typeof SELECT_ITEMS)[number];
  onCategoryChange: (value: "week" | "today" | "free" | "area") => void;
  selectedCategory?: string;
  isAnimating?: boolean;
  underlineDecoration?: "decoration-2" | "decoration-3";
}

const CategorySelectItem = ({
  item,
  onCategoryChange,
  selectedCategory,
  isAnimating = false,
  underlineDecoration = "decoration-2",
}: CategorySelectItemProps) => {
  return (
    <div
      onClick={() =>
        !isAnimating &&
        onCategoryChange(item.value as "week" | "today" | "free" | "area")
      }
      className={cn(
        !isAnimating && "cursor-pointer",
        selectedCategory === item.value
          ? cn("text-black underline underline-offset-4", underlineDecoration)
          : "text-[#20202066]"
      )}
    >
      <Subtitle className="text-[16px] xl:text-[20px] 2xl:text-[24px]">
        {item.label}
      </Subtitle>
    </div>
  );
};

const DesktopSelectShow = ({
  onCategoryChange,
  selectedCategory,
  isAnimating = false,
  selectedArea,
  onAreaChange,
}: SelectShowProps) => {
  const isAreaSelected = selectedCategory === "area";

  return (
    <div
      className={cn("hidden md:flex md:flex-col gap-4 xl:gap-4.5 2xl:gap-5")}
    >
      <div className={cn("flex gap-4")}>
        {SELECT_ITEMS.slice(0, 2).map((item) => (
          <CategorySelectItem
            key={item.id}
            item={item}
            onCategoryChange={onCategoryChange}
            selectedCategory={selectedCategory}
            isAnimating={isAnimating}
            underlineDecoration="decoration-3"
          />
        ))}
      </div>
      <div className={cn("flex gap-4 md:pl-8.5 lg:pl-11.5 items-center")}>
        {SELECT_ITEMS.slice(2, 4).map((item) => {
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
                  className={cn(
                    "border-none shadow-none p-0 h-auto w-auto gap-0",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    "items-center justify-start",
                    "data-[size=default]:h-auto",
                    !isAnimating && "cursor-pointer",
                    "[&_span]:text-[16px] [&_span]:xl:text-[20px] [&_span]:2xl:text-[24px]",
                    "[&_span]:gap-0",
                    "[&_span]:leading-percent",
                    "[&_span]:font-bold",
                    "[&_span]:tracking-[-0.04em]",
                    isAreaSelected
                      ? cn(
                          "text-black underline underline-offset-4 decoration-3",
                          "[&_span]:text-black"
                        )
                      : cn("text-[#20202066]", "[&_span]:text-[#20202066]")
                  )}
                >
                  <Subtitle>
                    <SelectValue placeholder="지역별" />
                  </Subtitle>
                </SelectTrigger>
                <SelectContent className="p-4 xl:p-5">
                  {item.region &&
                    item.region.map((area) => (
                      <UISelectItem key={area.id} value={area.value}>
                        {area.label}
                      </UISelectItem>
                    ))}
                </SelectContent>
              </Select>
            );
          }
          return (
            <CategorySelectItem
              key={item.id}
              item={item}
              onCategoryChange={onCategoryChange}
              selectedCategory={selectedCategory}
              isAnimating={isAnimating}
              underlineDecoration="decoration-3"
            />
          );
        })}
      </div>
    </div>
  );
};

export default DesktopSelectShow;
