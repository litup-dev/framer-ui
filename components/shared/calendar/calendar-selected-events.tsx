"use client";

import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { CalendarEvent } from "@/components/shared/calendar/types";
import { Description, Subtitle, Title } from "@/components/shared/typography";
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
                      className="flex gap-2"
                    >
                      <div className="flex-1 flex flex-col gap-3 sm:gap-4 md:gap-5 relative">
                        <div className="flex flex-col gap-3 sm:gap-4 h-full justify-between">
                          <div className="flex flex-col gap-3 md:gap-5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-1.5 h-1.5 bg-black rounded-full shrink-0" />
                              <Subtitle className="text-black text-[12px] sm:text-[14px] md:text-[16px]">
                                {timeString}
                              </Subtitle>
                            </div>

                            <div className="pl-4 flex flex-col gap-1.5 sm:gap-2">
                              <Link href={`/performance/${performance.id}`}>
                                <Subtitle className="text-black text-[15px] sm:text-[16px] md:text-[20px]">
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
                                          className="px-2 py-1.5 rounded-[2px] bg-[rgba(23,23,23,0.05)]"
                                        >
                                          <Subtitle className="text-black text-[12px] sm:text-[13px] md:text-[14px]">
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
                            <div className="flex items-center gap-0.5 pl-[11px]">
                              <Image
                                src="/images/list-location.png"
                                alt="location"
                                width={20}
                                height={20}
                                className="w-5 h-5 md:w-4 md:h-4"
                              />
                              <Title className="text-black-60 text-[12px] sm:text-[14px] md:text-[16px]">
                                {event.clubName}
                              </Title>
                            </div>
                          </Link>
                        </div>
                      </div>

                      <div className="flex-shrink-0 w-[90px] h-[113px] sm:w-[133px] sm:h-[166px] md:w-[160px] md:h-[200px] relative bg-gray overflow-hidden transition-all duration-300 ease-in-out">
                        <Link href={`/performance/${performance.id}`}>
                          <Image
                            src={imageUrl}
                            alt="Performance image"
                            fill
                            sizes="(max-width: 640px) 90px, (max-width: 768px) 133px, 160px"
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
