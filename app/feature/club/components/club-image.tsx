"use client";

import Image from "next/image";
import { Club } from "@/app/feature/club/types";

interface ClubImageProps {
  club: Club;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
};

const getImageUrl = (filePath: string | null | undefined): string | null => {
  if (!filePath) return null;
  
  // 이미 절대 URL인 경우 그대로 반환
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }
  
  // 상대 경로인 경우 API 베이스 URL과 결합
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  // filePath가 이미 /로 시작하는지 확인
  const path = filePath.startsWith("/") ? filePath : `/${filePath}`;
  return `${apiBaseUrl}${path}`;
};

const ClubImage = ({ club, size = "md", className = "" }: ClubImageProps) => {
  const sizeClass = sizeClasses[size];
  const imageUrl = getImageUrl(club.mainImage?.filePath);

  return (
    <div className={`relative ${sizeClass} rounded-full ${className}`}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={club.name}
          fill
          className="object-cover rounded-full"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-500 text-xs">이미지 없음</span>
        </div>
      )}
    </div>
  );
};

export default ClubImage;
