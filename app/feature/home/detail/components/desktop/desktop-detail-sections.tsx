import { Separator } from "@/components/ui/separator";
import DateSection from "@/app/feature/home/detail/components/date-section";
import PriceSection from "@/app/feature/home/detail/components/price-section";
import ClubSection from "@/app/feature/home/detail/components/club-section";
import LineupSection from "@/app/feature/home/detail/components/lineup-section";
import DesktopComentSection from "@/app/feature/home/detail/components/desktop/desktop-coment-section";

const DesktopDetailSections = () => {
  return (
    <div className="flex flex-col gap-6 lg:gap-[40px]">
      <DateSection />
      <PriceSection />
      <Separator />
      <ClubSection />
      <LineupSection />
      <DesktopComentSection />
    </div>
  );
};

export default DesktopDetailSections;
