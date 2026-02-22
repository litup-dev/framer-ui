"use client";

import Image from "next/image";
import { Club } from "@/app/feature/club/types";
import { cn } from "@/lib/utils";

interface ClubImageProps {
  club: Club;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const getImageUrl = (filePath: string | null | undefined): string | null => {
  if (!filePath) return null;

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const path = filePath.startsWith("/") ? filePath : `/${filePath}`;
  return `${apiBaseUrl}${path}`;
};

const ClubImage = ({ club, size = "md", className = "" }: ClubImageProps) => {
  const imageUrl = getImageUrl(club.mainImage?.filePath);

  return (
    <div
      className={cn(
        "relative size-11 sm:size-13 md:size-14 2xl:size-16 rounded-full",
        className,
      )}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={club.name}
          fill
          className="object-cover rounded-full"
        />
      )}
    </div>
  );
};

export default ClubImage;
