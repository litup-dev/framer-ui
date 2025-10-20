"use client";

import { Map, Info, Star } from "lucide-react";
import { Club } from "@/app/feature/club/types";
import ClubImage from "./club-image";
import { Separator } from "@/components/ui/separator";

interface ClubCardProps {
  club: Club;
  onMapClick: (club: Club) => void;
}

const ClubCard = ({ club, onMapClick }: ClubCardProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <div>
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
        </div>
        <Star className="w-4 h-4 sm:mr-4" />
      </div>

      <div className="flex gap-[1px]">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-25 w-20 bg-[#D9D9D9]" />
        ))}
      </div>

      <div className="flex gap-1 items-center text-subtitle-12 text-black-60 sm:hidden">
        <span
          className="flex items-center gap-1 border border-[#2020201A] px-2.5 py-2 rounded-[2px] cursor-pointer"
          onClick={() => onMapClick(club)}
        >
          <Map className="w-4 h-4" />
          지도
        </span>
        <span className="flex items-center gap-1 border border-[#2020201A] px-2.5 py-2 rounded-[2px]">
          <Info className="w-4 h-4" />
          상세
        </span>
      </div>
      <Separator className="hidden sm:block" />
    </div>
  );
};

export default ClubCard;
