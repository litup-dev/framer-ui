import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import FadeIn from "@/components/shared/fade-in";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

const PageWrapper = ({ children, className = "" }: PageWrapperProps) => {
  return (
    <FadeIn>
      <div
        className={cn(
          "w-full flex flex-col h-full px-5 md:px-10 lg:px-15 xl:px-15 2xl:px-20 pb-10 xl:pb-20 pt-1 md:pt-20 2xl:pt-[108px] gap-10 md:gap-[131px] lg:gap-[152px] xl:gap-[155px] 2xl:gap-[210px]",
          className,
        )}
      >
        {children}
      </div>
    </FadeIn>
  );
};

export default PageWrapper;
