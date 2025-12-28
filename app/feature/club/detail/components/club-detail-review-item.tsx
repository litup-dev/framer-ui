"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import { useClubDetailStore } from "@/app/feature/club/detail/store";

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

interface ClubDetailReviewItemProps {
  review: ReviewItem;
}

const ClubDetailReviewItem = ({ review }: ClubDetailReviewItemProps) => {
  const { openImageGallery } = useClubDetailStore();

  const handleImageClick = (index: number) => {
    if (review.images.length > 0) {
      openImageGallery(review.images, index);
    }
  };
  return (
    <div className="space-y-3 py-4 border-b">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
        <div className="flex-1 text-subtitle-14">{review.user.name}</div>
        <div className="flex items-center text-description-14">
          <Image
            src="/images/review_rate.svg"
            alt="rating"
            width={16}
            height={16}
            className="pb-1"
          />
          <span>{review.rating}</span>
        </div>
      </div>
      <div className="text-description-14">{review.content}</div>
      <div className="flex justify-end text-description-14 text-black-40">
        더보기
      </div>
      {review.images.length > 0 && (
        <div className="flex gap-2">
          {review.images.map((image, index) => (
            <button
              key={`${review.id}-image-${index}-${image}`}
              onClick={() => handleImageClick(index)}
              className="relative w-[110px] h-[140px] bg-gray-200 rounded flex-shrink-0 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Image
                src={image}
                alt={`Review image ${index + 1}`}
                fill
                className="object-cover"
                sizes="110px"
              />
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {review.tags.map((tag, index) => (
          <span
            key={`${review.id}-tag-${index}-${tag}`}
            className="p-2 w-fit bg-white border rounded-[3px] text-subtitle-14"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-subtitle-12 text-black-40">
        <div className="flex gap-1 text-description-12">
          <div>작성: {review.createdAt}</div>
          <div>수정: {review.updatedAt}</div>
        </div>
        <button className="flex items-center gap-0.5 hover:opacity-70 ">
          <span>신고</span>
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ClubDetailReviewItem;
