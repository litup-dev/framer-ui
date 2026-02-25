"use client";

import { Title, Subtitle, Description } from "@/components/shared/typography";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ClubSectionProps {
  club: {
    id: number;
    name: string;
    address: string;
  };
}

const ClubSection = ({ club }: ClubSectionProps) => {
  const router = useRouter();

  const handleClubClick = () => {
    router.push(`/club/${club.id}`);
  };

  return (
    <div className="flex flex-col">
      {/* club 타이틀 */}
      <Title className="hidden md:block text-[20px] xl:text-[24px]">
        club
      </Title>
      <div className="flex flex-col gap-3 text-black rounded-[4px] md:mt-6">
        <div
          onClick={handleClubClick}
          className="flex gap-3 items-center rounded-[4px] p-4 md:p-0 cursor-pointer hover:bg-gray-50 transition-colors border border-[#202020]/20 md:border-0"
        >
          {/* 클럽 아바타: 2XL/XL 72x72(w-18 h-18), LG 60x60(w-15 h-15) */}
          <div className="w-15 h-15 xl:w-18 xl:h-18 rounded-full bg-black flex-shrink-0" />
          <div className="flex flex-col gap-2 md:gap-2 flex-1">
            {/* 클럽명 */}
            <div className="flex items-center gap-1">
              <Subtitle className="xl:text-[18px] md:text-[16px] text-[14px]">
                {club.name}
              </Subtitle>
              {/* 화살표 아이콘: MD 이상에서는 클럽명 바로 옆 */}
              <Image src="/images/performance-detail/arrow-right-line.svg" alt="arrow" width={16} height={16} className="hidden md:block w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 flex-shrink-0" />
            </div>
            {/* 주소 */}
            <Description className="text-black-80 xl:text-[16px] md:text-[14px] text-[12px]">
              {club.address}
            </Description>
          </div>
          {/* 화살표 아이콘: SM에서만 우측 끝 */}
          <Image src="/images/performance-detail/arrow-right-line.svg" alt="arrow" width={16} height={16} className="md:hidden w-4 h-4 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default ClubSection;
