import { Description, Subtitle, Title } from "@/components/shared/typography";
import LineupSection from "./lineup-section";
import { ChevronRight } from "lucide-react";

/**
 * SM (모바일) 레이아웃용 상세 정보 섹션
 * 순서: 예매오픈 -> 공연일시 -> 예매 -> 현매 -> 장소 -> 클럽정보카드 -> 라인업
 */
const DetailSectionsSM = () => {
  return (
    <div className="flex flex-col">
      {/* Grid로 캡션과 value 정렬: SM은 30px gap */}
      <div className="grid grid-cols-[auto_1fr] gap-x-[30px]">
        {/* 예매오픈 */}
        <Description className="text-black">예매 오픈</Description>
        <Description className="text-black-80">2025.10.15 10:00</Description>

        {/* 공연일시: 예매오픈 10px 아래 */}
        <Description className="text-black mt-2.5">공연 일시</Description>
        <Description className="text-black-80 mt-2.5">2025.10.15 10:00</Description>

        {/* 예매: 공연일시 32px 아래 */}
        <Description className="text-black mt-8">예매가</Description>
        <Description className="text-black-80 mt-8">10,000원</Description>

        {/* 현매: 예매가 10px 아래 */}
        <Description className="text-black mt-2.5">현매가</Description>
        <Description className="text-black-80 mt-2.5">10,000원</Description>
      </div>

      {/* 장소(캡션): 현매 32px 아래 */}
      <div className="mt-8">
        <Description className="text-[14px] text-black-60">장소</Description>
      </div>

      {/* 클럽 정보 카드: 장소 16px 아래 */}
      {/* SM: padding 16, border 1px solid #202020 20%, radius 4px */}
      <div className="flex flex-col gap-3 text-black rounded-[4px] border border-[#202020]/20 mt-4">
        <div className="flex gap-3 items-center justify-between rounded-[4px] p-4">
          <div className="flex gap-3 items-center">
            {/* 클럽 아바타: SM 48x48 */}
            <div className="w-12 h-12 rounded-full bg-black flex-shrink-0" />
            <div className="flex flex-col gap-1.5">
              <Subtitle className="text-[14px]">
                현대카드 언더스테이지
              </Subtitle>
              <Description className="text-[12px]">
                현대카드 언더스테이지
              </Description>
            </div>
          </div>
          {/* SM: 우측 화살표 아이콘 */}
          <ChevronRight className="w-5 h-5 flex-shrink-0" />
        </div>
      </div>

      {/* 라인업: 클럽정보 카드 32px 아래 */}
      <div className="mt-8">
        <LineupSection variant="inline" />
      </div>
    </div>
  );
};

export default DetailSectionsSM;
