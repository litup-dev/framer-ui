import { Share2, Plus } from "lucide-react";
import { Title, Subtitle } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import DetailSections from "./detail-sections";
import DetailSectionsMD from "./detail-sections-md";
import DetailSectionsSM from "./detail-sections-sm";
import NoticeSection from "./notice-section";
import PerformanceTabs from "./performance-tabs";
import BookingButton from "./booking-button";

interface PerformanceDetailContentProps {
  title: string;
}

const PerformanceDetailContent = ({ title }: PerformanceDetailContentProps) => {
  return (
    <>
      {/* LG ~ 2XL: 상단 우측 영역 - 공연명, 버튼, 상세정보 */}
      <div className="hidden lg:flex flex-col">
        {/* 2XL, XL: 클럽명, 공연명, 버튼 (버튼 우측) */}
        <div className="hidden xl:flex justify-between items-start">
          <div className="flex flex-col">
            {/* 클럽명: 2XL 18px, XL 16px */}
            <Subtitle className="text-black-60 text-[16px] 2xl:text-[18px] mb-2.5 xl:mb-2.5 2xl:mb-3">
              클럽명
            </Subtitle>
            {/* 공연명: 2XL 34px, XL 24px */}
            <Subtitle className="text-[24px] 2xl:text-[28px]">
              {title}
            </Subtitle>
          </div>
          {/* 버튼: 2XL 123x40/108x40, XL 112x36/99x36 */}
          <div className="flex gap-3 self-end">
            <Button
              variant="default"
              className="flex items-center gap-1 h-9 2xl:h-10 w-[112px] 2xl:w-[123px]"
            >
              보고 싶어요
              <Plus className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-1 h-9 2xl:h-10 w-[99px] 2xl:w-[108px] border-[#BBBBBB] text-[#BBBBBB] hover:bg-[#BBBBBB]/10"
            >
              공유하기
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* LG: 클럽명, 버튼 (버튼 하단), 공연명 */}
        <div className="flex xl:hidden flex-col">
          {/* 클럽명: 14px */}
          <Subtitle className="text-black-60 text-[14px] mb-2">
            클럽명
          </Subtitle>
          {/* 공연명: 24px */}
          <Subtitle className="text-[20px]">
            {title}
          </Subtitle>
          {/* 버튼들: 클럽명 아래 16px */}
          <div className="flex gap-3 mt-4">
            <Button
              variant="default"
              className="flex items-center gap-1 h-9 w-[112px]"
            >
              보고 싶어요
              <Plus className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-1 h-9 w-[99px] border-[#BBBBBB] text-[#BBBBBB] hover:bg-[#BBBBBB]/10"
            >
              공유하기
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Separator: 2XL 24px(mt-6), XL 20px(mt-5), LG 16px(mt-4) */}
        <div className="h-[3px] bg-main mt-4 xl:mt-5 2xl:mt-6" />

        {/* 상세 정보: 2XL 56px(mt-14), XL 40px(mt-10), LG 32px(mt-8) */}
        <div className="mt-8 xl:mt-10 2xl:mt-14">
          <DetailSections />
        </div>

        {/* 예매하기 버튼 */}
        <div className="mt-[60px]">
          <BookingButton height="lg" />
        </div>
      </div>

      {/* MD: 태블릿 레이아웃 */}
      <div className="hidden md:block lg:hidden">
        {/* 공연명과 버튼: space-between */}
        <div className="flex justify-between items-center mt-5">
          <Subtitle className="text-[20px]">{title}</Subtitle>

          <div className="flex gap-3">
            <Button
              variant="default"
              className="flex items-center gap-1 h-9 w-[112px]"
            >
              보고 싶어요
              <Plus className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-1 h-9 w-[99px] border-[#BBBBBB] text-[#BBBBBB] hover:bg-[#BBBBBB]/10"
            >
              공유하기
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* 탭 */}
        <div className="mt-7">
          <PerformanceTabs
            size="md"
            noticeContent={
              <>
                <DetailSectionsMD />
                <div className="mt-6">
                  <NoticeSection />
                </div>
              </>
            }
          />
        </div>
      </div>

      {/* SM: 모바일 레이아웃 */}
      <div className="block md:hidden">
        {/* 클럽명: 포스터 20px 아래, 18px */}
        <Subtitle className="text-[18px] mt-5">
          {title}
        </Subtitle>

        {/* 탭 */}
        <div className="mt-4">
          <PerformanceTabs
            size="sm"
            noticeContent={
              <>
                <DetailSectionsSM />
                <div className="mt-4">
                  <NoticeSection />
                </div>
              </>
            }
          />
        </div>
      </div>
    </>
  );
};

export default PerformanceDetailContent;
