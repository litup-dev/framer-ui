"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";

import { ClubDetailData } from "@/app/feature/club/types";
import { Checkbox } from "@/components/ui/checkbox";

import { useClubDetailStore } from "@/app/feature/club/detail/store";
import ClubDetailReviewItem from "@/app/feature/club/detail/components/club-detail-review-item";
import ClubDetailReviewModal from "@/app/feature/club/detail/components/club-detail-review-modal";
import ClubDetailImageGallery from "@/app/feature/club/detail/components/club-detail-image-gallery";

interface ClubDetailReviewProps {
  data: ClubDetailData;
}

interface ReviewItem {
  id: number;
  images: string[];
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    profileImage?: string;
  };
  rating: number;
}

const ClubDetailReview = ({ data }: ClubDetailReviewProps) => {
  const { openReviewModal } = useClubDetailStore();

  const mockReviews: ReviewItem[] = [
    {
      id: 1,
      images: ["/images/club_detail1.png", "/images/club_detail2.png"],
      content:
        "낮에는 카페였다가 밤에는 지하에서 라이브공연을 하는 곳. 밤에는 취한제비로 상호가 바뀐다. 아늑하고 아늑하고 아늑하...",
      tags: ["#새단장", "#조용한 분위기", "#교통편이 편함", "#조용한 분위기"],
      createdAt: "00.00.00 00:00:00",
      updatedAt: "00.00.00 00:00:00",
      user: {
        name: "이름",
      },
      rating: 4.0,
    },
    {
      id: 2,
      images: ["/images/club_detail3.png", "/images/club_detail4.png"],
      content:
        "낮에는 카페였다가 밤에는 지하에서 라이브공연을 하는 곳. 밤에는 취한제비로 상호가 바뀐다. 아늑하고 아늑하고 아늑하...",
      tags: ["#새단장", "#조용한 분위기", "#교통편이 편함", "#조용한 분위기"],
      createdAt: "00.00.00 00:00:00",
      updatedAt: "00.00.00 00:00:00",
      user: {
        name: "이름",
      },
      rating: 4.0,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-main pb-2">
        <div className="flex gap-1 items-center">
          <Image
            src="/images/review.svg"
            alt="공연 일정"
            width={24}
            height={24}
          />
          <div className="text-subtitle-18">리뷰</div>
          <Image
            src="/images/rating.svg"
            alt="공연 일정"
            width={20}
            height={20}
          />
          <div className="text-subtitle-16 text-black-80">
            {data.avgRating ?? 0}
          </div>
        </div>
        <button
          onClick={openReviewModal}
          className="text-subtitle-12 flex items-center gap-1 border px-2.5 py-1.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          작성하기
          <Image
            src="/images/review_write.svg"
            alt="arrow-right"
            width={14}
            height={14}
            className="mb-1"
          />
        </button>
      </div>
      <div className="pt-4 flex justify-between text-description-14">
        <div className="flex items-center gap-1 text-black-80 font-semibold text-[14px]">
          내가 쓴 리뷰 보기
          <Checkbox />
        </div>
        <div className="flex items-center gap-1 text-black-60 font-semibold text-[14px]">
          최신순
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      <div className="pt-4">
        {mockReviews.map((review) => (
          <ClubDetailReviewItem key={review.id} review={review} />
        ))}
      </div>
      <ClubDetailReviewModal />
      <ClubDetailImageGallery />
    </div>
  );
};

export default ClubDetailReview;
