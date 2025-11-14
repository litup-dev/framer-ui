import { Title, Description } from "@/components/shared/typography";

const DateSection = () => {
  return (
    <div className="flex flex-col gap-6">
      <span className="hidden sm:block text-black text-description-14 sm:text-subtitle-20">
        date
      </span>
      <div className="flex flex-col gap-2.5 text-black">
        <div className="flex gap-8 lg:gap-[23px]">
          <Description>예매 오픈</Description>
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
