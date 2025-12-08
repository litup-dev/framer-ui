import FadeIn from "@/components/shared/fade-in";
import DateSection from "@/app/feature/home/detail/components/date-section";
import PriceSection from "@/app/feature/home/detail/components/price-section";
import ClubSection from "@/app/feature/home/detail/components/club-section";
import LineupSection from "@/app/feature/home/detail/components/lineup-section";

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
