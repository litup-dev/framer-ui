import { Star, Instagram, Share2 } from "lucide-react";
import { Title } from "@/components/shared/typography";

interface PosterHeaderProps {
  title: string;
}

const PosterHeader = ({ title }: PosterHeaderProps) => {
  return (
    <div className="pt-0 lg:pt-[26px] pb-4 lg:pb-[82px]">
      <div className="flex justify-between items-center">
        <Title className="text-gray-900">{title}</Title>
        <div className="hidden gap-2 lg:gap-4 md:flex">
          <Star className="w-4 h-4 lg:w-6 lg:h-6" />
          <Instagram className="w-4 h-4 lg:w-6 lg:h-6" />
          <Share2 className="w-4 h-4 lg:w-6 lg:h-6" />
        </div>
      </div>
    </div>
  );
};

export default PosterHeader;
