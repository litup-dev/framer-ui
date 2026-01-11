import FadeIn from "@/components/shared/fade-in";
import { Separator } from "@/components/ui/separator";
import { Description } from "@/components/shared/typography";
import DateSection from "./date-section";
import PriceSection from "./price-section";
import ClubSection from "./club-section";
import LineupSection from "./lineup-section";
import { PerformanceDetailResponse } from "../types";

interface InfoSectionsProps {
  variant?: "lg" | "md" | "sm";
  performance: PerformanceDetailResponse["data"];
}

/**
 * 공연 상세 정보 섹션 (날짜, 가격, 클럽, 라인업)
 * - LG+: 상세 레이아웃
 * - MD: 탭 내부 레이아웃
 * - SM: 탭 내부 레이아웃
 */
const InfoSections = ({ variant = "lg", performance }: InfoSectionsProps) => {
  // SM: 간소화된 레이아웃 (장소 캡션 추가, LineupSection inline variant)
  if (variant === "sm") {
    return (
      <div className="flex flex-col">
        <DateSection performDate={performance.performDate} />
        <PriceSection bookingPrice={performance.bookingPrice} onsitePrice={performance.onsitePrice} />

        {/* 장소 캡션: 현매 32px 아래 */}
        <div className="mt-8">
          <Description className="text-[14px] text-black-60 font-medium">장소</Description>
        </div>

        {/* 클럽 정보 카드: 장소 16px 아래 */}
        <div className="mt-4">
          <ClubSection club={performance.club} />
        </div>

        {/* 라인업: 클럽정보 카드 32px 아래 */}
        <div className="mt-8">
          <LineupSection variant="inline" artists={performance.artists} />
        </div>
      </div>
    );
  }

  // MD: 탭 내부 레이아웃
  if (variant === "md") {
    return (
      <div className="flex flex-col">
        <DateSection performDate={performance.performDate} />
        <PriceSection bookingPrice={performance.bookingPrice} onsitePrice={performance.onsitePrice} />

        {/* Separator: 현매 32px 아래 */}
        <Separator className="mt-8" />

        {/* Club: Separator 32px 아래 */}
        <div className="mt-8">
          <ClubSection club={performance.club} />
        </div>

        {/* Artist: 클럽카드정보 48px 아래 */}
        <div className="mt-12">
          <LineupSection artists={performance.artists} />
        </div>

        {/* Separator: 가수들 48px 아래 */}
        <Separator className="mt-12" />
      </div>
    );
  }

  // LG+: 기본 레이아웃
  return (
    <FadeIn>
      <div className="flex flex-col pb-20 md:pb-0">
        <DateSection performDate={performance.performDate} />
        <PriceSection bookingPrice={performance.bookingPrice} onsitePrice={performance.onsitePrice} />

        {/* Separator - Price 아래: 모든 사이즈 32px(mt-8) */}
        <Separator className="mt-8" />

        {/* Artist - Separator 아래: 모든 사이즈 32px(mt-8) */}
        <div className="mt-8">
          <LineupSection artists={performance.artists} />
        </div>

        {/* Club - Artist 아래: 2XL 56px(mt-14), XL 48px(mt-12), LG 40px(mt-10) */}
        <div className="mt-10 xl:mt-12 2xl:mt-14">
          <ClubSection club={performance.club} />
        </div>
      </div>
    </FadeIn>
  );
};

export default InfoSections;
