"use client";

import { useRef, useMemo, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { StarDisplay } from "./review-star-display";
import { useClubDetailStore } from "@/app/feature/club/detail/store";
import { Subtitle } from "@/components/shared/typography";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

interface ReviewStep2Props {
  rating: number;
  clubName: string;
  clubImage: string;
}

export const ReviewStep2 = ({
  rating,
  clubName,
  clubImage,
}: ReviewStep2Props) => {
  const {
    reviewContent,
    setReviewContent,
    existingReviewImages,
    newReviewImages,
    addReviewImage,
    removeNewReviewImage,
    removeExistingReviewImage,
  } = useClubDetailStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxImages = 3;

  const newImageUrls = useMemo(() => {
    return newReviewImages.map((image) => URL.createObjectURL(image));
  }, [newReviewImages]);

  useEffect(() => {
    return () => {
      newImageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImageUrls]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const totalImages = existingReviewImages.length + newReviewImages.length;
    const newImages = Array.from(files).slice(0, maxImages - totalImages);
    newImages.forEach((file) => {
      if (file.type.startsWith("image/")) {
        addReviewImage(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  const totalImageCount = existingReviewImages.length + newReviewImages.length;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="px-5 py-8 lg:pt-0 lg:px-12 space-y-6 lg:space-y-8 w-full h-full flex flex-col">
        <div className="flex items-center gap-3 w-full">
          {clubImage && getImageUrl(clubImage) && (
            <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
              <Image
                src={getImageUrl(clubImage)!}
                alt={clubName || "클럽"}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          )}
          <div className="flex items-center gap-2 flex-1 justify-between min-w-0">
            <Subtitle className="text-[16px] truncate">{clubName}</Subtitle>
            <StarDisplay rating={rating} size="sm" />
          </div>
        </div>

        <Separator />
        <div className="flex flex-col gap-3 lg:gap-6">
          <div className="text-subtitle-16">사진 첨부</div>
          <div className="flex gap-3">
            {existingReviewImages.map((imageUrl, index) => (
              <div
                key={`existing-${index}`}
                className="relative w-16 h-16 lg:w-20 lg:h-20 rounded flex-shrink-0"
              >
                <div className="absolute inset-0 rounded overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={`Existing review image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeExistingReviewImage(index)}
                  className="absolute top-0 right-0 w-7 h-7 bg-main rounded-full flex items-center justify-center text-white text-[14px]"
                >
                  123
                </button>
              </div>
            ))}
            {newReviewImages.map((image, index) => (
              <div
                key={`new-${index}`}
                className="relative w-16 h-16 lg:w-20 lg:h-20 rounded flex-shrink-0"
              >
                <div className="absolute inset-0 rounded overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={newImageUrls[index]}
                    alt={`Review image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeNewReviewImage(index)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-main rounded-full flex items-center justify-center text-white text-[14px] leading-none"
                >
                  ×
                </button>
              </div>
            ))}
            {totalImageCount < maxImages && (
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
                  className="w-20 h-20 bg-[#F5F5F5] border-gray-300 rounded flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <span className="text-2xl text-gray-400">+</span>
                </div>
              </>
            )}
          </div>
        </div>
        <Separator className="" />

        <div className="flex flex-col gap-3 lg:gap-6 flex-1">
          <div className="text-subtitle-16">내용 작성</div>
          <Textarea
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="내용을 입력하세요."
            className="w-full flex-1 p-4 min-h-[320px] border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-main text-[15px] placeholder:text-[15px] lg:text-[16px] lg:placeholder:text-[16px]"
          />
        </div>
      </div>
    </div>
  );
};
