import { Title, Description } from "@/components/shared/typography";

const DateSection = () => {
  return (
    <div className="flex flex-col">
      {/* date 타이틀 */}
      <Title className="hidden md:block lg:text-[20px] xl:text-[24px]">
        date
      </Title>

      {/* Grid로 캡션과 value 정렬: LG 이하 30px, XL 이상 24px */}
      <div className="grid grid-cols-[auto_1fr] gap-x-8 lg:gap-x-[30px] xl:gap-x-6 mt-5 lg:mt-6 xl:mt-5">
        {/* 예매 오픈 */}
        <Description className="text-black-60 text-[14px] md:text-[16px] xl:text-[18px]">예매 오픈</Description>
        <Description className="text-[14px] md:text-[16px] xl:text-[18px]">2025.10.15 10:00</Description>

        {/* 공연 일시 - 예매 오픈 아래: 2XL 14px(mt-3.5), XL 14px(mt-3.5), LG 16px(mt-4) */}
        <Description className="text-black-60 text-[14px] md:text-[16px] xl:text-[18px] lg:mt-4 xl:mt-3.5">공연 일시</Description>
        <Description className="text-[14px] md:text-[16px] xl:text-[18px] mt-2.5 lg:mt-4 xl:mt-3.5">2025.10.15 10:00</Description>
      </div>
    </div>
  );
};

export default DateSection;
