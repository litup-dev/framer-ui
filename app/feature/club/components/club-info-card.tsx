"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Club } from "@/app/feature/club/types";
import {
  clubFavoriteByIdOptions,
  getClubByIdOptions,
} from "@/app/feature/club/query-options";
import ClubImage from "./club-image";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";
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

  const clubWithImages: Club = useMemo(
    () => ({
      ...club,
      images: club.images?.length
        ? club.images
        : clubDetailData?.data?.images ?? club.images,
    }),
    [club, clubDetailData?.data?.images],
  );

  useEffect(() => {
    setIsFavorite(cacheFavorite);
  }, [cacheFavorite]);

  const mutate = () => {
    setIsFavorite(!isFavorite);
    mutateFavorite(undefined);
  };

  if (isOverlay) {
    return (
      <div className="relative w-fit">
        <div className="bg-white border border-[rgba(23,23,23,0.1)] drop-shadow-[0px_4px_15px_rgba(0,0,0,0.06)] rounded-[4px] p-5">
          <div className="flex gap-[14px] items-center pr-[14px]">
            <ClubImage club={clubWithImages} size="md" />
            <div className="flex flex-col gap-2 items-start">
              <div className="flex gap-2 items-center">
                <Subtitle className="text-[20px] text-[#171717] leading-none whitespace-nowrap">
                  {club.name}
                </Subtitle>
                <div className="flex items-center gap-0.5">
                  <Image
                    src="/images/club-rating.svg"
                    alt="star"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <Description className="text-[16px] text-[#171717] font-medium leading-none whitespace-nowrap">
                    {`${club.avgRating ?? 0} (${club.reviewCnt})`}
                  </Description>
                </div>
              </div>
              <Description className="text-[16px] text-[#20202080] font-medium leading-none whitespace-nowrap">
                {club.address}
              </Description>
            </div>
          </div>
        </div>
        <svg
          className="absolute left-1/2 -translate-x-1/2 -bottom-[18px]"
          width="26"
          height="19"
          viewBox="0 0 26 19"
          fill="none"
          aria-hidden="true"
        >
          <path d="M0 0 L26 0 L13 19 Z" fill="white" />
          <path
            d="M0 0 L13 19 L26 0"
            stroke="rgba(23,23,23,0.1)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="absolute inset-x-0 bottom-4 z-10 relative w-full min-w-[280px] px-2.5 md:px-10">
      <div className="relative w-full h-[96px] bg-white rounded-[4px] flex items-center w-full px-5">
        <div className="flex items-center gap-4">
          <div className="relative size-16 rounded-full overflow-hidden shrink-0 bg-[#D9D9D9]">
            {clubWithImages.images?.[0]?.filePath && (
              <Image
                src={getImageUrl(clubWithImages.images[0].filePath) ?? ""}
                alt={club.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1 items-center">
              <Subtitle className="text-[16px] 2xl:text-[20px]">
                {club.name}
              </Subtitle>
              <div className="flex items-center gap-1">
                <Image
                  src="/images/club-rating.svg"
                  alt="star"
                  width={20}
                  height={20}
                  className="w-4 h-4"
                />
                <Description className="text-[14px] 2xl:text-[16px]">
                  {club.avgRating ?? 0}
                </Description>
                <Description className="text-[14px] 2xl:text-[16px]">{`(${club.reviewCnt})`}</Description>
              </div>
            </div>
            <Description className="text-[12px] text-black/50">
              {club.address}
            </Description>
          </div>
        </div>
        <Image
          src={
            isFavorite
              ? "/images/club_favorite_fill.svg"
              : "/images/club_favorite.svg"
          }
          alt="favorite"
          width={16}
          height={16}
          className={`absolute top-[18px] right-[18px] w-7 h-7 cursor-pointer ${
            isFavorite
              ? "text-main hover:text-main"
              : "text-black-60 hover:text-main"
          }`}
          onClick={() => mutate()}
        />
      </div>
    </div>
  );
};

export default ClubInfoCard;
