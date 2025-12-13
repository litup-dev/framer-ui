"use client";

import { parse, getDate, isToday } from "date-fns";
import { CalendarEvent } from "@/components/shared/calendar/types";
import { Description, Subtitle } from "@/components/shared/typography";
import Image from "next/image";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

const DEFAULT_IMAGE = "/images/poster1.png";

const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  if (url.startsWith("/")) return true;
  if (url.startsWith("http://") || url.startsWith("https://")) return true;
  return false;
};

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
    0
  );

  return (
    <div className="flex gap-2.5 justify-between ">
      <div className="flex flex-col gap-4 flex-1">
        <Subtitle
          className={`text-[24px] sm:text-[32px] ${
            isTodayDate ? "text-black" : "text-black/50"
          }`}
        >
          {day}
        </Subtitle>
        <Description
          className={`text-[14px] ${
            isTodayDate ? "text-main" : "text-black/50"
          }`}
        >
          {totalPerformances}개
        </Description>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-x-2.5 md:gap-x-3 gap-y-5 md:gap-y-7 content-start flex-5">
        {events.map((event) =>
          event.performances?.map((performance, performanceIndex) => {
            const mainImage = performance.images?.find((img) => img.isMain);
            const imageUrl = mainImage?.filePath
              ? isValidImageUrl(mainImage.filePath)
                ? getImageUrl(mainImage.filePath) || DEFAULT_IMAGE
                : DEFAULT_IMAGE
              : DEFAULT_IMAGE;

            const artistNames =
              performance.artists?.map((artist) => artist.name).join(", ") ||
              "";

            return (
              <div key={`${event.id}-${performance.id}-${performanceIndex}`}>
                <div className="space-y-2.5">
                  <div className="relative w-full aspect-[94/117] overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={performance.title || "Performance image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 25vw"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Description className="text-[12px] md:text-[14px] text-black/50 truncate">
                      {event.clubName}
                    </Description>
                    <Subtitle className="text-[14px] md:text-[16px] lg:text-[18px] truncate">
                      {performance.title}
                    </Subtitle>
                    {artistNames && (
                      <Description className="text-black text-[12px] md:text-[14px] truncate">
                        {artistNames}
                      </Description>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CalendarDateEventList;
