import { Separator } from "@/components/ui/separator";
import DateSection from "./date-section";
import PriceSection from "./price-section";
import ClubSection from "./club-section";
import LineupSection from "./lineup-section";

const DesktopDetailSections = () => {
  return (
    <div className="flex flex-col gap-6 lg:gap-[42px]">
      <DateSection />
      <PriceSection />
      <Separator />
      <ClubSection />
      <LineupSection />
    </div>
  );
};

export default DesktopDetailSections;
