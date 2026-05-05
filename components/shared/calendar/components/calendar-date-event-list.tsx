"use client";

import { parse, getDate, isToday } from "date-fns";
import { CalendarEvent } from "@/components/shared/calendar/types";
import { Description, Subtitle } from "@/components/shared/typography";
import Image from "next/image";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";
import Link from "next/link";

const DEFAULT_IMAGE = "/images/poster_default.png";

interface CalendarDateEventListProps {
  dateKey: string;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
}

const CalendarDateEventList = ({
  dateKey,
  events,
}: CalendarDateEventListProps) => {
  const parsedDate = parse(dateKey, "yyyy-MM-dd", new Date());
  const day = getDate(parsedDate);
  const isTodayDate = isToday(parsedDate);

  const totalPerformances = events.reduce(
    (sum, event) => sum + (event.performances?.length || 0),
    0,
  );

  return (
    <div className="flex gap-2.5 md:gap-[93px] lg:gap-[142px] justify-between">
      <div className="flex flex-col gap-4 md:gap-[16px] w-[42px] flex-none pl-[2px]">
        <Subtitle
          className={`text-[24px] sm:text-[32px] md:text-[32px] lg:text-[40px] ${
            isTodayDate ? "text-black" : "text-black/50"
          }`}
        >
          {day}
        </Subtitle>
        <Description
          className={`text-[14px] md:text-[16px] lg:text-[18px] ${
            isTodayDate ? "text-main" : "text-black/50"
          }`}
        >
          {totalPerformances}개
        </Description>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-x-2.5 md:gap-x-[12px] lg:gap-x-4 gap-y-5 md:gap-y-7 lg:gap-y-8 content-start flex-5 md:flex-1 lg:flex-1">
        {events.map((event) =>
          event.performances?.map((performance, performanceIndex) => {
            const mainImage = performance.images?.find((img) => img.isMain);
            const imageUrl = getImageUrl(mainImage?.filePath) || DEFAULT_IMAGE;

            const artistNames =
              performance.artists?.map((artist) => artist.name).join(", ") ||
              "";

            return (
              <div key={`${event.id}-${performance.id}-${performanceIndex}`}>
                <div className="space-y-2.5 md:space-y-[12px] lg:space-y-[14px]">
                  <div className="relative w-full aspect-[94/117] md:aspect-[4/5] overflow-hidden">
                    <Link href={`/performance/${performance.id}`}>
                      <Image
                        src={imageUrl}
                        alt="Performance image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 33vw, 25vw"
                      />
                    </Link>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Link href={`/club/${event.id}`}>
                      <Description className="text-[12px] md:text-[14px] text-black/50 truncate">
                        {event.clubName}
                      </Description>
                    </Link>
                    <Link href={`/performance/${performance.id}`}>
                      <div className="flex flex-col gap-1.5">
                        <Subtitle className="text-[14px] md:text-[16px] lg:text-[18px] truncate">
                          {performance.artists?.map((a) => a.name).join(", ")}
                        </Subtitle>
                        {artistNames && (
                          <Description className="text-black text-[12px] md:text-[14px] truncate">
                            {artistNames}
                          </Description>
                        )}
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
};

export default CalendarDateEventList;
