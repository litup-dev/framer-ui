import Image from "next/image";

export const AllPerformancesHeader = () => {
  return (
    <div className="flex justify-end">
      <div className="relative w-[257px] h-[100px] sm:w-[335px] sm:h-[130px] lg:w-[386px] lg:h-[150px] xl:w-[566px] xl:h-[220px]">
        <Image src="/images/all-performances.svg" alt="All Performances" fill />
      </div>
    </div>
  );
};
