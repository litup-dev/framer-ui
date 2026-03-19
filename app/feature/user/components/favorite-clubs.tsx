"use client";

import { useRouter } from "next/navigation";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Title, Description } from "@/components/shared/typography";
import SectionHeader from "./section-header";
import LoadMoreButton from "./load-more-button";
import { getFavoriteClubsOptions } from "@/app/feature/user/query-options";
import { FavoriteClubItem } from "@/app/feature/user/types";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";
import { apiClient } from "@/lib/api-client";
import { useApiErrorMessage } from "@/hooks/use-api-error-message";
import { en } from "zod/v4/locales";

interface FavoriteClubsProps {
  className?: string;
  publicId: string;
  isOwner?: boolean;
}

export default function FavoriteClubs({
  className,
  publicId,
  isOwner = true,
}: FavoriteClubsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // API 호출: 관심 클럽
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } =
    useInfiniteQuery({
      ...getFavoriteClubsOptions(publicId),
      enabled: !!publicId,
    });
  const errorMessage = useApiErrorMessage(error);

  // 관심 클럽 토글 mutation (optimistic update)
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (clubId: number) => {
      return apiClient.post(`/api/v1/clubs/${clubId}/favorite`, {
        entityId: clubId,
      });
    },
    onMutate: async (clubId: number) => {
      // 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: ["favoriteClubs", publicId],
      });

      // 이전 데이터 백업
      const previousData = queryClient.getQueryData([
        "favoriteClubs",
        publicId,
      ]);

      // Optimistic update: 캐시 데이터에 isFavorite 필드 토글
      queryClient.setQueryData(["favoriteClubs", publicId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            items: page.items.map((club: FavoriteClubItem) => {
              if (club.id === clubId) {
                // isFavorite이 없으면 false로 설정 (즐겨찾기 해제)
                // isFavorite이 false면 undefined로 제거 (즐겨찾기 복원)
                const newIsFavorite =
                  club.isFavorite === false ? undefined : false;
                if (newIsFavorite === undefined) {
                  const { isFavorite, ...rest } = club;
                  return rest as FavoriteClubItem;
                }
                return { ...club, isFavorite: newIsFavorite };
              }
              return club;
            }),
          })),
        };
      });

      return { previousData };
    },
    onError: (err, clubId, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousData) {
        queryClient.setQueryData(
          ["favoriteClubs", publicId],
          context.previousData,
        );
      }
    },
  });

  // API 데이터를 평탄화
  const allClubs =
    data?.pages.flatMap((page: { items: FavoriteClubItem[] }) => page.items) ??
    [];

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const handleClubClick = (clubId: number) => {
    router.push(`/club/${clubId}`);
  };

  const toggleFavorite = (e: React.MouseEvent, clubId: number) => {
    e.stopPropagation();
    toggleFavoriteMutation.mutate(clubId);
  };

  const starIcon = (
    <Image
      src="/images/user/star-fill_black.svg"
      alt="관심 클럽"
      width={28}
      height={28}
      className="w-6 h-6 md:w-7 md:h-7 lg:w-7 lg:h-7 xl:w-7 xl:h-7 2xl:w-7 2xl:h-7"
    />
  );

  if (isLoading) {
    return (
      <div className={`flex flex-col ${className || ""}`}>
        <SectionHeader customIcon={starIcon} title="관심 클럽" />
        <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (isError && errorMessage) {
    return (
      <div className={`flex flex-col ${className || ""}`}>
        <SectionHeader customIcon={starIcon} title="관심 클럽" />
        <div className="col-span-full text-center py-8 text-muted-foreground">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className || ""}`}>
      <SectionHeader customIcon={starIcon} title="관심 클럽" />

      {/* Border to Cards: lg: 32px, md: 40px, sm: 24px */}
      {/* Grid: 2x2 (2 rows, 2 cols) */}
      {allClubs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-6 md:gap-y-3 lg:gap-x-8 lg:gap-y-4 2xl:gap-x-10 2xl:gap-y-6 mt-6 md:mt-10 lg:mt-8 xl:mt-8 2xl:mt-10">
            {allClubs.map((club: FavoriteClubItem) => {
              const imageUrl = club.mainImage
                ? getImageUrl(club.mainImage.filePath)
                : null;
              // isFavorite이 없으면 club_favorite_fill.svg, false면 club_favorite.svg
              const favoriteIcon =
                club.isFavorite === false
                  ? "/images/club_favorite.svg"
                  : "/images/club_favorite_fill.svg";

              return (
                <div
                  key={club.id}
                  onClick={() => handleClubClick(club.id)}
                  className="flex items-center gap-3 md:gap-3 lg:gap-4 2xl:gap-5 p-4 md:p-4 lg:p-5 2xl:p-6 hover:bg-accent/50 border border-[#202020]/20 rounded-[4px] transition-colors h-20 md:h-20 lg:h-24 2xl:h-[120px] cursor-pointer"
                >
                  {/* 아바타 - 2xl: 72x72, xl/lg: 56x56, md/sm: 48x48 */}
                  <Avatar className="w-12 h-12 lg:w-14 lg:h-14 2xl:w-[72px] 2xl:h-[72px] flex-shrink-0">
                    <AvatarImage src={imageUrl || ""} alt={club.name} />
                    <AvatarFallback className="bg-muted text-black text-xs">
                      {club.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* 정보 */}
                  <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                    <Title className="text-[14px] lg:text-[16px] 2xl:text-[18px] tracking-[-0.04em]">
                      {club.name}
                    </Title>
                  </div>

                  {/* 즐겨찾기 표시 - 2xl: 40x40, xl/lg: 32x32, md/sm: 28x28 */}
                  {isOwner ? (
                    <button
                      onClick={(e) => toggleFavorite(e, club.id)}
                      className="flex-shrink-0 hover:opacity-70 transition-opacity w-7 h-7 lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 bg-[#000000]/[0.04] rounded-[3px] flex items-center justify-center"
                    >
                      <Image
                        src={favoriteIcon}
                        alt="즐겨찾기"
                        width={24}
                        height={24}
                        className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6"
                      />
                    </button>
                  ) : (
                    <div className="flex-shrink-0 w-7 h-7 lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 bg-[#000000]/[0.04] rounded-[3px] flex items-center justify-center">
                      <Image
                        src="/images/club_favorite_fill.svg"
                        alt="즐겨찾기"
                        width={24}
                        height={24}
                        className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {hasNextPage && <LoadMoreButton onClick={handleLoadMore} />}
        </>
      ) : (
        <div className="text-center mt-20 text-muted-foreground mb-[180px] md:mb-[200px] lg:mb-[220px] xl:mb-[220px] 2xl:mb-[240px]">
          관심 클럽이 없습니다.
        </div>
      )}
    </div>
  );
}
