import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Description, Subtitle } from "@/components/shared/typography";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";

interface Performance {
  id: number;
  title: string;
  club: {
    name: string;
  };
  images: Array<{
    filePath?: string;
    isMain?: boolean;
  }>;
  artists?: Array<{
    name: string;
  }>;
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
      <Subtitle className="text-[16px] text-black truncate px-3 py-2 bg-gray">
        {artists[0].name} 외 {artists.length - 1}팀
      </Subtitle>
    );
  }

  return (
    <>
      {artists.map((artist, index) => (
        <Subtitle
          key={index}
          className="text-[16px] text-black truncate px-3 py-2 bg-gray"
        >
          {artist.name}
        </Subtitle>
      ))}
    </>
  );
};

export const PerformanceCard = ({ performance }: PerformanceCardProps) => {
  const mainImage =
    performance.images.find((img) => img.isMain) || performance.images[0];
  const imageUrl = getImageUrl(mainImage?.filePath);
  const alt =
    performance.title || performance.club?.name || "Performance image";

  return (
    <Link href={`/performance/${performance.id}`}>
      <Card
        className="overflow-hidden gap-5 pb-2"
        data-hero-key={performance.id}
      >
        <div className="aspect-[3/4] relative">
          <PerformanceImage imageUrl={imageUrl} alt={alt} />
        </div>
        <CardContent className="flex flex-col justify-start space-y-2.5">
          <Description className="text-gray-400 text-[16px] truncate">
            {performance.club.name}
          </Description>
          <Subtitle className="text-[20px] text-black] truncate">
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
