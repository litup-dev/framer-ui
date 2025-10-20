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

const ClubImage = ({ club, size = "md", className = "" }: ClubImageProps) => {
  const sizeClass = sizeClasses[size];

  return (
    <div className={`relative ${sizeClass} rounded-full ${className}`}>
      {club.mainImage?.filePath ? (
        <Image
          src={club.mainImage.filePath}
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
