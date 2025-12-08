import MobileSelectShow from "@/app/feature/home/components/mobile-select-show";
import DesktopSelectShow from "@/app/feature/home/components/desktop-select-show";

interface SelectShowProps {
  onCategoryChange: (value: "week" | "today" | "free" | "area") => void;
  selectedCategory?: string;
  isAnimating?: boolean;
  selectedArea?: string;
  onAreaChange?: (value: string | "seoul" | "hongdae" | "busan") => void;
}

const SelectShow = ({
  onCategoryChange,
  selectedCategory,
  isAnimating = false,
  selectedArea,
  onAreaChange,
}: SelectShowProps) => {
  return (
    <div className="flex flex-col gap-2">
      <MobileSelectShow
        onCategoryChange={onCategoryChange}
        selectedCategory={selectedCategory}
        isAnimating={isAnimating}
      />
      <DesktopSelectShow
        onCategoryChange={(value: "week" | "today" | "free" | "area") =>
          onCategoryChange(value)
        }
        selectedCategory={selectedCategory}
        isAnimating={isAnimating}
        selectedArea={selectedArea}
        onAreaChange={onAreaChange}
      />
    </div>
  );
};

export default SelectShow;
