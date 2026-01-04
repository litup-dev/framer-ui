import { Title, Description } from "@/components/shared/typography";

const PriceSection = () => {
  return (
    <div className="flex flex-col mt-6 lg:mt-10 xl:mt-12 2xl:mt-14">
      {/* price 타이틀 */}
      <Title className="hidden md:block lg:text-[20px] xl:text-[24px]">
        price
      </Title>

      {/* Grid로 캡션과 value 정렬: LG 이하 30px, XL 이상 24px */}
      <div className="grid grid-cols-[auto_1fr] gap-x-8 lg:gap-x-[30px] xl:gap-x-6 mt-5 lg:mt-6 xl:mt-5">
        {/* 예매가 */}
        <Description className="text-black-60 text-[14px] md:text-[16px] xl:text-[18px]">
          예매
        </Description>
        <Description className="text-[14px] md:text-[16px] xl:text-[18px]">
          10,000원
        </Description>

        {/* 현매가 - 예매가 아래: 2XL 14px(mt-3.5), XL 14px(mt-3.5), LG 16px(mt-4) */}
        <Description className="text-black-60 text-[14px] md:text-[16px] xl:text-[18px] mt-2.5 lg:mt-4 xl:mt-3.5">
          현매
        </Description>
        <Description className="text-[14px] md:text-[16px] xl:text-[18px] mt-2.5 lg:mt-4 xl:mt-3.5">
          10,000원
        </Description>
      </div>
    </div>
  );
};

export default PriceSection;
