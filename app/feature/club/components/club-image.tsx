"use client";

import Image from "next/image";
import { Club } from "@/app/feature/club/types";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

interface ClubImageProps {
  club: Club;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ClubImage = ({ club, size = "md", className = "" }: ClubImageProps) => {
  const imageUrl = getImageUrl(club.images?.[0]?.filePath);

  return (
    <div
      className={cn(
        "relative size-11 sm:size-13 md:size-13 lg:size-14 2xl:size-16 rounded-full",
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
