"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useHomeStore } from "@/app/feature/home/store/home-store";

const HomeCharacterImage = () => {
  const { selectedMobileBottomNavigation } = useHomeStore();
  const isCalendarTab = selectedMobileBottomNavigation === "calendar";

  return (
    <Image
      src="/images/main-characters.png"
      alt="main-image"
      width={1611}
      height={1230}
      priority
      className={cn(
        "absolute pointer-events-none select-none h-auto right-[20px] top-[64px] w-[210px] min-[744px]:right-[40px] min-[744px]:top-[56px] min-[744px]:w-[400px] min-[1024px]:right-[60px] min-[1024px]:top-[30px] min-[1024px]:w-[520px] min-[1280px]:top-[-36px] min-[1280px]:w-[640px] min-[1536px]:right-[80px] min-[1536px]:top-[-22px] min-[1536px]:w-[760px] min-[1600px]:top-[-40px] min-[1600px]:w-[800px] min-[1920px]:top-[-44px] min-[1920px]:w-[820px]",
        isCalendarTab && "hidden md:block",
      )}
    />
  );
};

export default HomeCharacterImage;
