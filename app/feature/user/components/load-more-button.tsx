import { ChevronDown } from "lucide-react";

interface LoadMoreButtonProps {
  onClick: () => void;
}

export default function LoadMoreButton({ onClick }: LoadMoreButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-1 py-2 text-[14px] lg:text-[16px] text-muted-foreground hover:text-black transition-colors mt-6 md:mt-10 xl:mt-10 2xl:mt-14"
    >
      더보기
      <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5" />
    </button>
  );
}
