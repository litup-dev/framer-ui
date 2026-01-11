"use client";

import { Subtitle, Description } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

interface NoticeSectionProps {
  description?: string;
  instagramUrl?: string;
}

const NoticeSection = ({ description, instagramUrl }: NoticeSectionProps) => {
  const handleInstagramClick = () => {
    if (instagramUrl) {
      window.open(instagramUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* notice 캡션: MD 이하에서만 표시 */}
      <Subtitle className="lg:hidden text-[14px] font-medium text-black-60 md:text-[20px] md:font-bold md:text-black">
        notice
      </Subtitle>
      <div className="flex flex-col relative">
        {/* 원문 가기 버튼: 우측 상단 */}
        {instagramUrl && (
          <Button
            onClick={handleInstagramClick}
            variant="outline"
            className="absolute top-4 right-4 2xl:top-6 2xl:right-6 xl:top-6 xl:right-6 bg-white rounded-[4px] border border-[#202020]/10 py-2.5 px-3.5 h-9 2xl:h-10 w-[100px] 2xl:w-[110px] flex items-center gap-1.5 hover:bg-gray-50 z-10"
          >
            <Subtitle className="text-[14px] 2xl:text-[16px]">원문 가기</Subtitle>
            <Instagram className="w-4 h-4" />
          </Button>
        )}

        <Description className="text-black-80 whitespace-pre-wrap bg-[#f5f5f5] p-10 rounded-[4px]">
          {description || "공지사항이 없습니다."}
        </Description>
      </div>
    </div>
  );
};

export default NoticeSection;
