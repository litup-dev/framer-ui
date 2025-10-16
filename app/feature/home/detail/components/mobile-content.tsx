import { Star, Instagram, Share2 } from "lucide-react";
import TabContent from "@/app/feature/home/detail/components/tab-content";
import { Title } from "@/components/shared/typography";

interface MobileContentProps {
  title: string;
}

const MobileContent = ({ title }: MobileContentProps) => {
  return (
    <>
      <div className="pt-0 pb-4">
        <div className="flex justify-between items-center">
          <Title className="text-gray-900">{title}</Title>
          <div className="hidden md:flex gap-2">
            <Star className="w-4 h-4" />
            <Instagram className="w-4 h-4" />
            <Share2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      <TabContent />
    </>
  );
};

export default MobileContent;
