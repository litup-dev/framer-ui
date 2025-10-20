import { Title, Description } from "@/components/shared/typography";

const PriceSection = () => {
  return (
    <div className="flex flex-col gap-6">
      <Title className="hidden lg:block text-black text-title-24">price</Title>

      <div className="flex flex-col gap-4 text-black">
        <div className="flex gap-8 lg:gap-[23px]">
          <Description className="text-description-16">예매가</Description>
          <Description className="text-black-80">10,000원</Description>
        </div>
        <div className="flex gap-8 lg:gap-[23px]">
          <Description className="text-description-16">현매가</Description>
          <Description className="text-black-80">10,000원</Description>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;
