import { Description, Subtitle, Title } from "@/components/shared/typography";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";

/**
 * MD (태블릿) 레이아웃용 상세 정보 섹션
 * 순서: Date -> Price -> Separator -> Club -> Artist -> Separator -> Notice
 */
const DetailSectionsMD = () => {
  return (
    <div className="flex flex-col">
      {/* Date: 탭 32px 아래 */}
      <div className="flex flex-col">
        <span className="text-black text-subtitle-20">date</span>

        {/* Grid로 캡션과 value 정렬: MD는 30px gap */}
        <div className="grid grid-cols-[auto_1fr] gap-x-[30px] mt-6">
          {/* 예매 오픈 */}
          <Description className="text-black">예매 오픈</Description>
          <Description className="text-black-80">2025.10.15 10:00</Description>

          {/* 공연 일시: 예매오픈 16px 아래 */}
          <Description className="text-black mt-4">공연 일시</Description>
          <Description className="text-black-80 mt-4">2025.10.15 10:00</Description>
        </div>
      </div>

      {/* Price: 공연일시 56px 아래 */}
      <div className="flex flex-col mt-14">
        <span className="text-black text-subtitle-20">price</span>

        {/* Grid로 캡션과 value 정렬: MD는 30px gap */}
        <div className="grid grid-cols-[auto_1fr] gap-x-[30px] mt-6">
          {/* 예매가 */}
          <Description className="text-black">예매가</Description>
          <Description className="text-black-80">10,000원</Description>

          {/* 현매가: 예매가 16px 아래 */}
          <Description className="text-black mt-4">현매가</Description>
          <Description className="text-black-80 mt-4">10,000원</Description>
        </div>
      </div>

      {/* Separator: 현매 32px 아래 */}
      <Separator className="mt-8" />

      {/* Club: Separator 32px 아래 */}
      <div className="mt-8">
        <div className="flex flex-col">
          <Title className="text-black-60 text-subtitle-20">club</Title>

          {/* 클럽 정보 카드: club 24px 아래 */}
          {/* MD: 배경색 없음 */}
          <div className="flex flex-col gap-3 text-black mt-6">
            <div className="flex gap-3 items-center">
              {/* 클럽 아바타: MD 60x60 */}
              <div className="w-15 h-15 rounded-full bg-black flex-shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                {/* 클럽명 + 화살표 아이콘 */}
                <div className="flex items-center gap-3">
                  <Subtitle className="text-subtitle-16">
                    현대카드 언더스테이지
                  </Subtitle>
                  {/* MD 화살표 아이콘: 16x16 */}
                  <ChevronRight className="w-4 h-4" />
                </div>
                <Description className="text-description-14">
                  현대카드 언더스테이지
                </Description>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artist: 클럽카드정보 48px 아래 */}
      <div className="mt-12">
        <div className="flex flex-col">
          <div className="text-black text-subtitle-20">artist</div>
          <span className="text-black-80 mt-6">6eyes, 소음발광, 칩앤스위트</span>
        </div>
      </div>

      {/* Separator: 가수들 48px 아래 */}
      <Separator className="mt-12" />
    </div>
  );
};

export default DetailSectionsMD;
