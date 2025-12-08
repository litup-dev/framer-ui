"use client";

import { useQuery } from "@tanstack/react-query";
import useKakaoLoader from "@/lib/kakao-map-loader";

import { getClubByIdOptions } from "@/app/feature/club/query-options";
import { ClubDetail } from "@/app/feature/club/types";
import { useClubDetailStore } from "@/app/feature/club/detail/store";

import {
  ClubDetailHeader,
  ClubDetailInfo,
  ClubDetailFacilities,
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
  const { isReviewModalOpen } = useClubDetailStore();
  const { data } = useQuery<ClubDetail>(getClubByIdOptions(id));
  useKakaoLoader();

  const images = data?.data?.images || [];
  const mainImageObj = images.find((img) => img.isMain) || images[0];
  const mainImagePath = mainImageObj?.filePath;
  const mainImage = getImageUrl(mainImagePath);

  const overlayImageObj =
    images.find((img) => img.id !== mainImageObj?.id) || images[1] || images[0];
  const overlayImagePath = overlayImageObj?.filePath;
  const overlayImage = getImageUrl(overlayImagePath);

  if (!data?.data) return null;

  const mockEvents = [
    {
      date: new Date(2025, 10, 12),
      time: "18:00 - 19:00",
      entry: "무료입장 / 자율페이",
      title: "6eyes 소음발광 칩앤스위트",
      description: "나고야 포스트 펑크밴드 6eyes 내한 >",
      isBooked: false,
    },
    {
      date: new Date(2025, 10, 12),
      time: "19:00 - 20:00",
      entry: "무료입장 / 자율페이",
      title: "6eyes 소음발광 칩앤스위트",
      description: "나고야 포스트 펑크밴드 6eyes 내한 >",
      isBooked: true,
    },
    {
      date: new Date(2025, 10, 15),
      time: "20:00 - 21:00",
      entry: "무료입장 / 자율페이",
      title: "다른 공연 제목",
      description: "다른 공연 설명 >",
      isBooked: false,
    },
  ];

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
                description={data.data.description}
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
              <ClubDetailScheduleHeader />
              <ClubDetailSchedule events={mockEvents} />
            </div>

            <div id="review" className="space-y-5 px-5 sm:px-10 lg:px-15">
              <ClubDetailReview data={data.data} />
            </div>
          </div>

          <div className="hidden xl:flex xl:flex-[3] bg-gray xl:self-stretch">
            <ClubDetailDescription data={data.data} />
          </div>
        </div>
      </div>

      {!isReviewModalOpen && <ClubDetailFloating />}
    </div>
  );
};

export default ClubDetailContent;
