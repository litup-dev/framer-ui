import { Title, Description } from "@/components/shared/typography";

const PriceSection = () => {
  return (
    <div className="flex flex-col gap-6">
      <span className="hidden sm:block text-black text-description-14 sm:text-subtitle-20">
        price
      </span>

      <div className="flex flex-col gap-2.5 text-black">
        <div className="flex gap-8 lg:gap-[23px]">
          <Description className="">예매가</Description>
          <Description className="text-black-80">10,000원</Description>
        </div>
        <div className="flex gap-8 lg:gap-[23px]">
          <Description className="">현매가</Description>
          <Description className="text-black-80">10,000원</Description>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;
