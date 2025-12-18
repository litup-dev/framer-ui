"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import useKakaoLoader from "@/lib/kakao-map-loader";
import {
  parseDateKey,
  extractTimeFromISO,
  formatEntryPrice,
} from "@/lib/date-utils";

import {
  getClubByIdOptions,
  getReviewByIdOptions,
  getClubDetailCalendarByIdOptions,
} from "@/app/feature/club/query-options";
import { ClubDetail, ReviewResponse, Review } from "@/app/feature/club/types";
import { useClubDetailStore } from "@/app/feature/club/detail/store";

import {
  ClubDetailHeader,
  ClubDetailInfo,
  ClubDetailDescription,
  ClubDetailScheduleHeader,
  ClubDetailSchedule,
} from "@/app/feature/club/detail/components";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";
import ClubDetailReview from "@/app/feature/club/detail/components/club-detail-review";
import ClubDetailFloating from "@/app/feature/club/detail/components/club-detail-floating";

interface ClubDetailContentProps {
  id: string;
}

const ClubDetailContent = ({ id }: ClubDetailContentProps) => {
  useKakaoLoader();

  const { isReviewModalOpen } = useClubDetailStore();
  const { data } = useQuery<ClubDetail>(getClubByIdOptions(id));
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const currentMonth = useMemo(
    () => format(selectedMonth, "yyyy-MM"),
    [selectedMonth]
  );
  const { data: calendarData } = useQuery({
    ...getClubDetailCalendarByIdOptions(Number(id), currentMonth),
  });
  const { data: reviewsData } = useQuery<ReviewResponse>(
    getReviewByIdOptions(id)
  );

  const images = data?.data?.images || [];
  const mainImageObj = images.find((img) => img.isMain) || images[0];
  const mainImagePath = mainImageObj?.filePath;
  const mainImage = getImageUrl(mainImagePath);

  const overlayImageObj =
    images.find((img) => img.id !== mainImageObj?.id) || images[1] || images[0];
  const overlayImagePath = overlayImageObj?.filePath;
  const overlayImage = getImageUrl(overlayImagePath);

  const events = useMemo(() => {
    if (!calendarData) return [];

    const scheduleEvents: Array<{
      id: number;
      date: Date;
      time: string;
      entry: string;
      title: string;
      description: string;
      isAttend: boolean;
    }> = [];

    Object.entries(calendarData).forEach(([dateKey, performances]) => {
      if (!Array.isArray(performances)) {
        return;
      }

      performances.forEach((performance) => {
        const eventDate = parseDateKey(dateKey);
        const timeStr = extractTimeFromISO(performance.performDate);
        const entryStr = formatEntryPrice(
          performance.bookingPrice,
          performance.onsitePrice
        );

        scheduleEvents.push({
          id: performance.id,
          date: eventDate,
          time: timeStr,
          entry: entryStr,
          title: performance.title,
          description: performance.description,
          isAttend: performance.isAttend,
        });
      });
    });

    return scheduleEvents;
  }, [calendarData]);

  const reviews: Review[] = reviewsData?.data ? [reviewsData.data] : [];

  if (!data?.data) return null;

  return (
    <div className="w-screen">
      <ClubDetailHeader
        mainImage={mainImage}
        overlayImage={overlayImage}
        clubName={data.data.name}
      />

      <div>
        <div className="flex flex-col xl:flex-row xl:items-stretch">
          <div className="flex flex-col flex-1 xl:flex-[5]">
            <div id="info" className="flex flex-col py-6 sm:py-8 lg:py-10">
              <ClubDetailInfo
                id={id}
                name={data.data.name}
                description={data.data.description || "description"}
                address={data.data.address}
              />
              <div className="xl:hidden">
                <ClubDetailDescription data={data.data} />
              </div>
            </div>

            <div
              id="schedule"
              className="py-5 space-y-5 px-5 sm:px-10 lg:px-15"
            >
              <ClubDetailScheduleHeader
                currentMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
              <ClubDetailSchedule
                events={events}
                clubId={Number(id)}
                month={currentMonth}
              />
            </div>

            <div id="review" className="space-y-5 px-5 sm:px-10 lg:px-15">
              <ClubDetailReview data={data.data} reviews={reviews} />
            </div>
          </div>

          <div className="hidden xl:flex xl:flex-[3] bg-gray xl:sticky xl:top-0 xl:self-start xl:h-screen xl:overflow-y-auto">
            <ClubDetailDescription data={data.data} />
          </div>
        </div>
      </div>

      {!isReviewModalOpen && <ClubDetailFloating />}
    </div>
  );
};

export default ClubDetailContent;
