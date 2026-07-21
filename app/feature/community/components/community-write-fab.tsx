"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";
import { saveReturnUrl } from "@/lib/login-utils";
import { usePathname } from "next/navigation";

export function CommunityWriteFab() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useCurrentUser();

  const handleClick = () => {
    if (!isAuthenticated) {
      saveReturnUrl(pathname);
      router.push("/login");
      return;
    }
    router.push("/community/write");
  };

  return (
    <button
      onClick={handleClick}
      className="md:hidden fixed bottom-6 right-5 z-50 w-16 h-16 rounded-full bg-main text-white flex items-center justify-center shadow-[0_4px_20px_0_rgba(0,0,0,0.2)] active:scale-95 transition-transform"
      aria-label="글쓰기"
    >
      <Pencil className="w-6 h-6" strokeWidth={2} />
    </button>
  );
}
