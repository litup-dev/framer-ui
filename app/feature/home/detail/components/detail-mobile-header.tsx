import { ChevronLeft, Share2, Plus } from "lucide-react";

const DetailMobileHeader = () => {
  return (
    <div className="flex justify-between items-center h-[48px] mb-[14px]">
      <ChevronLeft className="-mx-3" />
      <div className="flex gap-2">
        <div className="flex items-center text-subtitle-14 bg-main px-4 py-2.5 text-[#fff] rounded-[4px]">
          보고 싶어요
          <Plus className="h-4 w-4" />
        </div>

        <div className="px-4 py-2.5 bg-[#F2F1EE] rounded-[4px] flex items-center">
          <Share2 className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default DetailMobileHeader;
