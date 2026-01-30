"use client";

import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/user-store";

import { mutateFavoriteClub } from "@/app/feature/club/query-options";

import { Separator } from "@/components/ui/separator";
import { Description, Subtitle } from "@/components/shared/typography";

interface ClubDetailInfoProps {
  id: string;
  name?: string;
  subtitle?: string;
  description?: string;
  address?: string;
  isFavorite?: boolean;
  favoriteCount?: number;
}

const ClubDetailInfo = ({
  id,
  name,
  subtitle,
  description,
  address,
  isFavorite,
  favoriteCount,
}: ClubDetailInfoProps) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useUserStore();
  const { mutate: mutateFavorite } = useMutation(mutateFavoriteClub(id));

  const handleFavorite = () => {
    if (!isAuthenticated) {
      alert("로그인 후 이용해주세요");
      return;
    }
    mutateFavorite(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["club", id],
        });
      },
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      <div className="flex gap-4.5 items-center px-5 sm:px-10 lg:px-15">
        <div className="w-15 h-15 bg-gray-300 rounded-full"></div>
        <div className="flex-1 flex flex-col">
          <Subtitle className="text-black text-[16px] sm:text-[20px] md:text-[24px]">
            {subtitle || name}
          </Subtitle>
          <Description className="text-black-40 text-[14px] sm:text-[16px] md:text-[18px]">
            {address}
          </Description>
        </div>
        <div
          className="flex flex-col items-center gap-1"
          onClick={handleFavorite}
        >
          {isFavorite ? (
            <Image
              src="/images/favorite_active.svg"
              alt="club profile"
              width={28}
              height={28}
            />
          ) : (
            <Image
              src="/images/favorite_inactive.svg"
              alt="club profile"
              width={28}
              height={28}
            />
          )}

          <div className="text-chip-12 text-main">{favoriteCount}</div>
        </div>
      </div>

      <div className="px-5 sm:px-10 lg:px-15 flex flex-col space-y-6 pb-14 sm:pb-16 lg:pb-26">
        <Separator className="px-5" />
        <div className="flex-[9] space-y-2">
          <Description className="text-[16px] lg:text-[18px]">
            {description}
          </Description>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailInfo;
