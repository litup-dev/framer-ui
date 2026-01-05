import { Title, Subtitle, Description } from "@/components/shared/typography";
import { ChevronRight } from "lucide-react";

const ClubSection = () => {
  return (
    <div className="flex flex-col">
      {/* club 타이틀 */}
      <Title className="hidden md:block text-[20px] xl:text-[24px]">
        club
      </Title>
      <div className="flex flex-col gap-3 text-black rounded-[4px] mt-6">
        <div className="flex gap-3 items-center rounded-[4px] p-4 md:p-0">
          {/* 클럽 아바타: 2XL/XL 72x72(w-18 h-18), LG 60x60(w-15 h-15) */}
          <div className="w-15 h-15 xl:w-18 xl:h-18 rounded-full bg-black flex-shrink-0" />
          <div className="flex flex-col gap-2 md:gap-2 flex-1">
            {/* 클럽명 + 화살표 아이콘 */}
            <div className="flex items-center gap-3">
              <Subtitle className="xl:text-[18px] md:text-[16px]">
                현대카드 언더스테이지
              </Subtitle>
              {/* MD 이상 화살표 아이콘: 2XL/XL 24x24, LG 20x20, MD 16x16 */}
              <ChevronRight className="hidden md:block w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
            </div>
            <Description className="text-black-80 xl:text-[16px] md:text-[14px]">
              현대카드 언더스테이지
            </Description>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubSection;
