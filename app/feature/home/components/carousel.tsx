"use client";

import Image from "next/image";
import Link from "next/link";

import { eventPosters } from "@/app/feature/home/mock";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const MobileCarouselCards = () => {
  return (
    <div className="grid grid-cols-2 gap-4 md:hidden">
      {eventPosters.map((poster) => (
        <Link key={poster.id} href={`/performance/${poster.id}`}>
          <Card className="overflow-hidden" data-hero-key={poster.id}>
            <div className="aspect-[3/4] relative">
              <Image
                src={poster.image}
                alt={poster.title}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
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
      ))}
    </div>
  );
};

const DesktopCarouselCards = () => {
  return (
    <Carousel
      className="w-full hidden md:block"
      opts={{
        align: "start",
      }}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {eventPosters.map((poster) => (
          <CarouselItem key={poster.id} className="pl-2 sm:pl-4 sm:basis-1/5">
            <Link href={`/performance/${poster.id}`}>
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
  );
};

const CarouselCards = () => {
  return (
    <div>
      <MobileCarouselCards />
      <DesktopCarouselCards />
    </div>
  );
};

export default CarouselCards;
