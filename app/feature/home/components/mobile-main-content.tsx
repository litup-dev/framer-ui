"use client";

import Image from "next/image";
import Link from "next/link";

import { eventPosters } from "@/app/feature/home/mock";
import { Card, CardContent } from "@/components/ui/card";

import { Description, Subtitle } from "@/components/shared/typography";

interface MobileMainContentProps {
  selectedMobileBottomNavigation: "home" | "calendar";
}

const MobileMainContent = ({
  selectedMobileBottomNavigation,
}: MobileMainContentProps) => {
  if (selectedMobileBottomNavigation === "home") {
    return (
      <div className="grid grid-cols-3 gap-x-2.5 gap-y-6 md:hidden">
        {eventPosters.map((poster) => (
          <Link key={poster.id} href={`/home/detail/${poster.id}`}>
            <Card className="overflow-hidden gap-3 pb-2">
              <div className="aspect-[3/4] relative">
                <Image
                  src={poster.image}
                  alt={poster.title}
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="flex flex-col gap-1.5 justify-start">
                <Description className="truncate text-[12px] text-black/60">
                  {poster.title}
                </Description>
                <Subtitle className="truncate text-[14px]">
                  {poster.artists}
                </Subtitle>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  }
};

export default MobileMainContent;
