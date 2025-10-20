import { Star, Instagram, Share2 } from "lucide-react";
import DesktopDetailSections from "@/app/feature/home/detail/components/desktop/desktop-detail-sections";
import { Title } from "@/components/shared/typography";

interface DesktopContentProps {
  title: string;
}

const DesktopContent = ({ title }: DesktopContentProps) => {
  return (
    <>
      <div className="pb-4 pt-4">
        <div className="flex justify-between items-center">
          <Title className="text-gray-900">{title}</Title>
          <div className="hidden gap-2 lg:gap-4 md:flex">
            <Star className="w-4 h-4 lg:w-6 lg:h-6" />
            <Instagram className="w-4 h-4 lg:w-6 lg:h-6" />
            <Share2 className="w-4 h-4 lg:w-6 lg:h-6" />
          </div>
        </div>
      </div>

      <DesktopDetailSections />
    </>
  );
};

export default DesktopContent;
