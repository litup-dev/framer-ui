"use client";

import Image from "next/image";
import { format, getDate } from "date-fns";
import { ko } from "date-fns/locale";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";

import { Description, Subtitle } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { performaceAttendByIdOptions } from "@/app/feature/club/query-options";

interface ScheduleEvent {
  id: number;
  date: Date;
  time: string;
  entry: string;
  title: string;
  description: string;
  isAttend: boolean;
}

interface ClubDetailScheduleProps {
  events: ScheduleEvent[];
  clubId: number;
  month: string;
}

const ClubDetailSchedule = ({
  events,
  clubId,
  month,
}: ClubDetailScheduleProps) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { mutate } = useMutation(
    performaceAttendByIdOptions(clubId, month, queryClient)
  );

  console.log(session, "<<<<");
  const handleAttend = (id: number) => {
    if (!session) {
      alert("로그인 후 이용해주세요");
      return;
    }
    mutate(id);
  };

  const groupedEvents = events.reduce((acc, event) => {
    const dateKey = format(event.date, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, ScheduleEvent[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedEvents).map(([dateKey, events]) => {
        const firstEvent = events[0];
        const dayOfWeek = format(firstEvent.date, "EEEE", { locale: ko });
        const day = getDate(firstEvent.date);

        return (
          <div
            key={dateKey}
            className="border rounded-lg py-5 px-4 space-y-4 lg:space-y-8"
          >
            {events.map((event, eventIndex) => (
              <div key={eventIndex} className="flex gap-4 items-center">
                <div className="w-10 lg:w-16 flex-shrink-0 flex items-center justify-center flex-col gap-0.5">
                  {eventIndex === 0 && (
                    <>
                      <Subtitle className="text-black text-[11px] sm:text-[12px] leading-tight text-left">
                        {dayOfWeek}
                      </Subtitle>
                      <Subtitle className="text-[28px] sm:text-[32px]">
                        {day}
                      </Subtitle>
                    </>
                  )}
                </div>
                <div className="flex-1 flex flex-col lg:flex-row gap-3 lg:gap-6">
                  <div className="flex flex-col justify-center border-l-2 border-gray pl-4 space-y-1.5 lg:min-w-[240px] lg:flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-sm text-black-60">
                      <Image
                        src="/images/watch.svg"
                        alt="clock"
                        width={14}
                        height={14}
                      />
                      <Description className="text-[13px] sm:text-[16px]">
                        {event.time}
                      </Description>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-black-60">
                      <Image
                        src="/images/wallet.svg"
                        alt="clock"
                        width={14}
                        height={14}
                      />
                      <Description className="text-[13px] sm:text-[16px] break-words">
                        {event.entry}
                      </Description>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center pl-4 space-y-1.5 lg:border-l-2 lg:border-gray lg:pl-6 lg:flex-1 gap-2">
                    <Subtitle className="text-black text-[15px] sm:text-[18px]">
                      {event.title}
                    </Subtitle>
                    <Description className="text-[13px] sm:text-[16px] text-black-60">
                      {event.description}
                    </Description>
                  </div>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center justify-start">
                  {event.isAttend ? (
                    <div onClick={() => handleAttend(event.id)}>
                      <Button className="lg:hidden w-10 h-10 border-2 border-orange-500 bg-orange-500 rounded flex items-center justify-center hover:bg-orange-600 transition-colors">
                        <Check className="w-5 h-5 text-white" />
                      </Button>
                      <Button
                        className={cn(
                          "hidden lg:flex border-2 border-orange-500 bg-white text-main"
                        )}
                      >
                        <Subtitle className="text-[14px] xl:text-[16px]">
                          기대돼요
                        </Subtitle>
                        <Check />
                      </Button>
                    </div>
                  ) : (
                    <div onClick={() => handleAttend(event.id)}>
                      <Button className="lg:hidden w-10 h-10 border-2 border-orange-500 bg-orange-500 rounded flex items-center justify-center hover:bg-orange-600 transition-colors">
                        <Check className="w-5 h-5 text-white" />
                      </Button>
                      <Button
                        className={cn("hidden lg:flex bg-gray-100 text-black")}
                      >
                        <Subtitle className="text-[14px] xl:text-[16px]">
                          보고 싶어요 +
                        </Subtitle>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ClubDetailSchedule;
