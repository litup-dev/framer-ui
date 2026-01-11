"use client";

import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Club } from "@/app/feature/club/types";
import { clubFavoriteByIdOptions } from "@/app/feature/club/query-options";
import ClubImage from "./club-image";

interface ClubInfoCardProps {
  club: Club;
}

const ClubInfoCard = ({ club }: ClubInfoCardProps) => {
  const queryClient = useQueryClient();
  const { mutate: mutateFavorite } = useMutation(
    clubFavoriteByIdOptions(club.id, queryClient)
  );

  const mutate = () => {
    mutateFavorite(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["reviews", String(club.id)],
        });
      },
    });
  };

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
        {club.isFavorite ? (
          <Image
            className="w-8 h-8 sm:mr-4 text-main hover:text-main cursor-pointer"
            onClick={() => mutate()}
            src="/images/club_favorite_fill.svg"
            alt="favorite"
            width={16}
            height={16}
          />
        ) : (
          <Image
            src="/images/club_favorite.svg"
            alt="favorite"
            width={16}
            height={16}
            className="w-8 h-8 sm:mr-4 text-black-60 hover:text-main cursor-pointer"
            onClick={() => mutate()}
          />
        )}
      </div>
    </div>
  );
};

export default ClubInfoCard;
