"use client";

import { eventPosters } from "@/app/feature/home/mock";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const AllItemsGrid = () => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {eventPosters.map((poster) => (
        <Link key={poster.id} href={`/performance/${poster.id}`}>
          <Card className="overflow-hidden" data-hero-key={poster.id}>
            <div className="aspect-[3/4] relative">
              <Image
                src={poster.image}
                alt={poster.title}
                fill
                sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
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

export default AllItemsGrid;
