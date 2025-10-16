import { ChevronLeft, Star, Instagram, Share2 } from "lucide-react";

const DetailMobileHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <ChevronLeft />
      <div className="flex gap-2">
        <Star />
        <Instagram />
        <Share2 />
      </div>
    </div>
  );
};

export default DetailMobileHeader;
