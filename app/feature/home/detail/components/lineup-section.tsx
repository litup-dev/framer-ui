import { Description } from "@/components/shared/typography";

const LineupSection = () => {
  return (
    <div className="flex flex-col gap-[11px] lg:gap-4 text-black">
      <div className="flex gap-8 lg:gap-[23px]">
        <Description>라인업</Description>
        <Description className="text-black-80">
          6eyes, 소음발광, 칩앤스위트
        </Description>
      </div>
    </div>
  );
};

export default LineupSection;
