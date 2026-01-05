import Image from "next/image";

interface PosterImageProps {
  imageUrl: string;
  title: string;
  className?: string;
  sizes?: string;
}

/**
 * 공연 포스터 이미지 컴포넌트
 * - 다양한 breakpoint에서 재사용 가능
 */
const PosterImage = ({ imageUrl, title, className = "", sizes = "100vw" }: PosterImageProps) => {
  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
      <Image
        src={imageUrl}
        alt={title || "Performance poster"}
        fill
        sizes={sizes}
        className="object-cover"
        priority
      />
    </div>
  );
};

export default PosterImage;
