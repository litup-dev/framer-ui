import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Title, Description } from "@/components/shared/typography";
import { PerformHistoryItem } from "@/app/feature/user/types";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";
import { formatDate } from "@/lib/date-utils";

interface ViewingHistoryItemProps {
  item: PerformHistoryItem;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: (itemId: number) => void;
}

export default function ViewingHistoryItem({
  item,
  isEditing,
  isSelected,
  onSelect,
}: ViewingHistoryItemProps) {
  const mainImage = item.images?.find((img) => img.isMain) || item.images?.[0];
  const imageUrl = mainImage ? getImageUrl(mainImage.filePath) : null;
  const artistNames = item.artists?.map((artist) => artist.name) ?? [];

  return (
    <div className="flex gap-3 lg:gap-6 h-[125px] lg:h-[175px]">
      {/* 좌측: 포스터 이미지 - 2xl/xl/lg: 140x175, md/sm: 100x125 */}
      <div className="relative w-[100px] h-[125px] lg:w-[140px] lg:h-[175px] bg-muted rounded-[3px] flex-shrink-0">
        {/* 편집 모드: 체크박스 (포스터 내 좌측 상단) */}
        {isEditing && (
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(item.id)}
              className="w-[15px] h-[15px] lg:w-[18px] lg:h-[18px] 2xl:w-[18px] 2xl:h-[18px] border-[#222222]/20 rounded-[3px] data-[state=checked]:bg-transparent data-[state=checked]:border-[#222222]/20 data-[state=checked]:text-[#202020]/80 shadow-none"
            />
          </div>
        )}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className="object-cover rounded-[3px]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
            이미지
          </div>
        )}
      </div>

      {/* 우측: 정보 - 상하 padding 8px */}
      <div className="flex-1 flex flex-col py-2">
        {/* 클럽 위치 */}
        <Description className="text-[12px] md:text-[14px] lg:text-[16px] text-muted-foreground">
          {item.club?.name ?? ""}
        </Description>
        {/* 공연 타이틀 - 간격: 2xl/xl/lg 10px, md/sm 8px */}
        <Title className="text-[15px] md:text[16px] lg:text-[24px] line-clamp-1 mt-2 lg:mt-[10px]">
          {item.title}
        </Title>
        {/* 아티스트 - 간격: 2xl/xl/lg 10px, md/sm 8px */}
        <Description className="text-[12px] md:text-[14px] lg:text-[16px] mt-2 lg:mt-[10px]">
          {artistNames.join(", ")}
        </Description>
        {/* 공연 날짜 - 간격: 2xl/xl/lg 67px, md/sm 42px */}
        <Description className="text-[12px] md:text-[14px] lg:text-[16px] text-muted-foreground mt-[42px] lg:mt-[67px]">
          {formatDate(new Date(item.performDate), "yyyy.MM.dd HH:mm")}
        </Description>
      </div>
    </div>
  );
}
