"use client";

import { format } from "date-fns";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Image from "next/image";

import { ClubDetailData } from "@/app/feature/club/types";

import { Chip, Description, Subtitle } from "@/components/shared/typography";
import ClubDetailFacilities from "@/app/feature/club/detail/components/club-detail-facilities";

interface ClubDetailDescriptionProps {
  data: ClubDetailData;
}

const DEFAULT_TIME_MESSAGE = "운영시간을 등록해주세요.";

const LABEL_CLASS =
  "text-[14px] md:text-[16px] w-[80px] md:w-[88px] lg:w-[95px] xl:w-[95px] 2xl:w-[95px] flex-shrink-0 leading-[1.6]";
const VALUE_CLASS =
  "text-[14px] md:text-[16px] flex-1 min-w-0 leading-[1.6]";
const VALUE_COL_CLASS = "flex flex-col flex-1 min-w-0 gap-0";

interface InfoRowProps {
  label: string;
  children: React.ReactNode;
  align?: "center" | "start";
}

const InfoRow = ({ label, children, align = "center" }: InfoRowProps) => (
  <div
    className={`flex bg-gray p-5 md:p-6 xl:bg-transparent xl:p-0 2xl:bg-transparent 2xl:p-0 rounded-[3px] ${
      align === "start" ? "items-start" : "items-center"
    }`}
  >
    <Subtitle className={LABEL_CLASS}>{label}</Subtitle>
    {children}
  </div>
);

const ClubDetailDescription = ({ data }: ClubDetailDescriptionProps) => {
  const formatTime = (time: string | null) => {
    if (!time) return DEFAULT_TIME_MESSAGE;

    if (/^\d{2}:\d{2}$/.test(time)) {
      return time;
    }

    try {
      const date = new Date(time);
      if (isNaN(date.getTime())) {
        return time;
      }
      return format(date, "HH:mm");
    } catch {
      return time;
    }
  };

  return (
    <div className="px-5 sm:px-10 lg:px-15 lg:py-10 xl:pt-[55px] 2xl:px-20 2xl:pt-[62px] xl:mr-0 xl:w-full">
      <div className="flex flex-col lg:flex-row xl:flex-col lg:items-stretch gap-3 md:gap-4 lg:gap-10 xl:gap-14 2xl:gap-20">
        <div className="flex flex-col flex-1 space-y-3 md:space-y-4 lg:space-y-4 xl:space-y-14 2xl:space-y-20 lg:justify-start">
          <InfoRow label="수용인원">
            <Chip className={`${VALUE_CLASS} bg-gray xl:bg-transparent 2xl:bg-transparent`}>
              {data.capacity}명
            </Chip>
          </InfoRow>

          <InfoRow label="운영시간" align="start">
            <div className={`${VALUE_COL_CLASS} bg-gray xl:bg-transparent 2xl:bg-transparent`}>
              <Chip className={VALUE_CLASS}>{formatTime(data.openTime)}</Chip>
              <Chip className={VALUE_CLASS}>{formatTime(data.closeTime)}</Chip>
            </div>
          </InfoRow>

          {data.snsLinks && data.snsLinks.length > 0 && (
            <InfoRow label="SNS">
              <div className="flex-1 min-w-0 bg-gray xl:bg-transparent 2xl:bg-transparent flex gap-1.5">
                {data.snsLinks.map((sns, index) => (
                  <span
                    key={index}
                    onClick={() => window.open(sns.url, "_blank")}
                  >
                    <Description
                      key={index}
                      className={`text-black ${VALUE_CLASS}`}
                    >{`${sns.platform} ↗`}</Description>
                  </span>
                ))}
              </div>
            </InfoRow>
          )}
        </div>

        <div className="flex flex-col  flex-1 space-y-10 lg:space-y-20 xl:space-y-0 lg:justify-between pb-14">
          <div className="flex flex-col gap-4 md:gap-4 xl:gap-6 2xl:gap-6">
            <InfoRow label="위치" align="start">
              <div className={`${VALUE_COL_CLASS} bg-gray xl:bg-transparent 2xl:bg-transparent`}>
                <Chip className={`text-black ${VALUE_CLASS}`}>
                  {data.address}
                </Chip>
              </div>
            </InfoRow>

            <div className="flex bg-gray p-5 md:bg-transparent md:p-0 rounded-[3px] lg:bg-transparent lg:p-0 xl:bg-transparent xl:p-0 2xl:bg-transparent 2xl:p-0">
              <div className="flex-1 min-w-0 h-[200px] md:h-[376px] lg:h-[245px] xl:h-[210px] 2xl:h-[328px] rounded-[3px] overflow-hidden">
                <Map
                  center={{ lat: data.latitude, lng: data.longitude }}
                  className="w-full h-full"
                  draggable={false}
                >
                  <MapMarker
                    position={{ lat: data.latitude, lng: data.longitude }}
                    title={data.name}
                  />
                </Map>
              </div>
            </div>
            {/* <ClubDetailFacilities /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailDescription;
