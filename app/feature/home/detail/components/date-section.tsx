import { Title, Description, Subtitle } from "@/components/shared/typography";

const DateSection = () => {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <Title className="hidden md:block text-black">date</Title>
      <div className="flex flex-col gap-[11px] lg:gap-4 text-black">
        <div className="flex gap-8 lg:gap-[23px]">
          <Subtitle>예매 오픈</Subtitle>
          <Description className="text-black-80">2025.10.15 10:00</Description>
        </div>
        <div className="flex gap-8 lg:gap-[23px]">
          <Description>공연 일시</Description>
          <Description className="text-black-80">2025.10.15 10:00</Description>
        </div>
      </div>
    </div>
  );
};

export default DateSection;
