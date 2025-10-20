import { ChevronLeft, Star, Instagram, Share2 } from "lucide-react";

const DetailMobileHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <ChevronLeft className="w-5 h-5" />
      <div className="flex gap-2">
        <Star className="w-5 h-5" />
        <Instagram className="w-5 h-5" />
        <Share2 className="w-5 h-5" />
      </div>
    </div>
  );
};

export default DetailMobileHeader;
