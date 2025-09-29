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

const CarouselCards = () => {
  return (
    <div>
      <Carousel
        className="w-full max-w-6xl"
        opts={{
          align: "end",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {eventPosters.map((poster) => (
            <CarouselItem key={poster.id} className="pl-2 md:pl-4 md:basis-1/4">
              <div className="p-1">
                <Card className="overflow-hidden">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={poster.image}
                      alt={poster.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-1 truncate">
                      {poster.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">{poster.price}</p>
                    <p className="text-sm text-gray-500">{poster.location}</p>
                  </CardContent>
                </Card>
              </div>
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
