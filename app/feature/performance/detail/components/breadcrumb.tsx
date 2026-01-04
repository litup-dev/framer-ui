import { ChevronRight } from "lucide-react";
import Link from "next/link";

const Breadcrumb = () => {
  return (
    <div className="flex items-center gap-2 h-6 text-sm text-gray-600">
      <Link href="/home" className="hover:text-black">
        홈
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/performance" className="hover:text-black">
        공연
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-black">공연 상세</span>
    </div>
  );
};

export default Breadcrumb;
