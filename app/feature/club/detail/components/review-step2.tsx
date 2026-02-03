"use client";

import Image from "next/image";
import { useState, useRef, useMemo, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { StarDisplay } from "./review-star-display";
import { useClubDetailStore } from "@/app/feature/club/detail/store";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];

const isValidImageExtension = (fileName: string): boolean => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension ? ALLOWED_IMAGE_EXTENSIONS.includes(extension) : false;
};

interface ReviewStep2Props {
  rating: number;
  clubName?: string;
  clubImage?: string;
}

export const ReviewStep2 = ({
  rating,
  clubName,
  clubImage,
}: ReviewStep2Props) => {
  const imageUrl = clubImage ? getImageUrl(clubImage) : null;
  const [imageSizeError, setImageSizeError] = useState<string | null>(null);
  const [imageExtensionError, setImageExtensionError] = useState<string | null>(
    null
  );
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

    setImageSizeError(null);
    setImageExtensionError(null);

    const totalImages = existingReviewImages.length + newReviewImages.length;
    const slotsLeft = maxImages - totalImages;

    // 확장자 검증
    const invalidExtensionFiles = Array.from(files).filter(
      (f) => !isValidImageExtension(f.name)
    );

    if (invalidExtensionFiles.length > 0) {
      setImageExtensionError("PNG, JPG, WEBP 파일만 업로드 가능합니다.");
    }

    // 크기 및 확장자 검증을 통과한 파일들
    const candidates = Array.from(files).filter(
      (f) =>
        f.type.startsWith("image/") &&
        f.size <= MAX_IMAGE_SIZE_BYTES &&
        isValidImageExtension(f.name)
    );

    const oversized = Array.from(files).filter(
      (f) =>
        f.type.startsWith("image/") &&
        f.size > MAX_IMAGE_SIZE_BYTES &&
        isValidImageExtension(f.name)
    );

    if (oversized.length > 0) {
      setImageSizeError("파일 크기는 5MB 이하여야 합니다.");
    }

    candidates.slice(0, slotsLeft).forEach((file) => addReviewImage(file));

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
      <div className="px-5 py-15 space-y-6 w-full h-full flex flex-col">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0 relative overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={clubName || "클럽"}
                fill
                className="object-cover rounded-full"
              />
            ) : null}
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="text-subtitle-18">{clubName || "클럽"}</span>
            <StarDisplay rating={rating} size="sm" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-subtitle-16">사진 첨부</div>
          <div className="flex gap-3">
            {existingReviewImages.map((imageUrl, index) => (
              <div
                key={`existing-${index}`}
                className="relative w-20 h-20  rounded flex-shrink-0 overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={`Existing review image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeExistingReviewImage(index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
            {newReviewImages.map((image, index) => (
              <div
                key={`new-${index}`}
                className="relative w-20 h-20  rounded flex-shrink-0 overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={newImageUrls[index]}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeNewReviewImage(index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
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
                  accept="image/png,image/jpeg,image/jpg,image/webp"
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
          {imageSizeError && (
            <p className="text-description-12 text-red-500">{imageSizeError}</p>
          )}
          {imageExtensionError && (
            <p className="text-description-12 text-red-500">
              {imageExtensionError}
            </p>
          )}
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
