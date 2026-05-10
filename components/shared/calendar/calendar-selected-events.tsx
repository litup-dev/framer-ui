"use client";

import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { CalendarEvent } from "@/components/shared/calendar/types";
import { Description, Subtitle } from "@/components/shared/typography";
import FadeIn from "@/components/shared/fade-in";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";
import Link from "next/link";

const DEFAULT_IMAGE = "/images/poster_default.png";

interface CalendarSelectedEventsProps {
  selectedDate: Date | null;
  events: CalendarEvent[];
}

export const CalendarSelectedEvents = ({
  selectedDate,
  events,
}: CalendarSelectedEventsProps) => {
  return (
    <FadeIn>
      <div className="xl:hidden w-full bg-white pt-10 md:pt-11 lg:pt-20">
        <div className="px-5 md:px-10 lg:px-15">
          {!selectedDate || events.length === 0 ? (
            <Description className="text-black text-[14px] text-center text-black-40">
              날짜를 선택하세요.
            </Description>
          ) : (
            <div className="space-y-10 sm:space-y-12 lg:space-y-[60px]">
              {events.map((event, eventIndex) =>
                event.performances?.map((performance, performanceIndex) => {
                  const performDate = new Date(performance.performDate);
                  const timeString = format(performDate, "a h시", {
                    locale: ko,
                  });

                  const mainImage = performance.images?.find(
                    (img) => img.isMain,
                  );
                  const imageUrl =
                    getImageUrl(mainImage?.filePath) || DEFAULT_IMAGE;

                  return (
                    <div
                      key={`${event.id}-${performance.id}-${performanceIndex}`}
                      className="flex gap-2 items-stretch"
                    >
                      <div className="flex-1 flex flex-col justify-between relative">
                        <div className="flex flex-col gap-3 md:gap-4 lg:gap-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 bg-[#171717] rounded-full shrink-0" />
                            <Subtitle className="text-[#171717] text-[12px] md:text-[14px] lg:text-[16px]">
                              {timeString}
                            </Subtitle>
                          </div>

                          <div className="pl-4 flex flex-col gap-1.5 md:gap-2 lg:gap-2.5">
                            <Link href={`/performance/${performance.id}`}>
                              <Subtitle className="text-[#171717] text-[15px] md:text-[16px] lg:text-[20px] leading-[1.2]">
                                {performance.artists
                                  ?.map((a) => a.name)
                                  .join(", ")}
                              </Subtitle>
                            </Link>

                            {performance.artists &&
                              performance.artists.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {performance.artists.map(
                                    (artist, artistIndex) => (
                                      <div
                                        key={artistIndex}
                                        className="px-2 md:px-[9px] lg:px-[11px] py-1.5 md:py-[7px] lg:py-2 rounded-[2px] md:rounded-[3px] bg-[rgba(23,23,23,0.05)]"
                                      >
                                        <Subtitle className="text-[#171717] text-[12px] md:text-[13px] lg:text-[14px]">
                                          {artist.name}
                                        </Subtitle>
                                      </div>
                                    ),
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                        <Link href={`/club/${event.id}`}>
                          <div className="flex items-center gap-0.5 md:gap-0 pl-[11px] md:pl-[10px] lg:pl-[9px]">
                            <Image
                              src="/images/list-location.png"
                              alt="location"
                              width={28}
                              height={28}
                              className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                            />
                            <p className="font-medium tracking-[-0.04em] leading-percent text-[#20202080] text-[12px] md:text-[14px] lg:text-[16px]">
                              {event.clubName}
                            </p>
                          </div>
                        </Link>
                      </div>

                      <div className="flex-shrink-0 w-[90px] h-[113px] md:w-[133px] md:h-[166px] lg:w-[160px] lg:h-[200px] relative bg-gray overflow-hidden transition-all duration-300 ease-in-out">
                        <Link href={`/performance/${performance.id}`}>
                          <Image
                            src={imageUrl}
                            alt="Performance image"
                            fill
                            sizes="(max-width: 743px) 90px, (max-width: 1023px) 133px, 160px"
                            className="object-cover"
                          />
                        </Link>
                      </div>
                    </div>
                  );
                }),
              )}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
};
