import { Title, Description } from "@/components/shared/typography";

interface LineupSectionProps {
  variant?: "default" | "inline";
  artists: Array<{
    name: string;
  }>;
}

/**
 * 아티스트 라인업 섹션
 * - default: 세로 레이아웃 (LG+, MD)
 * - inline: 가로 레이아웃 (SM)
 */
const LineupSection = ({
  variant = "default",
  artists,
}: LineupSectionProps) => {
  const artistNames = artists.map((artist) => artist.name).join(", ");

  if (variant === "inline") {
    // SM: 라인업과 가수들이 한 줄
    return (
      <div className="grid grid-cols-[50px_1fr] md:grid-cols-[70px_1fr] xl:grid-cols-[80px_1fr] gap-x-8 lg:gap-x-[15px] xl:gap-x-6 md:mt-6">
        <Description className="text-black-60 text-[14px]">라인업</Description>
        <Description className="text-[14px]">{artistNames}</Description>
      </div>
    );
  }

  // Default: LG+, MD - 세로 레이아웃
  return (
    <div className="grid grid-cols-[50px_1fr] md:grid-cols-[70px_1fr] xl:grid-cols-[80px_1fr] gap-x-8 lg:gap-x-[15px] xl:gap-x-6 md:mt-6">
      <Title className="text-[20px] xl:text-[24px]">artist</Title>
      <Description className="mt-6 text-[16px] xl:text-[18px]">
        {artistNames}
      </Description>
    </div>
  );
};

export default LineupSection;
