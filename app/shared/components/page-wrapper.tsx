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
          "w-full flex flex-col h-full px-5 md:px-10 lg:px-15 xl:px-20 pb-20 sm:pt-20 gap-10 md:gap-[140px]",
          className
        )}
      >
        {children}
      </div>
    </FadeIn>
  );
};

export default PageWrapper;
