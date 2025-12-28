"use client";

import { useRef, useMemo, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { StarDisplay } from "./review-star-display";
import { useClubDetailStore } from "@/app/feature/club/detail/store";

interface ReviewStep2Props {
  rating: number;
}

export const ReviewStep2 = ({ rating }: ReviewStep2Props) => {
  const {
    reviewContent,
    setReviewContent,
    reviewImages,
    addReviewImage,
    removeReviewImage,
  } = useClubDetailStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxImages = 3;

  const imageUrls = useMemo(() => {
    return reviewImages.map((image) => URL.createObjectURL(image));
  }, [reviewImages]);

  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).slice(
      0,
      maxImages - reviewImages.length
    );
    newImages.forEach((file) => {
      if (file.type.startsWith("image/")) {
        addReviewImage(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageRemove = (index: number) => {
    removeReviewImage(index);
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="px-5 py-15 space-y-6 w-full h-full flex flex-col">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded-full flex-shrink-0" />
          <div className="flex items-center gap-2">
            <span className="text-subtitle-18">제비다방</span>
            <StarDisplay rating={rating} size="sm" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-subtitle-16">사진 첨부</div>
          <div className="flex gap-3">
            {reviewImages.map((image, index) => (
              <div
                key={index}
                className="relative w-20 h-20  rounded flex-shrink-0 overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrls[index]}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
            {reviewImages.length < maxImages && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div
                  onClick={handleAddImageClick}
                  className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <span className="text-2xl text-gray-400">+</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <div className="text-subtitle-16">내용 작성</div>
          <Textarea
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="내용을 입력하세요."
            className="w-full flex-1 p-4 min-h-[320px] border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-main"
          />
        </div>
      </div>
    </div>
  );
};
