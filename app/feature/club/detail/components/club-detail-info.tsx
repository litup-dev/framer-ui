"use client";

import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";

import { useCommonModalStore } from "@/store/common-modal-store";
import { mutateFavoriteClub } from "@/app/feature/club/query-options";

import { Separator } from "@/components/ui/separator";
import { Description, Subtitle } from "@/components/shared/typography";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

interface ClubDetailInfoProps {
  id: string;
  name?: string;
  subtitle?: string;
  description?: string;
  address?: string;
  isFavorite?: boolean;
  favoriteCount?: number;
  images?: Array<{ filePath: string; isMain?: boolean }>;
}

const ClubDetailInfo = ({
  id,
  name,
  subtitle,
  description,
  address,
  isFavorite,
  favoriteCount,
  images,
}: ClubDetailInfoProps) => {
  const firstImageUrl =
    images && images.length > 0 ? getImageUrl(images[0].filePath) : null;
  const { openModal } = useCommonModalStore();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useUserStore();
  const { mutate: mutateFavorite } = useMutation(mutateFavoriteClub(id));
  const router = useRouter();
  const handleFavorite = () => {
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
      <div className="flex gap-3 sm:gap-4 items-center px-5 sm:px-10 lg:px-15">
        <div className="w-15 h-15 2xl:w-20 2xl:h-20 bg-gray-300 rounded-full relative">
          {firstImageUrl ? (
            <Image
              src={firstImageUrl}
              alt="club profile"
              fill
              className="object-cover rounded-full"
            />
          ) : null}
        </div>
        <div className="flex-1 flex flex-col gap-2 2xl:gap-2.5">
          <Subtitle className="text-black text-[16px] sm:text-[20px] md:text-[24px]">
            {subtitle || name}
          </Subtitle>
          <Description className="text-black-40 text-[14px] sm:text-[16px] md:text-[18px]">
            {address}
          </Description>
        </div>
        <div
          className="flex flex-col items-center gap-1 2xl:gap-2"
          onClick={handleFavorite}
        >
          {isFavorite ? (
            <Image
              src="/images/favorite_active.svg"
              alt="club profile"
              width={40}
              height={40}
              className="w-7 h-7 2xl:w-10 2xl:h-10"
            />
          ) : (
            <Image
              src="/images/favorite_inactive.svg"
              alt="club profile"
              width={40}
              height={40}
              className="w-7 h-7 2xl:w-10 2xl:h-10"
            />
          )}

          <Description className="text-[12px] xl:text-[14px] text-main">
            {favoriteCount}
          </Description>
        </div>
      </div>

      <div className="px-5 sm:px-10 lg:px-15 flex flex-col space-y-6 pb-14 sm:pb-16 lg:pb-26">
        <Separator className="px-5" />
        <div className="flex-[9] space-y-2 2xl:pt-3">
          <Description className="text-[16px] lg:text-[18px]">
            {description}
          </Description>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailInfo;
