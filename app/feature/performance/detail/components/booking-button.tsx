"use client";

import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";
import { Subtitle, Description } from "@/components/shared/typography";

interface BookingButtonProps {
  variant?: "fixed" | "static";
  height?: "sm" | "md" | "lg";
  className?: string;
  bookingUrl?: string;
}

/**
 * 예매하기 버튼 컴포넌트
 * - fixed: 하단 고정 (SM, MD)
 * - static: 일반 버튼 (LG+)
 * - height: sm(60px), md(64px), lg(80px)
 */
const BookingButton = ({
  variant = "static",
  height = "lg",
  className = "",
  bookingUrl,
}: BookingButtonProps) => {
  const heightClass = {
    sm: "h-15", // 60px
    md: "h-16", // 64px
    lg: "h-20", // 80px
  }[height];

  const isDisabled = !bookingUrl;

  const handleClick = () => {
    if (bookingUrl) {
      // URL에 프로토콜이 없으면 https:// 추가
      let fullUrl = bookingUrl;
      if (!bookingUrl.startsWith('http://') && !bookingUrl.startsWith('https://')) {
        fullUrl = `https://${bookingUrl}`;
      }
      window.open(fullUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (variant === "fixed") {
    // MD 이하: 검정색 배경
    const fixedButtonBgClass = isDisabled
      ? "bg-[#BBBBBB] hover:bg-[#BBBBBB] cursor-not-allowed"
      : "bg-[#202020] hover:bg-[#202020]/90 cursor-pointer";

    return (
      <div className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}>
        <Button
          onClick={handleClick}
          disabled={isDisabled}
          className={`w-full ${heightClass} rounded-none ${fixedButtonBgClass}`}
        >
          {isDisabled ? (
            <Description className="text-[14px] md:text-[16px] text-white">
              공연 안내를 확인하세요
            </Description>
          ) : (
            <>
              <Subtitle className="text-[14px] md:text-[16px]">예매하기</Subtitle>
              <LinkIcon className="w-3 h-3 md:w-4 md:h-4" />
            </>
          )}
        </Button>
      </div>
    );
  }

  // LG 이상: Main 색상
  const staticButtonBgClass = isDisabled
    ? "bg-[#BBBBBB] hover:bg-[#BBBBBB] cursor-not-allowed"
    : "bg-main hover:bg-main/90 cursor-pointer";

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      className={`w-full ${heightClass} text-lg ${staticButtonBgClass} ${className}`}
    >
      {isDisabled ? (
        <Description className="2xl:text-[18px] xl:text-[16px] lg:text-[14px] text-white">
          공연 안내를 확인하세요
        </Description>
      ) : (
        <>
          <Subtitle className="2xl:text-[20px] xl:text-[18px] lg:text-[16px]">예매하기</Subtitle>
          <LinkIcon className="2xl:w-6 2xl:h-6 xl:w-5 xl:h-5 lg:w-4 lg:h-4"/>
        </>
      )}
    </Button>
  );
};

export default BookingButton;
