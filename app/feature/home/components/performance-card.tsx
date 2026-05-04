import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Description, Subtitle } from "@/components/shared/typography";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";
import { formatMonthDay } from "@/lib/date-utils";

interface Performance {
  id: number;
  title: string;
  club: {
    id: number;
    name: string;
  };
  images: Array<{
    filePath?: string;
    isMain?: boolean;
  }>;
  artists?: Array<{
    name: string;
  }>;
  performDate: string;
}

interface PerformanceCardProps {
  performance: Performance;
}

const PerformanceImage = ({
  imageUrl,
  alt,
}: {
  imageUrl: string | null;
  alt: string;
}) => {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <span className="text-gray-500 text-sm">이미지 없음</span>
    </div>
  );
};

const ArtistsDisplay = ({ artists }: { artists?: Array<{ name: string }> }) => {
  if (!artists || artists.length === 0) {
    return (
      <Subtitle className="text-[16px] text-black truncate">
        아티스트 정보 없음
      </Subtitle>
    );
  }

  if (artists.length >= 3) {
    return (
      <Subtitle className="text-[16px] xl:text-[14px] 2xl:text-[16px] text-black inline-flex items-center justify-center truncate px-3 xl:px-[11px] 2xl:px-3 py-2 2xl:py-[9px] rounded-[3px] bg-[#F4F4F4]">
        {artists[0].name} 외 {artists.length - 1}팀
      </Subtitle>
    );
  }

  return (
    <>
      {artists.map((artist, index) => (
        <Subtitle
          key={index}
          className="text-[16px] xl:text-[14px] 2xl:text-[16px] text-black inline-flex items-center justify-center truncate px-3 xl:px-[11px] 2xl:px-3 py-2 2xl:py-[9px] rounded-[3px] bg-[#F4F4F4]"
        >
          {artist.name}
        </Subtitle>
      ))}
    </>
  );
};

export const PerformanceCard = ({ performance }: PerformanceCardProps) => {
  const router = useRouter();
  const mainImage =
    performance.images.find((img) => img.isMain) || performance.images[0];
  const imageUrl = getImageUrl(mainImage?.filePath);
  const alt =
    performance.title || performance.club?.name || "Performance image";

  return (
    <Link href={`/performance/${performance.id}`}>
      <Card
        className="overflow-hidden gap-5 bg-transparent"
        data-hero-key={performance.id}
      >
        <div className="aspect-[3/4] xl:aspect-[107/134] 2xl:aspect-[4/5] relative">
          <PerformanceImage imageUrl={imageUrl} alt={alt} />
          <div className="absolute text-[#FFFFFF] rounded-[3px] bg-[#000000]/50 xl:bg-black/40 top-2.5 right-2.5 px-2 py-1.5 xl:top-3 xl:right-3 2xl:top-4 2xl:right-4 xl:px-2.5 xl:py-[7px] 2xl:px-3 2xl:py-[9px] backdrop-blur-xs xl:backdrop-blur-[2px]">
            <Subtitle className="text-[12px] xl:text-[14px] 2xl:text-[16px] xl:tracking-[-0.56px] 2xl:tracking-[-0.64px]">
              {formatMonthDay(performance.performDate)}
            </Subtitle>
          </div>
        </div>
        <CardContent className="flex flex-col justify-start space-y-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/club/${performance.club.id}`);
            }}
            className="text-left w-full"
          >
            <Description className="text-black text-[16px] xl:text-[14px] 2xl:text-[16px] truncate hover:text-gray-600 cursor-pointer">
              {performance.club.name}
            </Description>
          </button>
          <Subtitle className="text-[20px] xl:text-[18px] 2xl:text-[20px] text-black truncate leading-[120%]">
            {performance.title}
          </Subtitle>
          <div className="flex gap-2 truncate">
            <ArtistsDisplay artists={performance.artists} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
