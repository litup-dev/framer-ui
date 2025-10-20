import MobileSelectShow from "@/app/feature/home/components/mobile-select-show";
import DesktopSelectShow from "@/app/feature/home/components/desktop-select-show";

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
  return (
    <div className="flex flex-col gap-2">
      <MobileSelectShow
        onCategoryChange={onCategoryChange}
        selectedCategory={selectedCategory}
        isAnimating={isAnimating}
      />
      <DesktopSelectShow
        onCategoryChange={onCategoryChange}
        selectedCategory={selectedCategory}
        isAnimating={isAnimating}
      />
    </div>
  );
};

export default SelectShow;
