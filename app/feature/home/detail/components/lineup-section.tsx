import { Description, Title } from "@/components/shared/typography";

const LineupSection = () => {
  return (
    <div className="flex flex-col gap-6 text-black">
      <Title className="hidden lg:block text-black text-title-24">artist</Title>

      <Description className="text-black-80">
        6eyes, 소음발광, 칩앤스위트
      </Description>
    </div>
  );
};

export default LineupSection;
