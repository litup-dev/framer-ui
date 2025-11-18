"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

import { CalendarEvent } from "@/components/shared/calendar/types";
import { Description, Subtitle, Title } from "@/components/shared/typography";
import FadeIn from "@/components/shared/fade-in";

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
              {events.map((event, index) => (
                <div key={event.id || index} className="flex">
                  <div className="flex-1 flex flex-col gap-3 sm:gap-4 md:gap-5 relative">
                    <div className="absolute left-0 top-0 w-1.5 h-1.5 bg-black rounded-full mt-1.5" />
                    <div className="pl-5 flex flex-col gap-3 sm:gap-4 h-full justify-between">
                      <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
                        <Title className="text-black text-[12px] sm:text-[14px] md:text-[16px]">
                          오후 6시 - 오후 8시
                        </Title>

                        <div className="flex flex-col gap-1.5 sm:gap-2">
                          <Subtitle className="text-black text-[15px] sm:text-[16px] md:text-[20px]">
                            {event.venue}
                          </Subtitle>

                          {event.artists.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {event.artists.map((artist, artistIndex) => (
                                <div
                                  key={artistIndex}
                                  className="px-3 py-1.5 bg-gray"
                                >
                                  <Subtitle className="text-black text-[12px] sm:text-[13px] md:text-[14px]">
                                    {artist}
                                  </Subtitle>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-black-60" />
                        <Title className="text-black-60 text-[12px] sm:text-[14px] md:text-[16px]">
                          {event.venue}
                        </Title>
                      </div>
                    </div>
                  </div>

                  {event.image && (
                    <div className="flex-shrink-0 w-[90px] h-[113px] sm:w-[133px] sm:h-[166px] md:w-[160px] md:h-[200px] relative bg-gray overflow-hidden transition-all duration-300 ease-in-out">
                      <Image
                        src={event.image}
                        alt={event.venue}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
};
