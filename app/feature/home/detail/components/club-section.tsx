import { Title, Subtitle, Description } from "@/components/shared/typography";

const ClubSection = () => {
  return (
    <div className="flex flex-col gap-4">
      <Title className="text-black-60 text-description-14 sm:text-subtitle-20">
        club
      </Title>
      <div className="flex flex-col gap-3 text-black bg-gray-100 rounded-[4px]">
        <div className="flex gap-3 items-center  rounded-[4px] p-4">
          <div className="w-15 h-15 rounded-full bg-black" />
          <div className="flex flex-col gap-2">
            <Subtitle className="text-subtitle-16">
              현대카드 언더스테이지
            </Subtitle>
            <Description className="text-description-14">
              현대카드 언더스테이지
            </Description>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubSection;
