"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { CalendarEvent } from "@/components/shared/calendar/types";
import { Description, Subtitle, Title } from "@/components/shared/typography";
import FadeIn from "@/components/shared/fade-in";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

const DEFAULT_IMAGE = "/images/poster1.png";

const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  if (url.startsWith("/")) return true;
  if (url.startsWith("http://") || url.startsWith("https://")) return true;
  return false;
};

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
      <div className="xl:hidden w-full bg-white pt-10">
        <div className="px-5">
          {!selectedDate || events.length === 0 ? (
            <Description className="text-black text-[14px] text-center text-black-40">
              날짜를 선택하세요.
            </Description>
          ) : (
            <div className="space-y-6 sm:space-y-12">
              {events.map((event, eventIndex) =>
                event.performances?.map((performance, performanceIndex) => {
                  const performDate = new Date(performance.performDate);
                  const timeString = format(performDate, "a h시", {
                    locale: ko,
                  });

                  const mainImage = performance.images?.find(
                    (img) => img.isMain,
                  );
                  const imageUrl = mainImage?.filePath
                    ? isValidImageUrl(mainImage.filePath)
                      ? getImageUrl(mainImage.filePath) || DEFAULT_IMAGE
                      : DEFAULT_IMAGE
                    : DEFAULT_IMAGE;

                  return (
                    <div
                      key={`${event.id}-${performance.id}-${performanceIndex}`}
                      className="flex"
                    >
                      <div className="flex-1 flex flex-col gap-3 sm:gap-4 md:gap-5 relative">
                        <div className="absolute left-0 top-0 w-1.5 h-1.5 bg-black rounded-full mt-[2.5px]" />
                        <div className="pl-5 flex flex-col gap-3 sm:gap-4 h-full justify-between">
                          <div className="flex flex-col gap-4 sm:gap-4 md:gap-5">
                            <Subtitle className="text-black text-[12px] sm:text-[14px] md:text-[16px]">
                              {timeString}
                            </Subtitle>

                            <div className="flex flex-col gap-1.5 sm:gap-2">
                              <Subtitle className="text-black text-[15px] sm:text-[16px] md:text-[20px]">
                                {performance.title}
                              </Subtitle>

                              {performance.artists &&
                                performance.artists.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {performance.artists.map(
                                      (artist, artistIndex) => (
                                        <div
                                          key={artistIndex}
                                          className="px-3 py-1.5 bg-gray"
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
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-black-60" />
                            <Title className="text-black-60 text-[12px] sm:text-[14px] md:text-[16px]">
                              {event.clubName}
                            </Title>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 w-[90px] h-[113px] sm:w-[133px] sm:h-[166px] md:w-[160px] md:h-[200px] relative bg-gray overflow-hidden transition-all duration-300 ease-in-out">
                        <Image
                          src={imageUrl}
                          alt={performance.title || "Performance image"}
                          fill
                          sizes="(max-width: 640px) 90px, (max-width: 768px) 133px, 160px"
                          className="object-cover"
                        />
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
