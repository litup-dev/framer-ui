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
import {
  ClubDetail,
  ReviewPaginatedResponse,
  Review,
} from "@/app/feature/club/types";
import { useClubDetailStore } from "@/app/feature/club/detail/store";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

import {
  ClubDetailHeader,
  ClubDetailInfo,
  ClubDetailDescription,
  ClubDetailScheduleHeader,
  ClubDetailSchedule,
} from "@/app/feature/club/detail/components";
import ClubDetailReview from "@/app/feature/club/detail/components/club-detail-review";
import ClubDetailFloating from "@/app/feature/club/detail/components/club-detail-floating";
import Footer from "@/app/shared/components/footer";

interface ClubDetailContentProps {
  id: string;
}

const ClubDetailContent = ({ id }: ClubDetailContentProps) => {
  useKakaoLoader();

  const { isReviewModalOpen } = useClubDetailStore();
  const { data } = useQuery<ClubDetail>(getClubByIdOptions(id));
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [reviewPage, setReviewPage] = useState(1);
  const [isMine, setIsMine] = useState(false);
  const [sort, setSort] = useState<"-createdAt" | "+createdAt">("-createdAt");
  const reviewLimit = 5;
  const reviewOffset = (reviewPage - 1) * reviewLimit;

  const currentMonth = useMemo(
    () => format(selectedMonth, "yyyy-MM"),
    [selectedMonth]
  );
  const { data: calendarData } = useQuery({
    ...getClubDetailCalendarByIdOptions(Number(id), currentMonth),
  });
  const { data: reviewsData } = useQuery<ReviewPaginatedResponse>(
    getReviewByIdOptions(id, reviewOffset, reviewLimit, isMine, sort)
  );

  const images = data?.data?.images || [];
  const imageUrls = images
    .map((img) => getImageUrl(img.filePath))
    .filter((url): url is string => url !== null);

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

  const reviews: Review[] = reviewsData?.items || [];

  if (!data?.data) return null;

  return (
    <div className="w-screen">
      <ClubDetailHeader images={imageUrls} clubName={data.data.name} />

      <div>
        <div className="flex flex-col xl:flex-row xl:items-stretch">
          <div className="flex flex-col flex-1 xl:flex-[5]">
            <div id="info" className="flex flex-col py-6 sm:py-8 lg:py-10">
              <ClubDetailInfo
                id={id}
                name={data.data.name}
                description={data.data.description || "description"}
                address={data.data.address}
                isFavorite={data.data.isFavorite}
                favoriteCount={data.data.favoriteCount}
                images={data.data.images}
              />
              <div className="xl:hidden">
                <ClubDetailDescription data={data.data} />
              </div>
            </div>

            <div className="space-y-16 sm:space-y-20 xl:space-y-25">
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
                <ClubDetailReview
                  data={data.data}
                  reviews={reviews}
                  total={reviewsData?.total || 0}
                  currentPage={reviewPage}
                  limit={reviewLimit}
                  onPageChange={setReviewPage}
                  isMine={isMine}
                  setIsMine={setIsMine}
                  sort={sort}
                  setSort={setSort}
                />
              </div>
            </div>
          </div>

          <div className="hidden xl:flex xl:flex-[3] bg-gray xl:sticky xl:top-0 xl:self-start xl:h-screen xl:overflow-y-auto">
            <ClubDetailDescription data={data.data} />
          </div>
        </div>
      </div>
      <Footer />

      {!isReviewModalOpen && <ClubDetailFloating />}
    </div>
  );
};

export default ClubDetailContent;
