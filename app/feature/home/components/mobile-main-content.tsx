"use client";

import { eventPosters } from "@/app/feature/home/mock";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Description, Subtitle } from "@/components/shared/typography";
import { Calendar } from "@/components/ui/calendar";

interface MobileMainContentProps {
  selectedMobileBottomNavigation: "home" | "calendar";
}

const MobileMainContent = ({
  selectedMobileBottomNavigation,
}: MobileMainContentProps) => {
  if (selectedMobileBottomNavigation === "home") {
    return (
      <div className="grid grid-cols-2 gap-2 md:hidden">
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
              <CardContent className="flex flex-col justify-start">
                <Subtitle className="truncate text-subtitle-16">
                  {poster.title}
                </Subtitle>
                <Description>{poster.artists}</Description>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="md:hidden -mx-5">
      <Calendar className="w-full" />
    </div>
  );
};

export default MobileMainContent;
