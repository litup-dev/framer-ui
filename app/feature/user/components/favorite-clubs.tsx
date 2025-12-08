"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Title } from "@/components/shared/typography";
import { Star, ChevronDown } from "lucide-react";

interface Club {
  id: string;
  name: string;
  location: string;
  image?: string;
  isFavorite: boolean;
}

interface FavoriteClubsProps {
  className?: string;
}

export default function FavoriteClubs({ className }: FavoriteClubsProps) {
  const [displayCount, setDisplayCount] = useState(4);

  // 임시 데이터
  const allClubs: Club[] = [
    { id: "1", name: "현대카드 언더스테이지", location: "서울시 용산구 이태원로 246", isFavorite: true },
    { id: "2", name: "현대카드 언더스테이지", location: "서울시 용산구 이태원로 246", isFavorite: false },
    { id: "3", name: "현대카드 언더스테이지", location: "서울시 용산구 이태원로 246", isFavorite: true },
    { id: "4", name: "현대카드 언더스테이지", location: "서울시 용산구 이태원로 246", isFavorite: false },
    { id: "5", name: "현대카드 언더스테이지", location: "서울시 용산구 이태원로 246", isFavorite: true },
    { id: "6", name: "현대카드 언더스테이지", location: "서울시 용산구 이태원로 246", isFavorite: false },
  ];

  const displayedClubs = allClubs.slice(0, displayCount);
  const hasMore = displayCount < allClubs.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 4);
  };

  const toggleFavorite = (clubId: string) => {
    console.log("Toggle favorite for club:", clubId);
    // TODO: API 호출로 즐겨찾기 상태 변경
  };

  return (
    <div className={`flex flex-col ${className || ""}`}>
      {/* 헤더 */}
      <div className="flex flex-col">
        <Title className="text-black">관심 클럽</Title>
        {/* 주황색 구분선 - 높이 3px */}
        <div className="h-[3px] bg-main mt-3" />
      </div>

      {/* 클럽 목록 - sm: 1개씩 세로, 나머지: 2개씩 가로 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-6 md:gap-y-4 lg:gap-x-8 lg:gap-y-4 2xl:gap-x-10 2xl:gap-y-6 mt-4">
        {displayedClubs.map((club) => (
          <div
            key={club.id}
            className="flex items-center gap-3 md:gap-3 lg:gap-4 2xl:gap-5 p-4 md:p-4 lg:p-5 2xl:p-6 hover:bg-accent/50 border border-[#202020]/20 rounded md:rounded-md 2xl:rounded-md transition-colors h-20 md:h-20 lg:h-24 2xl:h-[120px]"
          >
            {/* 아바타 - 2xl: 72x72, xl/lg: 56x56, md/sm: 48x48 */}
            <Avatar className="w-12 h-12 lg:w-14 lg:h-14 2xl:w-[72px] 2xl:h-[72px] flex-shrink-0">
              <AvatarImage src={club.image} alt={club.name} />
              <AvatarFallback className="bg-muted text-black text-xs">
                {club.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* 정보 */}
            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
              <h3 className="font-medium text-sm truncate">{club.name}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {club.location}
              </p>
            </div>

            {/* 즐겨찾기 표시 - 정사각형 + 별 */}
            <button
              onClick={() => toggleFavorite(club.id)}
              className="flex-shrink-0 w-7 h-7 md:w-7 md:h-7 lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 flex items-center justify-center rounded bg-black/[0.04] hover:bg-black/[0.08] transition-colors"
            >
              <Star
                className={`w-4 h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 ${
                  club.isFavorite
                    ? "fill-main text-main"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* 더보기 버튼 - 간격: 2xl 56px, xl/lg/md 40px, sm 24px */}
      {hasMore && (
        <button
          onClick={handleLoadMore}
          className="flex items-center justify-center gap-1 py-2 text-sm text-muted-foreground hover:text-black transition-colors mt-6 md:mt-10 xl:mt-10 2xl:mt-14"
        >
          더보기
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
