"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { format, getDate } from "date-fns";
import { ko } from "date-fns/locale";
import { Check, ChevronRightIcon, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";
import { useCommonModalStore } from "@/store/common-modal-store";
import { Description, Subtitle } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { performaceAttendByIdOptions } from "@/app/feature/club/query-options";
import Link from "next/link";

interface ScheduleEvent {
  id: number;
  artists: { name: string }[] | null;
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

function groupEventsByDate(events: ScheduleEvent[]) {
  return events.reduce(
    (acc, event) => {
      const dateKey = format(event.date, "yyyy-MM-dd");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    },
    {} as Record<string, ScheduleEvent[]>,
  );
}

function EventDateCell({
  dayOfWeek,
  day,
  isVisible,
}: {
  dayOfWeek: string;
  day: number;
  isVisible: boolean;
}) {
  return (
    <div className="flex w-10 shrink-0 items-center justify-center lg:w-16">
      {isVisible ? (
        <div className="flex flex-col items-center sm:gap-0.5">
          <Subtitle className="text-[11px] sm:text-[12px] text-black/80">
            {dayOfWeek}
          </Subtitle>
          <Subtitle className="text-[28px] sm:text-[32px] leading-none">
            {day}
          </Subtitle>
        </div>
      ) : (
        <div className="min-h-0" aria-hidden />
      )}
    </div>
  );
}

function EventTimeEntry({
  time,
  entry,
  isFirstInDay,
}: {
  time: string;
  entry: string;
  isFirstInDay: boolean;
}) {
  const hasMultipleParts = entry.includes(" / ");
  const entryParts = hasMultipleParts
    ? entry.split(" / ").filter(Boolean)
    : [entry];

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] gap-x-1.5 gap-y-1.5 items-start pl-4 sm:pl-6 lg:min-w-[240px] lg:shrink-0 lg:place-content-center text-black/80",
        isFirstInDay
          ? "border-l border-gray-200"
          : "sm:border-l sm:border-gray-200",
      )}
    >
      <Image
        src="/images/watch.svg"
        alt=""
        width={20}
        height={20}
        className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0"
      />
      <Description className="text-[13px] sm:text-[16px]">{time}</Description>
      <Image
        src="/images/wallet.svg"
        alt=""
        width={20}
        height={20}
        className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0"
      />
      <div className="flex flex-col gap-0.5 min-w-0">
        {entryParts.map((part) => (
          <Description
            key={part}
            className="text-[13px] sm:text-[16px] text-left leading-tight"
          >
            {part}
          </Description>
        ))}
      </div>
    </div>
  );
}

function EventTitleArtists({
  title,
  artists,
  id,
}: {
  title: string;
  artists: ScheduleEvent["artists"];
  id: number;
}) {
  const artistNames = artists?.map((a) => a.name).join(", ") ?? "";

  return (
    <Link href={`/performance/${id}`}>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 justify-center pl-4 sm:pl-6 min-h-0 lg:min-w-0 lg:border-l lg:border-gray-200 lg:pl-6">
        <Subtitle className="text-[15px] sm:text-[18px]">{title}</Subtitle>
        <div className="flex items-center gap-0.5">
          <Description className="text-[14px] sm:text-[16px] text-black/60">
            {artistNames}
          </Description>
          <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-black/60 shrink-0" />
        </div>
      </div>
    </Link>
  );
}

function AttendButton({
  isAttend,
  isPast,
  onClick,
}: {
  isAttend: boolean;
  isPast: boolean;
  onClick: () => void;
}) {
  const attendLabel = isPast
    ? "관람했어요"
    : isAttend
      ? "기대돼요"
      : "보고 싶어요";
  return (
    <div
      onClick={onClick}
      className="flex shrink-0 flex-col items-center justify-start"
    >
      {isAttend ? (
        <>
          <Button className="lg:hidden w-9 h-9 shrink-0 border-2 border-main bg-main rounded flex items-center justify-center hover:bg-main/90 transition-colors">
            <Check className="w-5 h-5 text-white" />
          </Button>
          <Button className="hidden lg:flex border-2 border-main bg-white text-main hover:bg-main hover:text-white">
            <Subtitle className="text-[14px] xl:text-[16px] group-hover:text-white transition-colors">
              {attendLabel}
            </Subtitle>
            <Check className="w-5 h-5 text-main group-hover:text-white transition-colors" />
          </Button>
        </>
      ) : (
        <>
          <Button className="group lg:hidden w-9 h-9 shrink-0 bg-gray rounded flex items-center justify-center hover:bg-main transition-colors hover:text-white">
            <Plus className="w-5 h-5 text-black group-hover:text-white transition-colors" />
          </Button>
          <Button className="hidden lg:flex bg-gray hover:bg-main hover:text-white">
            <Subtitle className="text-[14px] xl:text-[16px] group-hover:text-white transition-colors text-black">
              보고 싶어요
            </Subtitle>
            <Plus className="w-5 h-5 text-black group-hover:text-white transition-colors" />
          </Button>
        </>
      )}
    </div>
  );
}

export default function ClubDetailSchedule({
  events,
  clubId,
  month,
}: ClubDetailScheduleProps) {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useCurrentUser();
  const { openModal: openCommonModal } = useCommonModalStore();
  const router = useRouter();
  const { mutate } = useMutation(
    performaceAttendByIdOptions(clubId, month, queryClient),
  );

  const handleAttend = (id: number) => {
    if (!isAuthenticated) {
      openCommonModal({
        description:
          "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?",
        confirmButton: {
          label: "확인",
          onClick: () => {
            router.push("/login");
          },
        },
        cancelButton: {
          label: "취소",
          onClick: () => {},
        },
      });
      return;
    }
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["performHistory", user?.publicId],
        });
      },
    });
  };

  const groupedEvents = groupEventsByDate(events);

  function isPerformPast(date: Date, time: string) {
    console.log("isPerformPast called with date:", date, "and time:", time);
    const [hours, minutes] = time.split(":").map(Number);
    const performDateTime = new Date(date);
    performDateTime.setHours(hours, minutes, 0, 0);
    return performDateTime < new Date();
  }

  if (events.length === 0 || Object.keys(groupedEvents).length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Description className="text-black-60 text-[14px] sm:text-[16px]">
          공연 일정이 없습니다.
        </Description>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedEvents).map(([dateKey, dayEvents]) => {
        const firstEvent = dayEvents[0];
        const dayOfWeek = format(firstEvent.date, "EEEE", { locale: ko });
        const day = getDate(firstEvent.date);

        return (
          <div
            key={dateKey}
            className="border rounded-lg py-5 px-4 space-y-4 lg:space-y-8"
          >
            {dayEvents.map((event, eventIndex) => (
              <div
                key={event.id}
                className="relative flex gap-4 items-start pr-12 lg:items-center lg:pr-0"
              >
                <EventDateCell
                  dayOfWeek={dayOfWeek}
                  day={day}
                  isVisible={eventIndex === 0}
                />
                <div className="flex flex-1 flex-col gap-3 min-w-0 lg:flex-row lg:gap-6 lg:items-center">
                  <EventTimeEntry
                    time={event.time}
                    entry={event.entry}
                    isFirstInDay={eventIndex === 0}
                  />
                  <EventTitleArtists
                    title={event.title}
                    artists={event.artists}
                    id={event.id}
                  />
                </div>
                <div className="absolute top-0 right-0 flex justify-end lg:static lg:top-auto lg:right-auto lg:shrink-0">
                  <AttendButton
                    isAttend={event.isAttend}
                    onClick={() => handleAttend(event.id)}
                    isPast={isPerformPast(event.date, event.time)}
                  />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
