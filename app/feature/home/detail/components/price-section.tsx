import { Title, Description } from "@/components/shared/typography";

const PriceSection = () => {
  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <Title className="hidden md:block text-black">price</Title>

      <div className="flex flex-col gap-[11px] lg:gap-4 text-black">
        <div className="flex gap-8 lg:gap-[23px]">
          <Description>예매가</Description>
          <Description className="text-black-80">2025.10.15 10:00</Description>
        </div>
        <div className="flex gap-8 lg:gap-[23px]">
          <Description>현매가</Description>
          <Description className="text-black-80">2025.10.15 10:00</Description>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;
