import { Title, Subtitle, Description } from "@/components/shared/typography";

const ClubSection = () => {
  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <Title className="text-black">club</Title>
      <div className="flex flex-col gap-2 text-black">
        <div className="flex gap-3 lg:gap-4 items-center bg-[#F2F1EE] p-3 rounded-[4px]">
          <div className="w-12 h-12 lg:w-18 lg:h-18 rounded-full bg-black" />
          <div className="flex flex-col md:gap-2.5">
            <Subtitle className="text-black">현대카드 언더스테이지</Subtitle>
            <Description className="text-black">
              현대카드 언더스테이지
            </Description>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubSection;
