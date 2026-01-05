import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { Subtitle } from "@/components/shared/typography";

interface BookingButtonProps {
  variant?: "fixed" | "static";
  height?: "sm" | "md" | "lg";
  className?: string;
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
}: BookingButtonProps) => {
  const heightClass = {
    sm: "h-15", // 60px
    md: "h-16", // 64px
    lg: "h-20", // 80px
  }[height];

  if (variant === "fixed") {
    return (
      <div className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}>
        <Button
          className={`w-full ${heightClass} rounded-none bg-[#202020] hover:bg-[#202020]/90`}
        >
          <Subtitle className="text-[14px] md:text-[16px]">예매하기</Subtitle>
          <Link className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button className={`w-full ${heightClass} text-lg ${className}`}>
      <Subtitle className="2xl:text-[20px] xl:text-[18px] lg:text-[16px]">예매하기</Subtitle>
      <Link className="2xl:w-6 2xl:h-6 xl:w-5 xl:h-5 lg:w-4 lg:h-4"/>
    </Button>
  );
};

export default BookingButton;
