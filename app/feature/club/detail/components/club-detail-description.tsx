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
  "text-[14px] md:text-[16px] w-[80px] md:w-[88px] flex-shrink-0";
const VALUE_CLASS = "text-[14px] md:text-[16px] flex-1 min-w-0";
const VALUE_COL_CLASS = "flex flex-col flex-1 min-w-0 gap-1";

interface InfoRowProps {
  label: string;
  children: React.ReactNode;
  align?: "center" | "start";
}

const InfoRow = ({ label, children, align = "center" }: InfoRowProps) => (
  <div
    className={`flex bg-gray p-5 md:p-6 rounded-[3px] ${
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
    <div className="px-5 sm:px-10 lg:px-15 lg:py-10 xl:mr-0 xl:w-full">
      <div className="flex flex-col lg:flex-row xl:flex-col lg:items-stretch gap-3 lg:gap-10">
        <div className="flex flex-col flex-1 space-y-3 lg:space-y-4 xl:space-y-10 lg:justify-start">
          <InfoRow label="수용인원">
            <Chip className={`${VALUE_CLASS} bg-gray`}>{data.capacity}명</Chip>
          </InfoRow>

          <InfoRow label="운영시간" align="start">
            <div className={`${VALUE_COL_CLASS} bg-gray`}>
              <Chip>{formatTime(data.openTime)}</Chip>
              <Chip>{formatTime(data.closeTime)}</Chip>
            </div>
          </InfoRow>

          {data.snsLinks && data.snsLinks.length > 0 && (
            <InfoRow label="SNS">
              <div className="flex-1 min-w-0 bg-gray flex gap-5">
                {data.snsLinks.map((sns, index) => (
                  <span
                    key={index}
                    onClick={() => window.open(sns.url, "_blank")}
                  >
                    <Description
                      key={index}
                      className="text-black"
                    >{`${sns.platform} ↗`}</Description>
                  </span>
                ))}
              </div>
            </InfoRow>
          )}
        </div>

        <div className="flex flex-col  flex-1 space-y-10 lg:space-y-20 xl:space-y-0 lg:justify-between pb-14">
          <div className="flex flex-col gap-4">
            <InfoRow label="위치" align="start">
              <div className={`${VALUE_COL_CLASS} bg-gray`}>
                <Chip className="text-black">{data.address}</Chip>
              </div>
            </InfoRow>

            <div className="flex bg-gray p-5 md:p-6 rounded-[3px]">
              <div className="flex-1 min-w-0 h-[300px] md:h-[376px] lg:h-[210px] xl:h-[249px] rounded-[3px] overflow-hidden">
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
