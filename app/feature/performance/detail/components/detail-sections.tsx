import FadeIn from "@/components/shared/fade-in";
import { Separator } from "@/components/ui/separator";
import DateSection from "./date-section";
import PriceSection from "./price-section";
import ClubSection from "./club-section";
import LineupSection from "./lineup-section";
import NoticeSection from "./notice-section";

const DetailSections = () => {
  return (
    <FadeIn>
      <div className="flex flex-col pb-20 md:pb-0">
        <DateSection />
        <PriceSection />

        {/* Separator - Price 아래: 모든 사이즈 32px(mt-8) */}
        <Separator className="mt-8" />

        {/* Artist - Separator 아래: 모든 사이즈 32px(mt-8) */}
        <div className="mt-8">
          <LineupSection />
        </div>

        {/* Club - Artist 아래: 2XL 56px(mt-14), XL 48px(mt-12), LG 40px(mt-10) */}
        <div className="mt-10 xl:mt-12 2xl:mt-14">
          <ClubSection />
        </div>
      </div>
    </FadeIn>
  );
};

export default DetailSections;
