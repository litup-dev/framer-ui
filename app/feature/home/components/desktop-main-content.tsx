"use client";

import { eventPosters } from "@/app/feature/home/mock";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Subtitle } from "@/components/shared/typography";
import CharacterSection from "@/app/feature/home/components/character-section";

interface DesktopMainContentProps {
  showAllItems: boolean;
}

const DesktopMainContent = ({ showAllItems }: DesktopMainContentProps) => {
  if (showAllItems) {
    return (
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {eventPosters.map((poster) => (
          <Link key={poster.id} href={`/home/detail/${poster.id}`}>
            <Card
              className="overflow-hidden gap-3 pb-2"
              data-hero-key={poster.id}
            >
              <div className="aspect-[3/4] relative">
                <Image
                  src={poster.image}
                  alt={poster.title}
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="flex flex-col justify-start truncate gap-2.5">
                <Subtitle>{poster.label}</Subtitle>
                <Subtitle>{poster.title}</Subtitle>
                <p className="text-chip-14 2xl:text-chip-16">
                  {poster.artists}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full hidden md:block">
      <Carousel
        className="w-full relative z-10"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {eventPosters.map((poster) => (
            <CarouselItem
              key={poster.id}
              className="pl-2 sm:pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <Link href={`/home/detail/${poster.id}`}>
                <Card className="overflow-hidden" data-hero-key={poster.id}>
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={poster.image}
                      alt={poster.title}
                      fill
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex flex-col justify-start">
                    <h3 className="text-gray-400 text-[16px] font-medium mb-1 truncate">
                      {poster.label}
                    </h3>
                    <p className="font-bold text-[20px] text-[#202020] mb-1 truncate">
                      {poster.title}
                    </p>
                    <p className="font-normal text-[14px] text-gray-400">
                      {poster.artists}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default DesktopMainContent;
