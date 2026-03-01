"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Club, ClubDetail } from "@/app/feature/club/types";
import {
  clubFavoriteByIdOptions,
  getClubByIdOptions,
} from "@/app/feature/club/query-options";
import ClubImage from "./club-image";
import { cn } from "@/lib/utils";
import { Description, Subtitle } from "@/components/shared/typography";

interface ClubInfoCardProps {
  club: Club;
  isOverlay?: boolean;
}

const ClubInfoCard = ({ club, isOverlay = false }: ClubInfoCardProps) => {
  const queryClient = useQueryClient();

  const { data: clubDetailData } = useQuery(
    getClubByIdOptions(String(club.id)),
  );
  const cacheFavorite = clubDetailData?.data?.isFavorite ?? club.isFavorite;

  const [isFavorite, setIsFavorite] = useState(cacheFavorite);
  const { mutate: mutateFavorite } = useMutation(
    clubFavoriteByIdOptions(club.id, queryClient),
  );

  useEffect(() => {
    setIsFavorite(cacheFavorite);
  }, [cacheFavorite]);

  const mutate = () => {
    setIsFavorite(!isFavorite);
    mutateFavorite(undefined);
  };

  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-4 z-10",
        isOverlay
          ? "relative w-fit border rounded-[4px]"
          : "relative w-full min-w-[280px] px-2.5 z-10",
      )}
    >
      <div
        className={cn(
          "w-full h-[96px] bg-white rounded-[4px] flex justify-between items-center",
          isOverlay ? " min-w-[280px] px-5" : "w-full px-2.5",
        )}
      >
        <div className="flex items-center gap-4">
          <ClubImage club={club} size="md" />
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <Subtitle className="text-[14px] xl:text-[16px] 2xl:text-[20px]">
                {club.name}
              </Subtitle>
              <div className="flex items-center gap-1">
                <Image
                  src="/images/club-rating.svg"
                  alt="star"
                  width={20}
                  height={20}
                />
                <Description className="text-[12px] xl:text-[14px] 2xl:text-[16px]">
                  {club.avgRating ?? 0}
                </Description>
                <Description className="text-[12px] xl:text-[14px] 2xl:text-[16px]">{`(${club.reviewCnt})`}</Description>
              </div>
            </div>
            <div className="text-description-14 text-black-60">
              {club.address}
            </div>
          </div>
        </div>
        {!isOverlay && (
          <Image
            src={
              isFavorite
                ? "/images/club_favorite_fill.svg"
                : "/images/club_favorite.svg"
            }
            alt="favorite"
            width={16}
            height={16}
            className={`w-8 h-8 sm:mr-4 cursor-pointer ${
              isFavorite
                ? "text-main hover:text-main"
                : "text-black-60 hover:text-main"
            }`}
            onClick={() => mutate()}
          />
        )}
      </div>
    </div>
  );
};

export default ClubInfoCard;
