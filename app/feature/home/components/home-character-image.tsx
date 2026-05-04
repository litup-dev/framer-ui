"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useHomeStore } from "@/app/feature/home/store/home-store";

const HomeCharacterImage = () => {
  const { selectedMobileBottomNavigation } = useHomeStore();
  const isCalendarTab = selectedMobileBottomNavigation === "calendar";

  return (
    <Image
      src="/images/main-character.png"
      alt="main-image"
      width={1092}
      height={1092}
      className={cn(
        "absolute right-0 -z-10 pointer-events-none select-none top-[37px] min-[744px]:top-[72px] min-[1024px]:top-[-34px] min-[1280px]:top-[-34px] min-[1600px]:top-[-82px] min-[1600px]:right-[-24px] w-[155px] h-[155px] min-[744px]:w-[366px] min-[744px]:h-[366px] min-[1024px]:w-[592px] min-[1024px]:h-[592px] min-[1280px]:w-[782px] min-[1280px]:h-[782px] min-[1600px]:w-[1092px] min-[1600px]:h-[1092px]",
        isCalendarTab && "hidden md:block",
      )}
    />
  );
};

export default HomeCharacterImage;
