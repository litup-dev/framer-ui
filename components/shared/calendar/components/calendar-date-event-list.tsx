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
          {events.length}개
        </Description>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-x-2.5 md:gap-x-3 gap-y-5 md:gap-y-7 content-start flex-5">
        {events.map((event) => (
          <div key={event.id}>
            <div className="space-y-2.5">
              {(() => {
                const eventImage = event.image;
                const imageUrl = isValidImageUrl(eventImage)
                  ? getImageUrl(eventImage) || DEFAULT_IMAGE
                  : DEFAULT_IMAGE;

                return (
                  <div className="relative w-full aspect-[94/117] overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={event.clubName || "Event image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 25vw"
                    />
                  </div>
                );
              })()}
              <div className="space-y-1.5">
                <Description className="text-[12px] md:text-[14px] text-black/50 truncate">
                  {event.clubName}
                </Description>
                <Subtitle className="text-[14px] md:text-[16px] lg:text-[18px] truncate">
                  {event.performName}
                </Subtitle>
                <Description className="text-black text-[12px] md:text-[14px] truncate">
                  {event.artists.join(", ")}
                </Description>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarDateEventList;
