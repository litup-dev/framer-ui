import { Subtitle } from "@/components/shared/typography";
import { cn } from "@/lib/utils";

interface SelectShowProps {
  onCategoryChange: (value: string) => void;
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
  onCategoryChange: (value: string) => void;
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
      onClick={() => !isAnimating && onCategoryChange(item.value)}
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

const DesktopSelectShow = ({
  onCategoryChange,
  selectedCategory,
  isAnimating = false,
}: SelectShowProps) => {
  return (
    <div className="hidden md:block">
      <div className="flex gap-4">
        {selectItems.slice(0, 2).map((item) => (
          <SelectItem
            key={item.id}
            item={item}
            onCategoryChange={onCategoryChange}
            selectedCategory={selectedCategory}
            isAnimating={isAnimating}
            underlineDecoration="decoration-3"
          />
        ))}
      </div>
      <div className="flex gap-4 md:pl-8.5 lg:pl-11.5">
        {selectItems.slice(2, 4).map((item) => (
          <SelectItem
            key={item.id}
            item={item}
            onCategoryChange={onCategoryChange}
            selectedCategory={selectedCategory}
            isAnimating={isAnimating}
            underlineDecoration="decoration-3"
          />
        ))}
      </div>
    </div>
  );
};

export default DesktopSelectShow;
