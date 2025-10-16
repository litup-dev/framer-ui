import DateSection from "./date-section";
import PriceSection from "./price-section";
import ClubSection from "./club-section";
import LineupSection from "./lineup-section";
import FadeIn from "@/components/shared/fade-in";

const MobileDetailSections = () => {
  return (
    <FadeIn>
      <div className="flex flex-col gap-8 pb-20">
        <DateSection />
        <PriceSection />
        <ClubSection />
        <LineupSection />
      </div>
    </FadeIn>
  );
};

export default MobileDetailSections;
