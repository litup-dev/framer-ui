"use client";

import { Star } from "lucide-react";
import { Club } from "@/app/feature/club/types";
import ClubImage from "./club-image";

interface ClubInfoCardProps {
  club: Club;
}

const ClubInfoCard = ({ club }: ClubInfoCardProps) => {
  return (
    <div className="absolute inset-x-0 bottom-4 px-2.5 z-10">
      <div className="w-full h-[96px] bg-white rounded-[4px] flex justify-between items-center px-2.5">
        <div className="flex items-center gap-4">
          <ClubImage club={club} size="md" />
          <div className="flex flex-col text-subtitle-16">
            <div className="flex gap-1">
              <div>{club.name}</div>
              <div className="flex items-center gap-1 text-black-60">
                <div>{club.avgRating ?? 0}</div>
                <div>{`(${club.capacity})`}</div>
              </div>
            </div>
            <div className="text-description-14 text-black-60">
              {club.address}
            </div>
          </div>
        </div>
        <Star />
      </div>
    </div>
  );
};

export default ClubInfoCard;
