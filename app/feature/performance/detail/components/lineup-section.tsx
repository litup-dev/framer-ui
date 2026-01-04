import { Title, Description } from "@/components/shared/typography";

interface LineupSectionProps {
  variant?: "default" | "inline";
}

/**
 * 아티스트 라인업 섹션
 * - default: 세로 레이아웃 (LG+, MD)
 * - inline: 가로 레이아웃 (SM)
 */
const LineupSection = ({ variant = "default" }: LineupSectionProps) => {
  if (variant === "inline") {
    // SM: 라인업과 가수들이 한 줄
    return (
      <div className="flex items-center gap-3">
        <Description className="text-black-60 text-[14px]">라인업</Description>
        <Description className="text-[14px]">6eyes, 소음발광, 칩앤스위트</Description>
      </div>
    );
  }

  // Default: LG+, MD - 세로 레이아웃
  return (
    <div className="flex flex-col">
      <Title className="text-[20px] xl:text-[24px]">
        artist
      </Title>
      <Description className="mt-6 text-[16px] xl:text-[18px]">
        6eyes, 소음발광, 칩앤스위트
      </Description>
    </div>
  );
};

export default LineupSection;
