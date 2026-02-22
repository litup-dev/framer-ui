"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Map, Info } from "lucide-react";
import { useRouter } from "next/navigation";

import { Club } from "@/app/feature/club/types";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";
import {
  clubFavoriteByIdOptions,
  getClubByIdOptions,
} from "@/app/feature/club/query-options";
import { useUserStore } from "@/store/user-store";
import { useCommonModalStore } from "@/store/common-modal-store";

import ClubImage from "@/app/feature/club/components/club-image";
import { Description, Subtitle } from "@/components/shared/typography";

interface ClubCardProps {
  club: Club;
  onMapClick: (club: Club) => void;
}

const ClubCard = ({ club, onMapClick }: ClubCardProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useUserStore();
  const { openModal } = useCommonModalStore();
  const { data: clubDetailData } = useQuery(
    getClubByIdOptions(String(club.id)),
  );
  const cacheFavorite =
    club.isFavorite ?? clubDetailData?.data?.isFavorite ?? false;

  const [isFavorite, setIsFavorite] = useState(cacheFavorite);
  const { mutate: mutateFavorite } = useMutation(
    clubFavoriteByIdOptions(club.id, queryClient),
  );

  useEffect(() => {
    setIsFavorite(cacheFavorite);
  }, [club.id, cacheFavorite]);

  const mutate = () => {
    if (!isAuthenticated) {
      openModal({
        description: "로그인 후 이용해주세요",
        confirmButton: {
          label: "확인",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }
    setIsFavorite(!isFavorite);
    mutateFavorite(undefined);
  };

  const mainImageUrl = useMemo(() => {
    return club.mainImage?.filePath
      ? getImageUrl(club.mainImage.filePath)
      : null;
  }, [club.mainImage]);

  return (
    <div className="space-y-4 block cursor-pointer">
      <div className="flex justify-between">
        <Link href={`/club/${club.id}`}>
          <div className="flex items-center gap-4">
            <ClubImage club={club} size="md" />
            <div className="flex flex-col text-subtitle-16 gap-2">
              <div className="flex gap-1 items-center">
                <Subtitle className="text-[14px] xl:text-[16px] 2xl:text-[20px]">
                  {club.name}
                </Subtitle>
                <div className="flex items-center gap-0.5 text-black">
                  <Image
                    src="/images/club-rating.svg"
                    alt="star"
                    width={20}
                    height={20}
                  />
                  <div className="flex gap-1">
                    <Description className="text-[12px] xl:text-[14px] 2xl:text-[16px]">
                      {club.avgRating ?? 0}
                    </Description>
                    <Description className="text-[12px] xl:text-[14px] 2xl:text-[16px]">{`(${club.reviewCnt})`}</Description>
                  </div>
                </div>
              </div>
              <Description className="text-[12px] xl:text-[14px] 2xl:text-[16px] text-black/50">
                {club.address}
              </Description>
            </div>
          </div>
        </Link>
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            mutate();
          }}
        />
      </div>
      <div className="flex gap-[1px] pt-1">
        {mainImageUrl && (
          <div className="relative h-[180px] w-[144px] bg-[#D9D9D9] overflow-hidden rounded-[4px]">
            <Image
              src={mainImageUrl}
              alt={club.name}
              fill
              className="object-cover"
              sizes="20px"
            />
          </div>
        )}
      </div>
      <div className="flex gap-1 items-center text-subtitle-12 text-black-60">
        <div
          className="flex items-center gap-1 border border-black/20 px-2.5 py-2 rounded-[4px] cursor-pointer"
          onClick={() => onMapClick(club)}
        >
          <Map className="w-4 h-4" />
          <Subtitle className="2xl:text-[14px]">위치</Subtitle>
        </div>
        <Link href={`/club/${club.id}`}>
          <div className="flex items-center gap-1 border border-black/20 px-2.5 py-2 rounded-[4px] cursor-pointer">
            <Info className="w-4 h-4" />
            <Subtitle className="2xl:text-[14px]">상세</Subtitle>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ClubCard;
