import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import FadeIn from "@/components/shared/fade-in";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  // loading.tsx 셸이 이미 같은 자리에 떠 있을 때 false로 두어 페이드로 깜빡이지 않게 한다.
  fade?: boolean;
}

const PageWrapper = ({
  children,
  className = "",
  fade = true,
}: PageWrapperProps) => {
  const content = (
    <div
      className={cn(
        "w-full flex flex-col h-full px-5 md:px-10 lg:px-15 xl:px-15 2xl:px-20 pb-10 xl:pb-20 pt-1 md:pt-20 2xl:pt-[108px] gap-10 md:gap-[131px] lg:gap-[152px] xl:gap-[155px] 2xl:gap-[210px]",
        className,
      )}
    >
      {children}
    </div>
  );

  return fade ? <FadeIn>{content}</FadeIn> : content;
};

export default PageWrapper;
