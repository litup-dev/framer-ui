"use client";

import { eventPosters } from "@/app/feature/home/mock";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const CarouselCards = () => {
  return (
    <div>
      <Carousel
        className="w-full"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {eventPosters.map((poster) => (
            <CarouselItem key={poster.id} className="pl-2 md:pl-4 md:basis-1/5">
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

export default CarouselCards;
